import { ThemeProvider } from "@/components/ThemeProvider";
import { Toaster } from "@/components/ui/toaster";
import Home from "@/pages/Home";
import NotFound from "@/pages/not-found";
import { Route, Switch } from "wouter";
import { PortfolioProvider } from "./hooks/usePortfolioData";

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <PortfolioProvider>
      <ThemeProvider>
        <Router />
        <Toaster />
      </ThemeProvider>
    </PortfolioProvider>
  );
}

export default App;
