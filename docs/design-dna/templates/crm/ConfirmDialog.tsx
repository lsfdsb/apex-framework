import React, { useEffect, useRef } from "react";
interface ConfirmDialogProps { open: boolean; onConfirm: () => void; onCancel: () => void; title?: string; description?: string; confirmText?: string; cancelText?: string; variant?: "default" | "destructive" }
export default function ConfirmDialog({ open, onConfirm, onCancel, title = "Confirmar ação", description = "Tem certeza que deseja continuar?", confirmText = "Confirmar", cancelText = "Cancelar", variant = "default" }: ConfirmDialogProps) {
  const btnRef = useRef<HTMLButtonElement>(null);
  useEffect(() => { if (open) setTimeout(() => btnRef.current?.focus(), 50) }, [open]);
  useEffect(() => { if (!open) return; const h = (e: KeyboardEvent) => { if (e.key === "Escape") onCancel() }; document.addEventListener("keydown", h); return () => document.removeEventListener("keydown", h) }, [open, onCancel]);
  if (!open) return null;
  const isDestructive = variant === "destructive";
  return (
    <div onClick={onCancel} style={{ position: "fixed", inset: 0, zIndex: 9999, background: "rgba(8,8,10,0.7)", backdropFilter: "blur(8px)", display: "flex", alignItems: "center", justifyContent: "center" }} role="dialog" aria-modal>
      <div onClick={(e) => e.stopPropagation()} style={{ background: "var(--bg-elevated)", border: "1px solid var(--border)", borderRadius: "var(--radius, 12px)", padding: 32, maxWidth: 420, width: "90%", backdropFilter: "blur(20px) saturate(1.4)", animation: "confirm-in .25s cubic-bezier(0.22,1,0.36,1)" }}>
        <style>{`@keyframes confirm-in{from{opacity:0;transform:scale(0.95)}to{opacity:1;transform:scale(1)}}`}</style>
        <h3 style={{ fontSize: 18, fontWeight: 600, marginBottom: 8, color: "var(--text)" }}>{title}</h3>
        <p style={{ fontSize: 14, color: "var(--text-secondary)", lineHeight: 1.6, marginBottom: 24 }}>{description}</p>
        <div style={{ display: "flex", justifyContent: "flex-end", gap: 8 }}>
          <button onClick={onCancel} style={{ padding: "8px 16px", borderRadius: "var(--radius-sm, 8px)", fontSize: 13, fontWeight: 500, background: "none", border: "1px solid var(--border)", color: "var(--text-secondary)", cursor: "pointer", fontFamily: "var(--font-body)" }}>{cancelText}</button>
          <button ref={btnRef} onClick={onConfirm} style={{ padding: "8px 16px", borderRadius: "var(--radius-sm, 8px)", fontSize: 13, fontWeight: 500, border: "none", cursor: "pointer", fontFamily: "var(--font-body)", background: isDestructive ? "var(--destructive)" : "var(--accent)", color: "var(--accent-contrast, white)" }}>{confirmText}</button>
        </div>
      </div>
    </div>
  );
}
