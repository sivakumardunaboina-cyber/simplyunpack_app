import { NOTIFS } from '../data/content.js';

// (MOCK) simulated live telemetry driven by a ticking counter.
export function liveMetrics(tick) {
  const step = tick % 12;
  const crates = 38 + (tick % 10);
  const eta = 22 - step;
  return {
    progress: 32 + step * 5 + '%',
    crates,
    cratesLine: `${crates} of 48 crates loaded`,
    eta,
    etaLine: `ETA ${eta} min`,
    truckLeft: 22 + step * 3.6 + '%',
  };
}

export const APPROVAL_KEYS = ['tap', 'ward'];
export const pendingApprovals = (appr = {}) => APPROVAL_KEYS.filter((k) => !appr[k]).length;
export const approvalsLabel = (n) => `${n} ${n === 1 ? 'approval is' : 'approvals are'} waiting on you`;

export const doneIndex = (stage) => ({ new: 0, quote: 1, live: 4 }[stage] ?? 10);

export function moveDay(s) {
  if (s.resched) return s.resched;
  return { new: 'Not booked yet', quote: 'Thu 24 Sep · tentative', live: 'Today, Wed 23 Sep' }[s.stage] || 'Completed Thu 24 Sep';
}

export function visibleNotifs(s) {
  if (!s.account || s.stage === 'new') return [];
  return NOTIFS.filter((n) => (s.stage === 'quote' ? n.stage === 'quote' : true));
}
export const unreadCount = (s) => visibleNotifs(s).filter((n) => !s.read.includes(n.id)).length;
