import { lazy, type ComponentType } from "react";
import { type PaletteName } from "./palettes";

export type RouteCategory = "hub" | "template" | "system";

export interface RouteEntry {
  path: string;
  label: string;
  component: React.LazyExoticComponent<ComponentType>;
  palette: PaletteName;
  category: RouteCategory;
}

export const OPS_ROUTES: RouteEntry[] = [
  { path: "/projects", label: "Projects", component: lazy(() => import("../pages/ProjectsPage")), palette: "saas", category: "hub" },
  { path: "/tasks", label: "Tasks", component: lazy(() => import("../pages/TaskBoardPage")), palette: "saas", category: "hub" },
];

export const NAV_ROUTES: RouteEntry[] = [
  { path: "/about", label: "About", component: lazy(() => import("../pages/AboutPage")), palette: "saas", category: "hub" },
  { path: "/changelog", label: "Changelog", component: lazy(() => import("../pages/ChangelogPage")), palette: "saas", category: "hub" },
];

/** @deprecated use OPS_ROUTES */
export const HUB_ROUTES = OPS_ROUTES;

export const TEMPLATE_ROUTES: RouteEntry[] = [
  { path: "/landing", label: "Landing", component: lazy(() => import("@templates/LandingPage")), palette: "startup", category: "template" },
  { path: "/saas", label: "SaaS", component: lazy(() => import("@templates/SaaSDashboard")), palette: "saas", category: "template" },
  { path: "/crm", label: "CRM", component: lazy(() => import("@templates/CRMPipeline")), palette: "fintech", category: "template" },
  { path: "/blog", label: "Blog", component: lazy(() => import("@templates/BlogLayout")), palette: "editorial", category: "template" },
  { path: "/ecommerce", label: "E-Commerce", component: lazy(() => import("@templates/EcommercePage")), palette: "fintech", category: "template" },
  { path: "/backoffice", label: "Backoffice", component: lazy(() => import("@templates/BackofficePage")), palette: "saas", category: "template" },
  { path: "/portfolio", label: "Portfolio", component: lazy(() => import("@templates/PortfolioPage")), palette: "creative", category: "template" },
  { path: "/lms", label: "LMS & E-Book", component: lazy(() => import("@templates/LMSDashboard")), palette: "creative", category: "template" },
  { path: "/social", label: "Social", component: lazy(() => import("@templates/SocialFeed")), palette: "saas", category: "template" },
  { path: "/email", label: "Email", component: lazy(() => import("@templates/EmailTemplate")), palette: "saas", category: "template" },
  { path: "/presentation", label: "Slides", component: lazy(() => import("@templates/PresentationSlide")), palette: "startup", category: "template" },
  { path: "/design-system", label: "Tokens", component: lazy(() => import("@templates/DesignSystemPage")), palette: "saas", category: "system" },
  { path: "/patterns", label: "Patterns", component: lazy(() => import("@templates/PatternShowcase")), palette: "creative", category: "system" },
  { path: "/animations", label: "Animations", component: lazy(() => import("@templates/AnimationsShowcase")), palette: "creative", category: "system" },
];
