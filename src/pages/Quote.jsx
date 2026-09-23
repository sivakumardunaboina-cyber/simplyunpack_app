import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../store/AppStore.jsx';
import { BHK, SERVICES, WHEN } from '../data/content.js';
import Screen from '../components/Screen.jsx';
import Option, { Check } from '../components/Option.jsx';

const COPY = {
  1: ['Which package fits?', 'Prices are indicative and confirmed in writing after the free survey.'],
  2: ['Anything else while we are there?', 'Add-ons are available only alongside a move-in package, and quoted after the survey.'],
  3: ['When is moving day?', 'We plan pre-pack, the move and setup around it, then hold a survey slot.'],
};

export default function Quote() {
  const nav = useNavigate();
  const { s, set, row } = useApp();
  const [step, setStep] = useState(1);
  const addons = SERVICES.filter((x) => x.addon);

  const toggleAddon = (id) => set((p) => ({
    addons: p.addons.includes(id) ? p.addons.filter((y) => y !== id) : p.addons.concat(id),
    plan: p.plan.includes(id) ? p.plan : p.plan.concat(id),
  }));

  const summary = [
    { k: 'Move', v: `${s.fromArea} → ${s.area}` },
    { k: 'Home', v: row.label },
    { k: 'Setup', v: row.hours },
    { k: 'Moving day', v: (WHEN.find((w) => w.v === s.when) || WHEN[0]).label },
    { k: 'Add-ons', v: s.addons.length ? `${s.addons.length} selected` : 'None' },
  ];

  const cta = step < 3
    ? { note: `Step ${step} of 3`, value: `${row.label} · ${s.area}`, label: 'Continue', onClick: () => setStep(step + 1) }
    : { note: 'Indicative package', value: row.price, label: 'Book free survey', onClick: () => nav('/survey') };

  return (
    <Screen cta={cta}>
      <div className="page">
        <div className="row between mb-20">
          <button type="button" className="back-btn" style={{ margin: 0 }} onClick={() => (step > 1 ? setStep(step - 1) : nav(-1))}>{step > 1 ? 'Back' : 'Close'}</button>
          <span className="small">Step {step} of 3</span>
        </div>
        <div className="progress dark mb-24" style={{ height: 4 }}><div style={{ width: `${(step / 3) * 100}%`, transition: 'width .3s ease' }} /></div>
        <h1 className="h1">{COPY[step][0]}</h1>
        <p className="lead">{COPY[step][1]}</p>

        {step === 1 && (
          <>
            <div className="stack">
              {BHK.map((b) => <Option key={b.v} selected={s.bhk === b.v} onClick={() => set({ bhk: b.v })} title={b.label} sub={b.hours} right={b.price} />)}
            </div>
            <p className="small mt-14">4 BHK and villas are quoted after the free survey.</p>
          </>
        )}

        {step === 2 && (
          <div className="stack">
            {addons.map((x) => {
              const on = s.addons.includes(x.id);
              return <Option key={x.id} selected={on} onClick={() => toggleAddon(x.id)} lead={<Check on={on} />} title={x.name} sub={x.blurb} />;
            })}
          </div>
        )}

        {step === 3 && (
          <>
            <div className="stack">
              {WHEN.map((w) => <Option key={w.v} selected={s.when === w.v} onClick={() => set({ when: w.v })} title={w.label} right={<span className="option-right note">{w.note}</span>} />)}
            </div>
            <div className="cream mt-20" style={{ padding: '18px 20px' }}>
              <div className="eyebrow muted">Your estimate</div>
              <div className="stack">{summary.map((r) => <div key={r.k} className="kv" style={{ fontSize: 13 }}><span>{r.k}</span><b>{r.v}</b></div>)}</div>
              <div className="divider" />
              <div className="total"><span style={{ fontSize: 14.5 }}>Package</span><b style={{ fontSize: 21 }}>{row.price}</b></div>
              <p className="small mt-8" style={{ fontSize: 11.5 }}>These are tentative prices. Your final quote depends on the add-on services you opt for and your actual inventory — confirmed in writing after the free survey.</p>
            </div>
          </>
        )}
      </div>
    </Screen>
  );
}
