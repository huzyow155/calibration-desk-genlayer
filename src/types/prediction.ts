export type PredictionStatus = 'OPEN' | 'RESOLVED';
export type PredictionOutcome = 'YES' | 'NO' | 'AMBIGUOUS';

export interface PredictionRecord {
  schema_version: string;
  prediction_id: string;
  forecaster: string;
  event_text: string;
  prob_bp: number;
  deadline_hint: string;
  created_at_round: string;
  status: PredictionStatus;
  outcome: PredictionOutcome | null;
  resolution_evidence: string;
  resolution_quote: string;
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
