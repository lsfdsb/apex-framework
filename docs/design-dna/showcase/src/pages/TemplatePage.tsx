import { useState, Suspense, useEffect, useRef } from "react";
import { SourceViewer } from "../components/SourceViewer";
import { usePalette } from "../context/PaletteContext";
import { type PaletteName } from "../data/palettes";

interface TemplatePageProps {
  component: React.LazyExoticComponent<React.ComponentType>;
  label: string;
  defaultPalette: PaletteName;
  source?: string;
}

export default function TemplatePage({ component: Component, label, defaultPalette, source }: TemplatePageProps) {
  const [showSource, setShowSource] = useState(false);
  const { setPalette } = usePalette();
  const initialized = useRef(false);

  // Only set palette on first mount or when navigating to a different template
  useEffect(() => {
    if (!initialized.current) {
      setPalette(defaultPalette);
      initialized.current = true;
    }
  }, [defaultPalette, setPalette]);

  // Reset ref when template changes so palette applies on navigation
  useEffect(() => {
    initialized.current = false;
    setPalette(defaultPalette);
    initialized.current = true;
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [defaultPalette]);

  return (
    <div>
      {/* Source panel */}
      {showSource && source && (
        <div className="max-w-screen-xl mx-auto p-6">
          <SourceViewer source={source} filename={`${label}.tsx`} />
        </div>
      )}

      {/* Template render */}
      <Suspense
        fallback={
          <div style={{ display: "flex", alignItems: "center", justifyContent: "center", minHeight: "70vh" }}>
            <div style={{ textAlign: "center" }}>
              <div style={{ width: 48, height: 48, margin: "0 auto 24px", position: "relative" }}>
                <div style={{ position: "absolute", inset: 0, borderRadius: "50%", border: "1px solid var(--border)" }} />
                <div style={{ position: "absolute", inset: -2, borderRadius: "50%", border: "2px solid transparent", borderTopColor: "var(--accent)", animation: "apex-orbit 1.2s cubic-bezier(0.22,1,0.36,1) infinite" }} />
                <div style={{ position: "absolute", inset: 8, borderRadius: "50%", background: "var(--accent)", opacity: 0.15, animation: "apex-pulse 2s ease-in-out infinite" }} />
              </div>
              <p style={{ fontFamily: "'Instrument Serif', Georgia, serif", fontStyle: "italic", fontSize: 16, color: "var(--text-muted)", letterSpacing: "-0.02em" }}>Forging the beskar...</p>
            </div>
          </div>
        }
      >
        <div className="min-h-screen">
          <Component />
        </div>
      </Suspense>

      {/* Floating action — bottom right, minimal */}
      {source && (
        <button
          onClick={() => setShowSource(!showSource)}
          style={{
            position: "fixed",
            bottom: 24,
            right: 24,
            zIndex: 200,
            display: "flex",
            alignItems: "center",
            gap: 6,
            padding: "8px 16px",
            borderRadius: 999,
            fontSize: 12,
            fontWeight: 500,
            fontFamily: "'Inter', -apple-system, sans-serif",
            cursor: "pointer",
            transition: "all 0.4s cubic-bezier(0.22,1,0.36,1)",
            backdropFilter: "blur(12px)",
            WebkitBackdropFilter: "blur(12px)",
            background: showSource ? "var(--accent)" : "color-mix(in srgb, var(--bg-elevated) 75%, transparent)",
            color: showSource ? "white" : "var(--text-secondary)",
            border: showSource ? "1px solid var(--accent)" : "1px solid color-mix(in srgb, var(--text-muted) 20%, transparent)",
            boxShadow: "0 4px 16px rgba(0,0,0,0.15)",
          }}
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <polyline points="16 18 22 12 16 6" /><polyline points="8 6 2 12 8 18" />
          </svg>
          {showSource ? "Hide" : "Source"}
        </button>
      )}
    </div>
  );
}
