import { SERVICES, ADDON_PRICE, ADVANCE_SHARE, TAP_FIX_PRICE } from '../data/content.js';
import { fmt } from './format.js';

// Builds the written quote from the user's package + chosen add-ons.
// (MOCK) In production the quote comes from the backend after the survey.
export function computeQuote(s, row) {
  let ids = [...new Set((s.plan || []).concat(s.addons || []))].filter((id) => ADDON_PRICE[id]);
  if (!ids.length) ids = ['clean', 'pest', 'ready'];
  const base = row.amount;
  const lines = [
    { k: row.label + ' end-to-end package', v: fmt(base) },
    { k: 'Pre-pack, packing & moving', v: 'Included' },
    { k: 'Unpacking, organising, kitchen & wardrobe setup', v: 'Included' },
    ...ids.map((id) => ({ k: SERVICES.find((x) => x.id === id).name, v: fmt(ADDON_PRICE[id]) })),
  ];
  const total = base + ids.reduce((a, id) => a + ADDON_PRICE[id], 0);
  const adv = Math.round(total * ADVANCE_SHARE);
  const extra = s.appr && s.appr.tap === 'yes' ? TAP_FIX_PRICE : 0;
  return { lines, total, adv, bal: total - adv + extra, balBase: total - adv, extra };
}
