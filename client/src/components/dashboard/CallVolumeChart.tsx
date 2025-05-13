import React, { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useAuth } from '@/contexts/AuthContext';
import { useDashboard } from '@/contexts/DashboardContext';
import { CallVolumeData } from '@/lib/types';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Skeleton } from '@/components/ui/skeleton';

interface CallVolumeChartProps {
  title?: string;
}

const CallVolumeChart: React.FC<CallVolumeChartProps> = ({ title = 'Call Volume Trends' }) => {
  const { currentTenant } = useAuth();
  const { timeRange, getDateRangeParams } = useDashboard();
  const [activeTimeRange, setActiveTimeRange] = useState<'day' | 'week' | 'month'>('day');
  
  const dateParams = getDateRangeParams();
  const queryParams = new URLSearchParams({
    tenantId: currentTenant?.id?.toString() || '1',
    ...(dateParams.startDate && { startDate: dateParams.startDate }),
    ...(dateParams.endDate && { endDate: dateParams.endDate })
  }).toString();
  
  const { data, isLoading, isError } = useQuery<CallVolumeData[]>({
    queryKey: [`/api/calls?${queryParams}`],
    enabled: !!currentTenant
  });

  // Generate sample data based on time range
  // In a real app, this would come from the API
  const generateChartData = () => {
    if (activeTimeRange === 'day') {
      return [
        { time: '8:00', inbound: 42, outbound: 12 },
        { time: '9:00', inbound: 85, outbound: 19 },
        { time: '10:00', inbound: 101, outbound: 25 },
        { time: '11:00', inbound: 92, outbound: 32 },
        { time: '12:00', inbound: 78, outbound: 28 },
        { time: '13:00', inbound: 80, outbound: 24 },
        { time: '14:00', inbound: 95, outbound: 20 },
        { time: '15:00', inbound: 88, outbound: 25 },
        { time: '16:00', inbound: 76, outbound: 30 },
        { time: '17:00', inbound: 68, outbound: 22 }
      ];
    } else if (activeTimeRange === 'week') {
      return [
        { time: 'Mon', inbound: 350, outbound: 120 },
        { time: 'Tue', inbound: 380, outbound: 130 },
        { time: 'Wed', inbound: 420, outbound: 150 },
        { time: 'Thu', inbound: 390, outbound: 140 },
        { time: 'Fri', inbound: 410, outbound: 160 },
        { time: 'Sat', inbound: 280, outbound: 90 },
        { time: 'Sun', inbound: 220, outbound: 70 }
      ];
    } else {
      return [
        { time: 'Week 1', inbound: 1450, outbound: 520 },
        { time: 'Week 2', inbound: 1580, outbound: 570 },
        { time: 'Week 3', inbound: 1620, outbound: 590 },
        { time: 'Week 4', inbound: 1550, outbound: 560 }
      ];
    }
  };

  const chartData = data || generateChartData();

  if (isLoading) {
    return (
      <div>
        <div className="flex justify-between items-center mb-4">
          <h3 className="font-medium text-neutral-700">{title}</h3>
          <div className="flex space-x-2">
            <button className="px-2 py-1 text-xs rounded bg-primary-50 text-primary-600">Day</button>
            <button className="px-2 py-1 text-xs rounded text-neutral-500 hover:bg-neutral-50">Week</button>
            <button className="px-2 py-1 text-xs rounded text-neutral-500 hover:bg-neutral-50">Month</button>
          </div>
        </div>
        <Skeleton className="h-[250px] w-full" />
      </div>
    );
  }

  if (isError) {
    return (
      <div>
        <div className="flex justify-between items-center mb-4">
          <h3 className="font-medium text-neutral-700">{title}</h3>
        </div>
        <div className="h-[250px] flex items-center justify-center bg-neutral-50 rounded-md">
          <p className="text-neutral-500">Failed to load call volume data</p>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h3 className="font-medium text-neutral-700">{title}</h3>
        <div className="flex space-x-2">
          <button 
            className={`px-2 py-1 text-xs rounded ${activeTimeRange === 'day' ? 'bg-primary-50 text-primary-600' : 'text-neutral-500 hover:bg-neutral-50'}`}
            onClick={() => setActiveTimeRange('day')}
          >
            Day
          </button>
          <button 
            className={`px-2 py-1 text-xs rounded ${activeTimeRange === 'week' ? 'bg-primary-50 text-primary-600' : 'text-neutral-500 hover:bg-neutral-50'}`}
            onClick={() => setActiveTimeRange('week')}
          >
            Week
          </button>
          <button 
            className={`px-2 py-1 text-xs rounded ${activeTimeRange === 'month' ? 'bg-primary-50 text-primary-600' : 'text-neutral-500 hover:bg-neutral-50'}`}
            onClick={() => setActiveTimeRange('month')}
          >
            Month
          </button>
        </div>
      </div>
      <ResponsiveContainer width="100%" height={250}>
        <BarChart data={chartData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="time" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Bar dataKey="inbound" name="Inbound" fill="#1a5fb4" />
          <Bar dataKey="outbound" name="Outbound" fill="#26a269" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default CallVolumeChart;
