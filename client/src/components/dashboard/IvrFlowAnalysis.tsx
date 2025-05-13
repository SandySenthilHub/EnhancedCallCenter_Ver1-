import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { useAuth } from '@/contexts/AuthContext';
import { useDashboard } from '@/contexts/DashboardContext';
import { IvrFlowNode } from '@/lib/types';
import { Skeleton } from '@/components/ui/skeleton';
import { Sankey, Tooltip, Rectangle, Layer, ResponsiveContainer } from 'recharts';

interface IvrFlowAnalysisProps {
  title?: string;
}

const IvrFlowAnalysis: React.FC<IvrFlowAnalysisProps> = ({ title = 'IVR Flow Analysis' }) => {
  const { currentTenant } = useAuth();
  const { getDateRangeParams } = useDashboard();
  
  const dateParams = getDateRangeParams();
  const queryParams = new URLSearchParams({
    tenantId: currentTenant?.id?.toString() || '1',
    ...(dateParams.startDate && { startDate: dateParams.startDate }),
    ...(dateParams.endDate && { endDate: dateParams.endDate })
  }).toString();
  
  const { data, isLoading, isError } = useQuery({
    queryKey: [`/api/ivr-flow?${queryParams}`],
    enabled: !!currentTenant
  });

  // Sample data - in a real app this would come from the API
  const sampleData = {
    nodes: [
      { name: 'Main Menu' },
      { name: 'Account Balance' },
      { name: 'Transaction History' },
      { name: 'Speak to Agent' },
      { name: 'End Call' },
    ],
    links: [
      { source: 0, target: 1, value: 30 },
      { source: 0, target: 2, value: 62 },
      { source: 0, target: 3, value: 10 },
      { source: 1, target: 4, value: 25 },
      { source: 2, target: 4, value: 55 },
      { source: 2, target: 3, value: 7 },
      { source: 3, target: 4, value: 17 },
    ]
  };

  const ivrData = data || sampleData;

  if (isLoading) {
    return (
      <div>
        <div className="flex justify-between items-center mb-4">
          <h3 className="font-medium text-neutral-700">{title}</h3>
          <button className="text-xs bg-neutral-50 hover:bg-neutral-100 text-neutral-600 py-1 px-2 rounded">
            View Details
          </button>
        </div>
        <Skeleton className="h-[200px] w-full" />
      </div>
    );
  }

  if (isError) {
    return (
      <div>
        <div className="flex justify-between items-center mb-4">
          <h3 className="font-medium text-neutral-700">{title}</h3>
          <button className="text-xs bg-neutral-50 hover:bg-neutral-100 text-neutral-600 py-1 px-2 rounded">
            View Details
          </button>
        </div>
        <div className="h-[200px] flex items-center justify-center bg-neutral-50 rounded-md">
          <p className="text-neutral-500">Failed to load IVR flow data</p>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h3 className="font-medium text-neutral-700">{title}</h3>
        <button className="text-xs bg-neutral-50 hover:bg-neutral-100 text-neutral-600 py-1 px-2 rounded">
          View Details
        </button>
      </div>
      <div className="h-[200px]">
        <ResponsiveContainer width="100%" height="100%">
          <Sankey
            data={ivrData}
            nodeWidth={20}
            nodePadding={10}
            linkCurvature={0.5}
            iterations={64}
            node={props => {
              const { x, y, width, height, index, name } = props;
              return (
                <Layer key={`node-${index}`}>
                  <Rectangle
                    x={x}
                    y={y}
                    width={width}
                    height={height}
                    fill="#e6f0fc"
                    fillOpacity={0.9}
                    stroke="#cce0f9"
                  />
                  <text
                    textAnchor={index % 2 ? 'start' : 'end'}
                    x={index % 2 ? x + width + 6 : x - 6}
                    y={y + height / 2}
                    fontSize={9}
                    fill="#1a5fb4"
                    dominantBaseline="middle"
                  >
                    {name}
                  </text>
                </Layer>
              )
            }}
            link={props => {
              const { sourceX, targetX, sourceY, targetY, sourceControlX, targetControlX, linkWidth, index } = props;
              return (
                <Layer key={`link-${index}`}>
                  <path
                    d={`
                      M${sourceX},${sourceY}
                      C${sourceControlX},${sourceY} ${targetControlX},${targetY} ${targetX},${targetY}
                    `}
                    fill="none"
                    stroke="#cce0f9"
                    strokeWidth={linkWidth}
                    strokeOpacity={0.5}
                  />
                </Layer>
              )
            }}
            tooltip={<Tooltip />}
          />
        </ResponsiveContainer>
      </div>
      <div className="text-xs text-neutral-500 mt-4 text-center">
        Top path: Main Menu → Transaction History (62% of calls)
      </div>
    </div>
  );
};

export default IvrFlowAnalysis;
