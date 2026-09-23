import { useEffect, useRef, useState } from 'react';
import { useApp } from '../store/AppStore.jsx';
import { api } from '../services/api.js';
import { whatsappLink } from '../config.js';
import { QUICK_REPLIES } from '../data/content.js';
import { liveMetrics } from '../lib/move.js';
import BackButton from '../components/BackButton.jsx';
import { IconSend } from '../components/Icons.jsx';

export default function Support() {
  const { s, set, tick } = useApp();
  const [text, setText] = useState('');
  const endRef = useRef(null);
  const scrollRef = useRef(null);

  useEffect(() => {
    const el = scrollRef.current;
    if (el) el.scrollTop = el.scrollHeight;
  }, [s.chat.length]);

  const send = async (raw) => {
    const t = (raw || '').trim();
    if (!t) return;
    setText('');
    set((p) => ({ chat: p.chat.concat({ me: true, text: t }) }));
    try {
      const res = await api.sendSupportMessage({ text: t, eta: liveMetrics(tick).eta });
      set((p) => ({ chat: p.chat.concat({ me: false, text: res.reply }) }));
    } catch {
      set((p) => ({ chat: p.chat.concat({ me: false, text: 'We couldn’t send that. Try WhatsApp instead.' }) }));
    }
  };

  return (
    <>
      <main className="screen" ref={scrollRef}>
        <div className="chat-head">
          <div className="row between" style={{ marginBottom: 14 }}>
            <BackButton />
            <a className="btn btn-navy btn-sm" style={{ width: 'auto', height: 36, color: 'var(--yellow)', fontSize: 12.5, marginBottom: 18 }} href={whatsappLink('Hi Simply Unpack, I need help with my move.')} target="_blank" rel="noreferrer">Continue on WhatsApp</a>
          </div>
          <div className="row" style={{ gap: 11 }}>
            <span className="avatar md">DV</span>
            <div>
              <div className="strong" style={{ fontSize: 15 }}>Divya · Support</div>
              <div className="small" style={{ fontSize: 11.5 }}>Replies in about 2 minutes · 8am–10pm</div>
            </div>
          </div>
        </div>
        <div className="chat-body">
          {s.chat.map((m, i) => <div key={i} className={`bubble ${m.me ? 'me' : 'them'}`}>{m.text}</div>)}
          <div ref={endRef} />
        </div>
        <div className="chips" style={{ padding: '0 20px 12px' }}>
          {QUICK_REPLIES.map((q) => <button type="button" key={q} className="quick-chip" onClick={() => send(q)}>{q}</button>)}
        </div>
      </main>
      <form className="chat-input" onSubmit={(e) => { e.preventDefault(); send(text); }}>
        <label className="field">
          <input value={text} onChange={(e) => setText(e.target.value)} placeholder="Type a message" aria-label="Message" style={{ fontWeight: 400, fontSize: 14 }} />
        </label>
        <button type="submit" className="send-btn" aria-label="Send"><IconSend /></button>
      </form>
    </>
  );
}
