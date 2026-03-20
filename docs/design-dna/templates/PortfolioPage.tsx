// Copy this file into your app and customize
// Visual reference: docs/design-dna/portfolio.html
// DNA palette: bg=var(--bg), accent=var(--accent), typography-driven hero, asymmetric project grid

import React from "react";
import { Header } from "../starters/layout";
import { SectionHeader, Card, Button, Badge } from "../starters/primitives";

// ── Types ─────────────────────────────────────────────────────
interface Project {
  id: string;
  title: string;
  category: string;
  description: string;
  tags: string[];
  year: string;
  featured?: boolean;
}

interface Skill {
  name: string;
  level: number;
}

// ── Sample data ───────────────────────────────────────────────
const sampleProjects: Project[] = [
  {
    id: "pr1",
    title: "Forma — Design System",
    category: "Product Design",
    description:
      "Built a comprehensive design system from scratch for a Series B SaaS company. 120+ components, 5 themes, full a11y compliance.",
    tags: ["Figma", "React", "TypeScript"],
    year: "2026",
    featured: true,
  },
  {
    id: "pr2",
    title: "Relay — Real-time Collaboration",
    category: "Frontend Engineering",
    description:
      "Architected the WebSocket layer and presence system for a document editor used by 80k teams.",
    tags: ["Next.js", "WebSockets", "CRDTs"],
    year: "2025",
    featured: true,
  },
  {
    id: "pr3",
    title: "Beacon — Analytics Dashboard",
    category: "Full-stack",
    description:
      "End-to-end analytics product. Data pipeline, visualization layer, and white-label reporting.",
    tags: ["React", "D3", "Postgres"],
    year: "2025",
  },
  {
    id: "pr4",
    title: "Inkline — Brand Identity",
    category: "Visual Design",
    description:
      "Complete brand identity, illustration system, and motion guidelines for a publishing startup.",
    tags: ["Illustrator", "Motion", "Brand"],
    year: "2024",
  },
];

const sampleSkills: Skill[] = [
  { name: "TypeScript / React", level: 95 },
  { name: "System Design", level: 90 },
  { name: "UI / Design Systems", level: 88 },
  { name: "Performance Optimization", level: 82 },
  { name: "Accessibility (WCAG)", level: 85 },
  { name: "Node.js / APIs", level: 80 },
];

const sampleServices = [
  {
    title: "Product Design",
    description:
      "From information architecture to high-fidelity prototypes that developers can build without a second question.",
  },
  {
    title: "Frontend Engineering",
    description:
      "Production-ready React and Next.js code. Semantic, performant, and accessible by default.",
  },
  {
    title: "Design Systems",
    description:
      "Component libraries that scale. Tokens, documentation, and the culture to keep them alive.",
  },
];

// ── Sub-components ────────────────────────────────────────────
function ProjectCard({ project, large }: { project: Project; large?: boolean }) {
  return (
    <Card hover as="article" className={large ? "lg:col-span-2" : ""}>
      <Card.Thumbnail>
        <div
          className="absolute inset-0 flex items-end p-6"
          style={{
            background: `linear-gradient(135deg, var(--accent-glow) 0%, var(--bg-surface) 100%)`,
          }}
        >
          <span
            className="text-[11px] uppercase tracking-[0.08em] font-medium px-2.5 py-1 rounded-full"
            style={{ background: "var(--bg-elevated)", color: "var(--text-muted)" }}
          >
            {project.year}
          </span>
        </div>
      </Card.Thumbnail>
      <Card.Body>
        <p className="text-[11px] uppercase tracking-[0.1em] mb-1.5" style={{ color: "var(--accent)" }}>
          {project.category}
        </p>
        <h3
          className="tracking-[-0.02em] mb-2"
          style={{
            fontSize: large ? "22px" : "17px",
            fontWeight: 500,
            color: "var(--text)",
            fontFamily: "var(--font-display)",
          }}
        >
          {project.title}
        </h3>
        <p
          className="text-[14px] leading-relaxed mb-4"
          style={{ color: "var(--text-secondary)" }}
        >
          {project.description}
        </p>
        <div className="flex flex-wrap gap-1.5">
          {project.tags.map((tag) => (
            <Badge key={tag} variant="default">
              {tag}
            </Badge>
          ))}
        </div>
      </Card.Body>
      <Card.Footer>
        <a
          href={`#project-${project.id}`}
          className="text-[13px] font-medium transition-opacity hover:opacity-70"
          style={{ color: "var(--accent)", textDecoration: "none" }}
        >
          View case study →
        </a>
      </Card.Footer>
    </Card>
  );
}

