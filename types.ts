
export type LogType = 
  | 'ENTRADA' 
  | 'SAIDA_INTERVALO' 
  | 'RETORNO_INTERVALO' 
  | 'SAIDA' 
  | 'INICIO_HOME_OFFICE' 
  | 'FIM_HOME_OFFICE';

export interface TimeLog {
  id: string;
  timestamp: Date;
  type: LogType;
  label: string;
}

export interface DailySummary {
  date: string;
  logs: TimeLog[];
}
