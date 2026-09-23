export default function Toggle({ on, onChange, title, sub }) {
  return (
    <button type="button" role="switch" aria-checked={!!on} className="toggle-row" onClick={() => onChange(!on)}>
      <span className="toggle-text">
        <span className="toggle-title">{title}</span>
        {sub ? <span className="toggle-sub">{sub}</span> : null}
      </span>
      <span className={`toggle${on ? ' is-on' : ''}`}><span /></span>
    </button>
  );
}
