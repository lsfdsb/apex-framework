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
      <div className="nav-glass sticky top-[49px] z-30 flex items-center justify-between px-6 py-3">
        <div className="flex items-center gap-3">
          <h2 className="text-sm font-semibold" style={{ color: "var(--text)" }}>{label}</h2>
          <span
            className="text-xs px-2.5 py-1 rounded-full font-medium"
            style={{ background: "var(--accent-glow)", color: "var(--accent)" }}
          >
            {defaultPalette}
          </span>
        </div>
        {source && (
          <button
            onClick={() => setShowSource(!showSource)}
            className="text-xs px-4 py-2 rounded-lg font-medium transition-all"
            style={{
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
