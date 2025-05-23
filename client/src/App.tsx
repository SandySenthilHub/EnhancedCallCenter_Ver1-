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
import TeamManagement from "./pages/admin/TeamManagement";
import RoleManagement from "./pages/admin/RoleManagement";
import TenantManagement from "./pages/admin/TenantManagement";
import EntityFramework from "./pages/admin/EntityFramework";
import WorkflowManagement from "./pages/admin/WorkflowManagement";
import TransactionCenter from "./pages/admin/TransactionCenter";
import CompanyManagement from "./pages/admin/CompanyManagement";
import WorkflowInbox from "./pages/system/WorkflowInbox";
import CurrencyManagement from "./pages/system/CurrencyManagement";
import CountryManagement from "./pages/system/CountryManagement";
import LanguageManagement from "./pages/system/LanguageManagement";
import SystemMonitoring from "./pages/system/SystemMonitoring";
import AuditLogs from "./pages/system/AuditLogs";

// Backend Infrastructure Components
import DataSourceConnectors from "./pages/backend/DataSourceConnectors";
import FileProcessingPipeline from "./pages/backend/FileProcessingPipeline";
import DatabaseIntegration from "./pages/backend/DatabaseIntegration";
import SystemInfrastructure from "./pages/backend/SystemInfrastructure";

// Intelligence Components
import TranscriptionHub from "./pages/intelligence/TranscriptionHub";
import AIAnalysisSuite from "./pages/intelligence/AIAnalysisSuite";
import IntelligenceDashboard from "./pages/intelligence/IntelligenceDashboard";
import ConfigurationCenter from "./pages/intelligence/ConfigurationCenter";
import NotFound from "@/pages/not-found";
import { Loader2 } from "lucide-react";

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/kpi-dashboard" component={KpiDashboard} />
      <Route path="/chart-dashboard" component={SimpleChartView} />
      <Route path="/cognitive-services" component={CognitiveServices} />
      <Route path="/ai-playbook" component={AIPlaybook} />
      
      {/* Contact Center Submenu */}
      <Route path="/contact-center/dashboard" component={ContactCenter} />
      <Route path="/contact-center/analytics" component={ContactCenter} />
      <Route path="/contact-center/agents" component={ContactCenter} />
      <Route path="/contact-center/quality" component={ContactCenter} />
      <Route path="/contact-center/backend" component={DataSourceConnectors} />
      <Route path="/contact-center/intelligence" component={IntelligenceDashboard} />
      
      {/* Backend Infrastructure Pages */}
      <Route path="/backend/data-sources" component={DataSourceConnectors} />
      <Route path="/backend/file-processing" component={FileProcessingPipeline} />
      <Route path="/backend/database" component={DatabaseIntegration} />
      <Route path="/backend/infrastructure" component={SystemInfrastructure} />
      
      {/* Intelligence Pages */}
      <Route path="/intelligence/transcription" component={TranscriptionHub} />
      <Route path="/intelligence/analysis" component={AIAnalysisSuite} />
      <Route path="/intelligence/dashboard" component={IntelligenceDashboard} />
      <Route path="/intelligence/configuration" component={ConfigurationCenter} />
      
      {/* Mobile Banking Submenu */}
      <Route path="/mobile-banking/dashboard" component={MobileBanking} />
      <Route path="/mobile-banking/transactions" component={MobileBanking} />
      <Route path="/mobile-banking/users" component={MobileBanking} />
      <Route path="/mobile-banking/performance" component={MobileBanking} />
      
      {/* IVR Analytics Submenu */}
      <Route path="/ivr-analytics/dashboard" component={IvrAnalytics} />
      <Route path="/ivr-analytics/flows" component={IvrAnalytics} />
      <Route path="/ivr-analytics/performance" component={IvrAnalytics} />
      <Route path="/ivr-analytics/optimization" component={IvrAnalytics} />

      <Route path="/admin/users" component={UserManagement} />
      <Route path="/admin/teams" component={TeamManagement} />
      <Route path="/admin/roles" component={RoleManagement} />
      <Route path="/admin/tenants" component={TenantManagement} />
      <Route path="/admin/entities" component={EntityFramework} />
      <Route path="/admin/workflows" component={WorkflowManagement} />
      <Route path="/admin/companies" component={CompanyManagement} />
      <Route path="/admin/transactions" component={TransactionCenter} />
      <Route path="/system/countries" component={CountryManagement} />
      <Route path="/system/currencies" component={CurrencyManagement} />
      <Route path="/system/languages" component={LanguageManagement} />
      <Route path="/system/monitoring" component={SystemMonitoring} />
      <Route path="/system/audit" component={AuditLogs} />
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
