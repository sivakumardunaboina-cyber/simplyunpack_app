import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react';
import { BHK, INITIAL_CHAT } from '../data/content.js';
import { computeQuote } from '../lib/quote.js';

const STORAGE_KEY = 'simplyunpack:v1';

export const initialState = {
  onboarded: false,
  // move details
  fromArea: 'Koramangala', area: 'Whitefield', bhk: '2', when: 'week', plan: [], addons: [], slot: null, phone: '', remote: false,
  // account
  account: false, name: '', email: '', household: 'Couple',
  // booking lifecycle: new → quote → live → done
  stage: 'new', read: [], appr: {}, payMethod: 'upi', balMethod: 'upi',
  rating: 0, tags: [], comment: '', resched: null,
  chat: INITIAL_CHAT,
};

const Ctx = createContext(null);

function load() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? { ...initialState, ...JSON.parse(raw) } : initialState;
  } catch {
    return initialState;
  }
}

export function AppProvider({ children }) {
  const [s, setS] = useState(load);
  const [toast, setToast] = useState('');
  const [tick, setTick] = useState(0);
  const toastTimer = useRef();

  useEffect(() => {
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(s)); } catch { /* storage unavailable */ }
  }, [s]);

  useEffect(() => {
    if (!(s.account && s.stage === 'live')) return undefined;
    const id = setInterval(() => setTick((t) => (t + 1) % 100), 1600);
    return () => clearInterval(id);
  }, [s.account, s.stage]);

  const set = useCallback((patch) => setS((prev) => ({ ...prev, ...(typeof patch === 'function' ? patch(prev) : patch) })), []);
  const flash = useCallback((msg) => {
    setToast(msg);
    clearTimeout(toastTimer.current);
    toastTimer.current = setTimeout(() => setToast(''), 2400);
  }, []);
  const signOut = useCallback(() => setS({ ...initialState, onboarded: true }), []);

  const value = useMemo(() => {
    const row = BHK.find((b) => b.v === s.bhk) || BHK[1];
    return { s, set, flash, toast, tick, row, quote: computeQuote(s, row), signOut };
  }, [s, set, flash, toast, tick, signOut]);

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useApp() {
  const v = useContext(Ctx);
  if (!v) throw new Error('useApp must be used inside <AppProvider>');
  return v;
}
