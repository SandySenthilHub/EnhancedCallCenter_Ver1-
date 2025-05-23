import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { useAuth } from "./contexts/AuthContext";
import { ThemeProvider } from "./contexts/ThemeContext";
import { DashboardProvider } from "./contexts/DashboardContext";
import Sidebar from "./components/layout/Sidebar";
import Header from "./components/layout/Header";
import Home from "./pages/Home";
import ContactCenter from "./pages/ContactCenter";
import MobileBanking from "./pages/MobileBanking";
import IvrAnalytics from "./pages/IvrAnalytics";
import CognitiveServices from "./pages/CognitiveServices";
import Settings from "./pages/Settings";
import KpiDashboard from "./pages/KpiDashboard";
import SimpleChartView from "./pages/SimpleChartView";
import AIPlaybook from "./pages/AIPlaybook";
import UserManagement from "./pages/admin/UserManagement";
import EntityFramework from "./pages/admin/EntityFramework";
import WorkflowManagement from "./pages/admin/WorkflowManagement";
import TransactionCenter from "./pages/admin/TransactionCenter";
import CompanyManagement from "./pages/admin/CompanyManagement";
import WorkflowInbox from "./pages/system/WorkflowInbox";
import CurrencyManagement from "./pages/system/CurrencyManagement";
import NotFound from "@/pages/not-found";
import { Loader2 } from "lucide-react";

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/contact-center" component={ContactCenter} />
      <Route path="/mobile-banking" component={MobileBanking} />
      <Route path="/ivr-analytics" component={IvrAnalytics} />
      <Route path="/cognitive-services" component={CognitiveServices} />
      <Route path="/kpi-dashboard" component={KpiDashboard} />
      <Route path="/chart-dashboard" component={SimpleChartView} />
      <Route path="/ai-playbook" component={AIPlaybook} />
      <Route path="/admin/users" component={UserManagement} />
      <Route path="/admin/teams" component={() => <div className="p-6"><h1 className="text-2xl font-bold">Team Management</h1><p className="text-gray-600">Manage teams and team memberships - Framework Foundation Ready!</p></div>} />
      <Route path="/admin/roles" component={() => <div className="p-6"><h1 className="text-2xl font-bold">Roles & Permissions</h1><p className="text-gray-600">Configure role-based access control - Framework Foundation Ready!</p></div>} />
      <Route path="/admin/tenants" component={() => <div className="p-6"><h1 className="text-2xl font-bold">Tenant Management</h1><p className="text-gray-600">Manage multi-tenant organizations - Framework Foundation Ready!</p></div>} />
      <Route path="/admin/entities" component={EntityFramework} />
      <Route path="/admin/workflows" component={WorkflowManagement} />
      <Route path="/admin/companies" component={CompanyManagement} />
      <Route path="/admin/transactions" component={TransactionCenter} />
      <Route path="/system/countries" component={() => <div className="p-6"><h1 className="text-2xl font-bold">Countries & Regions</h1><p className="text-gray-600">Global geographic data management - Framework Foundation Ready!</p></div>} />
      <Route path="/system/currencies" component={CurrencyManagement} />
      <Route path="/system/languages" component={() => <div className="p-6"><h1 className="text-2xl font-bold">Language Management</h1><p className="text-gray-600">Internationalization support - Framework Foundation Ready!</p></div>} />
      <Route path="/system/monitoring" component={() => <div className="p-6"><h1 className="text-2xl font-bold">System Health</h1><p className="text-gray-600">Comprehensive system monitoring - Framework Foundation Ready!</p></div>} />
      <Route path="/system/audit" component={() => <div className="p-6"><h1 className="text-2xl font-bold">Audit Logs</h1><p className="text-gray-600">Complete audit trail system - Framework Foundation Ready!</p></div>} />
      <Route path="/system/alerts" component={() => <div className="p-6"><h1 className="text-2xl font-bold">Alert Management</h1><p className="text-gray-600">System alert configuration - Framework Foundation Ready!</p></div>} />
      <Route path="/system/inbox" component={WorkflowInbox} />
      <Route path="/settings" component={Settings} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  const { isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen bg-neutral-50">
        <div className="text-center">
          <Loader2 className="h-12 w-12 text-primary-600 animate-spin mx-auto" />
          <p className="mt-4 text-lg text-neutral-600">Loading analytics platform...</p>
        </div>
      </div>
    );
  }

  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <DashboardProvider>
          <TooltipProvider>
            <div className="flex h-screen overflow-hidden">
              <Sidebar />
              <main className="flex-1 overflow-y-auto bg-neutral-50">
                <Header />
                <Router />
              </main>
            </div>
            <Toaster />
          </TooltipProvider>
        </DashboardProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}

export default App;
