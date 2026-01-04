
import React from 'react';
import { TimeLog } from '../types';
import { LOG_CONFIG } from '../constants';

interface HistoryProps {
  logs: TimeLog[];
  onClear?: () => void;
  title?: string;
  hideHeader?: boolean;
}

const History: React.FC<HistoryProps> = ({ logs, onClear, title = "Linha do Tempo", hideHeader = false }) => {
  if (logs.length === 0) return null;

  return (
    <div className="bg-white rounded-[2rem] shadow-sm border border-stone-100 overflow-hidden">
      {!hideHeader && (
        <div className="px-10 py-8 border-b border-stone-50 flex justify-between items-center bg-stone-50/30">
          <div>
            <h3 className="text-xl font-bold text-stone-900">{title}</h3>
            <p className="text-stone-400 text-xs mt-1">Registros organizados por ordem cronológica</p>
          </div>
          {onClear && (
            <button 
              onClick={onClear}
              className="text-[10px] text-stone-400 hover:text-red-500 transition-colors uppercase font-bold tracking-widest px-4 py-2 rounded-full border border-stone-100 hover:border-red-100"
            >
              Limpar Tudo
            </button>
          )}
        </div>
      )}
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-stone-50/50 text-stone-400 text-[10px] uppercase font-bold tracking-[0.15em]">
              <th className="px-10 py-5 font-black">Data</th>
              <th className="px-10 py-5 font-black">Horário</th>
              <th className="px-10 py-5 font-black">Categoria</th>
              <th className="px-10 py-5 text-right font-black">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-stone-50">
            {logs.map((log) => (
              <tr key={log.id} className="group hover:bg-stone-50/50 transition-colors">
                <td className="px-10 py-5 text-sm text-stone-600 font-medium">
                  {log.timestamp.toLocaleDateString('pt-BR')}
                </td>
                <td className="px-10 py-5 text-sm font-mono font-bold text-stone-900">
                  {log.timestamp.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
                </td>
                <td className="px-10 py-5">
                  <div className="flex items-center gap-3">
                    <div className={`w-2.5 h-2.5 rounded-full ${LOG_CONFIG[log.type]?.color?.split(' ')[0] || 'bg-stone-400'} shadow-sm`}></div>
                    <span className="text-sm font-bold text-stone-800">{log.label}</span>
                  </div>
                </td>
                <td className="px-10 py-5 text-right">
                  <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-stone-100 rounded-full text-[9px] font-black text-stone-500 tracking-tighter uppercase">
                    Válido
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default History;
