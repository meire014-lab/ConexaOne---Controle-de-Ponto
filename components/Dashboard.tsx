
import React from 'react';
import { LogType, TimeLog } from '../types';
import { LOG_CONFIG } from '../constants';

interface DashboardProps {
  currentTime: Date;
  onLog: (type: LogType) => void;
  todayLogs: TimeLog[];
  workedMinutes: number;
}

const Dashboard: React.FC<DashboardProps> = ({ currentTime, onLog, todayLogs, workedMinutes }) => {
  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
  };

  const seconds = currentTime.getSeconds().toString().padStart(2, '0');

  const lastLog = todayLogs.length > 0 ? todayLogs[todayLogs.length - 1] : null;

  return (
    <div className="space-y-8">
      <div className="bg-white rounded-[3rem] p-12 shadow-sm border border-stone-100 text-center relative overflow-hidden group">
        <div className="absolute top-0 right-0 w-64 h-64 bg-stone-50 rounded-full -mr-32 -mt-32 opacity-50 group-hover:scale-110 transition-transform duration-1000"></div>
        
        <p className="text-stone-400 text-xs font-black mb-4 uppercase tracking-[0.3em]">
          {currentTime.toLocaleDateString('pt-BR', { weekday: 'long', day: '2-digit', month: 'long' })}
        </p>
        
        <div className="flex items-baseline justify-center gap-2 mb-8">
          <h2 className="text-8xl md:text-9xl font-black text-stone-900 tracking-tighter">
            {formatTime(currentTime)}
          </h2>
          <span className="text-2xl font-bold text-stone-300 font-mono animate-pulse">{seconds}</span>
        </div>
        
        <div className="flex flex-col items-center">
          {lastLog ? (
             <div className="inline-flex items-center gap-3 text-sm text-stone-600 bg-stone-50 px-8 py-3 rounded-2xl border border-stone-100 font-medium">
               ✨ <span className="text-stone-400">Última ação:</span> <span className="font-bold text-stone-900">{lastLog.label}</span>
             </div>
          ) : (
            <div className="text-sm text-stone-400 font-bold bg-stone-50 px-8 py-3 rounded-2xl border border-stone-100 uppercase tracking-widest">
              Aguardando registro inicial
            </div>
          )}
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
        {(Object.keys(LOG_CONFIG) as LogType[]).map((type) => {
          const config = LOG_CONFIG[type];
          const hasLoggedToday = todayLogs.some(l => l.type === type);
          
          return (
            <button
              key={type}
              onClick={() => onLog(type)}
              className={`group flex flex-col items-center justify-center p-8 rounded-[2.5rem] border transition-all duration-500 relative ${
                hasLoggedToday 
                ? 'bg-stone-50 border-stone-200 opacity-60 grayscale-[0.5]' 
                : 'bg-white border-stone-100 hover:border-stone-900/10 hover:shadow-[0_20px_40px_-15px_rgba(0,0,0,0.05)] hover:-translate-y-1 active:scale-95'
              }`}
            >
              <div className={`w-16 h-16 rounded-[1.5rem] flex items-center justify-center mb-4 transition-all duration-500 shadow-sm ${
                hasLoggedToday ? 'bg-stone-200 text-stone-500' : `${config.color} group-hover:rotate-6 group-hover:scale-110`
              }`}>
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d={config.icon} />
                </svg>
              </div>
              <span className={`text-sm font-black tracking-tight uppercase ${hasLoggedToday ? 'text-stone-400' : 'text-stone-800'}`}>
                {config.label}
              </span>
              {hasLoggedToday && (
                <div className="mt-2 text-[9px] font-black text-stone-400 bg-stone-200/50 px-2 py-0.5 rounded-full uppercase tracking-tighter">
                  Realizado
                </div>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default Dashboard;
