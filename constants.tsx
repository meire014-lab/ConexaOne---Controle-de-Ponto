
import { LogType } from './types';

export const LOG_CONFIG: Record<LogType, { label: string; color: string; icon: string }> = {
  ENTRADA: { 
    label: 'Entrada', 
    color: 'bg-zinc-800 text-white', 
    icon: 'M12 4v16m8-8H4' 
  },
  SAIDA_INTERVALO: { 
    label: 'Início Intervalo', 
    color: 'bg-stone-200 text-stone-700', 
    icon: 'M12 8v4l3 3' 
  },
  RETORNO_INTERVALO: { 
    label: 'Fim Intervalo', 
    color: 'bg-stone-100 text-stone-600', 
    icon: 'M12 15l-3-3m0 0l3-3m-3 3h12' 
  },
  SAIDA: { 
    label: 'Saída', 
    color: 'bg-zinc-900 text-white', 
    icon: 'M17 16l4-4m0 0l-4-4m4 4H7' 
  },
  INICIO_HOME_OFFICE: { 
    label: 'Início Home Office', 
    color: 'bg-[#EAE7E2] text-stone-800', 
    icon: 'M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6' 
  },
  FIM_HOME_OFFICE: { 
    label: 'Fim Home Office', 
    color: 'bg-[#D6D1CA] text-stone-900', 
    icon: 'M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6' 
  },
};
