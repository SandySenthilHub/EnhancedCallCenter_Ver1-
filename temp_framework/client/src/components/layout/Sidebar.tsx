import { useState } from "react";
import { Link, useLocation } from "wouter";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Building,
  BarChart3,
  Database,
  Ticket,
  Monitor,
  Users,
  Shield,
  TrendingUp,
  MoreVertical,
  LogOut,
  Globe,
  DollarSign,
  Languages,
  MapPin,
  Inbox,
  Send,
  AlertTriangle,
  Bug,
  Activity,
  Lock,
  Settings,
  CreditCard,
  Camera,
  Bell,
  FileText,
  Building2,
} from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

interface SidebarProps {
  collapsed: boolean;
  onToggle: () => void;
}

export default function Sidebar({ collapsed }: SidebarProps) {
  const [location] = useLocation();
  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: tenants = [] } = useQuery({
    queryKey: ["/api/tenants"],
    enabled: !!user,
  });

  const updateTenantMutation = useMutation({
    mutationFn: async (tenantId: number) => {
      await apiRequest("PUT", "/api/auth/user/current-tenant", { tenantId });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/auth/user"] });
      queryClient.invalidateQueries();
      toast({
        title: "Success",
        description: "Tenant switched successfully",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to switch tenant",
        variant: "destructive",
      });
    },
  });

  const navigation = [
    // MAIN BUSINESS MODULES
    {
      name: "Dashboard",
      href: "/dashboard",
      icon: BarChart3,
      section: "main",
    },
    {
      name: "Entity Management",
      href: "/entities",
      icon: Database,
      section: "main",
    },
    {
      name: "Transactions",
      href: "/transactions",
      icon: Ticket,
      section: "main",
    },
    {
      name: "Screen Assets",
      href: "/screens",
      icon: Monitor,
      section: "main",
    },
    
    // WORKFLOW MANAGEMENT
    {
      name: "Inbox",
      href: "/inbox",
      icon: Inbox,
      section: "workflow",
    },
    {
      name: "Sent Items",
      href: "/sent-items",
      icon: Send,
      section: "workflow",
    },
    {
      name: "Alerts",
      href: "/alerts",
      icon: Bell,
      section: "workflow",
    },
    
    // REFERENCE DATA
    {
      name: "Countries",
      href: "/countries",
      icon: Globe,
      section: "reference",
    },
    {
      name: "Cities",
      href: "/cities",
      icon: MapPin,
      section: "reference",
    },
    {
      name: "Currencies",
      href: "/currencies",
      icon: DollarSign,
      section: "reference",
    },
    {
      name: "Languages",
      href: "/languages",
      icon: Languages,
      section: "reference",
    },
    {
      name: "Text Translations",
      href: "/translations",
      icon: FileText,
      section: "reference",
    },
    
    // FINANCIAL MANAGEMENT
    {
      name: "Credits System",
      href: "/credits",
      icon: CreditCard,
      section: "financial",
    },
    {
      name: "Transaction Limits",
      href: "/transaction-limits",
      icon: Lock,
      section: "financial",
    },
    
    // USER & SECURITY MANAGEMENT
    {
      name: "User Management",
      href: "/users",
      icon: Users,
      section: "admin",
    },
    {
      name: "Team Management",
      href: "/teams",
      icon: Users,
      section: "admin",
    },
    {
      name: "Roles & Permissions",
      href: "/roles",
      icon: Shield,
      section: "admin",
    },
    {
      name: "Role Exceptions",
      href: "/role-exceptions",
      icon: Settings,
      section: "admin",
    },
    {
      name: "User Activity Monitor",
      href: "/user-activity",
      icon: Activity,
      section: "admin",
    },
    {
      name: "User Restrictions",
      href: "/user-restrictions",
      icon: Lock,
      section: "admin",
    },
    {
      name: "Modules",
      href: "/modules",
      icon: Building2,
      section: "admin",
    },
    
    // SYSTEM MONITORING & LOGS
    {
      name: "Error Logs",
      href: "/error-logs",
      icon: AlertTriangle,
      section: "system",
    },
    {
      name: "Exception Logs",
      href: "/exception-logs",
      icon: Bug,
      section: "system",
    },
    {
      name: "Access Logs",
      href: "/access-logs",
      icon: Activity,
      section: "system",
    },
    {
      name: "Health Checks",
      href: "/health-checks",
      icon: Activity,
      section: "system",
    },
    {
      name: "Reports",
      href: "/reports",
      icon: TrendingUp,
      section: "system",
    },
  ];

  const handleTenantChange = (tenantId: string) => {
    updateTenantMutation.mutate(parseInt(tenantId));
  };

  const handleLogout = () => {
    window.location.href = "/api/logout";
  };

  const getInitials = (firstName?: string, lastName?: string) => {
    return `${firstName?.[0] || ''}${lastName?.[0] || ''}`.toUpperCase() || 'U';
  };

  const currentTenant = tenants.find((t: any) => t.id === user?.currentTenantId);

  return (
    <aside className="w-64 bg-white shadow-sm border-r border-slate-200 flex flex-col">
      {/* Header */}
      <div className="p-4 border-b border-slate-200">
        <div className="flex items-center space-x-3 mb-3">
          <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
            <Building className="text-white text-sm" size={16} />
          </div>
          <div>
            <h1 className="font-semibold text-slate-900">EnterprisePlatform</h1>
          </div>
        </div>
        
        {/* Tenant Selector */}
        <Select 
          value={user?.currentTenantId?.toString() || ""} 
          onValueChange={handleTenantChange}
          disabled={updateTenantMutation.isPending}
        >
          <SelectTrigger className="w-full bg-slate-50 border border-slate-200">
            <SelectValue placeholder="Select tenant" />
          </SelectTrigger>
          <SelectContent>
            {tenants.map((tenant: any) => (
              <SelectItem key={tenant.id} value={tenant.id.toString()}>
                {tenant.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
        {/* Main Section */}
        <div className="text-xs font-medium text-slate-500 uppercase tracking-wide mb-3">
          Main
        </div>
        {navigation
          .filter(item => item.section === "main")
          .map((item) => {
            const isActive = location === item.href || (item.href === "/dashboard" && location === "/");
            return (
              <Link key={item.name} href={item.href}>
                <Button
                  variant="ghost"
                  className={`w-full justify-start ${
                    isActive
                      ? "bg-primary text-white hover:bg-blue-700"
                      : "text-slate-600 hover:bg-slate-50"
                  }`}
                >
                  <item.icon className="mr-3" size={16} />
                  {item.name}
                </Button>
              </Link>
            );
          })}

        {/* Workflow Section */}
        <div className="text-xs font-medium text-slate-500 uppercase tracking-wide mb-3 mt-6">
          Workflow
        </div>
        {navigation
          .filter(item => item.section === "workflow")
          .map((item) => {
            const isActive = location === item.href;
            return (
              <Link key={item.name} href={item.href}>
                <Button
                  variant="ghost"
                  className={`w-full justify-start ${
                    isActive
                      ? "bg-primary text-white hover:bg-blue-700"
                      : "text-slate-600 hover:bg-slate-50"
                  }`}
                >
                  <item.icon className="mr-3" size={16} />
                  {item.name}
                </Button>
              </Link>
            );
          })}

        {/* Reference Data Section */}
        <div className="text-xs font-medium text-slate-500 uppercase tracking-wide mb-3 mt-6">
          Reference Data
        </div>
        {navigation
          .filter(item => item.section === "reference")
          .map((item) => {
            const isActive = location === item.href;
            return (
              <Link key={item.name} href={item.href}>
                <Button
                  variant="ghost"
                  className={`w-full justify-start ${
                    isActive
                      ? "bg-primary text-white hover:bg-blue-700"
                      : "text-slate-600 hover:bg-slate-50"
                  }`}
                >
                  <item.icon className="mr-3" size={16} />
                  {item.name}
                </Button>
              </Link>
            );
          })}

        {/* Financial Section */}
        <div className="text-xs font-medium text-slate-500 uppercase tracking-wide mb-3 mt-6">
          Financial
        </div>
        {navigation
          .filter(item => item.section === "financial")
          .map((item) => {
            const isActive = location === item.href;
            return (
              <Link key={item.name} href={item.href}>
                <Button
                  variant="ghost"
                  className={`w-full justify-start ${
                    isActive
                      ? "bg-primary text-white hover:bg-blue-700"
                      : "text-slate-600 hover:bg-slate-50"
                  }`}
                >
                  <item.icon className="mr-3" size={16} />
                  {item.name}
                </Button>
              </Link>
            );
          })}

        {/* Administration Section */}
        <div className="text-xs font-medium text-slate-500 uppercase tracking-wide mb-3 mt-6">
          Administration
        </div>
        {navigation
          .filter(item => item.section === "admin")
          .map((item) => {
            const isActive = location === item.href;
            return (
              <Link key={item.name} href={item.href}>
                <Button
                  variant="ghost"
                  className={`w-full justify-start ${
                    isActive
                      ? "bg-primary text-white hover:bg-blue-700"
                      : "text-slate-600 hover:bg-slate-50"
                  }`}
                >
                  <item.icon className="mr-3" size={16} />
                  {item.name}
                </Button>
              </Link>
            );
          })}

        {/* System Section */}
        <div className="text-xs font-medium text-slate-500 uppercase tracking-wide mb-3 mt-6">
          System
        </div>
        {navigation
          .filter(item => item.section === "system")
          .map((item) => {
            const isActive = location === item.href;
            return (
              <Link key={item.name} href={item.href}>
                <Button
                  variant="ghost"
                  className={`w-full justify-start ${
                    isActive
                      ? "bg-primary text-white hover:bg-blue-700"
                      : "text-slate-600 hover:bg-slate-50"
                  }`}
                >
                  <item.icon className="mr-3" size={16} />
                  {item.name}
                </Button>
              </Link>
            );
          })}
      </nav>

      {/* User Profile */}
      <div className="p-4 border-t border-slate-200">
        <div className="flex items-center space-x-3">
          <Avatar className="h-8 w-8">
            <AvatarImage src={user?.profileImageUrl} />
            <AvatarFallback className="bg-primary text-white text-xs">
              {getInitials(user?.firstName, user?.lastName)}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-slate-900 truncate">
              {user?.firstName} {user?.lastName}
            </p>
            <p className="text-xs text-slate-500">
              {currentTenant?.name || 'No Tenant'}
            </p>
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm" className="text-slate-400 hover:text-slate-600">
                <MoreVertical size={16} />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={handleLogout}>
                <LogOut className="mr-2" size={14} />
                Sign Out
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </aside>
  );
}
