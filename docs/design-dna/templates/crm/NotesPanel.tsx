import React, { useState } from 'react';

interface Note {
  initials: string;
  name: string;
  time: string;
  content: React.ReactNode;
  tags: string[];
  avatarColor?: string;
  avatarBg?: string;
}

const NOTES: Note[] = [
  {
    initials: 'AS', name: 'Ana Souza', time: 'Há 2 horas',
    content: <>Liguei para Elena para discutir a proposta revisada. Ela está animada com o <strong>módulo de analytics em tempo real</strong> — disse que era a peça que faltava. A revisão do conselho está agendada para quinta. Ela vai pressionar por uma decisão até sexta.</>,
    tags: ['ligação', 'proposta', 'decisão pendente'],
  },
  {
    initials: 'MC', name: 'Marcus Chen', time: 'Ontem',
    content: <>Revisão técnica concluída. O time deles usa stack <strong>PostgreSQL + Redis</strong>. A integração vai precisar de uma ponte webhook personalizada para o sistema legado de estoque. Estimativa de mais 2 sprints.</>,
    tags: ['técnico', 'integração'],
    avatarColor: 'var(--success)', avatarBg: 'rgba(52,211,153,0.1)',
  },
  {
    initials: 'JP', name: 'Julia Park', time: 'Há 3 dias',
    content: <>Análise competitiva: eles também estão conversando com a <strong>BuildCo</strong> — mas o prazo deles é 6+ meses. Nossa entrega em 8 semanas é o nosso diferencial mais forte. Lidere com velocidade.</>,
    tags: ['competitivo', 'estratégia'],
    avatarColor: 'var(--warning)', avatarBg: 'rgba(251,191,36,0.1)',
  },
];

const styles: Record<string, React.CSSProperties> = {
  panel: { maxWidth: 480, margin: '0 auto' },
  noteInput: {
    background: 'var(--bg-elevated)', border: '1px solid var(--border)',
    borderRadius: 'var(--radius)', padding: 16, display: 'flex',
    gap: 12, alignItems: 'flex-start', marginBottom: 16,
  },
  textarea: {
    flex: 1, border: 'none', background: 'none', color: 'var(--text)',
    fontSize: 13, outline: 'none', resize: 'none', minHeight: 48, lineHeight: 1.5,
    fontFamily: 'var(--font-body)',
  },
  submitBtn: {
    background: 'var(--accent)', color: 'white', border: 'none', width: 32, height: 32,
    borderRadius: 'var(--radius-sm)', cursor: 'pointer', display: 'flex',
    alignItems: 'center', justifyContent: 'center', flexShrink: 0,
  },
  note: {
    background: 'var(--bg-elevated)', border: '1px solid var(--border)',
    borderRadius: 'var(--radius)', padding: 20, marginBottom: 12,
    transition: 'all 0.3s cubic-bezier(0.22,1,0.36,1)',
  },
  noteHeader: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 },
  noteAuthor: { display: 'flex', alignItems: 'center', gap: 8 },
  noteContent: { fontSize: 14, color: 'var(--text-secondary)', lineHeight: 1.6 },
  noteTags: { display: 'flex', gap: 6, marginTop: 12, flexWrap: 'wrap' as const },
  noteTag: {
    fontSize: 10, padding: '2px 8px', borderRadius: 999,
    background: 'var(--bg-surface)', color: 'var(--text-muted)',
  },
};

function Avatar({ initials, color, bg }: { initials: string; color?: string; bg?: string }) {
  return (
    <div style={{
      width: 24, height: 24, borderRadius: '50%',
      background: bg ?? 'var(--accent-glow)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      fontSize: 9, fontWeight: 600, color: color ?? 'var(--accent)', flexShrink: 0,
    }}>
      {initials}
    </div>
  );
}

export default function NotesPanel() {
  const [value, setValue] = useState('');

  return (
    <div style={styles.panel}>
      <div style={styles.noteInput}>
        <Avatar initials="AS" />
        <textarea
          style={styles.textarea}
          placeholder="Adicione uma nota sobre este contato ou deal..."
          value={value}
          onChange={e => setValue(e.target.value)}
          rows={2}
        />
        <button style={styles.submitBtn} aria-label="Enviar nota">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M22 2L11 13M22 2l-7 20-4-9-9-4 20-7z" />
          </svg>
        </button>
      </div>

      {NOTES.map((note, i) => (
        <div key={i} style={styles.note}>
          <div style={styles.noteHeader}>
            <div style={styles.noteAuthor}>
              <Avatar initials={note.initials} color={note.avatarColor} bg={note.avatarBg} />
              <span style={{ fontSize: 13, fontWeight: 500 }}>{note.name}</span>
            </div>
            <span style={{ fontSize: 11, color: 'var(--text-muted)' }}>{note.time}</span>
          </div>
          <div style={styles.noteContent}>{note.content}</div>
          <div style={styles.noteTags}>
            {note.tags.map(tag => <span key={tag} style={styles.noteTag}>{tag}</span>)}
          </div>
        </div>
      ))}
    </div>
  );
}
