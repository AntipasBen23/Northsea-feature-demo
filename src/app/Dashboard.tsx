// Dashboard.tsx - Enhanced main Lighthouse Dashboard with all features

'use client';

import { useState, useEffect } from 'react';
import { Study, Benchmark, TimeSeriesPoint, Industry } from './types';
import { api } from './mockApi';
import BenchmarkChart from './BenchmarkChart';
import TimeSeriesChart from './TimeSeriesChart';
import AIInsights from './AIInsights';

export default function Dashboard() {
  const [studies, setStudies] = useState<Study[]>([]);
  const [benchmarks, setBenchmarks] = useState<Benchmark[]>([]);
  const [timeSeries, setTimeSeries] = useState<TimeSeriesPoint[]>([]);
  const [selectedIndustry, setSelectedIndustry] = useState<Industry | 'all'>('all');
  const [selectedStudy, setSelectedStudy] = useState<Study | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'overview' | 'benchmarks' | 'trends' | 'insights'>('overview');

  useEffect(() => {
    loadData();
  }, [selectedIndustry]);

  async function loadData() {
    setIsLoading(true);
    
    const studiesData = await api.getStudies(
      selectedIndustry !== 'all' ? { industry: selectedIndustry } : undefined
    );
    const benchmarksData = await api.getBenchmarks(
      selectedIndustry !== 'all' ? selectedIndustry : undefined
    );
    const timeSeriesData = await api.getTimeSeries();
    
    setStudies(studiesData);
    setBenchmarks(benchmarksData);
    setTimeSeries(timeSeriesData);
    setIsLoading(false);
  }

  // Calculate stats
  const totalStudies = studies.length;
  const avgNPS = studies.length > 0 
    ? Math.round(studies.reduce((sum, s) => sum + s.metrics.nps, 0) / studies.length)
    : 0;
  const avgChurn = studies.length > 0
    ? Math.round((studies.reduce((sum, s) => sum + s.metrics.churnRate, 0) / studies.length) * 10) / 10
    : 0;

  return (
    <div className="min-h-screen bg-[#0A1628] text-white p-8">
      {/* Header */}
      <div className="max-w-7xl mx-auto mb-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold mb-2">🌊 Northsea Lighthouse</h1>
            <p className="text-gray-400">Cross-Study Intelligence & Competitive Benchmarking</p>
          </div>
          
          {/* Industry Filter */}
          <select
            value={selectedIndustry}
            onChange={(e) => setSelectedIndustry(e.target.value as Industry | 'all')}
            className="bg-[#1a2942] border border-gray-700 rounded-lg px-4 py-2 text-white"
          >
            <option value="all">All Industries</option>
            <option value="SaaS">SaaS</option>
            <option value="FinTech">FinTech</option>
            <option value="Healthcare">Healthcare</option>
            <option value="E-commerce">E-commerce</option>
          </select>
        </div>
      </div>

      {/* Tabs */}
      <div className="max-w-7xl mx-auto mb-8">
        <div className="flex gap-2 border-b border-gray-800">
          {(['overview', 'benchmarks', 'trends', 'insights'] as const).map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-6 py-3 text-sm font-medium capitalize transition-colors ${
                activeTab === tab
                  ? 'text-cyan-400 border-b-2 border-cyan-400'
                  : 'text-gray-400 hover:text-gray-300'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      {/* Loading State */}
      {isLoading && (
        <div className="max-w-7xl mx-auto text-center py-12">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
          <p className="mt-4 text-gray-400">Loading insights...</p>
        </div>
      )}

      {/* Content */}
      {!isLoading && (
        <div className="max-w-7xl mx-auto">
          {/* Overview Tab */}
          {activeTab === 'overview' && (
            <div className="space-y-8">
              {/* Stats Cards */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-[#1a2942] rounded-lg p-6 border border-gray-800">
                  <div className="text-gray-400 text-sm mb-2">Total Studies</div>
                  <div className="text-3xl font-bold">{totalStudies}</div>
                  <div className="text-xs text-gray-500 mt-2">
                    {selectedIndustry !== 'all' ? selectedIndustry : 'All Industries'}
                  </div>
                </div>

                <div className="bg-[#1a2942] rounded-lg p-6 border border-gray-800">
                  <div className="text-gray-400 text-sm mb-2">Average NPS</div>
                  <div className="text-3xl font-bold">{avgNPS}</div>
                  <div className={`text-xs mt-2 ${avgNPS > 50 ? 'text-green-400' : 'text-yellow-400'}`}>
                    {avgNPS > 50 ? '↑ Above benchmark' : '→ At benchmark'}
                  </div>
                </div>

                <div className="bg-[#1a2942] rounded-lg p-6 border border-gray-800">
                  <div className="text-gray-400 text-sm mb-2">Average Churn Rate</div>
                  <div className="text-3xl font-bold">{avgChurn}%</div>
                  <div className={`text-xs mt-2 ${avgChurn < 8 ? 'text-green-400' : 'text-red-400'}`}>
                    {avgChurn < 8 ? '↓ Below benchmark' : '↑ Above benchmark'}
                  </div>
                </div>
              </div>

              {/* Studies Table */}
              <div className="bg-[#1a2942] rounded-lg border border-gray-800 overflow-hidden">
                <div className="px-6 py-4 border-b border-gray-800">
                  <h2 className="text-xl font-semibold">Recent Studies</h2>
                </div>
                
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-[#0f1c2e]">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Company</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Industry</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">NPS</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Churn Rate</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Respondents</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Date</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-800">
                      {studies.slice(0, 10).map((study) => (
                        <tr key={study.id} className="hover:bg-[#0f1c2e] transition-colors">
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="font-medium">{study.companyName}</div>
                            <div className="text-xs text-gray-500">{study.studyType}</div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className="px-2 py-1 text-xs rounded-full bg-blue-900/30 text-blue-300">
                              {study.industry}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`font-semibold ${
                              study.metrics.nps > 50 ? 'text-green-400' : 
                              study.metrics.nps > 30 ? 'text-yellow-400' : 'text-red-400'
                            }`}>
                              {study.metrics.nps}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`font-semibold ${
                              study.metrics.churnRate < 8 ? 'text-green-400' : 'text-red-400'
                            }`}>
                              {study.metrics.churnRate}%
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-gray-400">
                            {study.respondents}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-gray-400 text-sm">
                            {new Date(study.completedAt).toLocaleDateString()}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <button
                              onClick={() => {
                                setSelectedStudy(study);
                                setActiveTab('insights');
                              }}
                              className="text-cyan-400 hover:text-cyan-300 text-sm"
                            >
                              Analyze →
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* Benchmarks Tab */}
          {activeTab === 'benchmarks' && selectedIndustry !== 'all' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <BenchmarkChart
                benchmarks={benchmarks}
                industry={selectedIndustry}
                currentValue={avgNPS}
                metric="nps"
              />
              <BenchmarkChart
                benchmarks={benchmarks}
                industry={selectedIndustry}
                currentValue={avgChurn}
                metric="churnRate"
              />
            </div>
          )}

          {activeTab === 'benchmarks' && selectedIndustry === 'all' && (
            <div className="text-center py-12 text-gray-400">
              <p>Please select a specific industry to view benchmarks</p>
            </div>
          )}

          {/* Trends Tab */}
          {activeTab === 'trends' && (
            <TimeSeriesChart data={timeSeries} metric="nps" />
          )}

          {/* Insights Tab */}
          {activeTab === 'insights' && selectedStudy && (
            <div className="space-y-6">
              <div className="bg-[#1a2942] rounded-lg p-6 border border-gray-800">
                <h2 className="text-xl font-semibold mb-2">{selectedStudy.companyName}</h2>
                <p className="text-sm text-gray-400">{selectedStudy.industry} • {selectedStudy.studyType}</p>
              </div>
              <AIInsights study={selectedStudy} />
            </div>
          )}

          {activeTab === 'insights' && !selectedStudy && (
            <div className="text-center py-12 text-gray-400">
              <p>Select a study from the Overview tab to generate AI insights</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}