import { createContext, useCallback, useContext, useState } from 'react';
import en from './i18n/en.json';
import th from './i18n/th.json';

const STORAGE_KEY = 'afterbloom_lang';
const STRINGS = { en, th };

const canStore = () => typeof window !== 'undefined' && typeof window.localStorage !== 'undefined';

const LangContext = createContext(null);

export function LangProvider({ children }) {
  const [lang, setLang] = useState(
    () => (canStore() ? localStorage.getItem(STORAGE_KEY) : null) || 'th'
  );

  const toggle = useCallback(() => {
    setLang(prev => {
      const next = prev === 'en' ? 'th' : 'en';
      if (canStore()) localStorage.setItem(STORAGE_KEY, next);
      return next;
    });
  }, []);

  return (
    <LangContext.Provider value={{ lang, toggle, t: STRINGS[lang] }}>
      {children}
    </LangContext.Provider>
  );
}

export function useLang() {
  const ctx = useContext(LangContext);
  if (!ctx) throw new Error('useLang must be used within LangProvider');
  return ctx;
}

export function useT() {
  return useLang().t;
}
