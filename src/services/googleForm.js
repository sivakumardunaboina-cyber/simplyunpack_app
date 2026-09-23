import { config } from '../config.js';
import { BHK, WHEN, SERVICES, SLOTS } from '../data/content.js';

// Sends app submissions to the "App Data" Google Form.
// Fields: Name, Mobile Number, Email, Moving from, Moving to, Home Size, Move Date, What do you Need.
// Everything that has no dedicated field goes into "What do you Need".

const EVENT_LABEL = {
  profile: 'Profile created',
  survey: 'Free survey booked',
  payment: 'Payment',
  approval: 'In-move approval',
  rating: 'Crew rating',
  reschedule: 'Reschedule request',
  cancel: 'Cancellation request',
  support: 'Support message',
  login: 'Login',
};

const FIELD_LABEL = {
  slot: 'Survey slot', addons: 'Add-ons', amount: 'Amount (₹)', method: 'Payment method', kind: 'Payment',
  id: 'Item', decision: 'Decision', rating: 'Rating (1–5)', tags: 'Tags', comment: 'Comment', date: 'Requested date',
  text: 'Message', provider: 'Sign-in with', household: 'Household', remote: 'Remote setup',
};
// Payload keys already covered by dedicated form fields
const SKIP = new Set(['name', 'email', 'phone', 'from', 'to', 'bhk', 'when', 'eta']);

const serviceName = (id) => (SERVICES.find((x) => x.id === id) || {}).name || id;

export const googleFormEnabled = () => {
  const e = config.gform.entries;
  return !!(config.gform.id && e.name && e.phone && e.need);
};

function readState() {
  try { return JSON.parse(localStorage.getItem('simplyunpack:v1') || '{}'); } catch { return {}; }
}

export function buildNeed(type, payload, s) {
  const row = BHK.find((b) => b.v === s.bhk);
  const addons = [...new Set((s.plan || []).concat(s.addons || []))].map(serviceName);
  const lines = [`Event: ${EVENT_LABEL[type] || type}`];
  if (row) lines.push(`Package: ${row.label} end-to-end (${row.price})`);
  lines.push(`Add-ons: ${addons.length ? addons.join(', ') : 'None'}`);
  if (s.household) lines.push(`Household: ${s.household}`);
  lines.push(`Remote setup: ${s.remote ? 'Yes' : 'No'}`);
  if (s.stage && s.stage !== 'new') lines.push(`Booking stage: ${s.stage}`);
  Object.entries(payload || {}).forEach(([k, v]) => {
    if (SKIP.has(k) || v === undefined || v === null || v === '') return;
    let val = v;
    if (k === 'addons' && Array.isArray(v)) return; // already listed above
    if (k === 'slot') val = (SLOTS.find((x) => x.v === v) || {}).label || v;
    if (k === 'remote' || k === 'household') return;
    if (Array.isArray(val)) val = val.join(', ');
    lines.push(`${FIELD_LABEL[k] || k}: ${val}`);
  });
  return lines.join('\n');
}

// Fire-and-forget POST. Google Forms doesn't send CORS headers, so the response is opaque (no-cors);
// the submission is still recorded.
export function submitToGoogleForm(type, payload = {}) {
  if (!googleFormEnabled()) return;
  const s = readState();
  const e = config.gform.entries;
  const row = BHK.find((b) => b.v === s.bhk);
  const when = WHEN.find((w) => w.v === s.when);
  const values = {
    [e.name]: payload.name || s.name || '',
    [e.phone]: payload.phone || s.phone || '',
    [e.email]: payload.email || s.email || '',
    [e.from]: payload.from || s.fromArea || '',
    [e.to]: payload.to || s.area || '',
    [e.size]: row ? row.label.replace(/\s+/g, '') : '', // matches form format, e.g. "2BHK"
    [e.date]: s.resched || (when ? when.label : ''),
    [e.need]: buildNeed(type, payload, s),
  };
  const body = new URLSearchParams();
  Object.entries(values).forEach(([k, v]) => { if (k && k !== 'undefined') body.append(k, v); });
  fetch(`https://docs.google.com/forms/d/e/${config.gform.id}/formResponse`, { method: 'POST', mode: 'no-cors', body })
    .catch((err) => console.warn('[google-form] could not submit', type, err));
}
