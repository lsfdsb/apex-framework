import { describe, it, expect, afterEach } from "vitest";
import { render, screen, act } from "@testing-library/react";
import { useHash, Link } from "./Router";

function HashDisplay() {
  const hash = useHash();
  return <div data-testid="hash">{hash}</div>;
}

describe("useHash", () => {
  afterEach(() => {
    window.location.hash = "";
  });

  it("returns / when no hash is set", () => {
    window.location.hash = "";
    render(<HashDisplay />);
    expect(screen.getByTestId("hash").textContent).toBe("/");
  });

  it("returns the current hash path", () => {
    window.location.hash = "#/landing";
    render(<HashDisplay />);
    expect(screen.getByTestId("hash").textContent).toBe("/landing");
  });

  it("updates when hash changes", () => {
    render(<HashDisplay />);
    act(() => {
      window.location.hash = "#/saas";
      window.dispatchEvent(new HashChangeEvent("hashchange"));
    });
    expect(screen.getByTestId("hash").textContent).toBe("/saas");
  });
});

describe("Link", () => {
  it("renders an anchor with correct href", () => {
    render(<Link to="/crm">CRM Pipeline</Link>);
    const link = screen.getByText("CRM Pipeline");
    expect(link).toBeInTheDocument();
    expect(link).toHaveAttribute("href", "#/crm");
  });

  it("passes className through", () => {
    render(
      <Link to="/blog" className="nav-link">
        Blog
      </Link>,
    );
    expect(screen.getByText("Blog")).toHaveClass("nav-link");
  });
});
