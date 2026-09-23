import CtaBar from './CtaBar.jsx';
import TabBar from './TabBar.jsx';

// Page wrapper: scrollable content + optional sticky CTA bar and bottom tab bar.
export default function Screen({ children, cta, tabs = false, className = '' }) {
  return (
    <>
      <main className={`screen ${className}`}>{children}</main>
      {cta ? <CtaBar {...cta} /> : null}
      {tabs ? <TabBar /> : null}
    </>
  );
}
