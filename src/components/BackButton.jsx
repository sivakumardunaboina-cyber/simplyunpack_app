import { useNavigate } from 'react-router-dom';

export default function BackButton({ to, label = 'Back', onClick, light = false }) {
  const nav = useNavigate();
  const go = () => {
    if (onClick) return onClick();
    if (to) return nav(to);
    return window.history.length > 1 ? nav(-1) : nav('/');
  };
  return (
    <button type="button" className={`back-btn${light ? ' light' : ''}`} onClick={go}>{label}</button>
  );
}
