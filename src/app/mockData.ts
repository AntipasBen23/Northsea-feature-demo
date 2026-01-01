// mockData.ts - Generate realistic study data

import { Study, Benchmark, TimeSeriesPoint, Insight, Industry, StudyType } from './types';

// Seed data - generates realistic correlated studies
export function generateStudy(index: number): Study {
  const industries: Industry[] = ['SaaS', 'FinTech', 'Healthcare', 'E-commerce'];
  const studyTypes: StudyType[] = ['NPS', 'Due Diligence', 'Pricing', 'Market Entry', 'Value Creation'];
  
  const industry = industries[index % industries.length];
  const studyType = studyTypes[index % studyTypes.length];
  
  // Base NPS determines other metrics (correlation)
  const baseNPS = 30 + Math.random() * 40; // 30-70
  
  // Companies with high NPS have low churn (realistic correlation)
  const churnRate = baseNPS > 50 
    ? 2 + Math.random() * 4  // 2-6%
    : 10 + Math.random() * 8; // 10-18%
  
  const customerSat = Math.min(100, baseNPS + (Math.random() * 10 - 5));
  
  return {
    id: `study-${index}`,
    companyName: generateCompanyName(index),
    industry,
    studyType,
    completedAt: new Date(Date.now() - Math.random() * 180 * 24 * 60 * 60 * 1000), // Last 180 days
    respondents: Math.floor(100 + Math.random() * 900),
    metrics: {
      nps: Math.round(baseNPS),
      churnRate: Math.round(churnRate * 10) / 10,
      customerSatisfaction: Math.round(customerSat),
      avgRevenuePerUser: Math.floor(50 + Math.random() * 450)
    }
  };
}

function generateCompanyName(index: number): string {
  const prefixes = ['Tech', 'Data', 'Cloud', 'Smart', 'Global', 'Rapid', 'Next'];
  const suffixes = ['Solutions', 'Systems', 'Platform', 'Labs', 'Dynamics', 'Works', 'Hub'];
  
  const prefix = prefixes[index % prefixes.length];
  const suffix = suffixes[Math.floor(index / prefixes.length) % suffixes.length];
  
  return `${prefix}${suffix}`;
}

// Generate 50 studies
export const MOCK_STUDIES: Study[] = Array.from({ length: 50 }, (_, i) => generateStudy(i));

// Calculate benchmarks from studies
export function calculateBenchmarks(): Benchmark[] {
  const benchmarks: Benchmark[] = [];
  const industries: Industry[] = ['SaaS', 'FinTech', 'Healthcare', 'E-commerce'];
  const metrics = ['nps', 'churnRate', 'customerSatisfaction', 'avgRevenuePerUser'];
  
  industries.forEach(industry => {
    const industryStudies = MOCK_STUDIES.filter(s => s.industry === industry);
    
    metrics.forEach(metric => {
      const values = industryStudies.map(s => s.metrics[metric as keyof typeof s.metrics]).sort((a, b) => a - b);
      
      benchmarks.push({
        industry,
        metric,
        p25: values[Math.floor(values.length * 0.25)],
        p50: values[Math.floor(values.length * 0.5)],
        p75: values[Math.floor(values.length * 0.75)],
        sampleSize: values.length
      });
    });
  });
  
  return benchmarks;
}

export const MOCK_BENCHMARKS = calculateBenchmarks();

// Generate time series data (monthly snapshots)
export function generateTimeSeries(): TimeSeriesPoint[] {
  const points: TimeSeriesPoint[] = [];
  const months = 6; // Last 6 months
  
  MOCK_STUDIES.slice(0, 10).forEach(study => { // Top 10 companies tracked over time
    for (let i = 0; i < months; i++) {
      const date = new Date();
      date.setMonth(date.getMonth() - i);
      
      // Simulate trend (slight variation month over month)
      const baseNPS = study.metrics.nps;
      const variation = (Math.random() - 0.5) * 10;
      
      points.push({
        date,
        metric: 'nps',
        value: Math.max(0, Math.min(100, baseNPS + variation)),
        studyId: study.id,
        companyName: study.companyName
      });
    }
  });
  
  return points.sort((a, b) => a.date.getTime() - b.date.getTime());
}

export const MOCK_TIME_SERIES = generateTimeSeries();

// Generate insights
export function generateInsights(): Insight[] {
  const insights: Insight[] = [];
  
  MOCK_STUDIES.forEach(study => {
    // Alert for low NPS
    if (study.metrics.nps < 40) {
      insights.push({
        id: `insight-${study.id}-1`,
        studyId: study.id,
        type: 'alert',
        title: 'Low NPS Detected',
        description: `${study.companyName} NPS (${study.metrics.nps}) is below industry average. Immediate attention required.`,
        confidence: 0.9,
        createdAt: study.completedAt
      });
    }
    
    // High churn alert
    if (study.metrics.churnRate > 12) {
      insights.push({
        id: `insight-${study.id}-2`,
        studyId: study.id,
        type: 'alert',
        title: 'High Churn Risk',
        description: `Churn rate of ${study.metrics.churnRate}% is 2x industry benchmark. Consider retention initiatives.`,
        confidence: 0.85,
        createdAt: study.completedAt
      });
    }
    
    // Opportunity for high performers
    if (study.metrics.nps > 60) {
      insights.push({
        id: `insight-${study.id}-3`,
        studyId: study.id,
        type: 'opportunity',
        title: 'Strong Market Position',
        description: `${study.companyName} outperforms industry benchmark by ${Math.round(study.metrics.nps - 50)} points. Potential for expansion.`,
        confidence: 0.8,
        createdAt: study.completedAt
      });
    }
  });
  
  return insights;
}

export const MOCK_INSIGHTS = generateInsights();