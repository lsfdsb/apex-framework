import { createContext, useContext, useState, useEffect, useCallback, type ReactNode } from "react";
import { type PaletteName, applyPalette } from "../data/palettes";

interface PaletteState {
  palette: PaletteName;
  mode: "dark" | "light";
  setPalette: (name: PaletteName) => void;
  toggleMode: () => void;
}

const PaletteCtx = createContext<PaletteState | null>(null);

export function PaletteProvider({ children }: { children: ReactNode }) {
  const [palette, setPaletteState] = useState<PaletteName>(
    () => (localStorage.getItem("apex-palette") as PaletteName) || "creative",
  );
  const [mode, setMode] = useState<"dark" | "light">(
    () => (localStorage.getItem("apex-theme") as "dark" | "light") || "dark",
  );

  useEffect(() => {
    applyPalette(palette, mode);
  }, [palette, mode]);

  const setPalette = useCallback((name: PaletteName) => setPaletteState(name), []);
  const toggleMode = useCallback(() => setMode((m) => (m === "dark" ? "light" : "dark")), []);

  return <PaletteCtx.Provider value={{ palette, mode, setPalette, toggleMode }}>{children}</PaletteCtx.Provider>;
}

export function usePalette() {
  const ctx = useContext(PaletteCtx);
  if (!ctx) throw new Error("usePalette must be inside PaletteProvider");
  return ctx;
}
