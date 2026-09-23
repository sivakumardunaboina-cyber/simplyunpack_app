export default function Chip({ selected, onClick, children, onPink = false, small = false }) {
  return (
    <button
      type="button"
      className={`chip${onPink ? ' on-pink' : ''}${selected ? ' is-selected' : ''}${small ? ' small' : ''}`}
      onClick={onClick}
      aria-pressed={!!selected}
    >
      {children}
    </button>
  );
}
