// AIInsights.tsx - AI-powered insights generator

'use client';

import { useState } from 'react';
import { Study } from './types';
import { api } from './mockApi';

interface AIInsightsProps {
  study: Study;
}

export default function AIInsights({ study }: AIInsightsProps) {
  const [isGenerating, setIsGenerating] = useState(false);
  const [insights, setInsights] = useState<{
    summary: string;
    insights: string[];
    confidence: number;
  } | null>(null);

  async function generateInsights() {
    setIsGenerating(true);
    setInsights(null);
    
    // Simulate AI processing with delay
    const result = await api.generateInsight(study.id);
    
    setInsights(result);
    setIsGenerating(false);
  }

  return (
    <div className="bg-[#1a2942] rounded-lg p-6 border border-gray-800">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-lg font-semibold">AI Insights</h3>
          <p className="text-sm text-gray-400">Powered by intelligent analysis</p>
        </div>
        
        <button
          onClick={generateInsights}
          disabled={isGenerating}
          className="px-4 py-2 bg-cyan-600 hover:bg-cyan-700 disabled:bg-gray-700 disabled:cursor-not-allowed rounded-lg text-sm font-medium transition-colors"
        >
          {isGenerating ? 'Analyzing...' : 'Generate Insights'}
        </button>
      </div>

      {/* Loading State */}
      {isGenerating && (
        <div className="space-y-4">
          <div className="flex items-center gap-3 text-cyan-400">
            <div className="flex gap-1">
              <div className="w-2 h-2 bg-cyan-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
              <div className="w-2 h-2 bg-cyan-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
              <div className="w-2 h-2 bg-cyan-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
            </div>
            <span className="text-sm">AI analyzing data patterns...</span>
          </div>
          
          {/* Skeleton loading */}
          <div className="space-y-3">
            <div className="h-4 bg-gray-700/50 rounded animate-pulse w-3/4"></div>
            <div className="h-4 bg-gray-700/50 rounded animate-pulse w-full"></div>
            <div className="h-4 bg-gray-700/50 rounded animate-pulse w-5/6"></div>
          </div>
        </div>
      )}

      {/* Results */}
      {insights && !isGenerating && (
        <div className="space-y-4">
          {/* Summary */}
          <div className="p-4 bg-[#0f1c2e] rounded-lg border border-cyan-900/30">
            <div className="flex items-start gap-3">
              <div className="text-2xl">🤖</div>
              <div className="flex-1">
                <div className="text-sm font-medium text-cyan-400 mb-1">Executive Summary</div>
                <p className="text-gray-300">{insights.summary}</p>
              </div>
            </div>
          </div>

          {/* Insights List */}
          {insights.insights.length > 0 && (
            <div className="space-y-3">
              <div className="text-sm font-medium text-gray-400">Key Findings</div>
              {insights.insights.map((insight, idx) => (
                <div key={idx} className="p-4 bg-[#0f1c2e] rounded-lg border border-gray-800">
                  <div className="flex items-start gap-3">
                    <div className="text-lg">
                      {idx === 0 ? '💡' : idx === 1 ? '📊' : '🎯'}
                    </div>
                    <p className="text-sm text-gray-300 flex-1">{insight}</p>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Confidence Score */}
          <div className="flex items-center justify-between p-3 bg-[#0f1c2e] rounded-lg">
            <span className="text-xs text-gray-400">Confidence Score</span>
            <div className="flex items-center gap-2">
              <div className="w-32 h-2 bg-gray-700 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-cyan-500 to-blue-500"
                  style={{ width: `${insights.confidence * 100}%` }}
                />
              </div>
              <span className="text-sm font-semibold text-cyan-400">
                {Math.round(insights.confidence * 100)}%
              </span>
            </div>
          </div>

          {/* Disclaimer */}
          <div className="text-xs text-gray-500 italic">
            * Insights generated based on pattern analysis across {study.respondents} respondents and cross-study benchmarks
          </div>
        </div>
      )}

      {/* Empty State */}
      {!insights && !isGenerating && (
        <div className="text-center py-8 text-gray-500">
          <div className="text-4xl mb-3">🧠</div>
          <p className="text-sm">Click "Generate Insights" to analyze this study with AI</p>
        </div>
      )}
    </div>
  );
}