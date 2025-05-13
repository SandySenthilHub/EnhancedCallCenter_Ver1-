import React from 'react';
import { useLocation } from 'wouter';
import { useAuth } from '@/contexts/AuthContext';
import { useDashboard } from '@/contexts/DashboardContext';
import { Edit2, User } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

const pageNames: Record<string, string> = {
  '/': 'Dashboard',
  '/contact-center': 'Contact Center Analytics',
  '/mobile-banking': 'Mobile Banking Analytics',
  '/ivr-analytics': 'IVR Analytics',
  '/cognitive-services': 'Cognitive Services',
  '/settings': 'Settings',
};

const Header: React.FC = () => {
  const [location] = useLocation();
  const { users, currentUser, setCurrentUser } = useAuth();
  const { isEditMode, setIsEditMode, timeRange, setTimeRange } = useDashboard();

  const pageName = pageNames[location] || 'Contact Center & Mobile Banking Dashboard';
  const pageDescription = location === '/' 
    ? 'Overview of key performance metrics and analytics'
    : '';

  return (
    <header className="bg-white border-b border-neutral-100 px-4 md:px-8 py-4 sticky top-0 z-10">
      <div className="flex justify-between items-center">
        {/* Left: Title + Breadcrumb */}
        <div>
          <h1 className="text-xl font-semibold text-neutral-700">{pageName}</h1>
          {pageDescription && (
            <div className="text-sm text-neutral-400 mt-1">{pageDescription}</div>
          )}
        </div>
        
        {/* Right: Controls */}
        <div className="flex items-center space-x-4">
          {/* Time Range Selector */}
          <div className="hidden md:block">
            <Select 
              value={timeRange} 
              onValueChange={(value) => setTimeRange(value as any)}
            >
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Select time range" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="today">Today</SelectItem>
                <SelectItem value="yesterday">Yesterday</SelectItem>
                <SelectItem value="week">Last 7 days</SelectItem>
                <SelectItem value="month">Last 30 days</SelectItem>
                <SelectItem value="custom">Custom range</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          {/* User Selector */}
          <div className="relative">
            <Select 
              value={currentUser?.username || ''} 
              onValueChange={(value) => {
                const user = users.find(u => u.username === value);
                if (user) setCurrentUser(user);
              }}
            >
              <SelectTrigger className="w-[140px] pl-10">
                <User className="h-4 w-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-neutral-400" />
                <SelectValue placeholder="Select user" />
              </SelectTrigger>
              <SelectContent>
                {users.map(user => (
                  <SelectItem key={user.id} value={user.username}>
                    {user.displayName}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          {/* Edit Dashboard Mode Toggle */}
          <button 
            className={`inline-flex items-center px-3 py-2 border rounded-md text-sm font-medium
              ${isEditMode 
                ? 'border-primary-600 bg-primary-50 text-primary-600'
                : 'border-primary-600 text-primary-600 bg-white hover:bg-primary-50'
              }`}
            onClick={() => setIsEditMode(!isEditMode)}
          >
            <Edit2 className="h-4 w-4 mr-2" />
            <span className="hidden md:inline">Customize Dashboard</span>
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;
