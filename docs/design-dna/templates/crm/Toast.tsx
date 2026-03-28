import React, { createContext, useContext, useState, useCallback, useEffect, useRef } from 'react';
type Variant = 'success' | 'error' | 'warning' | 'info';
interface ToastItem {
  id: number;
  title: string;
  description?: string;
  variant: Variant;
}
interface ToastCtx {
  toast: (t: Omit<ToastItem, 'id'>) => void;
}
const Ctx = createContext<ToastCtx>({ toast: () => {} });
export const useToast = () => useContext(Ctx);
const COLORS: Record<Variant, string> = {
  success: 'var(--success)',
  error: 'var(--destructive)',
  warning: 'var(--warning)',
  info: 'var(--info)',
};
function ToastCard({ item, onDismiss }: { item: ToastItem; onDismiss: () => void }) {
  const [progress, setProgress] = useState(100);
  const raf = useRef<number>(undefined);
  const start = useRef(Date.now());
  useEffect(() => {
    const tick = () => {
      const elapsed = Date.now() - start.current;
      const pct = Math.max(0, 100 - (elapsed / 4000) * 100);
      setProgress(pct);
      if (pct <= 0) {
        onDismiss();
        return;
      }
      raf.current = requestAnimationFrame(tick);
    };
    raf.current = requestAnimationFrame(tick);
    return () => {
      if (raf.current) cancelAnimationFrame(raf.current);
    };
  }, [onDismiss]);
  return (
    <div
      style={{
        background: 'var(--bg-elevated)',
        border: '1px solid var(--border)',
        borderRadius: 'var(--radius-sm, 8px)',
        padding: '14px 16px',
        minWidth: 280,
        maxWidth: 380,
        boxShadow: '0 8px 32px rgba(0,0,0,0.2)',
        position: 'relative',
        overflow: 'hidden',
        animation: 'toast-in .3s cubic-bezier(0.22,1,0.36,1)',
      }}
    >
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'flex-start',
          gap: 12,
        }}
      >
        <div>
          <div style={{ fontSize: 14, fontWeight: 600, marginBottom: 2, color: 'var(--text)' }}>
            {item.title}
          </div>
          {item.description && (
            <div style={{ fontSize: 13, color: 'var(--text-secondary)' }}>{item.description}</div>
          )}
        </div>
        <button
          onClick={onDismiss}
          style={{
            background: 'none',
            border: 'none',
            color: 'var(--text-muted)',
            cursor: 'pointer',
            fontSize: 16,
            padding: 0,
            lineHeight: 1,
          }}
        >
          ×
        </button>
      </div>
      <div
        style={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          height: 2,
          width: `${progress}%`,
          background: COLORS[item.variant],
          transition: 'width .1s linear',
        }}
      />
    </div>
  );
}
export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<ToastItem[]>([]);
  let nextId = useRef(0);
  const toast = useCallback((t: Omit<ToastItem, 'id'>) => {
    setToasts((prev) => [...prev, { ...t, id: ++nextId.current }]);
  }, []);
  const dismiss = useCallback((id: number) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);
  return (
    <Ctx.Provider value={{ toast }}>
      {children}
      <style>{`@keyframes toast-in{from{transform:translateX(100%);opacity:0}to{transform:translateX(0);opacity:1}}`}</style>
      <div
        style={{
          position: 'fixed',
          bottom: 24,
          right: 24,
          zIndex: 9999,
          display: 'flex',
          flexDirection: 'column-reverse',
          gap: 8,
        }}
        role="region"
        aria-label="Notificações"
      >
        {toasts.map((t) => (
          <ToastCard key={t.id} item={t} onDismiss={() => dismiss(t.id)} />
        ))}
      </div>
    </Ctx.Provider>
  );
}
