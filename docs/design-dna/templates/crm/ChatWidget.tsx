import { useState, useRef, useEffect } from 'react'

interface Message {
  id: number
  role: 'agent' | 'user'
  text: string
}

const INITIAL_MESSAGES: Message[] = [
  { id: 1, role: 'agent', text: 'Hi! How can I help you today?' },
  { id: 2, role: 'user', text: 'I can\'t find the export button.' },
  { id: 3, role: 'agent', text: 'Great question! In the new version, it was moved to the top-right corner. Click the three-dot menu and you\'ll see "Export data".' },
  { id: 4, role: 'user', text: 'Found it, thanks!' },
]

const styles: Record<string, React.CSSProperties> = {
  window: {
    background: 'var(--bg-elevated)',
    border: '1px solid var(--border)',
    borderRadius: 'var(--radius)',
    overflow: 'hidden',
    maxWidth: 400,
    margin: '0 auto',
    boxShadow: '0 8px 32px rgba(0,0,0,0.12)',
    fontFamily: 'var(--font-body)',
  },
  header: {
    padding: '16px 20px',
    borderBottom: '1px solid var(--border)',
    display: 'flex',
    alignItems: 'center',
    gap: 12,
  },
  statusDot: {
    width: 8, height: 8, borderRadius: '50%',
    background: 'var(--success)', flexShrink: 0,
  },
  agentName: { fontSize: 14, fontWeight: 600, color: 'var(--text)', margin: 0 },
  responseTime: { fontSize: 11, color: 'var(--text-muted)', margin: 0 },
  body: {
    padding: 20, maxHeight: 320, overflowY: 'auto',
    display: 'flex', flexDirection: 'column', gap: 12,
  },
  msgBase: { maxWidth: '80%', padding: '10px 14px', borderRadius: 12, fontSize: 14, lineHeight: 1.5 },
  inputBar: { padding: '12px 20px', borderTop: '1px solid var(--border)', display: 'flex', gap: 8 },
  sendBtn: {
    background: 'var(--accent)', border: 'none', width: 32, height: 32,
    borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center',
    cursor: 'pointer', color: 'white', flexShrink: 0,
  },
}

function TypingDots() {
  return (
    <div style={{ ...styles.msgBase, background: 'var(--bg-surface)', alignSelf: 'flex-start', borderBottomLeftRadius: 4, display: 'flex', gap: 4, alignItems: 'center', padding: '12px 16px' }}>
      <style>{`@keyframes typing-bounce{0%,60%,100%{transform:translateY(0)}30%{transform:translateY(-4px)}}`}</style>
      {[0, 0.2, 0.4].map((delay, i) => (
        <span key={i} style={{ width: 6, height: 6, borderRadius: '50%', background: 'var(--text-muted)', display: 'block', animation: `typing-bounce 1.2s ease-in-out ${delay}s infinite` }} />
      ))}
    </div>
  )
}

export default function ChatWidget() {
  const [messages, setMessages] = useState<Message[]>(INITIAL_MESSAGES)
  const [input, setInput] = useState('')
  const [typing, setTyping] = useState(true)
  const bodyRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (bodyRef.current) bodyRef.current.scrollTop = bodyRef.current.scrollHeight
  }, [messages, typing])

  function handleSend() {
    const text = input.trim()
    if (!text) return
    setMessages(prev => [...prev, { id: Date.now(), role: 'user', text }])
    setInput('')
    setTyping(true)
    setTimeout(() => {
      setTyping(false)
      setMessages(prev => [...prev, { id: Date.now() + 1, role: 'agent', text: 'Entendido! Vou verificar isso para você agora.' }])
    }, 1800)
  }

  function handleKeyDown(e: React.KeyboardEvent) {
    if (e.key === 'Enter') handleSend()
  }

  return (
    <div style={styles.window}>
      <div style={styles.header}>
        <div style={styles.statusDot} aria-label="Online" />
        <div>
          <p style={styles.agentName}>Suporte — Ana Souza</p>
          <p style={styles.responseTime}>Responde em 2 min</p>
        </div>
      </div>
      <div ref={bodyRef} style={styles.body}>
        {messages.map(msg => (
          <div key={msg.id} style={{ ...styles.msgBase, background: msg.role === 'agent' ? 'var(--bg-surface)' : 'var(--accent)', color: msg.role === 'agent' ? 'var(--text-secondary)' : 'white', alignSelf: msg.role === 'agent' ? 'flex-start' : 'flex-end', borderBottomLeftRadius: msg.role === 'agent' ? 4 : 12, borderBottomRightRadius: msg.role === 'user' ? 4 : 12 }}>
            {msg.text}
          </div>
        ))}
        {typing && <TypingDots />}
      </div>
      <div style={styles.inputBar}>
        <input value={input} onChange={e => setInput(e.target.value)} onKeyDown={handleKeyDown} placeholder="Digite uma mensagem..." style={{ flex: 1, background: 'var(--bg)', border: '1px solid var(--border)', borderRadius: 999, padding: '8px 16px', color: 'var(--text)', fontSize: 13, fontFamily: 'var(--font-body)', outline: 'none' }} aria-label="Mensagem" />
        <button style={styles.sendBtn} onClick={handleSend} aria-label="Send">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M22 2L11 13M22 2l-7 20-4-9-9-4 20-7z" /></svg>
        </button>
      </div>
    </div>
  )
}
