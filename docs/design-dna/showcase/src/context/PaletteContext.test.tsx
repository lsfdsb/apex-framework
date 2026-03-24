import { describe, it, expect, beforeEach } from "vitest";
import { render, screen, act } from "@testing-library/react";
import { PaletteProvider, usePalette } from "./PaletteContext";

function PaletteDisplay() {
  const { palette, mode, setPalette, toggleMode } = usePalette();
  return (
    <div>
      <span data-testid="palette">{palette}</span>
      <span data-testid="mode">{mode}</span>
      <button onClick={() => setPalette("fintech")}>set fintech</button>
      <button onClick={toggleMode}>toggle mode</button>
    </div>
  );
}

describe("PaletteContext", () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it("provides default palette and dark mode", () => {
    render(
      <PaletteProvider>
        <PaletteDisplay />
      </PaletteProvider>,
    );
    expect(screen.getByTestId("palette").textContent).toBe("creative");
    expect(screen.getByTestId("mode").textContent).toBe("dark");
  });

  it("allows changing palette", () => {
    render(
      <PaletteProvider>
        <PaletteDisplay />
      </PaletteProvider>,
    );
    act(() => {
      screen.getByText("set fintech").click();
    });
    expect(screen.getByTestId("palette").textContent).toBe("fintech");
  });

  it("toggles between dark and light mode", () => {
    render(
      <PaletteProvider>
        <PaletteDisplay />
      </PaletteProvider>,
    );
    act(() => {
      screen.getByText("toggle mode").click();
    });
    expect(screen.getByTestId("mode").textContent).toBe("light");
  });

  it("throws when used outside PaletteProvider", () => {
    expect(() => render(<PaletteDisplay />)).toThrow("usePalette must be inside PaletteProvider");
  });
});
