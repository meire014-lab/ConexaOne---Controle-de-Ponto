
import React, { useMemo, useState } from 'react';
import { TimeLog } from '../types';
import History from './History';

interface MonthlyHistoryProps {
  logs: TimeLog[];
  calculateMinutes: (logs: TimeLog[]) => number;
}

const MonthlyHistory: React.FC<MonthlyHistoryProps> = ({ logs, calculateMinutes }) => {
  const [selectedMonth, setSelectedMonth] = useState<string | null>(null);

  // Group logs by Year-Month
  const monthlyGroups = useMemo(() => {
    const groups: Record<string, { logs: TimeLog[]; totalMinutes: number; monthName: string; year: string }> = {};

    logs.forEach(log => {
      const date = log.timestamp;
      const monthIndex = date.getMonth();
      const year = date.getFullYear().toString();
      const key = `${year}-${(monthIndex + 1).toString().padStart(2, '0')}`;
      const monthName = date.toLocaleDateString('pt-BR', { month: 'long' });

      if (!groups[key]) {
        groups[key] = { logs: [], totalMinutes: 0, monthName, year };
      }
      groups[key].logs.push(log);
    });

    // Calculate total minutes for each group
    Object.keys(groups).forEach(key => {
      // For accurate monthly calculation, we group logs by day first
      const logsByDay: Record<string, TimeLog[]> = {};
      groups[key].logs.forEach(l => {
        const dayKey = l.timestamp.toLocaleDateString('pt-BR');
        if (!logsByDay[dayKey]) logsByDay[dayKey] = [];
        logsByDay[dayKey].push(l);
      });

      let total = 0;
      Object.values(logsByDay).forEach(dayLogs => {
        total += calculateMinutes(dayLogs);
      });
      groups[key].totalMinutes = total;
    });

    return Object.entries(groups).sort((a, b) => b[0].localeCompare(a[0]));
  }, [logs, calculateMinutes]);

  const filteredLogs = useMemo(() => {
    if (!selectedMonth) return [];
    return logs
      .filter(log => {
        const date = log.timestamp;
        const key = `${date.getFullYear()}-${(date.getMonth() + 1).toString().padStart(2, '0')}`;
        return key === selectedMonth;
      })
      .sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());
  }, [logs, selectedMonth]);

  if (logs.length === 0) {
    return (
      <div className="bg-white rounded-[2.5rem] p-16 text-center border border-stone-100 shadow-sm">
        <div className="w-20 h-20 bg-stone-50 rounded-3xl flex items-center justify-center mx-auto mb-6 text-stone-300">
          <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
        </div>
        <h3 className="text-xl font-bold text-stone-900 mb-2">Sem histórico disponível</h3>
        <p className="text-stone-400 text-sm font-medium">Comece a registrar seus pontos hoje mesmo!</p>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {monthlyGroups.map(([key, data]) => (
          <button
            key={key}
            onClick={() => setSelectedMonth(selectedMonth === key ? null : key)}
            className={`text-left p-8 rounded-[2rem] border transition-all duration-300 group ${
              selectedMonth === key 
                ? 'bg-stone-900 border-stone-900 text-white shadow-xl shadow-stone-200 -translate-y-1' 
                : 'bg-white border-stone-100 text-stone-900 hover:border-stone-300 hover:shadow-md'
            }`}
          >
            <div className="flex justify-between items-start mb-6">
              <div>
                <p className={`text-[10px] font-black uppercase tracking-widest mb-1 ${selectedMonth === key ? 'text-stone-400' : 'text-stone-400'}`}>
                  {data.year}
                </p>
                <h4 className="text-xl font-black capitalize tracking-tight">{data.monthName}</h4>
              </div>
              <div className={`p-2 rounded-xl ${selectedMonth === key ? 'bg-white/10 text-white' : 'bg-stone-50 text-stone-400'}`}>
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M9 5l7 7-7 7" />
                </svg>
              </div>
            </div>
            
            <div className="space-y-1">
              <p className={`text-[10px] font-bold uppercase tracking-tighter ${selectedMonth === key ? 'text-stone-300' : 'text-stone-400'}`}>
                Horas Acumuladas
              </p>
              <p className="text-2xl font-black tabular-nums">
                {Math.floor(data.totalMinutes / 60)}h {data.totalMinutes % 60}m
              </p>
            </div>

            <div className={`mt-6 w-full h-1.5 rounded-full overflow-hidden ${selectedMonth === key ? 'bg-white/20' : 'bg-stone-100'}`}>
              <div 
                className={`h-full transition-all duration-1000 ${selectedMonth === key ? 'bg-white' : 'bg-stone-900'}`}
                style={{ width: `${Math.min((data.totalMinutes / 10560) * 100, 100)}%` }} // Meta mensal de aprox 176h
              ></div>
            </div>
          </button>
        ))}
      </div>

      {selectedMonth && (
        <div className="space-y-6 pt-4 animate-in slide-in-from-bottom-4 duration-500">
          <div className="flex items-center gap-4">
            <div className="h-px bg-stone-200 flex-grow"></div>
            <h3 className="text-xs font-black text-stone-400 uppercase tracking-[0.4em] whitespace-nowrap">
              Detalhes de {monthlyGroups.find(g => g[0] === selectedMonth)?.[1].monthName}
            </h3>
            <div className="h-px bg-stone-200 flex-grow"></div>
          </div>
          <History logs={filteredLogs} hideHeader />
        </div>
      )}
    </div>
  );
};

export default MonthlyHistory;
