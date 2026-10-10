export type PredictionStatus = 'OPEN' | 'PROVISIONAL' | 'SETTLED';
export type PredictionOutcome = 'YES' | 'NO' | 'AMBIGUOUS';

export interface PredictionRecord {
  schema_version: string;
  prediction_id: string;
  forecaster: string;
  event_text: string;
  prob_bp: number;
  resolve_after: string;
  source_url: string;
  created_at?: string;
  status: PredictionStatus;
  outcome: PredictionOutcome | null;
  resolved_at?: string;
  settled_at?: string;
  resolution_quote: string;
  source_hash?: string;
  contested?: boolean;
  contested_at?: string;
  contester?: string;
  last_attempt?: string;
}

export interface CalibrationBucket {
  range: string;
  n: number;
  hits: number;
  hit_rate: number;
}

export interface CalibrationReport {
  schema_version: string;
  forecaster: string;
  n_registered: number;
  n_resolved: number;
  n_provisional: number;
  n_settled: number;
  n_scored: number;
  brier_score: number | null;
  buckets: CalibrationBucket[];
}

export interface CouncilEndorsement {
  id: string;
  author: string;
  brier_score: number;
  statement: string;
}
