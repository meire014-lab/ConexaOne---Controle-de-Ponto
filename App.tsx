
import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { TimeLog, LogType } from './types';
import { LOG_CONFIG } from './constants';
import Header from './components/Header';
import Dashboard from './components/Dashboard';
import History from './components/History';
import GeminiInsight from './components/GeminiInsight';
import MonthlyHistory from './components/MonthlyHistory';

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'dashboard' | 'monthly'>('dashboard');
  const [logs, setLogs] = useState<TimeLog[]>(() => {
    const saved = localStorage.getItem('conexaone_logs');
    if (saved) {
      return JSON.parse(saved).map((l: any) => ({
        ...l,
        timestamp: new Date(l.timestamp)
      }));
    }
    return [];
  });

  const [notification, setNotification] = useState<{message: string, type: string} | null>(null);
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    localStorage.setItem('conexaone_logs', JSON.stringify(logs));
  }, [logs]);

  const addLog = useCallback((type: LogType) => {
    const newLog: TimeLog = {
      id: Math.random().toString(36).substr(2, 9),
      timestamp: new Date(),
      type,
      label: LOG_CONFIG[type].label
    };
    setLogs(prev => [newLog, ...prev]);
    
    setNotification({
      message: `${LOG_CONFIG[type].label} registrado com sucesso!`,
      type: 'success'
    });
    
    setTimeout(() => setNotification(null), 3000);
  }, []);

  const todayLogs = useMemo(() => {
    const todayStr = new Date().toLocaleDateString('pt-BR');
    return logs.filter(log => log.timestamp.toLocaleDateString('pt-BR') === todayStr)
               .sort((a, b) => a.timestamp.getTime() - b.timestamp.getTime());
  }, [logs]);

  const calculateWorkedMinutes = (logArray: TimeLog[]) => {
    if (logArray.length < 2) return 0;
    let totalMs = 0;
    let startTime: Date | null = null;

    // Sort logs chronologically for calculation
    const sorted = [...logArray].sort((a, b) => a.timestamp.getTime() - b.timestamp.getTime());

    for (let i = 0; i < sorted.length; i++) {
      const log = sorted[i];
      if (log.type === 'ENTRADA' || log.type === 'RETORNO_INTERVALO' || log.type === 'INICIO_HOME_OFFICE') {
        startTime = log.timestamp;
      } else if (startTime && (log.type === 'SAIDA_INTERVALO' || log.type === 'SAIDA' || log.type === 'FIM_HOME_OFFICE')) {
        totalMs += log.timestamp.getTime() - startTime.getTime();
        startTime = null;
      }
    }
    return Math.floor(totalMs / 1000 / 60);
  };

  const workedMinutesToday = useMemo(() => calculateWorkedMinutes(todayLogs), [todayLogs]);

  const sortedLogs = useMemo(() => {
    return [...logs].sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());
  }, [logs]);

  return (
    <div className="min-h-screen flex flex-col pb-12 bg-[#FCFAF7]">
      <Header />
      
      {/* Navigation Tabs */}
      <nav className="container mx-auto px-4 mt-6">
        <div className="flex gap-2 p-1.5 bg-stone-100 rounded-2xl w-fit border border-stone-200 shadow-inner">
          <button 
            onClick={() => setActiveTab('dashboard')}
            className={`px-6 py-2.5 rounded-xl text-xs font-black transition-all uppercase tracking-widest ${activeTab === 'dashboard' ? 'bg-white text-stone-900 shadow-sm' : 'text-stone-400 hover:text-stone-600'}`}
          >
            Dashboard
          </button>
          <button 
            onClick={() => setActiveTab('monthly')}
            className={`px-6 py-2.5 rounded-xl text-xs font-black transition-all uppercase tracking-widest ${activeTab === 'monthly' ? 'bg-white text-stone-900 shadow-sm' : 'text-stone-400 hover:text-stone-600'}`}
          >
            Histórico Mensal
          </button>
        </div>
      </nav>
      
      {/* Toast Notification */}
      {notification && (
        <div className="fixed top-24 left-1/2 -translate-x-1/2 z-[100] animate-bounce">
          <div className="bg-stone-900 text-white px-6 py-3 rounded-2xl shadow-2xl flex items-center gap-3 border border-white/10">
            <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse"></div>
            <span className="text-sm font-bold">{notification.message}</span>
          </div>
        </div>
      )}

      <main className="flex-grow container mx-auto px-4 mt-8">
        {activeTab === 'dashboard' ? (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-8">
              <Dashboard 
                currentTime={currentTime} 
                onLog={addLog} 
                todayLogs={todayLogs}
                workedMinutes={workedMinutesToday}
              />
              <History 
                logs={sortedLogs.slice(0, 10)} 
                title="Atividades Recentes"
                onClear={() => {
                  if (confirm('Deseja realmente limpar seu histórico?')) setLogs([]);
                }} 
              />
            </div>
            
            <div className="space-y-6">
              <GeminiInsight logs={logs} />
              
              <div className="bg-white rounded-[2rem] p-8 shadow-sm border border-stone-100/50">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 bg-orange-50 rounded-2xl flex items-center justify-center text-orange-500">
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 17v-2a4 4 0 014-4h4m0 0l-4-4m4 4l-4 4" />
                    </svg>
                  </div>
                  <h3 className="text-stone-800 font-bold">Exportação Rápida</h3>
                </div>
                <p className="text-stone-500 text-xs mb-6 leading-relaxed font-medium">
                  Baixe todos os seus registros em formato compatível com Excel.
                </p>
                <button 
                  onClick={() => exportToCsv(logs)}
                  className="w-full bg-stone-900 text-white py-4 rounded-2xl hover:bg-stone-800 active:scale-[0.97] transition-all flex items-center justify-center gap-3 font-bold text-sm shadow-lg shadow-stone-200"
                >
                  Baixar Planilha .csv
                </button>
              </div>

              <div className="bg-stone-50 rounded-[2rem] p-8 border border-stone-100">
                <div className="flex justify-between items-end mb-6">
                  <div>
                    <h4 className="text-[10px] font-black text-stone-400 uppercase tracking-[0.2em] mb-1">Hoje</h4>
                    <p className="text-2xl font-black text-stone-900 tracking-tighter">
                      {Math.floor(workedMinutesToday / 60)}h {workedMinutesToday % 60}m
                    </p>
                  </div>
                  <div className="text-right">
                    <span className="text-[10px] font-bold text-emerald-600 bg-emerald-100 px-3 py-1 rounded-full uppercase">Ativo</span>
                  </div>
                </div>
                
                <div className="w-full h-3 bg-stone-200 rounded-full overflow-hidden mb-2">
                  <div 
                    className="h-full bg-stone-900 transition-all duration-1000 ease-out"
                    style={{ width: `${Math.min((workedMinutesToday / 480) * 100, 100)}%` }}
                  ></div>
                </div>
                <div className="flex justify-between text-[10px] font-bold text-stone-400">
                  <span>Início</span>
                  <span>Meta: 8h</span>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <MonthlyHistory logs={logs} calculateMinutes={calculateWorkedMinutes} />
        )}
      </main>
    </div>
  );
};

const exportToCsv = (logs: TimeLog[], filenamePrefix: string = 'ConexaOne_Relatorio') => {
  if (logs.length === 0) return;
  const headers = ['ID', 'Data', 'Hora', 'Tipo', 'Descricao'];
  const rows = logs.map(log => [
    log.id, 
    log.timestamp.toLocaleDateString('pt-BR'), 
    log.timestamp.toLocaleTimeString('pt-BR'), 
    log.type, 
    log.label
  ]);
  
  // Create CSV with semicolon separator which is better for Excel in many locales
  const csvContent = [headers.join(';'), ...rows.map(row => row.join(';'))].join('\n');
  const blob = new Blob(["\uFEFF" + csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  
  const now = new Date();
  const dateStr = `${now.getFullYear()}-${(now.getMonth() + 1).toString().padStart(2, '0')}`;
  
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', `${filenamePrefix}_${dateStr}.csv`);
  link.click();
};

export default App;
