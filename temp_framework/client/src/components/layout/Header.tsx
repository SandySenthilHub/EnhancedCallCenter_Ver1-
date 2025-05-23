import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Bell, Plus } from "lucide-react";

export default function Header() {
  const [location] = useLocation();

  const getBreadcrumbs = () => {
    const paths = location.split('/').filter(Boolean);
    
    if (paths.length === 0 || location === '/dashboard') {
      return { parent: 'Dashboard', current: 'Overview' };
    }

    const routeMap: Record<string, string> = {
      entities: 'Entity Management',
      users: 'User Management',
      roles: 'Roles & Permissions',
      transactions: 'Transaction Management',
      screens: 'Screen Assets',
      reports: 'Reports & Analytics',
    };

    const current = paths[0];
    return {
      parent: routeMap[current] || 'Dashboard',
      current: routeMap[current] || 'Overview',
    };
  };

  const { parent, current } = getBreadcrumbs();

  const getPageTitle = () => {
    if (location === '/' || location === '/dashboard') return 'Dashboard Overview';
    
    const titleMap: Record<string, string> = {
      '/entities': 'Entity Management',
      '/users': 'User Management', 
      '/roles': 'Roles & Permissions',
      '/transactions': 'Transaction Management',
      '/screens': 'Screen Assets',
      '/reports': 'Reports & Analytics',
    };

    return titleMap[location] || 'Dashboard Overview';
  };

  return (
    <header className="bg-white shadow-sm border-b border-slate-200 px-6 py-4">
      <div className="flex items-center justify-between">
        <div>
          <nav className="flex items-center space-x-2 text-sm">
            <span className="text-slate-500">{parent}</span>
            {parent !== current && (
              <>
                <span className="text-slate-300">›</span>
                <span className="text-slate-900 font-medium">{current}</span>
              </>
            )}
          </nav>
          <h1 className="text-2xl font-semibold text-slate-900 mt-1">
            {getPageTitle()}
          </h1>
        </div>
        
        <div className="flex items-center space-x-4">
          <Button variant="ghost" size="sm" className="p-2 text-slate-400 hover:text-slate-600 relative">
            <Bell size={20} />
            <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full"></span>
          </Button>
          
          <Button className="bg-primary text-white hover:bg-blue-700">
            <Plus className="mr-2" size={16} />
            Create New
          </Button>
        </div>
      </div>
    </header>
  );
}
