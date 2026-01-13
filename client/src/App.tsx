import { Switch, Route } from "wouter";
import "leaflet/dist/leaflet.css";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/not-found";
import { BottomNav } from "@/components/BottomNav";

// Pages
import Analyze from "@/pages/Analyze";
import History from "@/pages/History";
import MapPage from "@/pages/Map";
import Profile from "@/pages/Profile";

function Router() {
  return (
    <div className="relative min-h-screen bg-background font-sans text-foreground antialiased">
      <Switch>
        <Route path="/" component={Analyze} />
        <Route path="/history" component={History} />
        <Route path="/map" component={MapPage} />
        <Route path="/profile" component={Profile} />
        <Route component={NotFound} />
      </Switch>
      <BottomNav />
    </div>
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
