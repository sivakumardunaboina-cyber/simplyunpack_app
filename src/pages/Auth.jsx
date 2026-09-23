import { useState } from 'react';
import { Navigate, useNavigate, useParams, useSearchParams } from 'react-router-dom';
import { useApp } from '../store/AppStore.jsx';
import { api } from '../services/api.js';
import { MOCK_OTP_HINT, MOCK_USER } from '../services/mocks.js';
import { config } from '../config.js';
import { HOUSEHOLDS, SLOTS } from '../data/content.js';
import { digitsOnly, firstName } from '../lib/format.js';
import BackButton from '../components/BackButton.jsx';
import Chip from '../components/Chip.jsx';
import Toggle from '../components/Toggle.jsx';
import { IconGoogle, IconApple } from '../components/Icons.jsx';

const KEYS = ['1', '2', '3', '4', '5', '6', '7', '8', '9', 'Clear', '0', '⌫'];

export default function Auth() {
  const { mode } = useParams();
  const [params] = useSearchParams();
  const fromOnboarding = params.get('from') === 'onboarding';
  const next = params.get('next');
  const nav = useNavigate();
  const { s, set, flash } = useApp();
  const [step, setStep] = useState(0);
  const [otp, setOtp] = useState('');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');

  if (mode !== 'signup' && mode !== 'login') return <Navigate to="/auth/signup" replace />;
  const isLogin = mode === 'login';
  const query = params.toString() ? `?${params.toString()}` : '';

  const run = async (fn) => {
    setError(''); setBusy(true);
    try { await fn(); } catch (e) { setError(e.message || 'Something went wrong. Try again.'); } finally { setBusy(false); }
  };

  const finishLogin = async (profile = {}) => {
    const res = await api.login({ phone: s.phone });
    set({ account: true, onboarded: true, name: s.name || profile.name || res.name || MOCK_USER.name, email: s.email || profile.email || res.email || '', stage: res.stage || 'live' });
    flash('Signed in. Your move is picking up where it left off.');
    nav(next || '/move', { replace: true });
  };

  const sendCode = () => run(async () => {
    if (digitsOnly(s.phone).length !== 10) throw new Error('Enter a 10-digit mobile number.');
    await api.sendOtp({ phone: s.phone });
    setOtp(''); setStep(1);
  });

  const verify = () => run(async () => {
    await api.verifyOtp({ phone: s.phone, code: otp });
    if (isLogin) await finishLogin();
    else setStep(2);
  });

  const social = (provider) => run(async () => {
    const res = await api.signInWithProvider({ provider });
    if (isLogin) return finishLogin(res);
    set({ name: s.name || res.name, email: s.email || res.email });
    flash(`Connected ${provider}. Check your details.`);
    setStep(2);
  });

  const createProfile = () => run(async () => {
    if (!s.name.trim()) throw new Error('Add your name so the crew knows who to ask for.');
    await api.createProfile({ name: s.name, email: s.email, phone: s.phone, household: s.household, remote: s.remote, from: s.fromArea, to: s.area });
    set({ account: true, stage: s.slot ? 'quote' : s.stage === 'new' ? 'new' : s.stage });
    setStep(3);
  });

  const done = () => {
    if (fromOnboarding) return nav('/onboarding/1', { replace: true });
    set({ onboarded: true });
    return nav(s.stage === 'quote' ? '/move' : '/', { replace: true });
  };

  const back = () => {
    setError('');
    if (step === 1 || step === 2) return setStep(step - 1);
    if (fromOnboarding) return nav('/welcome');
    return window.history.length > 1 ? nav(-1) : nav('/profile');
  };

  const press = (k) => setOtp((o) => (k === 'Clear' ? '' : k === '⌫' ? o.slice(0, -1) : o.length < 4 ? o + k : o));

  const titles = isLogin
    ? ['Welcome back', 'Enter the code we sent']
    : ['Create your account', 'Enter the code we sent', 'Set up your profile', ''];
  const hints = isLogin
    ? ['Sign in with the number you booked with.', 'Four digits and you’re back in.']
    : ['One number holds your quote, your survey and every crew update.', 'Four digits, then your move gets its own timeline.', 'Your name is what the crew lead sees when they call.', ''];
  const stepLabel = step === 3 ? 'Done' : `Step ${step + 1} of ${isLogin ? 2 : 3}`;

  const slotLabel = (SLOTS.find((x) => x.v === s.slot) || {}).label;
  const summary = [
    { k: 'Name', v: s.name.trim() || '—' },
    { k: 'Phone', v: '+91 ' + (s.phone || '—') },
    { k: 'Household', v: s.household },
    ...(s.stage === 'quote' && slotLabel ? [{ k: 'Survey', v: slotLabel }] : []),
  ];

  const cta = [
    { label: 'Send code', on: sendCode },
    { label: isLogin ? 'Sign in' : 'Verify', on: verify, disabled: otp.length !== 4 },
    { label: 'Create profile', on: createProfile },
    { label: fromOnboarding ? 'Tell us about your move' : s.stage === 'quote' ? 'Open my move' : 'Start exploring', on: done },
  ][step];

  return (
    <>
      <main className="screen">
        <div className="page" style={{ paddingBottom: 12 }}>
          <div className="row between">
            {step < 3 ? <BackButton onClick={back} /> : <span />}
            <span className="small" style={{ marginBottom: 18 }}>{stepLabel}</span>
          </div>

          {step < 3 && (
            <>
              <h1 className="h1">{titles[step]}</h1>
              <p className="lead">{hints[step]}</p>
            </>
          )}

          {step === 0 && (
            <>
              <label className="field">
                <span className="field-prefix">+91</span>
                <input inputMode="numeric" autoComplete="tel-national" value={s.phone} onChange={(e) => set({ phone: e.target.value })} placeholder="98765 43210" aria-label="Mobile number" />
              </label>
              <p className="small mt-14">The same number your crew and surveyor will use. We only send move updates.</p>
              <div className="or">or</div>
              <div className="stack">
                <button type="button" className="btn btn-outline" onClick={() => social('Google')} disabled={busy}><IconGoogle />Continue with Google</button>
                <button type="button" className="btn btn-navy" onClick={() => social('Apple')} disabled={busy}><IconApple />Continue with Apple</button>
              </div>
              <button type="button" className="btn-link" style={{ padding: '20px 0 0' }} onClick={() => { setError(''); nav(`/auth/${isLogin ? 'signup' : 'login'}${query}`, { replace: true }); }}>
                {isLogin ? 'New here? Create an account' : 'Already have an account? Sign in'}
              </button>
            </>
          )}

          {step === 1 && (
            <>
              <div className="otp" aria-label="Verification code">
                {[0, 1, 2, 3].map((i) => <div key={i} className={otp.length === i ? 'active' : ''}>{otp[i] || ''}</div>)}
              </div>
              <div className="keypad">
                {KEYS.map((k) => <button type="button" key={k} onClick={() => press(k)}>{k}</button>)}
              </div>
              <p className="small">Code sent to +91 {s.phone}. {config.useMocks ? MOCK_OTP_HINT : ''}</p>
            </>
          )}

          {step === 2 && (
            <div className="stack lg">
              <label className="field col">
                <span className="field-label">Your name</span>
                <input autoComplete="name" value={s.name} onChange={(e) => set({ name: e.target.value })} placeholder="Meera Raghavan" />
              </label>
              <label className="field col">
                <span className="field-label">Email · for your quote and invoice</span>
                <input type="email" autoComplete="email" value={s.email} onChange={(e) => set({ email: e.target.value })} placeholder="meera.r@gmail.com" />
              </label>
              <div>
                <div className="label" style={{ fontSize: 13, marginTop: 6 }}>Who’s moving?</div>
                <div className="chips">
                  {HOUSEHOLDS.map((h) => <Chip key={h} selected={s.household === h} onClick={() => set({ household: h })}>{h}</Chip>)}
                </div>
              </div>
              <Toggle on={s.remote} onChange={(v) => set({ remote: v })} title="I’m not in the city yet" sub="Turns on remote setup — photo and video approvals" />
            </div>
          )}

          {step === 3 && (
            <div className="center" style={{ paddingTop: 40 }}>
              <div className="success-mark">✓</div>
              <h1 className="h1" style={{ fontSize: 19 }}>
                {fromOnboarding || s.stage !== 'quote' ? `Welcome, ${firstName(s.name)}` : `${firstName(s.name, 'Right')}, your move is on the board`}
              </h1>
              <p className="lead" style={{ maxWidth: 280, margin: '0 auto 22px' }}>
                {fromOnboarding ? 'Next, three quick questions about the move and you’ll see your price.'
                  : s.stage === 'quote' ? 'Your package, add-ons and survey are now one timeline you can follow day by day.'
                    : 'Your profile is saved. Build a quote whenever you’re ready.'}
              </p>
              <div className="cream cream-pad stack" style={{ textAlign: 'left' }}>
                {summary.map((r) => <div key={r.k} className="kv"><span>{r.k}</span><b>{r.v}</b></div>)}
              </div>
            </div>
          )}

          {error ? <div className="error" role="alert">{error}</div> : null}
        </div>
      </main>
      <div className="bottom-actions">
        <button type="button" className="btn btn-pink" style={{ height: 52 }} onClick={cta.on} disabled={busy || cta.disabled}>
          {busy ? 'Please wait…' : cta.label}
        </button>
      </div>
    </>
  );
}
