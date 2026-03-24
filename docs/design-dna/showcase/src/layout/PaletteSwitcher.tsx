import { useState } from "react";
import { usePalette } from "../context/PaletteContext";
import { PALETTES, PALETTE_NAMES } from "../data/palettes";

const widgetStyles = `
.apex-widget{position:fixed;bottom:24px;left:24px;z-index:200;animation:apex-widget-enter .6s cubic-bezier(0.22,1,0.36,1) backwards;animation-delay:.3s}
@keyframes apex-widget-enter{from{opacity:0;transform:translateY(12px) scale(0.9)}}
.apex-widget-toggle{width:40px;height:40px;border-radius:50%;background:var(--bg-elevated);border:1px solid var(--border);display:flex;align-items:center;justify-content:center;cursor:pointer;color:var(--text-secondary);transition:all .4s cubic-bezier(0.22,1,0.36,1);backdrop-filter:blur(12px);box-shadow:0 4px 16px rgba(0,0,0,0.15)}
.apex-widget-toggle:hover{border-color:var(--accent);color:var(--accent);transform:scale(1.1) rotate(90deg);box-shadow:0 0 20px var(--accent-glow)}
.apex-widget-toggle:active{transform:scale(0.95)}
.apex-widget.open .apex-widget-toggle{border-color:var(--accent);color:var(--accent);transform:rotate(180deg)}
.apex-widget-panel{position:absolute;bottom:52px;left:0;background:var(--bg-elevated);border:1px solid var(--border);border-radius:16px;padding:16px;min-width:230px;backdrop-filter:blur(16px);box-shadow:0 12px 48px rgba(0,0,0,0.25);opacity:0;transform:translateY(10px) scale(0.92);pointer-events:none;transition:all .45s cubic-bezier(0.22,1,0.36,1)}
.apex-widget.open .apex-widget-panel{opacity:1;transform:translateY(0) scale(1);pointer-events:all}
.apex-widget-label{font-size:10px;text-transform:uppercase;letter-spacing:0.08em;color:var(--text-muted);font-weight:500;margin-bottom:8px}
.apex-widget-divider{height:1px;background:var(--border);margin:12px 0}
.pal-dot{width:20px;height:20px;border-radius:50%;border:2px solid transparent;cursor:pointer;transition:all .3s cubic-bezier(0.22,1,0.36,1)}
.pal-dot:hover{transform:scale(1.25);box-shadow:0 0 12px currentColor}
.pal-dot:active{transform:scale(0.9)}
.pal-dot.active{border-color:var(--text);transform:scale(1.15);box-shadow:0 0 8px currentColor}
.mode-btn{background:none;border:1px solid var(--border);border-radius:8px;width:28px;height:28px;display:flex;align-items:center;justify-content:center;cursor:pointer;color:var(--text-muted);transition:all .3s cubic-bezier(0.22,1,0.36,1)}
.mode-btn:hover{border-color:var(--text-muted);color:var(--text);transform:translateY(-1px)}
.mode-btn:active{transform:scale(0.95)}
.mode-btn.active{border-color:var(--accent);color:var(--accent);background:var(--accent-glow)}
`;

export function PaletteSwitcher() {
  const { palette, mode, setPalette, toggleMode } = usePalette();
  const [open, setOpen] = useState(false);

  return (
    <>
      <style>{widgetStyles}</style>
      <div className={`apex-widget${open ? " open" : ""}`}>
        <button
          className="apex-widget-toggle"
          onClick={() => setOpen(!open)}
          aria-label="Design settings"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="12" cy="12" r="3" />
            <path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42" />
          </svg>
        </button>

        <div className="apex-widget-panel">
          {/* Palette */}
          <div style={{ marginBottom: 10 }}>
            <div className="apex-widget-label">Palette</div>
            <div style={{ display: "flex", gap: 6 }}>
              {PALETTE_NAMES.map((name) => (
                <button
                  key={name}
                  className={`pal-dot${palette === name ? " active" : ""}`}
                  title={PALETTES[name].name}
                  style={{ background: PALETTES[name].dark.accent }}
                  onClick={() => setPalette(name)}
                />
              ))}
            </div>
          </div>

          {/* Mode */}
          <div style={{ marginBottom: 0 }}>
            <div className="apex-widget-label">Mode</div>
            <div style={{ display: "flex", gap: 4 }}>
              <button
                className={`mode-btn${mode === "dark" ? " active" : ""}`}
                onClick={() => { if (mode !== "dark") toggleMode(); }}
                title="Dark"
              >
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
                </svg>
              </button>
              <button
                className={`mode-btn${mode === "light" ? " active" : ""}`}
                onClick={() => { if (mode !== "light") toggleMode(); }}
                title="Light"
              >
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="12" cy="12" r="5" />
                  <path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
