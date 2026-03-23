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

export default function App() {
  const hash = useHash();

  const route = TEMPLATE_ROUTES.find((r) => r.path === hash);

  return (
    <PaletteProvider>
      <div className="min-h-screen" style={{ background: "var(--bg)", color: "var(--text)" }}>
        <ShowcaseNav activePath={hash} />
        <div style={{ height: 68 }} /> {/* Spacer for floating nav (44px + 12px top + 12px gap) */}

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
