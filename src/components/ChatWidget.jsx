import { useState, useRef, useEffect } from 'react';

const QUICK_CHIPS = ['Shipping cost?', 'Size guide', 'What\'s in stock?', 'Track order'];

export default function ChatWidget() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState(() => {
    try { return JSON.parse(sessionStorage.getItem('genzfront_chat')) || []; } catch { return []; }
  });
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => {
    sessionStorage.setItem('genzfront_chat', JSON.stringify(messages));
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  useEffect(() => {
    if (open) setTimeout(() => inputRef.current?.focus(), 100);
  }, [open]);

  const sendMessage = async (text) => {
    const msg = text || input.trim();
    if (!msg || loading) return;
    setInput('');

    const userMsg = { role: 'user', content: msg };
    setMessages(prev => [...prev, userMsg]);
    setLoading(true);

    try {
      // Send past messages as history (ensuring it ends with a bot/model response)
      const prevMessages = [...messages].filter(m => m.role === 'user' || m.role === 'bot');
      // Ensure we take an even number of messages so the sequence is strictly user -> model -> user -> model
      const len = prevMessages.length;
      const validHistoryStr = len % 2 !== 0 ? prevMessages.slice(1) : prevMessages;
      const history = validHistoryStr.slice(-6);

      const res = await fetch('/api/chatbot', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: msg, history }),
      });
      const data = await res.json();
      setMessages(prev => [...prev, { role: 'bot', content: data.reply || "Sorry, I couldn't respond right now." }]);
    } catch {
      setMessages(prev => [...prev, { role: 'bot', content: "Sorry, I'm slow right now. Try again!" }]);
    } finally {
      setLoading(false);
    }
  };

  const handleKey = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); sendMessage(); }
  };

  return (
    <>
      {/* Floating Button */}
      <button className="chat-fab" onClick={() => setOpen(v => !v)} aria-label="Chat">
        {open ? (
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <path d="M18 6L6 18M6 6l12 12"/>
          </svg>
        ) : (
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
          </svg>
        )}
        {!open && messages.length === 0 && <span className="chat-ping" />}
      </button>

      {/* Chat Window */}
      {open && (
        <div className="chat-window">
          <div className="chat-header">
            <div className="chat-header-info">
              <div className="chat-avatar">GZ</div>
              <div>
                <p className="chat-name">Gen Z Front Assistant</p>
                <p className="chat-status">● Online</p>
              </div>
            </div>
            <button className="chat-close" onClick={() => setOpen(false)}>✕</button>
          </div>

          <div className="chat-messages">
            {messages.length === 0 && (
              <div className="chat-welcome">
                <span className="chat-bot-icon">🤖</span>
                <p>Hey! 👋 I'm your Gen Z Front assistant. Ask me about products, sizes, shipping — anything!</p>
              </div>
            )}
            {messages.map((m, i) => (
              <div key={i} className={`chat-msg ${m.role}`}>
                <div className="chat-bubble">{m.content}</div>
              </div>
            ))}
            {loading && (
              <div className="chat-msg bot">
                <div className="chat-bubble typing">
                  <span/><span/><span/>
                </div>
              </div>
            )}
            <div ref={bottomRef} />
          </div>

          <div className="chat-chips">
            {QUICK_CHIPS.map(chip => (
              <button key={chip} className="chip" onClick={() => sendMessage(chip)} disabled={loading}>
                {chip}
              </button>
            ))}
          </div>

          <div className="chat-input-row">
            <input
              ref={inputRef}
              className="chat-input"
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={handleKey}
              placeholder="Type a message..."
              disabled={loading}
            />
            <button className="chat-send" onClick={() => sendMessage()} disabled={loading || !input.trim()}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/>
              </svg>
            </button>
          </div>
        </div>
      )}

      <style>{`
        .chat-fab {
          position: fixed;
          bottom: 1.5rem;
          right: 1.5rem;
          width: 56px;
          height: 56px;
          border-radius: 50%;
          background: var(--accent);
          color: var(--primary);
          border: none;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          box-shadow: 0 4px 24px rgba(232,255,0,0.35);
          z-index: 500;
          transition: transform 0.2s ease, box-shadow 0.2s ease;
        }
        .chat-fab:hover {
          transform: scale(1.08);
          box-shadow: 0 6px 32px rgba(232,255,0,0.5);
        }
        .chat-ping {
          position: absolute;
          top: 4px;
          right: 4px;
          width: 12px;
          height: 12px;
          border-radius: 50%;
          background: var(--error);
          border: 2px solid var(--bg);
          animation: ping 1.5s ease-in-out infinite;
        }
        @keyframes ping {
          0%,100% { transform: scale(1); opacity:1; }
          50% { transform: scale(1.3); opacity:0.7; }
        }
        .chat-window {
          position: fixed;
          bottom: 5.5rem;
          right: 1.5rem;
          width: 320px;
          height: 440px;
          background: var(--bg-card);
          border: 1px solid var(--border-light);
          border-radius: var(--radius-lg);
          display: flex;
          flex-direction: column;
          z-index: 500;
          box-shadow: 0 16px 60px rgba(0,0,0,0.7);
          animation: slideUp 0.25s ease;
          overflow: hidden;
        }
        .chat-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 0.85rem 1rem;
          background: var(--bg-elevated);
          border-bottom: 1px solid var(--border);
          flex-shrink: 0;
        }
        .chat-header-info {
          display: flex;
          align-items: center;
          gap: 0.65rem;
        }
        .chat-avatar {
          width: 34px;
          height: 34px;
          border-radius: 50%;
          background: var(--accent);
          color: var(--primary);
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 0.7rem;
          font-weight: 800;
          letter-spacing: 0.05em;
          flex-shrink: 0;
        }
        .chat-name {
          font-size: 0.85rem;
          font-weight: 700;
          color: var(--text);
        }
        .chat-status {
          font-size: 0.68rem;
          color: var(--success);
          font-weight: 600;
        }
        .chat-close {
          background: none;
          border: none;
          color: var(--text-muted);
          cursor: pointer;
          font-size: 0.8rem;
          padding: 4px;
          border-radius: 4px;
          transition: color 0.2s;
        }
        .chat-close:hover { color: var(--text); }
        .chat-messages {
          flex: 1;
          overflow-y: auto;
          padding: 1rem;
          display: flex;
          flex-direction: column;
          gap: 0.65rem;
        }
        .chat-welcome {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 0.5rem;
          text-align: center;
          padding: 1rem 0;
          color: var(--text-muted);
          font-size: 0.83rem;
          line-height: 1.5;
        }
        .chat-bot-icon { font-size: 2rem; }
        .chat-msg {
          display: flex;
        }
        .chat-msg.user { justify-content: flex-end; }
        .chat-msg.bot  { justify-content: flex-start; }
        .chat-bubble {
          max-width: 80%;
          padding: 0.55rem 0.85rem;
          border-radius: 14px;
          font-size: 0.83rem;
          line-height: 1.5;
        }
        .chat-msg.user .chat-bubble {
          background: var(--accent);
          color: var(--primary);
          border-bottom-right-radius: 4px;
          font-weight: 500;
        }
        .chat-msg.bot .chat-bubble {
          background: var(--bg-elevated);
          color: var(--text);
          border: 1px solid var(--border-light);
          border-bottom-left-radius: 4px;
        }
        .chat-bubble.typing {
          display: flex;
          align-items: center;
          gap: 4px;
          padding: 0.65rem 1rem;
        }
        .chat-bubble.typing span {
          width: 7px;
          height: 7px;
          border-radius: 50%;
          background: var(--text-muted);
          animation: bounce 1.2s infinite;
        }
        .chat-bubble.typing span:nth-child(2) { animation-delay: 0.2s; }
        .chat-bubble.typing span:nth-child(3) { animation-delay: 0.4s; }
        @keyframes bounce {
          0%,80%,100% { transform: translateY(0); }
          40% { transform: translateY(-5px); }
        }
        .chat-chips {
          display: flex;
          flex-wrap: wrap;
          gap: 0.4rem;
          padding: 0.5rem 0.75rem;
          border-top: 1px solid var(--border);
          flex-shrink: 0;
        }
        .chip {
          padding: 0.3rem 0.65rem;
          border-radius: var(--radius-pill);
          background: var(--bg-elevated);
          border: 1px solid var(--border-light);
          color: var(--text-muted);
          font-size: 0.72rem;
          font-weight: 600;
          cursor: pointer;
          transition: var(--transition);
          white-space: nowrap;
        }
        .chip:hover:not(:disabled) {
          border-color: var(--accent);
          color: var(--accent);
        }
        .chip:disabled { opacity: 0.5; cursor: not-allowed; }
        .chat-input-row {
          display: flex;
          gap: 0.4rem;
          padding: 0.65rem;
          border-top: 1px solid var(--border);
          flex-shrink: 0;
        }
        .chat-input {
          flex: 1;
          background: var(--bg-elevated);
          border: 1.5px solid var(--border-light);
          border-radius: var(--radius-sm);
          color: var(--text);
          padding: 0.55rem 0.8rem;
          font-size: 0.85rem;
          outline: none;
          transition: border-color 0.2s;
        }
        .chat-input:focus { border-color: var(--accent); }
        .chat-input::placeholder { color: var(--text-subtle); }
        .chat-send {
          width: 38px;
          height: 38px;
          border-radius: var(--radius-sm);
          background: var(--accent);
          color: var(--primary);
          border: none;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
          transition: var(--transition);
        }
        .chat-send:hover:not(:disabled) {
          background: var(--accent-hover);
          transform: scale(1.05);
        }
        .chat-send:disabled { opacity: 0.4; cursor: not-allowed; transform: none; }
        @media (max-width: 400px) {
          .chat-window { right: 0.75rem; left: 0.75rem; width: auto; }
          .chat-fab { right: 0.75rem; }
        }
      `}</style>
    </>
  );
}
