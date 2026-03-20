import { usePalette } from "../context/PaletteContext";
import { PALETTES, PALETTE_NAMES, type PaletteName } from "../data/palettes";

export function PaletteSwitcher() {
  const { palette, mode, setPalette, toggleMode } = usePalette();

  return (
    <div
      className="fixed bottom-4 left-4 z-50 flex items-center gap-2 px-3 py-2 rounded-full backdrop-blur-md"
      style={{ background: "color-mix(in srgb, var(--bg-elevated) 80%, transparent)", border: "1px solid var(--border)" }}
    >
      {PALETTE_NAMES.map((name) => (
        <button
          key={name}
          onClick={() => setPalette(name)}
          title={PALETTES[name].name}
          className="w-5 h-5 rounded-full transition-all"
          style={{
            background: PALETTES[name].dark.accent,
            outline: palette === name ? "2px solid var(--text)" : "none",
            outlineOffset: "2px",
            transform: palette === name ? "scale(1.2)" : "scale(1)",
          }}
        />
      ))}
      <div className="w-px h-4 mx-1" style={{ background: "var(--border)" }} />
      <button
        onClick={toggleMode}
        className="text-sm px-2 py-1 rounded-md transition-colors"
        style={{ color: "var(--text-secondary)" }}
        title={mode === "dark" ? "Switch to light mode" : "Switch to dark mode"}
      >
        {mode === "dark" ? "☀️" : "🌙"}
      </button>
    </div>
  );
}
