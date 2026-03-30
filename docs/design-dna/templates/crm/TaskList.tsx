// CRM Task / Follow-up List — checklist with due dates, assignees, priority
// Copy into your app and customize. Zero external dependencies.

import React, { useState } from 'react';

interface Task {
  id: string;
  title: string;
  context: string;
  assignee: { name: string; initials: string };
  due: string;
  dueType: 'overdue' | 'today' | 'upcoming';
  done: boolean;
}

const defaultTasks: Task[] = [
  {
    id: 't1',
    title: 'Follow-up com StyleHouse',
    context: 'Deal: E-commerce Platform · $65k',
    assignee: { name: 'Ana', initials: 'AS' },
    due: 'Overdue',
    dueType: 'overdue',
    done: false,
  },
  {
    id: 't2',
    title: 'Send revised proposal',
    context: 'Deal: API Integration · $45k',
    assignee: { name: 'Marcus', initials: 'MC' },
    due: 'Today',
    dueType: 'today',
    done: false,
  },
  {
    id: 't3',
    title: 'Schedule demo for Lumina',
    context: 'Deal: Brand Identity · $8.5k',
    assignee: { name: 'Julia', initials: 'JP' },
    due: 'Tomorrow',
    dueType: 'upcoming',
    done: false,
  },
  {
    id: 't4',
    title: 'Revisar contrato DataFlow',
    context: 'Deal: Dashboard MVP · $18k',
    assignee: { name: 'Ana', initials: 'AS' },
    due: 'Sex',
    dueType: 'upcoming',
    done: true,
  },
  {
    id: 't5',
    title: 'Call InsightCo — feedback',
    context: 'Deal: Analytics Suite · $52k',
    assignee: { name: 'Marcus', initials: 'MC' },
    due: 'Mon',
    dueType: 'upcoming',
    done: true,
  },
];

const dueBg: Record<string, string> = {
  overdue: 'rgba(248,113,113,0.1)',
  today: 'rgba(251,191,36,0.1)',
  upcoming: 'rgba(96,165,250,0.1)',
};
const dueColor: Record<string, string> = {
  overdue: 'var(--destructive)',
  today: 'var(--warning)',
  upcoming: 'var(--info)',
};

export default function TaskList({ tasks = defaultTasks }: { tasks?: Task[] }) {
  const [items, setItems] = useState(tasks);

  const toggle = (id: string) => {
    setItems((prev) => prev.map((t) => (t.id === id ? { ...t, done: !t.done } : t)));
  };

  return (
    <div
      style={{ display: 'flex', flexDirection: 'column', gap: 6, maxWidth: 640, margin: '0 auto' }}
    >
      {items.map((t) => (
        <div
          key={t.id}
          style={{
            background: 'var(--bg-elevated)',
            border: '1px solid var(--border)',
            borderRadius: 'var(--radius-sm, 8px)',
            padding: '14px 18px',
            display: 'flex',
            alignItems: 'center',
            gap: 14,
            transition: 'all .3s cubic-bezier(0.22,1,0.36,1)',
            cursor: 'pointer',
          }}
          onClick={() => toggle(t.id)}
        >
          {/* Check circle */}
          <div
            style={{
              width: 18,
              height: 18,
              borderRadius: '50%',
              border: `2px solid ${t.done ? 'var(--success)' : 'var(--border)'}`,
              background: t.done ? 'var(--success)' : 'transparent',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0,
              transition: 'all .2s',
              fontSize: 10,
              fontWeight: 700,
              color: 'white',
            }}
          >
            {t.done && '✓'}
          </div>

          {/* Info */}
          <div style={{ flex: 1 }}>
            <div
              style={{
                fontSize: 14,
                fontWeight: 500,
                marginBottom: 2,
                textDecoration: t.done ? 'line-through' : 'none',
                color: t.done ? 'var(--text-muted)' : 'var(--text)',
              }}
            >
              {t.title}
            </div>
            <div
              style={{
                fontSize: 12,
                color: 'var(--text-muted)',
                display: 'flex',
                alignItems: 'center',
                gap: 8,
              }}
            >
              <span>{t.context}</span>
            </div>
          </div>

          {/* Assignee */}
          <div
            style={{
              width: 20,
              height: 20,
              borderRadius: '50%',
              background: 'var(--bg-surface)',
              border: '1px solid var(--border)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: 8,
              fontWeight: 600,
              color: 'var(--text-muted)',
              flexShrink: 0,
            }}
          >
            {t.assignee.initials}
          </div>

          {/* Due badge */}
          <span
            style={{
              fontSize: 11,
              padding: '2px 8px',
              borderRadius: 999,
              fontWeight: 500,
              whiteSpace: 'nowrap',
              background: dueBg[t.dueType],
              color: dueColor[t.dueType],
            }}
          >
            {t.due}
          </span>
        </div>
      ))}
    </div>
  );
}
