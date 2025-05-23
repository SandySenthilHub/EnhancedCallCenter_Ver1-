import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/not-found";
import Login from "@/pages/login";
import Dashboard from "@/pages/dashboard";
import Entities from "@/pages/entities";
import Users from "@/pages/users";
import Teams from "@/pages/teams";
import UserActivity from "@/pages/user-activity";
import Roles from "@/pages/roles";
import Transactions from "@/pages/transactions";
import Screens from "@/pages/screens";
import Reports from "@/pages/reports";
import Inbox from "@/pages/inbox";
import SentItems from "@/pages/sent-items";
import Countries from "@/pages/countries";
import AppLayout from "@/components/layout/AppLayout";
import { useAuth } from "@/hooks/useAuth";

function Router() {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen w-full flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
          <p className="mt-2 text-sm text-slate-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Login />;
  }

  return (
    <AppLayout>
      <Switch>
        <Route path="/" component={Dashboard} />
        <Route path="/dashboard" component={Dashboard} />
        <Route path="/entities" component={Entities} />
        <Route path="/users" component={Users} />
        <Route path="/teams" component={Teams} />
        <Route path="/user-activity" component={UserActivity} />
        <Route path="/roles" component={Roles} />
        <Route path="/transactions" component={Transactions} />
        <Route path="/screens" component={Screens} />
        <Route path="/reports" component={Reports} />
        
        {/* Workflow Management */}
        <Route path="/inbox" component={Inbox} />
        <Route path="/sent-items" component={SentItems} />
        
        {/* Reference Data */}
        <Route path="/countries" component={Countries} />
        
        <Route component={NotFound} />
      </Switch>
    </AppLayout>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Router />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
