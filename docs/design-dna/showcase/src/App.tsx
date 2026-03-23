import { Suspense } from "react";
import { PaletteProvider } from "./context/PaletteContext";
import { useHash } from "./router/Router";
import { ShowcaseNav } from "./layout/ShowcaseNav";
import { PaletteSwitcher } from "./layout/PaletteSwitcher";
import { TEMPLATE_ROUTES } from "./data/routes";
import HomePage from "./pages/HomePage";
import TemplatePage from "./pages/TemplatePage";

// Raw source imports for each template (always in sync with rendered component)
const SOURCES: Record<string, string> = {};
const rawModules = import.meta.glob("../../templates/*.tsx", { query: "?raw", import: "default", eager: true });
for (const [path, source] of Object.entries(rawModules)) {
  const name = path.split("/").pop()?.replace(".tsx", "") ?? "";
  SOURCES[name] = source as string;
}

function AnimatedBackground() {
  return (
    <div className="bg-canvas" aria-hidden="true">
      <div className="orb orb-1" />
      <div className="orb orb-2" />
      <div className="orb orb-3" />
      <svg className="grid-overlay" viewBox="0 0 1200 800" preserveAspectRatio="xMidYMid slice">
        <defs>
          <pattern id="grid" width="60" height="60" patternUnits="userSpaceOnUse">
            <path d="M 60 0 L 0 0 0 60" fill="none" stroke="currentColor" strokeWidth="0.5" />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#grid)" />
        <circle cx="180" cy="120" r="2" className="node node-1" />
        <circle cx="420" cy="200" r="1.5" className="node node-2" />
        <circle cx="700" cy="150" r="2" className="node node-3" />
        <circle cx="950" cy="280" r="1.5" className="node node-4" />
        <circle cx="300" cy="400" r="2" className="node node-2" />
        <circle cx="600" cy="500" r="1.5" className="node node-1" />
        <circle cx="850" cy="450" r="2" className="node node-3" />
      </svg>
    </div>
  );
}

export default function App() {
  const hash = useHash();

  const route = TEMPLATE_ROUTES.find((r) => r.path === hash);

  return (
    <PaletteProvider>
      <div className="min-h-screen" style={{ background: "var(--bg)", color: "var(--text)" }}>
        <AnimatedBackground />
        <ShowcaseNav activePath={hash} />
        <div style={{ height: 56 }} />

        <div style={{ position: "relative", zIndex: 1 }}>
          {hash === "/" ? (
            <HomePage />
          ) : route ? (
            <Suspense fallback={
              <div className="flex items-center justify-center min-h-[60vh]" style={{ color: "var(--text-muted)" }}>
                <p className="text-sm">Forging components...</p>
              </div>
            }>
              <TemplatePage
                component={route.component}
                label={route.label}
                defaultPalette={route.palette}
                source={SOURCES[getTemplateName(route.path)]}
              />
            </Suspense>
          ) : (
            <div className="flex items-center justify-center min-h-[60vh]" style={{ color: "var(--text-muted)" }}>
              <p className="text-sm">Route not found. <a href="#/" style={{ color: "var(--accent)" }}>Go home</a></p>
            </div>
          )}
        </div>

        <PaletteSwitcher />
      </div>
    </PaletteProvider>
  );
}

function getTemplateName(path: string): string {
  const map: Record<string, string> = {
    "/landing": "LandingPage",
    "/saas": "SaaSDashboard",
    "/crm": "CRMPipeline",
    "/blog": "BlogLayout",
    "/ecommerce": "EcommercePage",
    "/backoffice": "BackofficePage",
    "/portfolio": "PortfolioPage",
    "/lms": "LMSDashboard",
    "/social": "SocialFeed",
    "/email": "EmailTemplate",
    "/presentation": "PresentationSlide",
    "/ebook": "EbookPage",
    "/design-system": "DesignSystemPage",
    "/patterns": "PatternShowcase",
  };
  return map[path] ?? "";
}
