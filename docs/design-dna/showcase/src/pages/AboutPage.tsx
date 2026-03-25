import { Heart, MapPin, Rocket, Shield, Users, Sparkles } from "lucide-react";
import { Card } from "@starters/primitives/Card";
import { Badge } from "@starters/primitives/Badge";

type BadgeVariant = "default" | "success" | "warning" | "error" | "info" | "accent";

const VALUES = [
  { icon: <Shield size={20} />, title: "Quality is Non-Negotiable", text: "7-phase QA gate. Security scanning. Accessibility audits. CX reviews. Nothing ships without passing every gate." },
  { icon: <Users size={20} />, title: "The Framework Teaches", text: "Every action explains what and why. Users don't just build — they learn software engineering principles along the way." },
  { icon: <Rocket size={20} />, title: "Autonomous by Default", text: "3 user decisions. Everything else is autonomous. 5 agents coordinate, quality gates auto-fix, documentation writes itself." },
  { icon: <Sparkles size={20} />, title: "Apple-Grade Polish", text: "The last 10% is the other 90%. Truncated text, stale versions, dead references — these are quality failures, not nitpicks." },
] as const;

const AGENT_BADGES: Array<{ label: string; variant: BadgeVariant }> = [
  { label: "PM", variant: "accent" },
  { label: "Architect", variant: "info" },
  { label: "Builder", variant: "warning" },
  { label: "QA", variant: "success" },
  { label: "Technical Writer", variant: "default" },
];

export default function AboutPage() {
  return (
    <div style={{ maxWidth: 720, margin: "0 auto", padding: "48px 24px 80px" }}>
      {/* Header */}
      <div style={{ marginBottom: 48 }}>
        <div style={{ fontSize: 12, fontWeight: 600, color: "var(--accent)", letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: 12 }}>
          The Story
        </div>
        <h1 style={{ fontFamily: "var(--font-display)", fontStyle: "italic", fontSize: 36, fontWeight: 400, color: "var(--text)", letterSpacing: "-0.02em", marginBottom: 16 }}>
          About APEX Framework
        </h1>
        <p style={{ fontSize: 16, color: "var(--text-secondary)", lineHeight: 1.7 }}>
          Agent-Powered EXcellence for Claude Code.
        </p>
      </div>

      {/* Origin — wrapped in Card */}
      <Card hover={false}>
        <Card.Body>
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 16, color: "var(--text-muted)", fontSize: 13 }}>
            <MapPin size={14} />
            São Paulo, Brazil · 2026
          </div>
          <p style={{ fontSize: 15, color: "var(--text-secondary)", lineHeight: 1.8, marginBottom: 16 }}>
            APEX started as a question: <em style={{ color: "var(--text)", fontFamily: "var(--font-display)" }}>"What if AI didn't just write code — but built software the way Apple builds products?"</em>
          </p>
          <p style={{ fontSize: 15, color: "var(--text-secondary)", lineHeight: 1.8, marginBottom: 16 }}>
            Product vision like Jobs. Design like Ive. Code like Torvalds and Dean. Security like Ionescu and Rutkowska. Business like Amodei. Experience like Disney.
          </p>
          <p style={{ fontSize: 15, color: "var(--text-secondary)", lineHeight: 1.8, marginBottom: 20 }}>
            Built by <strong style={{ color: "var(--text)" }}>Bueno & Claude</strong>, APEX is a complete framework for Claude Code that enforces quality at every step — from PRD to production. 22 skills, 5 specialized agents, 14 hooks, and a 7-phase autonomous pipeline that turns "build me X" into shipped, tested, documented code.
          </p>
          {/* Agent badges */}
          <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
            {AGENT_BADGES.map((b) => (
              <Badge key={b.label} variant={b.variant} size="md">{b.label}</Badge>
            ))}
          </div>
        </Card.Body>
      </Card>

      {/* Vision */}
      <div style={{ margin: "40px 0 32px" }}>
        <h2 style={{ fontFamily: "var(--font-body)", fontSize: 22, fontWeight: 700, color: "var(--text)", letterSpacing: "-0.02em", marginBottom: 8 }}>
          Our Vision
        </h2>
        <p style={{ fontSize: 15, color: "var(--text-secondary)", lineHeight: 1.7 }}>
          Make AI-assisted development indistinguishable from a world-class engineering team. Not faster coding — better software. Every app built with APEX should feel like it was made by a team that cares about every detail.
        </p>
      </div>

      {/* Values — wrapped in Card */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: 16, marginBottom: 48 }}>
        {VALUES.map((v) => (
          <Card key={v.title}>
            <Card.Body>
              <div style={{ color: "var(--accent)", marginBottom: 12, display: "flex" }}>{v.icon}</div>
              <h3 style={{ fontSize: 14, fontWeight: 700, color: "var(--text)", marginBottom: 8, fontFamily: "var(--font-body)" }}>
                {v.title}
              </h3>
              <p style={{ fontSize: 13, color: "var(--text-secondary)", lineHeight: 1.6 }}>
                {v.text}
              </p>
            </Card.Body>
          </Card>
        ))}
      </div>

      {/* The Creed */}
      <div style={{ textAlign: "center", padding: "32px 0", borderTop: "1px solid var(--border)" }}>
        <p style={{
          fontFamily: "var(--font-display)", fontStyle: "italic",
          fontSize: 18, color: "var(--text-muted)", lineHeight: 1.8,
          maxWidth: 500, margin: "0 auto 12px",
        }}>
          "Never ship untested code. Never skip the PRD. Never break the build. Weapons are part of my religion."
        </p>
        <p style={{ fontSize: 12, color: "var(--accent)", letterSpacing: "0.06em", fontWeight: 600 }}>
          This is the Way.
        </p>
        <div style={{ display: "flex", justifyContent: "center", alignItems: "center", gap: 6, marginTop: 24, color: "var(--text-muted)", fontSize: 13 }}>
          <Heart size={14} style={{ color: "var(--destructive)" }} />
          Forged by Bueno & Claude · São Paulo · 2026
        </div>
      </div>
    </div>
  );
}
