import { Navigate, useNavigate, useParams } from 'react-router-dom';
import { useApp } from '../store/AppStore.jsx';
import { AREAS, BHK, WHEN } from '../data/content.js';
import Chip from '../components/Chip.jsx';
import Option from '../components/Option.jsx';

const COPY = {
  1: { title: 'Tell us where you are shifting?', lead: 'One team handles both homes — packing at the current one, setup at the new one.' },
  2: { title: 'How big is it?', lead: 'Packages are priced by home size. Indicative, confirmed after the free survey.' },
  3: { title: 'When is moving day?', lead: 'We plan pre-pack, the move and setup around this date.' },
};

export default function Onboarding() {
  const { step: raw } = useParams();
  const step = Number(raw);
  const nav = useNavigate();
  const { s, set } = useApp();
  if (![1, 2, 3].includes(step)) return <Navigate to="/welcome" replace />;

  const finish = () => { set({ onboarded: true }); nav('/'); };
  const next = () => (step === 3 ? finish() : nav(`/onboarding/${step + 1}`));
  const back = () => (step === 1 ? nav(s.account ? '/' : '/welcome') : nav(`/onboarding/${step - 1}`));

  return (
    <main className="screen onboard">
      <div className="onboard-top">
        <span className="onboard-step">Your move · {step} of 3</span>
        <button type="button" className="back-btn light" onClick={finish}>Skip</button>
      </div>
      <div className="onboard-body">
        <h1 className="onboard-title">{COPY[step].title}</h1>
        <p className="onboard-lead">{COPY[step].lead}</p>

        {step === 1 && (
          <>
            <div className="onboard-step" style={{ marginBottom: 11 }}>Moving from</div>
            <div className="chips" style={{ marginBottom: 24 }}>
              {AREAS.map((a) => (
                <Chip key={a} onPink small selected={s.fromArea === a} onClick={() => set({ fromArea: a })}>{a}</Chip>
              ))}
            </div>
            <div className="onboard-step" style={{ marginBottom: 11 }}>Moving to</div>
            <div className="chips">
              {AREAS.map((a) => (
                <Chip key={a} onPink selected={s.area === a} onClick={() => set({ area: a })}>{a}</Chip>
              ))}
            </div>
          </>
        )}

        {step === 2 && (
          <div className="stack">
            {BHK.map((b) => (
              <Option key={b.v} onPink selected={s.bhk === b.v} onClick={() => set({ bhk: b.v })} title={b.label} sub={b.hours} right={b.price} />
            ))}
          </div>
        )}

        {step === 3 && (
          <>
            <div className="stack">
              {WHEN.map((w) => (
                <Option key={w.v} onPink selected={s.when === w.v} onClick={() => set({ when: w.v })} title={w.label} right={<span className="option-right note">{w.note}</span>} />
              ))}
            </div>
            <div className="onboard-note">
              <b>Not in the city yet?</b>
              <span>Remote setup works on authorized access, verified mover handoff and photo approvals. You can switch it on later in your profile.</span>
            </div>
          </>
        )}
      </div>
      <div className="onboard-nav">
        <button type="button" className="onboard-back" onClick={back} aria-label="Back">‹</button>
        <button type="button" className="btn btn-yellow" style={{ height: 52 }} onClick={next}>{step === 3 ? 'See my price' : 'Continue'}</button>
      </div>
    </main>
  );
}
