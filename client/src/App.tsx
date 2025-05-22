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