function SkillBar({ skill }: { skill: Skill }) {
  return (
    <div>
      <div className="flex justify-between items-center mb-1.5">
        <span className="text-[13px] font-medium" style={{ color: "var(--text)" }}>
          {skill.name}
        </span>
        <span className="text-[12px]" style={{ color: "var(--text-muted)" }}>
          {skill.level}%
        </span>
      </div>
      <div
        className="h-1.5 rounded-full overflow-hidden"
        style={{ background: "var(--bg-surface)" }}
      >
        <div
          className="h-full rounded-full"
          style={{ width: `${skill.level}%`, background: "var(--accent)" }}
        />
      </div>
    </div>
  );
}

// ── Page ──────────────────────────────────────────────────────
export default function PortfolioPage() {
  return (
    <div className="apex-enter" style={{ background: "var(--bg)", color: "var(--text)" }}>
      <Header
        logo={
          <span className="text-[14px] font-semibold tracking-[-0.01em]" style={{ color: "var(--text)" }}>
            Jona Doe
          </span>
        }
        links={[
          { label: "Work", href: "#work", active: true },
          { label: "About", href: "#about" },
          { label: "Services", href: "#services" },
        ]}
        actions={
          <Button variant="ghost" size="sm" href="#contact">
            Get in touch
          </Button>
        }
      />

      {/* Hero — large type, asymmetric layout */}
      <section id="main-content" className="px-6 py-24 sm:py-36">
        <div className="max-w-5xl mx-auto grid lg:grid-cols-[1fr_340px] gap-12 items-end">
          <div>
            <p
              className="text-[12px] uppercase tracking-[0.12em] font-medium mb-6"
              style={{ color: "var(--accent)" }}
            >
              Product designer & engineer
            </p>
            <h1
              className="text-[clamp(48px,7vw,80px)] font-normal leading-none tracking-[-0.04em] mb-8"
              style={{ fontFamily: "var(--font-display)", color: "var(--text)" }}
            >
              Jona Doe.
              <br />
              <em className="not-italic" style={{ color: "var(--text-secondary)" }}>
                I build digital things
              </em>
              <br />
              that{" "}
              <em className="not-italic" style={{ color: "var(--accent)" }}>
                matter.
              </em>
            </h1>
            <div className="flex gap-4">
              <Button variant="primary" href="#work">
                View my work
              </Button>
              <Button variant="ghost" href="#contact">
                Contact me
              </Button>
            </div>
          </div>
          <div className="hidden lg:flex flex-col gap-4">
            <div
              className="rounded-[var(--radius)] p-6 border"
              style={{ background: "var(--bg-elevated)", borderColor: "var(--border)" }}
            >
              <p className="text-[11px] uppercase tracking-[0.08em] mb-1" style={{ color: "var(--text-muted)" }}>
                Years of experience
              </p>
              <p
                className="text-[48px] font-bold tracking-[-0.04em] leading-none"
                style={{ color: "var(--text)" }}
              >
                8+
              </p>
            </div>
            <div
              className="rounded-[var(--radius)] p-6 border"
              style={{ background: "var(--bg-elevated)", borderColor: "var(--border)" }}
            >
              <p className="text-[11px] uppercase tracking-[0.08em] mb-1" style={{ color: "var(--text-muted)" }}>
                Projects shipped
              </p>
              <p
                className="text-[48px] font-bold tracking-[-0.04em] leading-none"
                style={{ color: "var(--accent)" }}
              >
                42
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Selected work */}
      <section id="work" className="px-6 py-16 sm:py-24">
        <div className="max-w-5xl mx-auto">
          <SectionHeader
            label="Selected work"
            title="Projects that shaped me."
            subtitle="A selection of recent client and personal work."
          />
          {/* Asymmetric grid: featured items span 2 columns */}
          <div className="grid lg:grid-cols-2 gap-6">
            {sampleProjects.map((project) => (
              <ProjectCard key={project.id} project={project} large={project.featured} />
            ))}
          </div>
        </div>
      </section>

      {/* Services */}
      <section
        id="services"
        className="px-6 py-16 sm:py-24"
        style={{ background: "var(--bg-elevated)", borderTop: "1px solid var(--border)", borderBottom: "1px solid var(--border)" }}
      >
        <div className="max-w-5xl mx-auto">
          <SectionHeader
            label="Services"
            title="What I do."
            align="center"
          />
          <div className="grid sm:grid-cols-3 gap-6">
            {sampleServices.map((s) => (
              <div key={s.title} className="text-center">
                <h3 className="text-[17px] font-medium mb-3 tracking-[-0.02em]" style={{ color: "var(--text)" }}>
                  {s.title}
                </h3>
                <p className="text-[14px] leading-relaxed" style={{ color: "var(--text-secondary)" }}>
                  {s.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* About + Skills */}
      <section id="about" className="px-6 py-16 sm:py-24">
        <div className="max-w-5xl mx-auto grid lg:grid-cols-2 gap-16 items-start">
          <div>
            <SectionHeader label="About" title="A bit about me." />
            <div className="space-y-4 text-[15px] leading-relaxed" style={{ color: "var(--text-secondary)" }}>
              <p>
                I&apos;m a product designer and frontend engineer based in São Paulo. I&apos;ve spent the last
                eight years building digital products for startups and scale-ups — from zero to launch
                and from launch to millions of users.
              </p>
              <p>
                I believe the best products are built by people who can think in both systems and pixels.
                I care deeply about accessibility, performance, and the details nobody notices consciously.
              </p>
              <p>
                When I&apos;m not building things, I write about design and engineering on my journal.
              </p>
            </div>
            <div className="mt-8">
              <Button variant="ghost" href="#contact">
                Let&apos;s work together →
              </Button>
            </div>
          </div>
          <div>
            <h3 className="text-[13px] uppercase tracking-[0.1em] mb-6" style={{ color: "var(--text-muted)" }}>
              Skills
            </h3>
            <div className="space-y-4">
              {sampleSkills.map((skill) => (
                <SkillBar key={skill.name} skill={skill} />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Contact CTA */}
      <section
        id="contact"
        className="px-6 py-20 text-center border-t"
        style={{ borderColor: "var(--border)" }}
      >
        <div className="max-w-xl mx-auto">
          <h2
            className="text-[clamp(32px,5vw,52px)] font-normal tracking-[-0.04em] leading-tight mb-4"
            style={{ fontFamily: "var(--font-display)", color: "var(--text)" }}
          >
            Ready to build something{" "}
            <em className="not-italic" style={{ color: "var(--accent)" }}>
              great?
            </em>
          </h2>
          <p className="text-[16px] font-light mb-8" style={{ color: "var(--text-secondary)" }}>
            I take on a limited number of new projects each quarter.
          </p>
          <Button variant="primary" size="lg" href="mailto:hello@example.com">
            Say hello →
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t px-6 py-10" style={{ borderColor: "var(--border)" }}>
        <div className="max-w-5xl mx-auto flex flex-col sm:flex-row justify-between items-center gap-4">
          <span className="text-[14px] font-semibold">Jona Doe</span>
          <p className="text-[12px]" style={{ color: "var(--text-muted)" }}>
            &copy; {new Date().getFullYear()} · Crafted with care.
          </p>
        </div>
      </footer>
    </div>
  );
}
