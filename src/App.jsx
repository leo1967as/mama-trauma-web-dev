import { useState } from 'react';
import { Toaster } from "@/components/ui/toaster"
import { QueryClientProvider } from '@tanstack/react-query'
import { queryClientInstance } from '@/lib/query-client'
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import PageNotFound from './lib/PageNotFound';
import { AuthProvider } from '@/lib/AuthContext';
import Dashboard from './pages/Dashboard';
import Onboarding from './components/calmmama/Onboarding';
import { Analytics } from '@vercel/analytics/react';
import { SpeedInsights } from '@vercel/speed-insights/react';
import { isOnboarded } from './lib/user-data';

const AuthenticatedApp = () => {
  return (
    <Routes>
      <Route path="/" element={<Dashboard />} />
      <Route path="*" element={<PageNotFound />} />
    </Routes>
  );
};

function App() {
  const [onboarded, setOnboarded] = useState(() => isOnboarded());

  return (
    <AuthProvider>
      <QueryClientProvider client={queryClientInstance}>
        <Router>
          <AuthenticatedApp />
        </Router>
        <Toaster />
        <Analytics />
        <SpeedInsights />
        {!onboarded && (
          <Onboarding onComplete={() => setOnboarded(true)} />
        )}
      </QueryClientProvider>
    </AuthProvider>
  )
}

export default App
