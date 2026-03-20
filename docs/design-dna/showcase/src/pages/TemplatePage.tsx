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
        className="sticky top-[49px] z-30 flex items-center justify-between px-4 py-2"
        style={{ background: "color-mix(in srgb, var(--bg-surface) 90%, transparent)", borderBottom: "1px solid var(--border)", backdropFilter: "blur(8px)" }}
      >
        <div className="flex items-center gap-3">
          <h2 className="text-sm font-semibold" style={{ color: "var(--text)" }}>{label}</h2>
          <span className="text-xs px-2 py-0.5 rounded-full" style={{ background: "var(--accent-glow)", color: "var(--accent)" }}>
            {defaultPalette}
          </span>
        </div>
        {source && (
          <button
            onClick={() => setShowSource(!showSource)}
            className="text-xs px-3 py-1.5 rounded-md font-medium transition-colors"
            style={{
              background: showSource ? "var(--accent)" : "var(--bg-elevated)",
              color: showSource ? "var(--bg)" : "var(--text-secondary)",
              border: showSource ? "none" : "1px solid var(--border)",
            }}
          >
            {showSource ? "Hide Source" : "View Source"}
          </button>
        )}
      </div>

      {/* Source panel */}
      {showSource && source && (
        <div className="max-w-screen-xl mx-auto p-4">
          <SourceViewer source={source} filename={`${label}.tsx`} />
        </div>
      )}

      {/* Template render */}
      <Suspense fallback={
        <div className="flex items-center justify-center min-h-[60vh]" style={{ color: "var(--text-muted)" }}>
          <p className="text-sm">Forging components...</p>
        </div>
      }>
        <Component />
      </Suspense>
    </div>
  );
}
