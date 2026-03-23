import { useState, Suspense, useEffect } from "react";
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

  useEffect(() => {
    setPalette(defaultPalette);
  }, [defaultPalette, setPalette]);

  return (
    <div>
      {/* Template toolbar */}
      <div
        style={{
          position: "sticky",
          top: 52,
          zIndex: 30,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "8px 24px",
          background: "var(--nav-bg, rgba(6,6,10,0.6))",
          backdropFilter: "blur(20px) saturate(1.4)",
          borderBottom: "1px solid var(--border)",
          transition: "background 0.4s, border-color 0.4s",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <h2 style={{ fontSize: 13, fontWeight: 600, color: "var(--text)" }}>{label}</h2>
          <span
            style={{
              fontSize: 11,
              padding: "2px 8px",
              borderRadius: 999,
              fontWeight: 500,
              background: "var(--accent-glow)",
              color: "var(--accent)",
            }}
          >
            {defaultPalette}
          </span>
        </div>
        {source && (
          <button
            onClick={() => setShowSource(!showSource)}
            style={{
              fontSize: 12,
              padding: "5px 14px",
              borderRadius: 8,
              fontWeight: 500,
              transition: "all 0.25s",
              cursor: "pointer",
              fontFamily: "'Inter', -apple-system, sans-serif",
              background: showSource ? "var(--accent)" : "transparent",
              color: showSource ? "var(--bg)" : "var(--text-secondary)",
              border: `1px solid ${showSource ? "var(--accent)" : "var(--border)"}`,
            }}
          >
            {showSource ? "Hide Source" : "View Source"}
          </button>
        )}
      </div>

      {/* Source panel */}
      {showSource && source && (
        <div className="max-w-screen-xl mx-auto p-6">
          <SourceViewer source={source} filename={`${label}.tsx`} />
        </div>
      )}

      {/* Template render — full width, proper padding */}
      <Suspense
        fallback={
          <div className="flex items-center justify-center min-h-[60vh]" style={{ color: "var(--text-muted)" }}>
            <div className="text-center">
              <div
                className="w-8 h-8 rounded-full mx-auto mb-3"
                style={{ border: "2px solid var(--border)", borderTopColor: "var(--accent)", animation: "spin 0.8s linear infinite" }}
              />
              <p className="text-sm" style={{ fontFamily: "Instrument Serif, serif", fontStyle: "italic" }}>Forging the beskar...</p>
            </div>
          </div>
        }
      >
        <div className="min-h-screen">
          <Component />
        </div>
      </Suspense>
    </div>
  );
}
