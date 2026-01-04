
export enum Severity {
  LOW = 'LOW',
  MEDIUM = 'MEDIUM',
  HIGH = 'HIGH'
}

export type WasteType = 'plastic' | 'organic' | 'mixed' | 'construction';

export interface AnalysisResult {
  severity: Severity;
  confidence: number;
  waste_type: WasteType[];
  reason: string;
}

export interface WasteReport {
  id: string;
  timestamp: number;
  image: string;
  result: AnalysisResult;
  location?: {
    lat: number;
    lng: number;
  };
}