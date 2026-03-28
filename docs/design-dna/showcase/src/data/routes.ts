import { lazy, type ComponentType } from "react";
import { type PaletteName } from "./palettes";

export type RouteCategory = "template" | "system";

export interface RouteEntry {
  path: string;
  label: string;
  component: React.LazyExoticComponent<ComponentType>;
  palette: PaletteName;
  category: RouteCategory;
}

export const TEMPLATE_ROUTES: RouteEntry[] = [
  {
    path: "/design-system",
    label: "Tokens",
    component: lazy(() => import("@templates/DesignSystemPage")),
    palette: "saas",
    category: "system",
  },
  {
    path: "/patterns",
    label: "Patterns",
    component: lazy(() => import("@templates/PatternShowcase")),
    palette: "creative",
    category: "system",
  },
];
