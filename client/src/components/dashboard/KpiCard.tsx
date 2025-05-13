import React from 'react';
import { TrendingUp, TrendingDown } from 'lucide-react';

interface KpiCardProps {
  title: string;
  value: string;
  unit: string;
  target: string;
  threshold: string;
  trend: 'up' | 'down' | 'neutral';
  trendValue: number;
  progress: number;
  status: 'success' | 'warning' | 'error';
}

const KpiCard: React.FC<KpiCardProps> = ({ 
  title, 
  value, 
  unit, 
  target, 
  threshold, 
  trend, 
  trendValue, 
  progress, 
  status 
}) => {
  const statusColors = {
    success: 'bg-success',
    warning: 'bg-warning',
    error: 'bg-error'
  };

  const trendColors = {
    up: {
      text: trend === 'up' && status === 'success' ? 'text-success' : 'text-error',
      icon: <TrendingUp className="h-3 w-3 mr-1" />
    },
    down: {
      text: trend === 'down' && status === 'success' ? 'text-success' : 'text-error',
      icon: <TrendingDown className="h-3 w-3 mr-1" />
    },
    neutral: {
      text: 'text-neutral-400',
      icon: null
    }
  };

  const trendDisplay = trendColors[trend];

  return (
    <div className="bg-white rounded-lg border border-neutral-100 shadow-sm p-5">
      <div className="flex justify-between items-start mb-2">
        <div className="text-sm font-medium text-neutral-500">{title}</div>
        <div className={`flex items-center text-xs font-medium ${trendDisplay.text}`}>
          {trendDisplay.icon}
          {trendValue > 0 ? '+' : ''}{trendValue}%
        </div>
      </div>
      <div className="flex items-baseline">
        <span className="text-2xl font-semibold text-neutral-700">{value}</span>
        <span className="ml-2 text-sm text-neutral-400">{unit}</span>
      </div>
      <div className="w-full h-1 bg-neutral-100 rounded-full mt-3 overflow-hidden">
        <div className={`${statusColors[status]} h-full rounded-full`} style={{ width: `${progress}%` }}></div>
      </div>
      <div className="flex justify-between mt-1 text-xs text-neutral-400">
        <span>Target: {target}</span>
        <span>Threshold: {threshold}</span>
      </div>
    </div>
  );
};

export default KpiCard;
