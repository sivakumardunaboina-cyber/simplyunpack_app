import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../store/AppStore.jsx';
import { api } from '../services/api.js';
import { SLOTS } from '../data/content.js';
import Screen from '../components/Screen.jsx';
import BackButton from '../components/BackButton.jsx';
import Option from '../components/Option.jsx';

export default function Survey() {
  const nav = useNavigate();
  const { s, set, flash, row } = useApp();
  const [busy, setBusy] = useState(false);
  const slot = SLOTS.find((x) => x.v === s.slot);

  const confirm = async () => {
    if (!slot) return;
    setBusy(true);
    try {
      await api.bookSurvey({ slot: slot.label, phone: s.phone, from: s.fromArea, to: s.area, bhk: s.bhk, addons: s.addons, when: s.when });
      set({ stage: s.account ? 'quote' : s.stage });
      nav('/survey/booked');
    } catch (e) {
      flash(e.message || 'Could not book the survey. Try again.');
    } finally {
      setBusy(false);
    }
  };

  return (
    <Screen cta={{ note: slot ? 'Slot held for 24 hours' : 'Pick a slot to continue', value: slot ? slot.label : 'No slot yet', label: 'Confirm survey', onClick: confirm, disabled: !slot, busy }}>
      <div className="page">
        <BackButton to="/quote" />
        <h1 className="h1">Book a free survey</h1>
        <p className="lead">A surveyor walks your current home’s inventory and checks access at both buildings, then we confirm one quote for the whole move. Takes about 30 minutes.</p>
        <img src="/assets/survey.png" alt="Simply Unpack surveyor photographing a living room with a checklist" className="img-cover rounded mb-24" style={{ height: 150 }} />
        <div className="label">Pick a slot</div>
        <div className="stack mb-24">
          {SLOTS.map((x) => <Option key={x.v} selected={s.slot === x.v} onClick={() => set({ slot: x.v })} title={x.label} right={<span className="option-right note">{x.note}</span>} />)}
        </div>
        <div className="label">Where to reach you</div>
        <label className="field mb-12">
          <span className="field-prefix">+91</span>
          <input inputMode="numeric" autoComplete="tel-national" value={s.phone} onChange={(e) => set({ phone: e.target.value })} placeholder="98765 43210" aria-label="Mobile number" />
        </label>
        <p className="small">Nothing is charged today. We hold the slot for 24 hours and text you a confirmation. Survey for your {row.label} in {s.area}.</p>
      </div>
    </Screen>
  );
}
