import { config } from '../config.js';
import { supportReply, MOCK_USER } from './mocks.js';
import { submitToGoogleForm } from './googleForm.js';

const STORAGE_KEY = 'simplyunpack:v1';
const wait = (ms = 450) => new Promise((r) => setTimeout(r, ms));

async function request(path, body) {
  if (!config.apiBaseUrl) throw new Error('VITE_API_BASE_URL is not set. Set it or use VITE_USE_MOCKS=true.');
  const res = await fetch(config.apiBaseUrl + path, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
    body: JSON.stringify(body || {}),
  });
  if (!res.ok) throw new Error(`Request failed (${res.status})`);
  return res.json();
}

// Who is submitting — read from the persisted app state so every row carries contact details.
function currentUser() {
  try {
    const s = JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}');
    return {
      name: s.name || '', phone: s.phone || '', email: s.email || '', household: s.household || '',
      from: s.fromArea || '', to: s.area || '', bhk: s.bhk || '', stage: s.stage || '', remote: !!s.remote,
    };
  } catch {
    return {};
  }
}

// Google Sheets capture (see google-apps-script/Code.gs). Fire-and-forget: never blocks or breaks the UI.
// text/plain avoids a CORS preflight, which Apps Script web apps don't answer.
export function logToSheet(type, payload = {}) {
  if (!config.sheetsWebhookUrl) return;
  const body = JSON.stringify({ type, payload, user: currentUser(), token: config.sheetsToken || undefined, at: new Date().toISOString() });
  fetch(config.sheetsWebhookUrl, { method: 'POST', headers: { 'Content-Type': 'text/plain;charset=utf-8' }, body })
    .catch((e) => console.warn('[sheets] could not save', type, e));
}

// Each function mirrors a backend endpoint. With mocks on, they resolve locally.
// `sheet` names the Google Sheets tab the submission is copied to (if VITE_SHEETS_WEBHOOK_URL is set).
const call = (path, mockFn, sheet) => async (payload) => {
  let result;
  if (config.useMocks) {
    await wait();
    result = mockFn(payload);
  } else {
    result = await request(path, payload);
  }
  if (sheet) {
    logToSheet(sheet, payload);
    submitToGoogleForm(sheet, payload);
  }
  return result;
};

export const api = {
  sendOtp: call('/auth/otp/send', () => ({ ok: true })),
  verifyOtp: call('/auth/otp/verify', ({ code }) => {
    if (!/^\d{4}$/.test(code || '')) throw new Error('Enter the 4-digit code.');
    return { ok: true, token: 'mock-token' };
  }),
  signInWithProvider: call('/auth/social', ({ provider }) => ({ ok: true, provider, ...MOCK_USER }), 'login'),
  login: call('/auth/login', () => ({ ok: true, ...MOCK_USER, stage: 'live' }), 'login'),
  createProfile: call('/profile', (p) => ({ ok: true, profile: p }), 'profile'),
  bookSurvey: call('/survey/book', (p) => ({ ok: true, ref: 'SU-4827', ...p }), 'survey'),
  payAdvance: call('/payments/advance', ({ amount, method }) => ({ ok: true, amount, method, receipt: 'RCPT-ADV-4827' }), 'payment'),
  payBalance: call('/payments/balance', ({ amount, method }) => ({ ok: true, amount, method, receipt: 'RCPT-BAL-4827' }), 'payment'),
  submitApproval: call('/move/approvals', (p) => ({ ok: true, ...p }), 'approval'),
  submitRating: call('/move/rating', (p) => ({ ok: true, ...p }), 'rating'),
  reschedule: call('/move/reschedule', ({ date }) => ({ ok: true, date }), 'reschedule'),
  cancel: call('/move/cancel', () => ({ ok: true }), 'cancel'),
  sendSupportMessage: call('/support/messages', ({ text, eta }) => ({ ok: true, reply: supportReply(text, eta) }), 'support'),
};
