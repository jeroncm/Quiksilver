
export interface PriceData {
  current: number;
  yesterday: number;
  week: number;
  fifteen: number;
  month: number;
  year: number;
}

export interface HistoricalDataPoint {
  date: string;
  price: number;
}

export interface PredictionScenario {
  bestCase: number;
  worstCase: number;
  averageCase: number;
}

export interface AIPrediction {
  recommendation: string;
  tomorrow: string;
  oneYear: PredictionScenario;
  fiveYear: PredictionScenario;
  tenYear: PredictionScenario;
}
