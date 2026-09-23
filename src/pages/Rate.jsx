import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../store/AppStore.jsx';
import { api } from '../services/api.js';
import { RATE_TAGS } from '../data/content.js';
import Screen from '../components/Screen.jsx';
import Chip from '../components/Chip.jsx';

export default function Rate() {
  const nav = useNavigate();
  const { s, set, flash } = useApp();
  const [busy, setBusy] = useState(false);

  const submit = async () => {
    if (!s.rating) return;
    setBusy(true);
    try {
      await api.submitRating({ rating: s.rating, tags: s.tags, comment: s.comment });
      flash('Thanks — we’ve shared it with Lakshmi’s crew.');
      nav('/move/invoice', { replace: true });
    } catch (e) {
      flash(e.message || 'Could not submit. Try again.');
    } finally {
      setBusy(false);
    }
  };

  const toggleTag = (t) => set((p) => ({ tags: p.tags.includes(t) ? p.tags.filter((x) => x !== t) : p.tags.concat(t) }));

  return (
    <Screen cta={{ note: s.rating ? `${s.rating} of 5` : 'Tap a star', value: 'Rate the crew', label: 'Submit', onClick: submit, disabled: !s.rating, busy }}>
      <div className="page" style={{ paddingTop: 48 }}>
        <h1 className="h1">How did the crew do?</h1>
        <p className="lead" style={{ marginBottom: 24 }}>Lakshmi K. and team · SU-4827</p>
        <div className="row mb-24" style={{ justifyContent: 'center', gap: 10 }} role="radiogroup" aria-label="Rating">
          {[1, 2, 3, 4, 5].map((n) => (
            <button type="button" key={n} role="radio" aria-checked={s.rating === n} aria-label={`${n} star${n > 1 ? 's' : ''}`}
              onClick={() => set({ rating: n })}
              style={{ background: 'none', border: 'none', cursor: 'pointer', font: '400 40px/1 Poppins', color: n <= s.rating ? 'var(--star)' : 'rgba(36,26,86,.18)', padding: 0 }}>★</button>
          ))}
        </div>
        <div className="label">What went well?</div>
        <div className="chips mb-20">
          {RATE_TAGS.map((t) => <Chip key={t} small selected={s.tags.includes(t)} onClick={() => toggleTag(t)}>{t}</Chip>)}
        </div>
        <label className="field mb-12">
          <input value={s.comment} onChange={(e) => set({ comment: e.target.value })} placeholder="Anything to tell the crew?" aria-label="Comment" style={{ fontWeight: 400, fontSize: 14 }} />
        </label>
        <button type="button" className="btn-link muted" style={{ width: '100%' }} onClick={() => nav('/move/invoice')}>Skip for now</button>
      </div>
    </Screen>
  );
}
