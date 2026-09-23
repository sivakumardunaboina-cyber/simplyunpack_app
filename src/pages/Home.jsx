import { useNavigate } from 'react-router-dom';
import { useApp } from '../store/AppStore.jsx';
import { SERVICES, STEPS, TRUST } from '../data/content.js';
import { liveMetrics, pendingApprovals, approvalsLabel } from '../lib/move.js';
import { firstName } from '../lib/format.js';
import Screen from '../components/Screen.jsx';
import BellButton from '../components/BellButton.jsx';

export default function Home() {
  const nav = useNavigate();
  const { s, row, tick } = useApp();
  const live = liveMetrics(tick);
  const showAccountHero = s.account && s.stage !== 'new';
  const pending = pendingApprovals(s.appr);

  const hero = {
    quote: { eyebrow: 'Quote ready · SU-4827', title: 'Your written quote is waiting', note: 'Approve with a 20% advance to lock the crew and dates.', cta: 'Review quote', to: '/move/quote' },
    live: { eyebrow: 'Happening now · SU-4827', title: 'Moving day is under way', note: 'Truck 7 is on the road. Unpacking starts in the kitchen.', cta: 'Track the truck', to: '/move/track' },
    done: { eyebrow: 'Move complete · SU-4827', title: `Welcome home, ${firstName(s.name, 'Meera')}`, note: 'Handover photos, punch list and invoice are saved to your move.', cta: 'View invoice', to: '/move/invoice' },
  }[s.stage];

  return (
    <Screen tabs>
      <header className="home-header">
        <img src="/assets/logo.png" alt="simply unpack" className="logo" />
        <div className="row" style={{ gap: 8 }}>
          <button type="button" className="area-chip" onClick={() => nav('/coverage')}><i />{s.area}</button>
          {s.account ? <BellButton /> : null}
        </div>
      </header>

      <div className="pad-x">
        {showAccountHero && hero ? (
          <>
            <div className="hero hero-pad">
              <div className="eyebrow yellow">{hero.eyebrow}</div>
              <h2 className="hero-title" style={{ fontSize: 22, marginBottom: 8 }}>{hero.title}</h2>
              <p style={{ font: '400 13px/1.55 Poppins', color: 'rgba(255,255,255,.85)', margin: '0 0 16px' }}>{hero.note}</p>
              {s.stage === 'live' && (
                <>
                  <div className="progress mb-12"><div style={{ width: live.progress }} /></div>
                  <div className="row between mb-16" style={{ font: '500 11.5px/1 Poppins', color: 'rgba(255,255,255,.8)' }}>
                    <span>{live.cratesLine}</span><span>{live.etaLine}</span>
                  </div>
                </>
              )}
              <button type="button" className="btn btn-yellow" onClick={() => nav(hero.to)}>{hero.cta}</button>
            </div>
            {s.stage === 'live' && pending > 0 && (
              <button type="button" className="banner-yellow mt-8" onClick={() => nav('/move/approvals')}>
                <span>{approvalsLabel(pending)}</span><span>›</span>
              </button>
            )}
          </>
        ) : (
          <div className="hero">
            <img src="/assets/journey-grid.png" alt="Simply Unpack crews pre-packing, packing, moving, cleaning, organising and handing over a home" className="img-cover" style={{ height: 'auto' }} />
            <div className="hero-pad">
              <div className="eyebrow yellow">{s.fromArea} → {s.area} · {row.label}</div>
              <h2 className="hero-title">
                {s.remote ? `We can get your ${row.label} ready before you land in Bengaluru.` : 'From packing, moving to entire home organising and setup'}
              </h2>
              <div className="row mb-20" style={{ alignItems: 'flex-end' }}>
                <div style={{ font: '600 30px/1 Poppins' }}>{row.price}</div>
                <div style={{ font: '400 12.5px/1.4 Poppins', color: 'rgba(255,255,255,.8)', paddingBottom: 3 }}>indicative,<br />before add-ons</div>
              </div>
              <button type="button" className="btn btn-yellow" style={{ height: 52 }} onClick={() => nav('/quote')}>Build my quote</button>
              <div className="center" style={{ font: '400 12px/1 Poppins', color: 'rgba(255,255,255,.72)', marginTop: 12 }}>Free survey · no payment today</div>
            </div>
          </div>
        )}
      </div>

      <section className="pad-x mt-28">
        <h3 className="h2">Everything from packing day to living there</h3>
        <button type="button" className="btn-link" style={{ padding: '0 0 14px' }} onClick={() => nav('/explore')}>See all services →</button>
      </section>
      <div className="rail">
        {SERVICES.map((x) => (
          <button type="button" key={x.id} className="svc-card" onClick={() => nav(`/services/${x.id}`)}>
            <div style={{ position: 'relative' }}>
              <img src={x.img} alt={x.alt} className="img-cover" style={{ height: 116 }} />
              {x.addon ? <span className="tag-pink" style={{ position: 'absolute', top: 10, left: 10 }}>Add-on</span> : null}
            </div>
            <div className="body-pad">
              <div className="svc-name">{x.name}</div>
              <div className="svc-blurb">{x.blurb}</div>
              <div className="svc-foot">{x.foot}</div>
            </div>
          </button>
        ))}
      </div>

      <section className="pad-x mt-28">
        <h3 className="h2">One team, current home to new home</h3>
        <div className="stack">
          {STEPS.map((st) => (
            <div key={st.n} className="step-card">
              <div className="step-num">{st.n}</div>
              <div><div className="step-t">{st.t}</div><div className="step-d">{st.d}</div></div>
            </div>
          ))}
        </div>
      </section>

      <section className="pad-x mt-28">
        <div style={{ borderRadius: 20, overflow: 'hidden', background: 'var(--ink)' }}>
          <img src="/assets/women-team.png" alt="Simply Unpack women-powered crew in front of a branded truck" className="img-cover" style={{ height: 182 }} />
          <div style={{ padding: 20 }}>
            <div className="eyebrow yellow">Who shows up</div>
            <div style={{ font: '600 17px/1.32 Poppins', color: '#fff', marginBottom: 9 }}>A women-powered crew, trained on your rooms before they arrive.</div>
            <div style={{ font: '400 12.5px/1.6 Poppins', color: 'rgba(255,255,255,.8)' }}>Same team all day, uniformed and ID-carried, with a room-by-room handover before they leave.</div>
          </div>
        </div>
      </section>

      <section className="pad-x mt-28">
        <div className="row between" style={{ marginBottom: 13 }}>
          <h3 className="h2" style={{ margin: 0 }}>Less move fatigue</h3>
          <button type="button" className="btn-link" style={{ padding: 0 }} onClick={() => nav('/reviews')}>All reviews</button>
        </div>
        <button type="button" className="card card-pad" style={{ width: '100%', textAlign: 'left', cursor: 'pointer' }} onClick={() => nav('/reviews')}>
          <div className="stars">★★★★★</div>
          <p className="quote-text">“The biggest value was not unpacking. It was arriving Sunday evening and knowing the kitchen, beds and wardrobes were already usable.”</p>
          <div className="small" style={{ fontWeight: 500 }}>Ankit &amp; Kavya · Koramangala → Whitefield</div>
        </button>
      </section>

      <section className="pad-x" style={{ padding: '26px 20px 30px' }}>
        <div className="grid-3">
          {TRUST.map((t) => <div key={t.k} className="stat"><b style={{ fontSize: 15 }}>{t.k}</b><span>{t.v}</span></div>)}
        </div>
      </section>
    </Screen>
  );
}
