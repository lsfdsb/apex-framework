import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { PageShell } from "./PageShell";

describe("PageShell", () => {
  it("renders without crashing", () => {
    const { container } = render(<PageShell>content</PageShell>);
    expect(container.firstChild).toBeTruthy();
  });

  it("renders children in the main content area", () => {
    render(<PageShell>Main page content</PageShell>);
    const main = screen.getByRole("main");
    expect(main).toBeInTheDocument();
    expect(main).toHaveTextContent("Main page content");
  });

  it("renders optional sidebar when provided", () => {
    render(
      <PageShell sidebar={<nav data-testid="sidebar">Sidebar</nav>}>
        content
      </PageShell>
    );
    expect(screen.getByTestId("sidebar")).toBeInTheDocument();
  });

  it("renders optional header when provided", () => {
    render(
      <PageShell header={<header data-testid="app-header">Header</header>}>
        content
      </PageShell>
    );
    expect(screen.getByTestId("app-header")).toBeInTheDocument();
  });

  it("renders optional mobileNav when provided", () => {
    render(
      <PageShell mobileNav={<div data-testid="mobile-nav">Mobile Nav</div>}>
        content
      </PageShell>
    );
    expect(screen.getByTestId("mobile-nav")).toBeInTheDocument();
  });

  it("applies paddingLeft to main when sidebar is provided", () => {
    render(
      <PageShell sidebar={<nav>Sidebar</nav>} sidebarWidth={200}>
        content
      </PageShell>
    );
    const main = screen.getByRole("main");
    expect(main).toHaveStyle({ paddingLeft: "200px" });
  });

  it("applies zero paddingLeft to main when no sidebar", () => {
    render(<PageShell>content</PageShell>);
    const main = screen.getByRole("main");
    expect(main).toHaveStyle({ paddingLeft: "0px" });
  });

  it("uses default sidebarWidth of 56 when sidebar provided without explicit width", () => {
    render(
      <PageShell sidebar={<nav>Sidebar</nav>}>content</PageShell>
    );
    const main = screen.getByRole("main");
    expect(main).toHaveStyle({ paddingLeft: "56px" });
  });

  it("renders all optional slots together with children", () => {
    render(
      <PageShell
        sidebar={<nav data-testid="sidebar">Sidebar</nav>}
        header={<header data-testid="header">Header</header>}
        mobileNav={<div data-testid="mobile-nav">Mobile Nav</div>}
      >
        <p>Child content</p>
      </PageShell>
    );
    expect(screen.getByTestId("sidebar")).toBeInTheDocument();
    expect(screen.getByTestId("header")).toBeInTheDocument();
    expect(screen.getByTestId("mobile-nav")).toBeInTheDocument();
    expect(screen.getByText("Child content")).toBeInTheDocument();
  });
});
