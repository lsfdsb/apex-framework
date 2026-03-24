import { describe, it, expect } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { Tabs } from "./Tabs";

const sampleTabs = [
  { id: "alpha", label: "Alpha", content: <p>Alpha content</p> },
  { id: "beta", label: "Beta", content: <p>Beta content</p> },
  { id: "gamma", label: "Gamma", content: <p>Gamma content</p> },
];

describe("Tabs", () => {
  it("renders all tab labels", () => {
    render(<Tabs tabs={sampleTabs} />);
    expect(screen.getByText("Alpha")).toBeInTheDocument();
    expect(screen.getByText("Beta")).toBeInTheDocument();
    expect(screen.getByText("Gamma")).toBeInTheDocument();
  });

  it("renders a tablist with correct role", () => {
    render(<Tabs tabs={sampleTabs} />);
    expect(screen.getByRole("tablist")).toBeInTheDocument();
  });

  it("renders tab buttons with role=tab", () => {
    render(<Tabs tabs={sampleTabs} />);
    const tabs = screen.getAllByRole("tab");
    expect(tabs).toHaveLength(3);
  });

  it("first tab is active by default", () => {
    render(<Tabs tabs={sampleTabs} />);
    const firstTab = screen.getByRole("tab", { name: "Alpha" });
    expect(firstTab).toHaveAttribute("aria-selected", "true");
  });

  it("second and third tabs are not active by default", () => {
    render(<Tabs tabs={sampleTabs} />);
    const betaTab = screen.getByRole("tab", { name: "Beta" });
    const gammaTab = screen.getByRole("tab", { name: "Gamma" });
    expect(betaTab).toHaveAttribute("aria-selected", "false");
    expect(gammaTab).toHaveAttribute("aria-selected", "false");
  });

  it("shows first tab content by default", () => {
    render(<Tabs tabs={sampleTabs} />);
    const firstPanel = screen.getByRole("tabpanel", { hidden: false });
    expect(firstPanel).toBeVisible();
    expect(firstPanel).not.toHaveAttribute("hidden");
  });

  it("hides non-active tab panels", () => {
    render(<Tabs tabs={sampleTabs} />);
    const allPanels = screen.getAllByRole("tabpanel", { hidden: true });
    const hiddenPanels = allPanels.filter((p) => p.hasAttribute("hidden"));
    expect(hiddenPanels).toHaveLength(2);
  });

  it("clicking a tab makes it active", () => {
    render(<Tabs tabs={sampleTabs} />);
    const betaTab = screen.getByRole("tab", { name: "Beta" });
    fireEvent.click(betaTab);
    expect(betaTab).toHaveAttribute("aria-selected", "true");
  });

  it("clicking a tab deactivates the previous tab", () => {
    render(<Tabs tabs={sampleTabs} />);
    fireEvent.click(screen.getByRole("tab", { name: "Beta" }));
    const alphaTab = screen.getByRole("tab", { name: "Alpha" });
    expect(alphaTab).toHaveAttribute("aria-selected", "false");
  });

  it("clicking a tab shows its content panel", () => {
    render(<Tabs tabs={sampleTabs} />);
    fireEvent.click(screen.getByRole("tab", { name: "Beta" }));
    const betaPanel = document.getElementById("panel-beta");
    expect(betaPanel).not.toHaveAttribute("hidden");
  });

  it("clicking a tab hides the previously visible panel", () => {
    render(<Tabs tabs={sampleTabs} />);
    fireEvent.click(screen.getByRole("tab", { name: "Beta" }));
    const alphaPanel = document.getElementById("panel-alpha");
    expect(alphaPanel).toHaveAttribute("hidden");
  });

  it("respects defaultTab prop", () => {
    render(<Tabs tabs={sampleTabs} defaultTab="gamma" />);
    const gammaTab = screen.getByRole("tab", { name: "Gamma" });
    expect(gammaTab).toHaveAttribute("aria-selected", "true");
    const gammaPanel = document.getElementById("panel-gamma");
    expect(gammaPanel).not.toHaveAttribute("hidden");
  });

  it("each tab button has aria-controls pointing to its panel", () => {
    render(<Tabs tabs={sampleTabs} />);
    const alphaTab = screen.getByRole("tab", { name: "Alpha" });
    expect(alphaTab).toHaveAttribute("aria-controls", "panel-alpha");
  });
});
