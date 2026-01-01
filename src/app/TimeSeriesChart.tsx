// TimeSeriesChart.tsx - Show trends over time

'use client';

import { TimeSeriesPoint } from './types';

interface TimeSeriesChartProps {
  data: TimeSeriesPoint[];
  metric: string;
}

export default function TimeSeriesChart({ data, metric }: TimeSeriesChartProps) {
  if (data.length === 0) {
    return (
      <div className="bg-[#1a2942] rounded-lg p-6 border border-gray-800">
        <p className="text-gray-400">No time series data available</p>
      </div>
    );
  }

  // Group by company
  const companies = [...new Set(data.map(d => d.companyName))];
  
  // Get min/max for scaling
  const values = data.map(d => d.value);
  const minValue = Math.min(...values);
  const maxValue = Math.max(...values);
  const range = maxValue - minValue;
  
  // Get unique dates and sort
  const dates = [...new Set(data.map(d => d.date.toISOString()))]
    .sort()
    .map(d => new Date(d));
  
  const getYPosition = (value: number) => {
    return 100 - ((value - minValue) / range) * 100;
  };

  return (
    <div className="bg-[#1a2942] rounded-lg p-6 border border-gray-800">
      <div className="mb-6">
        <h3 className="text-lg font-semibold">Trend Analysis</h3>
        <p className="text-sm text-gray-400 capitalize">
          {metric.replace(/([A-Z])/g, ' $1').trim()} over time
        </p>
      </div>

      {/* Chart Area */}
      <div className="relative h-64 bg-[#0f1c2e] rounded-lg p-4">
        {/* Y-axis labels */}
        <div className="absolute left-0 top-0 bottom-0 w-12 flex flex-col justify-between text-xs text-gray-500">
          <span>{Math.round(maxValue)}</span>
          <span>{Math.round(maxValue - range * 0.5)}</span>
          <span>{Math.round(minValue)}</span>
        </div>

        {/* Chart area */}
        <div className="ml-12 h-full relative">
          {/* Grid lines */}
          <div className="absolute inset-0">
            {[0, 25, 50, 75, 100].map(y => (
              <div
                key={y}
                className="absolute w-full border-t border-gray-800"
                style={{ top: `${y}%` }}
              />
            ))}
          </div>

          {/* Lines for each company */}
          <svg className="absolute inset-0 w-full h-full">
            {companies.slice(0, 5).map((company, idx) => {
              const companyData = data
                .filter(d => d.companyName === company)
                .sort((a, b) => a.date.getTime() - b.date.getTime());
              
              const points = companyData.map((d, i) => {
                const x = (i / (companyData.length - 1)) * 100;
                const y = getYPosition(d.value);
                return `${x},${y}`;
              }).join(' ');

              const colors = [
                'rgb(34, 211, 238)', // cyan
                'rgb(59, 130, 246)', // blue
                'rgb(168, 85, 247)', // purple
                'rgb(236, 72, 153)', // pink
                'rgb(34, 197, 94)'   // green
              ];

              return (
                <polyline
                  key={company}
                  points={points}
                  fill="none"
                  stroke={colors[idx]}
                  strokeWidth="2"
                  className="transition-all"
                  vectorEffect="non-scaling-stroke"
                />
              );
            })}
          </svg>

          {/* Data points */}
          {companies.slice(0, 5).map((company, idx) => {
            const companyData = data
              .filter(d => d.companyName === company)
              .sort((a, b) => a.date.getTime() - b.date.getTime());
            
            const colors = [
              'rgb(34, 211, 238)',
              'rgb(59, 130, 246)',
              'rgb(168, 85, 247)',
              'rgb(236, 72, 153)',
              'rgb(34, 197, 94)'
            ];

            return companyData.map((d, i) => {
              const x = (i / (companyData.length - 1)) * 100;
              const y = getYPosition(d.value);
              
              return (
                <div
                  key={`${company}-${i}`}
                  className="absolute w-2 h-2 rounded-full transform -translate-x-1 -translate-y-1"
                  style={{
                    left: `${x}%`,
                    top: `${y}%`,
                    backgroundColor: colors[idx]
                  }}
                />
              );
            });
          })}
        </div>

        {/* X-axis labels */}
        <div className="ml-12 mt-2 flex justify-between text-xs text-gray-500">
          {dates.length > 0 && (
            <>
              <span>{dates[0].toLocaleDateString('en-US', { month: 'short', year: '2-digit' })}</span>
              <span>{dates[Math.floor(dates.length / 2)].toLocaleDateString('en-US', { month: 'short', year: '2-digit' })}</span>
              <span>{dates[dates.length - 1].toLocaleDateString('en-US', { month: 'short', year: '2-digit' })}</span>
            </>
          )}
        </div>
      </div>

      {/* Legend */}
      <div className="mt-4 grid grid-cols-2 md:grid-cols-3 gap-2">
        {companies.slice(0, 5).map((company, idx) => {
          const colors = [
            'rgb(34, 211, 238)',
            'rgb(59, 130, 246)',
            'rgb(168, 85, 247)',
            'rgb(236, 72, 153)',
            'rgb(34, 197, 94)'
          ];

          const latestValue = data
            .filter(d => d.companyName === company)
            .sort((a, b) => b.date.getTime() - a.date.getTime())[0]?.value;

          return (
            <div key={company} className="flex items-center gap-2 text-xs">
              <div
                className="w-3 h-3 rounded-full"
                style={{ backgroundColor: colors[idx] }}
              />
              <span className="text-gray-300 truncate">{company}</span>
              <span className="text-gray-500 ml-auto">{Math.round(latestValue)}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}