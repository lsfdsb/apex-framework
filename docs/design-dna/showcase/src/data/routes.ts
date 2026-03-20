import { lazy, type ComponentType } from "react";
import { type PaletteName } from "./palettes";

export interface RouteEntry {
  path: string;
  label: string;
  component: React.LazyExoticComponent<ComponentType>;
  palette: PaletteName;
  category: "template" | "system";
}

export const TEMPLATE_ROUTES: RouteEntry[] = [
  { path: "/landing", label: "Landing", component: lazy(() => import("@templates/LandingPage")), palette: "startup", category: "template" },
  { path: "/saas", label: "SaaS", component: lazy(() => import("@templates/SaaSDashboard")), palette: "saas", category: "template" },
  { path: "/crm", label: "CRM", component: lazy(() => import("@templates/CRMPipeline")), palette: "fintech", category: "template" },
  { path: "/blog", label: "Blog", component: lazy(() => import("@templates/BlogLayout")), palette: "editorial", category: "template" },
  { path: "/ecommerce", label: "E-Commerce", component: lazy(() => import("@templates/EcommercePage")), palette: "fintech", category: "template" },
  { path: "/backoffice", label: "Backoffice", component: lazy(() => import("@templates/BackofficePage")), palette: "saas", category: "template" },
  { path: "/portfolio", label: "Portfolio", component: lazy(() => import("@templates/PortfolioPage")), palette: "creative", category: "template" },
  { path: "/lms", label: "LMS", component: lazy(() => import("@templates/LMSDashboard")), palette: "creative", category: "template" },
  { path: "/social", label: "Social", component: lazy(() => import("@templates/SocialFeed")), palette: "saas", category: "template" },
  { path: "/email", label: "Email", component: lazy(() => import("@templates/EmailTemplate")), palette: "saas", category: "template" },
  { path: "/presentation", label: "Slides", component: lazy(() => import("@templates/PresentationSlide")), palette: "startup", category: "template" },
  { path: "/ebook", label: "E-Book", component: lazy(() => import("@templates/EbookPage")), palette: "editorial", category: "template" },
  { path: "/design-system", label: "Tokens", component: lazy(() => import("@templates/DesignSystemPage")), palette: "saas", category: "system" },
  { path: "/patterns", label: "Patterns", component: lazy(() => import("@templates/PatternShowcase")), palette: "creative", category: "system" },
];
