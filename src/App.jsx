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
import { auth, getCurrentUid, getUid, observeAuthState, resolveRedirectSignIn, signOutCurrentUser } from './lib/firebase';
import { flushPendingSync, hydrateProfile, subscribeToCheckins } from './lib/firebase-sync';
import { mergeRemoteMoodHistory } from './lib/mood-data';
import { activateUserSession, archiveAndClearActiveSession, getActiveSessionUid, saveActiveSessionSnapshot } from './lib/session-data';
import { clearAuthIntent } from './lib/auth-flow';

const AuthenticatedApp = ({ onLogout }) => {
  useEffect(() => subscribeToCheckins(mergeRemoteMoodHistory), []);

  return (
    <Routes>
      <Route path="/" element={<Dashboard onLogout={onLogout} />} />
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
  const [onboarded, setOnboarded] = useState(false);
  const [sessionReady, setSessionReady] = useState(false);
  const [resumeOnboarding, setResumeOnboarding] = useState(false);
  const [authErrorCode, setAuthErrorCode] = useState(null);

  useEffect(() => {
    let cancelled = false;
    let unsubscribe = () => {};

    const clearVisibleSession = (uid) => {
      try {
        archiveAndClearActiveSession(uid);
      } catch (error) {
        console.warn('Local session cleanup failed', error?.message);
      } finally {
        queryClientInstance.clear();
        setOnboarded(false);
      }
    };

    const initializeSession = async () => {
      let redirectUser = null;
      try {
        const result = await resolveRedirectSignIn();
        redirectUser = result?.user || auth.currentUser;
      } catch (error) {
        setAuthErrorCode(error?.code || 'auth/unknown');
      } finally {
        clearAuthIntent();
      }

      try {
        const uid = await getUid();
        activateUserSession(uid);
        await hydrateProfile();
      } catch (error) {
        console.warn('Firebase identity initialization failed', error?.code || error?.message);
      }

      if (cancelled) return;
      const setupComplete = isOnboarded();
      setOnboarded(setupComplete);
      setResumeOnboarding(Boolean(redirectUser?.uid && !setupComplete));
      setSessionReady(true);

      unsubscribe = observeAuthState(async (user) => {
        if (cancelled) return;

        const activeUid = getActiveSessionUid();
        if (user?.uid) {
          if (activeUid !== user.uid) {
            try {
              activateUserSession(user.uid);
              queryClientInstance.clear();
              await hydrateProfile();
              setOnboarded(isOnboarded());
            } catch (error) {
              console.warn('Account switch failed', error?.message);
              clearVisibleSession(activeUid);
            }
          }
          return;
        }

        if (activeUid && !activeUid.startsWith('device-')) {
          clearVisibleSession(activeUid);
        }
      });

    };

    void initializeSession();
    return () => {
      cancelled = true;
      unsubscribe();
    };
  }, []);

  const handleLogout = async () => {
    const uid = getActiveSessionUid() || getCurrentUid();
    const synced = await flushPendingSync();
    if (!synced) console.warn('Logout continued with Firestore writes still pending');
    saveActiveSessionSnapshot(uid);
    await signOutCurrentUser();
    try {
      archiveAndClearActiveSession(uid);
    } catch (error) {
      console.warn('Local session cleanup failed', error?.message);
    } finally {
      queryClientInstance.clear();
      setOnboarded(false);
    }
  };

  if (!sessionReady) {
    return <div className="min-h-screen bg-transparent" aria-busy="true" />;
  }

  return (
    <LangProvider>
    <AuthProvider>
      <QueryClientProvider client={queryClientInstance}>
        <Router>
          {onboarded && <AuthenticatedApp key="onboarded" onLogout={handleLogout} />}
        </Router>
        <Toaster />
        <DeferredVercelTelemetry />
        <AnimatePresence>
          {!onboarded && (
            <Onboarding
              key="onboarding"
              initialErrorCode={authErrorCode}
              resumeOnboarding={resumeOnboarding}
              onComplete={() => setOnboarded(true)}
            />
          )}
        </AnimatePresence>
      </QueryClientProvider>
    </AuthProvider>
    </LangProvider>
  );
}

export default App;
