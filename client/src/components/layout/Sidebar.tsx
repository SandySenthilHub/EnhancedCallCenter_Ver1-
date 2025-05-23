import React, { useState } from 'react';
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
  ChevronRight,
  LayoutGrid,
  LineChart,
  Cpu,
  Users,
  Building2,
  Shield,
  Globe,
  CreditCard,
  Activity,
  FileText,
  UserCheck,
  MapPin,
  Languages,
  AlertTriangle,
  Database,
  Workflow,
  UserPlus,
  Building,
  Briefcase,
  Target,
  TrendingUp,
  Crown,
  Server
} from 'lucide-react';

const Sidebar: React.FC = () => {
  const [location] = useLocation();
  const { currentTenant, tenants, setCurrentTenant } = useAuth();
  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({
    analytics: true,
    admin: false,
    system: false
  });

  const isActive = (path: string) => {
    return location === path;
  };

  const toggleSection = (section: string) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  const menuSections = [
    {
      id: 'analytics',
      title: 'Analytics',
      icon: TrendingUp,
      items: [
        { path: '/', label: 'Dashboard Overview', icon: BarChartBig },
        { path: '/kpi-dashboard', label: 'KPI Dashboard', icon: LayoutGrid },
        { path: '/chart-dashboard', label: 'Chart Dashboard', icon: LineChart },
        { path: '/cognitive-services', label: 'Cognitive Services', icon: Brain },
        { path: '/ai-playbook', label: 'AI/ML Playbook', icon: Cpu },
      ]
    },
    {
      id: 'contact-center',
      title: 'Contact Center',
      icon: Phone,
      items: [
        { path: '/contact-center/dashboard', label: 'Dashboard', icon: BarChartBig },
        { path: '/contact-center/analytics', label: 'Call Analytics', icon: Phone },
        { path: '/contact-center/agents', label: 'Agent Performance', icon: Users },
        { path: '/contact-center/quality', label: 'Quality Management', icon: Shield },
        { path: '/contact-center/backend', label: 'Back End', icon: Database },
        { path: '/contact-center/intelligence', label: 'Intelligence', icon: Brain },
        { path: '/contact-center/intel-delta', label: 'Intel Delta', icon: Server },
      ]
    },
    {
      id: 'mobile-banking',
      title: 'Mobile Banking',
      icon: Smartphone,
      items: [
        { path: '/mobile-banking/dashboard', label: 'Mobile Dashboard', icon: BarChartBig },
        { path: '/mobile-banking/transactions', label: 'Transaction Analytics', icon: CreditCard },
        { path: '/mobile-banking/users', label: 'User Behavior', icon: Users },
        { path: '/mobile-banking/performance', label: 'App Performance', icon: TrendingUp },
      ]
    },
    {
      id: 'ivr-analytics',
      title: 'IVR Analytics',
      icon: Network,
      items: [
        { path: '/ivr-analytics/dashboard', label: 'IVR Dashboard', icon: BarChartBig },
        { path: '/ivr-analytics/flows', label: 'Call Flow Analysis', icon: Workflow },
        { path: '/ivr-analytics/performance', label: 'Performance Metrics', icon: Activity },
        { path: '/ivr-analytics/optimization', label: 'Flow Optimization', icon: Target },
      ]
    },

    {
      id: 'admin',
      title: 'Administration',
      icon: Crown,
      items: [
        { path: '/admin/users', label: 'User Management', icon: Users },
        { path: '/admin/teams', label: 'Teams', icon: UserCheck },
        { path: '/admin/roles', label: 'Roles & Permissions', icon: Shield },
        { path: '/admin/tenants', label: 'Tenant Management', icon: Building2 },
        { path: '/admin/entities', label: 'Entity Framework', icon: Database },
        { path: '/admin/workflows', label: 'Workflow Management', icon: Workflow },
        { path: '/admin/companies', label: 'Companies', icon: Building },
        { path: '/admin/transactions', label: 'Transaction Center', icon: CreditCard },
      ]
    },
    {
      id: 'system',
      title: 'System Management',
      icon: Settings,
      items: [
        { path: '/system/countries', label: 'Countries & Regions', icon: Globe },
        { path: '/system/currencies', label: 'Currency Management', icon: CreditCard },
        { path: '/system/languages', label: 'Languages', icon: Languages },
        { path: '/system/monitoring', label: 'System Health', icon: Activity },
        { path: '/system/audit', label: 'Audit Logs', icon: FileText },
        { path: '/system/alerts', label: 'Alert Management', icon: AlertTriangle },
        { path: '/system/inbox', label: 'Workflow Inbox', icon: Briefcase },
        { path: '/settings', label: 'System Settings', icon: Settings },
      ]
    }
  ];

  return (
    <aside className="w-16 md:w-72 bg-white border-r border-neutral-100 flex flex-col">
      {/* Logo */}
      <div className="h-16 flex items-center justify-center md:justify-start px-4 border-b border-neutral-100">
        <div className="hidden md:block text-xl font-semibold text-primary-600">Banking Admin Hub</div>
        <div className="block md:hidden text-xl font-semibold text-primary-600">BA</div>
      </div>
      
      {/* Navigation Menu */}
      <nav className="flex-1 p-2 md:p-4 space-y-2 overflow-y-auto">
        {menuSections.map((section) => (
          <div key={section.id} className="space-y-1">
            {/* Section Header */}
            <button
              onClick={() => toggleSection(section.id)}
              className="w-full flex items-center justify-between p-2 text-neutral-700 hover:bg-neutral-50 rounded-md group"
            >
              <div className="flex items-center">
                <section.icon className="h-5 w-5 text-neutral-500" />
                <span className="ml-3 hidden md:block font-medium text-sm">{section.title}</span>
              </div>
              <div className="hidden md:block">
                {expandedSections[section.id] ? (
                  <ChevronDown className="h-4 w-4 text-neutral-400" />
                ) : (
                  <ChevronRight className="h-4 w-4 text-neutral-400" />
                )}
              </div>
            </button>

            {/* Section Items */}
            {expandedSections[section.id] && (
              <div className="space-y-1 ml-4 md:ml-6">
                {section.items.map((item) => (
                  <Link key={item.path} href={item.path}>
                    <a className={`flex items-center p-2 rounded-md text-sm ${
                      isActive(item.path) 
                        ? 'bg-primary-50 text-primary-600 border-r-2 border-primary-600' 
                        : 'text-neutral-600 hover:bg-neutral-50'
                    } group`}>
                      <item.icon className="h-4 w-4" />
                      <span className="ml-3 hidden md:block">{item.label}</span>
                    </a>
                  </Link>
                ))}
              </div>
            )}
          </div>
        ))}
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
