import { useEffect, useState } from 'react';
import { AnimatePresence } from "framer-motion";
import { Toaster } from "@/components/ui/toaster";
import { QueryClientProvider } from '@tanstack/react-query';
import { queryClientInstance } from '@/lib/query-client';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import PageNotFound from './lib/PageNotFound';
import { AuthProvider } from '@/lib/AuthContext';
import { LangProvider } from '@/lib/i18n';
import Dashboard from './pages/Dashboard';
import Onboarding from './components/afterbloom/Onboarding';
import { isOnboarded } from './lib/user-data';
import { getUid } from './lib/firebase';

const AuthenticatedApp = () => {
  return (
    <Routes>
      <Route path="/" element={<Dashboard />} />
      <Route path="*" element={<PageNotFound />} />
    </Routes>
  );
};

function DeferredVercelTelemetry() {
  const [telemetry, setTelemetry] = useState(null);

  useEffect(() => {
    if (!import.meta.env.PROD) return undefined;

    const loadTelemetry = () => {
      Promise.all([
        import('@vercel/analytics/react'),
        import('@vercel/speed-insights/react'),
      ]).then(([analyticsModule, speedInsightsModule]) => {
        setTelemetry({
          Analytics: analyticsModule.Analytics,
          SpeedInsights: speedInsightsModule.SpeedInsights,
        });
      }).catch(() => {
        setTelemetry(null);
      });
    };

    let idleId = null;
    const timer = window.setTimeout(() => {
      if (typeof window.requestIdleCallback === "function") {
        idleId = window.requestIdleCallback(loadTelemetry, { timeout: 2500 });
        return;
      }
      loadTelemetry();
    }, 3500);

    return () => {
      window.clearTimeout(timer);
      if (idleId !== null) window.cancelIdleCallback?.(idleId);
    };
  }, []);

  if (!telemetry) return null;
  const { Analytics, SpeedInsights } = telemetry;
  return (
    <>
      <Analytics />
      <SpeedInsights />
    </>
  );
}

function App() {
  const [onboarded, setOnboarded] = useState(() => isOnboarded());

  useEffect(() => {
    // Restore Google identity when available; guests receive a stable device ID.
    void getUid().catch((error) => {
      console.warn('Firebase identity initialization failed', error?.code || error?.message);
    });
  }, []);

  return (
    <LangProvider>
    <AuthProvider>
      <QueryClientProvider client={queryClientInstance}>
        <Router>
          <AuthenticatedApp key={onboarded ? "onboarded" : "onboarding"} />
        </Router>
        <Toaster />
        <DeferredVercelTelemetry />
        <AnimatePresence>
          {!onboarded && (
            <Onboarding key="onboarding" onComplete={() => setOnboarded(true)} />
          )}
        </AnimatePresence>
      </QueryClientProvider>
    </AuthProvider>
    </LangProvider>
  );
}

export default App;
