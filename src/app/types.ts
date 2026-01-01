// types.ts - Core data structures (mimics database schema)

export type Industry = 'SaaS' | 'FinTech' | 'Healthcare' | 'E-commerce';

export type StudyType = 'NPS' | 'Due Diligence' | 'Pricing' | 'Market Entry' | 'Value Creation';

export interface Study {
  id: string;
  companyName: string;
  industry: Industry;
  studyType: StudyType;
  completedAt: Date;
  respondents: number;
  metrics: {
    nps: number;
    churnRate: number;
    customerSatisfaction: number;
    avgRevenuePerUser: number;
  };
}

export interface Benchmark {
  industry: Industry;
  metric: string;
  p25: number; // 25th percentile
  p50: number; // median
  p75: number; // 75th percentile
  sampleSize: number;
}

export interface TimeSeriesPoint {
  date: Date;
  metric: string;
  value: number;
  studyId: string;
  companyName: string;
}

export interface Insight {
  id: string;
  studyId: string;
  type: 'alert' | 'opportunity' | 'trend';
  title: string;
  description: string;
  confidence: number;
  createdAt: Date;
}