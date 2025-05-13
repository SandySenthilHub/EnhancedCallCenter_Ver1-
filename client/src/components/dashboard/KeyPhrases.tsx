import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useAuth } from '@/contexts/AuthContext';
import { useDashboard } from '@/contexts/DashboardContext';
import { Skeleton } from '@/components/ui/skeleton';

interface KeyPhrasesProps {
  title?: string;
}

interface KeyPhrase {
  text: string;
  weight: number;
}

const KeyPhrases: React.FC<KeyPhrasesProps> = ({ title = 'Common Key Phrases' }) => {
  const { currentTenant } = useAuth();
  const { getDateRangeParams } = useDashboard();
  const [sourceType, setSourceType] = useState<'calls' | 'app'>('calls');
  
  const dateParams = getDateRangeParams();
  const queryParams = new URLSearchParams({
    tenantId: currentTenant?.id?.toString() || '1',
    source: sourceType,
    ...(dateParams.startDate && { startDate: dateParams.startDate }),
    ...(dateParams.endDate && { endDate: dateParams.endDate })
  }).toString();
  
  const { data, isLoading, isError } = useQuery<KeyPhrase[]>({
    queryKey: [`/api/key-phrases?${queryParams}`],
    enabled: !!currentTenant
  });

  // Sample data - in a real app, this would come from the API
  const keyPhrases: KeyPhrase[] = data || [
    { text: 'account balance', weight: 1.4 },
    { text: 'transaction issue', weight: 1.1 },
    { text: 'app crash', weight: 0.9 },
    { text: 'payment failed', weight: 1.2 },
    { text: 'transfer money', weight: 1.0 },
    { text: 'login problem', weight: 1.3 },
    { text: 'statement request', weight: 1.0 },
    { text: 'card activation', weight: 1.0 },
    { text: 'update details', weight: 0.9 },
    { text: 'wrong charge', weight: 1.0 }
  ];

  // Get random background color for visual variety
  const getRandomColorClass = () => {
    const colors = [
      'bg-blue-50 text-blue-700',
      'bg-neutral-50 text-neutral-700',
      'bg-red-50 text-red-700',
      'bg-green-50 text-green-700',
      'bg-yellow-50 text-yellow-700'
    ];
    return colors[Math.floor(Math.random() * colors.length)];
  };

  // Sort phrases by weight for display
  const sortedPhrases = [...keyPhrases].sort((a, b) => b.weight - a.weight);
  
  // Find top issue
  const topIssue = sortedPhrases.length > 0 ? sortedPhrases[0].text : '';

  if (isLoading) {
    return (
      <div>
        <div className="flex justify-between items-center mb-4">
          <h3 className="font-medium text-neutral-700">{title}</h3>
          <div className="flex space-x-2">
            <button 
              className={`px-2 py-1 text-xs rounded ${sourceType === 'calls' ? 'bg-primary-50 text-primary-600' : 'text-neutral-500 hover:bg-neutral-50'}`}
              onClick={() => setSourceType('calls')}
            >
              Calls
            </button>
            <button 
              className={`px-2 py-1 text-xs rounded ${sourceType === 'app' ? 'bg-primary-50 text-primary-600' : 'text-neutral-500 hover:bg-neutral-50'}`}
              onClick={() => setSourceType('app')}
            >
              App
            </button>
          </div>
        </div>
        <Skeleton className="h-[180px] w-full" />
      </div>
    );
  }

  if (isError) {
    return (
      <div>
        <div className="flex justify-between items-center mb-4">
          <h3 className="font-medium text-neutral-700">{title}</h3>
          <div className="flex space-x-2">
            <button 
              className={`px-2 py-1 text-xs rounded ${sourceType === 'calls' ? 'bg-primary-50 text-primary-600' : 'text-neutral-500 hover:bg-neutral-50'}`}
              onClick={() => setSourceType('calls')}
            >
              Calls
            </button>
            <button 
              className={`px-2 py-1 text-xs rounded ${sourceType === 'app' ? 'bg-primary-50 text-primary-600' : 'text-neutral-500 hover:bg-neutral-50'}`}
              onClick={() => setSourceType('app')}
            >
              App
            </button>
          </div>
        </div>
        <div className="h-[180px] flex items-center justify-center bg-neutral-50 rounded-md">
          <p className="text-neutral-500">Failed to load key phrases</p>
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
            className={`px-2 py-1 text-xs rounded ${sourceType === 'calls' ? 'bg-primary-50 text-primary-600' : 'text-neutral-500 hover:bg-neutral-50'}`}
            onClick={() => setSourceType('calls')}
          >
            Calls
          </button>
          <button 
            className={`px-2 py-1 text-xs rounded ${sourceType === 'app' ? 'bg-primary-50 text-primary-600' : 'text-neutral-500 hover:bg-neutral-50'}`}
            onClick={() => setSourceType('app')}
          >
            App
          </button>
        </div>
      </div>
      <div className="space-y-3 p-2">
        <div className="flex flex-wrap gap-2 justify-center">
          {sortedPhrases.map((phrase, index) => (
            <span 
              key={index} 
              className={`${getRandomColorClass()} px-2 py-1 rounded text-sm`} 
              style={{ fontSize: `${0.8 + (phrase.weight * 0.3)}rem` }}
            >
              {phrase.text}
            </span>
          ))}
        </div>
      </div>
      <div className="text-xs text-neutral-500 mt-2 text-center">
        Top issue: "{topIssue}" (72 occurrences today)
      </div>
    </div>
  );
};

export default KeyPhrases;
