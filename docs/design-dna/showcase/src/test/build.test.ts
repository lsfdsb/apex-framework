import { describe, it, expect } from "vitest";
import { existsSync } from "node:fs";
import { resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const here = dirname(fileURLToPath(import.meta.url));

describe("build smoke test", () => {
  it("has all route template files", () => {
    const templates = [
      "LandingPage",
      "SaaSDashboard",
      "CRMPipeline",
      "BlogLayout",
      "EcommercePage",
      "BackofficePage",
      "PortfolioPage",
      "LMSDashboard",
      "SocialFeed",
      "EmailTemplate",
      "PresentationSlide",
      "DesignSystemPage",
      "PatternShowcase",
    ];

    const templatesDir = resolve(here, "../../../templates");
    for (const name of templates) {
      expect(existsSync(resolve(templatesDir, `${name}.tsx`)), `Missing template: ${name}.tsx`).toBe(true);
    }
  });

  it("has all starter categories", () => {
    const startersDir = resolve(here, "../../../starters");
    const categories = ["layout", "patterns", "primitives"];
    for (const cat of categories) {
      expect(existsSync(resolve(startersDir, cat)), `Missing starter category: ${cat}`).toBe(true);
    }
  });

  it("has token system files", () => {
    const tokensDir = resolve(here, "../../../tokens");
    const required = ["foundation.css", "animations.css", "index.css", "index.ts"];
    for (const file of required) {
      expect(existsSync(resolve(tokensDir, file)), `Missing token file: ${file}`).toBe(true);
    }
  });
});
