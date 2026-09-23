// Selectable card used for packages, dates, slots, payment methods.
export default function Option({ selected, onClick, title, sub, right, lead, onPink = false }) {
  return (
    <button
      type="button"
      className={`option${onPink ? ' on-pink' : ''}${selected ? ' is-selected' : ''}`}
      onClick={onClick}
      aria-pressed={!!selected}
    >
      {lead ? <span className="option-lead">{lead}</span> : null}
      <span className="option-main">
        <span className="option-title">{title}</span>
        {sub ? <span className="option-sub">{sub}</span> : null}
      </span>
      {right != null ? <span className="option-right">{right}</span> : null}
    </button>
  );
}

export const Radio = ({ on }) => (
  <span className={`radio${on ? ' is-on' : ''}`}><span /></span>
);

export const Check = ({ on }) => (
  <span className={`check${on ? ' is-on' : ''}`}>{on ? '✓' : ''}</span>
);
