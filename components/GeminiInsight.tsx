
import React, { useState, useEffect } from 'react';
import { GoogleGenAI } from '@google/genai';
import { TimeLog } from '../types';

interface GeminiInsightProps {
  logs: TimeLog[];
}

const GeminiInsight: React.FC<GeminiInsightProps> = ({ logs }) => {
  const [insight, setInsight] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);

  const generateInsight = async () => {
    if (logs.length === 0) return;
    setLoading(true);
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const logsSummary = logs.slice(0, 5).map(l => `${l.label} às ${l.timestamp.toLocaleTimeString()}`).join(', ');
      
      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: `Com base nestes últimos registros: ${logsSummary}. Dê uma dica curta e amigável de bem-estar ou produtividade. Máximo 20 palavras. Seja motivador.`,
        config: {
          systemInstruction: 'Você é a Conexa, a inteligência amiga da empresa ConexaOne. Seu tom é leve, acolhedor e encorajador.',
          temperature: 0.9,
        }
      });
      setInsight(response.text || 'Você está fazendo um ótimo trabalho! Continue cuidando do seu tempo.');
    } catch (error) {
      setInsight('Mantenha o equilíbrio entre foco e descanso. Você merece!');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (logs.length > 0 && !insight) generateInsight();
  }, [logs]);

  return (
    <div className="bg-gradient-to-br from-stone-900 to-stone-800 rounded-[2rem] p-8 shadow-xl text-white relative overflow-hidden group">
      <div className="absolute -bottom-12 -left-12 w-48 h-48 bg-stone-700/30 rounded-full blur-3xl group-hover:bg-indigo-500/10 transition-colors duration-1000"></div>
      
      <div className="relative z-10">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 bg-white/10 rounded-2xl flex items-center justify-center backdrop-blur-sm border border-white/10">
            <span className="text-xl">✨</span>
          </div>
          <div>
            <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-stone-400">Dica da Conexa</h4>
            <p className="text-xs font-bold text-stone-200">Insight Inteligente</p>
          </div>
        </div>

        {loading ? (
          <div className="space-y-3">
            <div className="h-4 bg-white/5 rounded-full w-full animate-pulse"></div>
            <div className="h-4 bg-white/5 rounded-full w-4/5 animate-pulse"></div>
          </div>
        ) : (
          <p className="text-base leading-relaxed text-stone-100 font-medium">
            {insight || 'Registre seu primeiro ponto para eu te conhecer melhor! 😊'}
          </p>
        )}
        
        {insight && (
          <button 
            onClick={generateInsight}
            className="mt-6 text-[10px] text-stone-500 hover:text-white transition-colors uppercase font-black tracking-widest flex items-center gap-2"
          >
            <div className="w-1 h-1 rounded-full bg-current"></div>
            Quero outra dica
          </button>
        )}
      </div>
    </div>
  );
};

export default GeminiInsight;
