// BenchmarkChart.tsx - Visual benchmark comparison

'use client';

import { Benchmark, Industry } from './types';

interface BenchmarkChartProps {
  benchmarks: Benchmark[];
  industry: Industry;
  currentValue?: number;
  metric: string;
}

export default function BenchmarkChart({ benchmarks, industry, currentValue, metric }: BenchmarkChartProps) {
  const benchmark = benchmarks.find(b => b.industry === industry && b.metric === metric);
  
  if (!benchmark) {
    return (
      <div className="bg-[#1a2942] rounded-lg p-6 border border-gray-800">
        <p className="text-gray-400">No benchmark data available</p>
      </div>
    );
  }

  const { p25, p50, p75 } = benchmark;
  const maxValue = Math.max(p75, currentValue || 0) * 1.2;
  
  // Calculate positions as percentages
  const getPosition = (value: number) => (value / maxValue) * 100;

  return (
    <div className="bg-[#1a2942] rounded-lg p-6 border border-gray-800">
      <div className="mb-4">
        <h3 className="text-lg font-semibold capitalize">{metric.replace(/([A-Z])/g, ' $1').trim()}</h3>
        <p className="text-sm text-gray-400">{industry} Industry Benchmark</p>
      </div>

      {/* Visual Bar Chart */}
      <div className="space-y-6">
        {/* Benchmark bars */}
        <div className="relative h-12 bg-[#0f1c2e] rounded-lg overflow-hidden">
          {/* P25 - P75 Range (Interquartile range) */}
          <div
            className="absolute h-full bg-blue-900/40"
            style={{
              left: `${getPosition(p25)}%`,
              width: `${getPosition(p75) - getPosition(p25)}%`
            }}
          />
          
          {/* P50 (Median) Line */}
          <div
            className="absolute h-full w-1 bg-blue-400"
            style={{ left: `${getPosition(p50)}%` }}
          />
          
          {/* Current Value Marker */}
          {currentValue && (
            <div
              className="absolute h-full w-1 bg-cyan-400"
              style={{ left: `${getPosition(currentValue)}%` }}
            >
              <div className="absolute -top-6 -left-4 text-xs text-cyan-400 font-semibold whitespace-nowrap">
                You: {currentValue}
              </div>
            </div>
          )}
        </div>

        {/* Legend */}
        <div className="flex justify-between items-center text-xs">
          <div className="flex gap-4">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-blue-900/40 rounded"></div>
              <span className="text-gray-400">P25-P75 Range</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-blue-400 rounded"></div>
              <span className="text-gray-400">Median (P50)</span>
            </div>
            {currentValue && (
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-cyan-400 rounded"></div>
                <span className="text-gray-400">Your Value</span>
              </div>
            )}
          </div>
        </div>

        {/* Values Display */}
        <div className="grid grid-cols-3 gap-4 pt-4 border-t border-gray-800">
          <div>
            <div className="text-xs text-gray-500">25th Percentile</div>
            <div className="text-lg font-semibold">{p25}</div>
          </div>
          <div>
            <div className="text-xs text-gray-500">Median</div>
            <div className="text-lg font-semibold text-blue-400">{p50}</div>
          </div>
          <div>
            <div className="text-xs text-gray-500">75th Percentile</div>
            <div className="text-lg font-semibold">{p75}</div>
          </div>
        </div>

        {/* Performance Indicator */}
        {currentValue && (
          <div className={`text-sm p-3 rounded-lg ${
            currentValue >= p75 ? 'bg-green-900/20 text-green-400' :
            currentValue >= p50 ? 'bg-blue-900/20 text-blue-400' :
            currentValue >= p25 ? 'bg-yellow-900/20 text-yellow-400' :
            'bg-red-900/20 text-red-400'
          }`}>
            {currentValue >= p75 && '🌟 Top quartile performance - Excellent!'}
            {currentValue >= p50 && currentValue < p75 && '✓ Above median - Strong performance'}
            {currentValue >= p25 && currentValue < p50 && '→ Below median - Room for improvement'}
            {currentValue < p25 && '⚠️ Bottom quartile - Immediate attention needed'}
          </div>
        )}

        <div className="text-xs text-gray-500">
          Based on {benchmark.sampleSize} studies
        </div>
      </div>
    </div>
  );
}