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
      {/* Template toolbar — floating pill */}
      <div style={{ display: "flex", justifyContent: "center", padding: "0 24px", marginBottom: 8 }}>
        <div
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 10,
            padding: "6px 6px 6px 16px",
            borderRadius: 999,
            background: "color-mix(in srgb, var(--bg-elevated) 60%, transparent)",
            backdropFilter: "blur(16px) saturate(1.5)",
            WebkitBackdropFilter: "blur(16px) saturate(1.5)",
            border: "1px solid color-mix(in srgb, var(--border) 40%, transparent)",
            transition: "all 0.4s",
          }}
        >
          <span style={{ fontSize: 12, fontWeight: 600, color: "var(--text)", letterSpacing: "-0.01em" }}>{label}</span>
          <span
            style={{
              fontSize: 10,
              padding: "2px 8px",
              borderRadius: 999,
              fontWeight: 500,
              background: "var(--accent-glow)",
              color: "var(--accent)",
            }}
          >
            {defaultPalette}
          </span>
          {source && (
            <button
              onClick={() => setShowSource(!showSource)}
              style={{
                fontSize: 11,
                padding: "4px 12px",
                borderRadius: 999,
                fontWeight: 500,
                transition: "all 0.3s cubic-bezier(0.22,1,0.36,1)",
                cursor: "pointer",
                fontFamily: "'Inter', -apple-system, sans-serif",
                background: showSource ? "var(--accent)" : "transparent",
                color: showSource ? "white" : "var(--text-muted)",
                border: showSource ? "1px solid var(--accent)" : "1px solid color-mix(in srgb, var(--border) 50%, transparent)",
              }}
            >
              {showSource ? "Hide" : "Source"}
            </button>
          )}
        </div>
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
