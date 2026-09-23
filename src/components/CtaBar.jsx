export default function CtaBar({ note, value, label, onClick, disabled = false, busy = false }) {
  return (
    <div className="ctabar">
      <div className="ctabar-text">
        {note ? <div className="ctabar-note">{note}</div> : null}
        {value ? <div className="ctabar-value">{value}</div> : null}
      </div>
      <button type="button" className="btn btn-pink ctabar-btn" onClick={onClick} disabled={disabled || busy}>
        {busy ? 'Please wait…' : label}
      </button>
    </div>
  );
}
