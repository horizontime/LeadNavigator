import { Brain, TrendingUp, Target, Clock, AlertCircle } from 'lucide-react';
import type { LeadInsight } from '../types/lead';

interface InsightsSectionProps {
  insights: LeadInsight[];
  isLoading?: boolean;
  error?: string;
}

export default function InsightsSection({ insights, isLoading = false, error }: InsightsSectionProps) {
  const getInsightIcon = (category: string) => {
    switch (category) {
      case 'engagement':
        return <Clock size={20} />;
      case 'opportunity':
        return <TrendingUp size={20} />;
      case 'strategy':
        return <Target size={20} />;
      case 'priority':
        return <AlertCircle size={20} />;
      default:
        return <Brain size={20} />;
    }
  };

  const getConfidenceLevel = (confidence: number) => {
    if (confidence >= 0.8) return 'high';
    if (confidence >= 0.6) return 'medium';
    return 'low';
  };

  if (isLoading) {
    return (
      <div className="insights-section">
        <div className="insights-header">
          <Brain className="insights-icon" size={24} />
          <h2 className="insights-title">AI Insights</h2>
        </div>
        <div className="insights-loading">
          <div className="loading-spinner"></div>
          <p>Generating insights...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="insights-section">
        <div className="insights-header">
          <Brain className="insights-icon" size={24} />
          <h2 className="insights-title">AI Insights</h2>
        </div>
        <div className="insights-error">
          <p className="error-text">{error}</p>
        </div>
      </div>
    );
  }

  if (insights.length === 0) {
    return (
      <div className="insights-section">
        <div className="insights-header">
          <Brain className="insights-icon" size={24} />
          <h2 className="insights-title">AI Insights</h2>
        </div>
        <div className="insights-empty">
          <p>No insights available for this lead.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="insights-section">
      <div className="insights-header">
        <Brain className="insights-icon" size={24} />
        <h2 className="insights-title">AI Insights</h2>
      </div>
      
      <div className="insights-list">
        {insights.map((insight) => (
          <div key={insight.id} className={`insight-card ${insight.category}`}>
            <div className="insight-header">
              <div className="insight-icon">
                {getInsightIcon(insight.category)}
              </div>
              <div className="insight-meta">
                <h3 className="insight-title">{insight.title}</h3>
                <span className={`confidence-badge ${getConfidenceLevel(insight.confidence)}`}>
                  {Math.round(insight.confidence * 100)}% confidence
                </span>
              </div>
            </div>
            <p className="insight-content">{insight.content}</p>
          </div>
        ))}
      </div>
    </div>
  );
} 