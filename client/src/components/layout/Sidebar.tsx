import React from 'react';
import { Link, useLocation } from 'wouter';
import { useAuth } from '@/contexts/AuthContext';
import {
  BarChartBig,
  Phone,
  Smartphone,
  Network,
  Brain,
  Settings,
  ChevronDown,
  LayoutGrid,
  LineChart
} from 'lucide-react';

const Sidebar: React.FC = () => {
  const [location] = useLocation();
  const { currentTenant, tenants, setCurrentTenant } = useAuth();

  const isActive = (path: string) => {
    return location === path;
  };

  return (
    <aside className="w-16 md:w-64 bg-white border-r border-neutral-100 flex flex-col">
      {/* Logo */}
      <div className="h-16 flex items-center justify-center md:justify-start px-4 border-b border-neutral-100">
        <div className="hidden md:block text-xl font-semibold text-primary-600">Analytics Hub</div>
        <div className="block md:hidden text-xl font-semibold text-primary-600">A</div>
      </div>
      
      {/* Navigation Menu */}
      <nav className="flex-1 p-2 md:p-4 space-y-1">
        <Link href="/">
          <a className={`flex items-center p-2 rounded-md ${isActive('/') ? 'bg-primary-50 text-primary-600' : 'text-neutral-500 hover:bg-neutral-50'} group`}>
            <BarChartBig className="h-5 w-5" />
            <span className="ml-3 hidden md:block">Dashboard</span>
          </a>
        </Link>
        <Link href="/contact-center">
          <a className={`flex items-center p-2 rounded-md ${isActive('/contact-center') ? 'bg-primary-50 text-primary-600' : 'text-neutral-500 hover:bg-neutral-50'} group`}>
            <Phone className="h-5 w-5" />
            <span className="ml-3 hidden md:block">Contact Center</span>
          </a>
        </Link>
        <Link href="/mobile-banking">
          <a className={`flex items-center p-2 rounded-md ${isActive('/mobile-banking') ? 'bg-primary-50 text-primary-600' : 'text-neutral-500 hover:bg-neutral-50'} group`}>
            <Smartphone className="h-5 w-5" />
            <span className="ml-3 hidden md:block">Mobile Banking</span>
          </a>
        </Link>
        <Link href="/ivr-analytics">
          <a className={`flex items-center p-2 rounded-md ${isActive('/ivr-analytics') ? 'bg-primary-50 text-primary-600' : 'text-neutral-500 hover:bg-neutral-50'} group`}>
            <Network className="h-5 w-5" />
            <span className="ml-3 hidden md:block">IVR Analytics</span>
          </a>
        </Link>
        <Link href="/cognitive-services">
          <a className={`flex items-center p-2 rounded-md ${isActive('/cognitive-services') ? 'bg-primary-50 text-primary-600' : 'text-neutral-500 hover:bg-neutral-50'} group`}>
            <Brain className="h-5 w-5" />
            <span className="ml-3 hidden md:block">Cognitive Services</span>
          </a>
        </Link>
        <Link href="/kpi-dashboard">
          <a className={`flex items-center p-2 rounded-md ${isActive('/kpi-dashboard') ? 'bg-primary-50 text-primary-600' : 'text-neutral-500 hover:bg-neutral-50'} group`}>
            <LayoutGrid className="h-5 w-5" />
            <span className="ml-3 hidden md:block">KPI Dashboard</span>
          </a>
        </Link>
        <Link href="/chart-dashboard">
          <a className={`flex items-center p-2 rounded-md ${isActive('/chart-dashboard') ? 'bg-primary-50 text-primary-600' : 'text-neutral-500 hover:bg-neutral-50'} group`}>
            <LineChart className="h-5 w-5" />
            <span className="ml-3 hidden md:block">Chart Dashboard</span>
          </a>
        </Link>
        <Link href="/settings">
          <a className={`flex items-center p-2 rounded-md ${isActive('/settings') ? 'bg-primary-50 text-primary-600' : 'text-neutral-500 hover:bg-neutral-50'} group`}>
            <Settings className="h-5 w-5" />
            <span className="ml-3 hidden md:block">Settings</span>
          </a>
        </Link>
      </nav>
      
      {/* Tenant Selector */}
      <div className="p-4 border-t border-neutral-100">
        <div className="hidden md:block text-xs font-medium text-neutral-400 mb-2">TENANT</div>
        <div className="relative">
          <select 
            className="w-full p-2 bg-neutral-50 rounded-md text-sm font-medium appearance-none cursor-pointer focus:outline-none"
            value={currentTenant?.id || ''}
            onChange={(e) => {
              const tenant = tenants.find(t => t.id === Number(e.target.value));
              if (tenant) setCurrentTenant(tenant);
            }}
          >
            {tenants.map(tenant => (
              <option key={tenant.id} value={tenant.id}>
                {tenant.name}
              </option>
            ))}
          </select>
          <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-neutral-400">
            <ChevronDown className="h-4 w-4" />
          </div>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
