// mockApi.ts - Mimics backend API calls

import { Study, Benchmark, TimeSeriesPoint, Insight, Industry } from './types';
import { MOCK_STUDIES, MOCK_BENCHMARKS, MOCK_TIME_SERIES, MOCK_INSIGHTS } from './mockData';

// Simulate network delay
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// Mock API class
class MockAPI {
  // GET /api/studies
  async getStudies(filters?: { industry?: Industry; dateRange?: number }): Promise<Study[]> {
    await delay(400); // Realistic API latency
    
    let studies = [...MOCK_STUDIES];
    
    if (filters?.industry) {
      studies = studies.filter(s => s.industry === filters.industry);
    }
    
    if (filters?.dateRange) {
      const cutoffDate = new Date();
      cutoffDate.setDate(cutoffDate.getDate() - filters.dateRange);
      studies = studies.filter(s => s.completedAt >= cutoffDate);
    }
    
    return studies;
  }
  
  // GET /api/studies/:id
  async getStudyById(id: string): Promise<Study | null> {
    await delay(300);
    return MOCK_STUDIES.find(s => s.id === id) || null;
  }
  
  // GET /api/benchmarks
  async getBenchmarks(industry?: Industry): Promise<Benchmark[]> {
    await delay(350);
    
    if (industry) {
      return MOCK_BENCHMARKS.filter(b => b.industry === industry);
    }
    
    return MOCK_BENCHMARKS;
  }
  
  // GET /api/timeseries
  async getTimeSeries(studyIds?: string[]): Promise<TimeSeriesPoint[]> {
    await delay(400);
    
    if (studyIds && studyIds.length > 0) {
      return MOCK_TIME_SERIES.filter(ts => studyIds.includes(ts.studyId));
    }
    
    return MOCK_TIME_SERIES;
  }
  
  // GET /api/insights
  async getInsights(studyId?: string): Promise<Insight[]> {
    await delay(500);
    
    if (studyId) {
      return MOCK_INSIGHTS.filter(i => i.studyId === studyId);
    }
    
    return MOCK_INSIGHTS;
  }
  
  // POST /api/insights/generate - Mimics AI processing
  async generateInsight(studyId: string): Promise<{ summary: string; insights: string[]; confidence: number }> {
    await delay(1200); // AI takes longer
    
    const study = MOCK_STUDIES.find(s => s.id === studyId);
    if (!study) throw new Error('Study not found');
    
    const insights: string[] = [];
    
    // Smart rule-based "AI" insights
    if (study.metrics.nps < 40 && study.metrics.churnRate > 12) {
      insights.push(
        `Critical correlation: Low NPS (${study.metrics.nps}) + High churn (${study.metrics.churnRate}%) indicates systematic customer satisfaction issues.`
      );
    }
    
    if (study.metrics.nps > 60) {
      insights.push(
        `Strong performance: NPS of ${study.metrics.nps} places ${study.companyName} in top quartile for ${study.industry}.`
      );
    }
    
    const summary = `Analysis complete for ${study.companyName}. ${insights.length} key insights identified.`;
    
    return {
      summary,
      insights,
      confidence: 0.87
    };
  }
  
  // GET /api/analytics/cross-study
  async getCrossStudyAnalytics(industry: Industry): Promise<{
    totalStudies: number;
    avgNPS: number;
    avgChurn: number;
    trend: 'up' | 'down' | 'stable';
  }> {
    await delay(600);
    
    const studies = MOCK_STUDIES.filter(s => s.industry === industry);
    const avgNPS = studies.reduce((sum, s) => sum + s.metrics.nps, 0) / studies.length;
    const avgChurn = studies.reduce((sum, s) => sum + s.metrics.churnRate, 0) / studies.length;
    
    return {
      totalStudies: studies.length,
      avgNPS: Math.round(avgNPS),
      avgChurn: Math.round(avgChurn * 10) / 10,
      trend: avgNPS > 50 ? 'up' : avgNPS > 40 ? 'stable' : 'down'
    };
  }
}

export const api = new MockAPI();