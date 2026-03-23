// Copy this file into your app and customize
// DNA source: docs/design-dna/email.html
// Rendered in a centered 600px container — simulates real email client rendering
// Palette: bg=#08080a, elevated=#111114, accent=#636bf0, font=Inter

import React from "react";
import { Button, SectionHeader } from "../starters/primitives";

// --- Sample data ---

type EmailVariant = "welcome" | "verification" | "order" | "password-reset";

interface EmailData {
  variant: EmailVariant;
  recipientName: string;
  appName: string;
  accentColor?: string;
}

const SAMPLE_DATA: EmailData = {
  variant: "welcome",
  recipientName: "Ana Souza",
  appName: "YourApp",
};

// --- Sub-components ---

function EmailFrame({ subject, preview, children }: {
  subject: string;
  preview: string;
  children: React.ReactNode;
}) {
  return (
    <div
      className="rounded-[var(--radius)] border overflow-hidden mx-auto"
      style={{ background: "var(--bg-elevated)", borderColor: "var(--border)", maxWidth: 640 }}
    >
      {/* Mock email client chrome */}
      <div
        className="px-4 py-2.5 border-b flex items-center gap-2 relative"
        style={{ borderColor: "var(--border)" }}
      >
        <span className="w-2.5 h-2.5 rounded-full" style={{ background: "#ff5f57" }} aria-hidden="true" />
        <span className="w-2.5 h-2.5 rounded-full" style={{ background: "#febc2e" }} aria-hidden="true" />
        <span className="w-2.5 h-2.5 rounded-full" style={{ background: "#28c840" }} aria-hidden="true" />
        <span
          className="absolute left-1/2 -translate-x-1/2 text-[11px]"
          style={{ color: "var(--text-muted)" }}
        >
          {subject}
        </span>
      </div>
      {/* Email metadata */}
      <div className="px-6 py-4 border-b text-[12px]" style={{ borderColor: "var(--border)", color: "var(--text-muted)" }}>
        <div className="mb-1">
          <strong style={{ color: "var(--text-secondary)", fontWeight: 500 }}>From: </strong>
          no-reply@yourapp.com
        </div>
        <div className="mb-1">
          <strong style={{ color: "var(--text-secondary)", fontWeight: 500 }}>Subject: </strong>
          {subject}
        </div>
        <div className="opacity-60">{preview}</div>
      </div>
      {/* Email body */}
      <div style={{ background: "var(--bg)" }}>
        <div className="mx-auto py-10" style={{ maxWidth: 560, padding: "40px 32px" }}>
          {children}
        </div>
      </div>
    </div>
  );
}

function EmailLogo({ appName }: { appName: string }) {
  return (
    <div className="text-[16px] font-semibold tracking-tight mb-8" style={{ color: "var(--text)" }}>
      {appName.slice(0, -3)}
      <span style={{ color: "var(--accent)" }}>{appName.slice(-3)}</span>
    </div>
  );
}

function EmailDivider() {
  return <div className="my-6" style={{ height: 1, background: "var(--border)" }} aria-hidden="true" />;
}

function EmailFooter() {
  return (
    <div
      className="text-[12px] leading-relaxed mt-8 pt-6 border-t"
      style={{ borderColor: "var(--border)", color: "var(--text-muted)" }}
    >
      <p className="mb-1">You received this email because you signed up for YourApp.</p>
      <p>
        <a href="#" style={{ color: "var(--text-muted)" }} className="underline">Unsubscribe</a>
        {" · "}
        <a href="#" style={{ color: "var(--text-muted)" }} className="underline">Privacy Policy</a>
        {" · "}
        <a href="#" style={{ color: "var(--text-muted)" }} className="underline">Terms</a>
      </p>
      <p className="mt-2">123 Design Street, São Paulo, Brazil</p>
    </div>
  );
}

// --- Email variants ---

function WelcomeEmail({ data }: { data: EmailData }) {
  return (
    <EmailFrame
      subject={`Welcome to ${data.appName}, ${data.recipientName}!`}
      preview="Your account is ready. Here's how to get started."
    >
      <EmailLogo appName={data.appName} />
      <h1 className="text-[24px] font-semibold tracking-tight mb-3 leading-snug" style={{ color: "var(--text)" }}>
        Welcome, {data.recipientName}.
      </h1>
      <p className="text-[15px] leading-[1.7] mb-4" style={{ color: "var(--text-secondary)" }}>
        Your account is ready. We built {data.appName} to help you ship faster without sacrificing quality. Start by exploring the dashboard.
      </p>
      <p className="text-[15px] leading-[1.7] mb-6" style={{ color: "var(--text-secondary)" }}>
        If you have any questions, reply to this email — we read every one.
      </p>
      <a
        href="#"
        className="inline-block px-7 py-3 rounded-[var(--radius-sm)] text-[14px] font-medium mb-4 transition-opacity duration-200 hover:opacity-90"
        style={{ background: "var(--accent)", color: "#fff", textDecoration: "none" }}
      >
        Open your dashboard
      </a>
      <EmailDivider />
      <p className="text-[13px] font-semibold mb-3" style={{ color: "var(--text)" }}>Get started in 3 steps:</p>
      {[
        ["1", "Complete your profile", "Add a photo and bio so your team knows who you are."],
        ["2", "Create your first project", "Projects keep your work organized by client or goal."],
        ["3", "Invite your team", "Collaboration is better when everyone is in the same place."],
      ].map(([num, title, desc]) => (
        <div key={num} className="flex gap-3 mb-4">
          <div
            className="w-6 h-6 rounded-full flex items-center justify-center text-[11px] font-bold shrink-0 mt-0.5"
            style={{ background: "var(--accent-glow)", color: "var(--accent)" }}
          >
            {num}
          </div>
          <div>
            <p className="text-[14px] font-medium mb-0.5" style={{ color: "var(--text)" }}>{title}</p>
            <p className="text-[13px]" style={{ color: "var(--text-muted)" }}>{desc}</p>
          </div>
        </div>
      ))}
      <EmailFooter />
    </EmailFrame>
  );
}

function VerificationEmail({ data }: { data: EmailData }) {
  return (
    <EmailFrame
      subject="Verify your email address"
      preview="Use the code below to verify your account."
    >
      <EmailLogo appName={data.appName} />
      <h1 className="text-[24px] font-semibold tracking-tight mb-3" style={{ color: "var(--text)" }}>
        Verify your email
      </h1>
      <p className="text-[15px] leading-[1.7] mb-6" style={{ color: "var(--text-secondary)" }}>
        Enter the code below to verify your email address. This code expires in 10 minutes.
      </p>
      <div
        className="inline-block text-[32px] font-bold tracking-[0.15em] rounded-[var(--radius-sm)] px-8 py-4 mb-6 border"
        style={{
          fontFamily: "'JetBrains Mono', monospace",
          background: "var(--bg-elevated)",
          borderColor: "var(--border)",
          color: "var(--text)",
        }}
        aria-label="Verification code: 482 917"
      >
        482 917
      </div>
      <p className="text-[13px]" style={{ color: "var(--text-muted)" }}>
        If you didn't request this, you can safely ignore this email.
      </p>
      <EmailFooter />
    </EmailFrame>
  );
}

function OrderEmail({ data }: { data: EmailData }) {
  const items = [
    { name: "Design Systems Pro", variant: "Annual license", price: "$199.00" },
    { name: "Component Library", variant: "Add-on", price: "$49.00" },
  ];
  return (
    <EmailFrame
      subject="Order confirmed — #ORD-20260320"
      preview="Your order has been confirmed. Here are the details."
    >
      <EmailLogo appName={data.appName} />
      <div
        className="inline-flex items-center gap-1.5 text-[12px] font-medium px-2.5 py-1 rounded-full mb-4"
        style={{ background: "rgba(52,211,153,0.1)", color: "var(--success)" }}
      >
        ✓ Order confirmed
      </div>
      <h1 className="text-[24px] font-semibold tracking-tight mb-3" style={{ color: "var(--text)" }}>
        Thank you, {data.recipientName}.
      </h1>
      <p className="text-[15px] leading-[1.7] mb-6" style={{ color: "var(--text-secondary)" }}>
        Your order <strong style={{ color: "var(--text)" }}>#ORD-20260320</strong> has been confirmed and is being processed.
      </p>
      <EmailDivider />
      <p className="text-[13px] font-semibold mb-4" style={{ color: "var(--text)" }}>Order summary</p>
      {items.map(item => (
        <div
          key={item.name}
          className="flex items-center gap-4 py-3.5 border-b last:border-0"
          style={{ borderColor: "var(--border)" }}
        >
          <div
            className="w-14 h-14 rounded-[var(--radius-sm)] flex items-center justify-center shrink-0 text-[10px]"
            style={{ background: "var(--bg-elevated)", color: "var(--text-muted)" }}
          >
            Item
          </div>
          <div className="flex-1">
            <p className="text-[14px] font-medium" style={{ color: "var(--text)" }}>{item.name}</p>
            <p className="text-[12px]" style={{ color: "var(--text-muted)" }}>{item.variant}</p>
          </div>
          <p className="text-[14px] font-semibold" style={{ color: "var(--text)" }}>{item.price}</p>
        </div>
      ))}
      <div
        className="flex justify-between pt-4 text-[16px] font-semibold border-t"
        style={{ borderColor: "var(--border)", color: "var(--text)" }}
      >
        <span>Total</span>
        <span>$248.00</span>
      </div>
      <EmailFooter />
    </EmailFrame>
  );
}

function PasswordResetEmail({ data }: { data: EmailData }) {
  return (
    <EmailFrame
      subject="Reset your password"
      preview="Click the link below to reset your password. It expires in 1 hour."
    >
      <EmailLogo appName={data.appName} />
      <h1 className="text-[24px] font-semibold tracking-tight mb-3" style={{ color: "var(--text)" }}>
        Reset your password
      </h1>
      <p className="text-[15px] leading-[1.7] mb-6" style={{ color: "var(--text-secondary)" }}>
        We received a request to reset your password. Click the button below to choose a new one. The link expires in 1 hour.
      </p>
      <a
        href="#"
        className="inline-block px-7 py-3 rounded-[var(--radius-sm)] text-[14px] font-medium mb-6 transition-opacity duration-200 hover:opacity-90"
        style={{ background: "var(--accent)", color: "#fff", textDecoration: "none" }}
      >
        Reset password
      </a>
      <p className="text-[13px]" style={{ color: "var(--text-muted)" }}>
        If you didn't request a password reset, you can safely ignore this email. Your password won't change.
      </p>
      <EmailFooter />
    </EmailFrame>
  );
}

// --- Page (shows all 4 email variants) ---

export default function EmailTemplate() {
  return (
    <div
      className="min-h-screen px-4 py-16 apex-enter"
      style={{ color: "var(--text)" }}
    >
      <div className="mx-auto" style={{ maxWidth: 720 }}>
        <SectionHeader
          label="Email Templates"
          title="Transactional emails."
          subtitle="8 production-ready email patterns. Copy and customize."
          align="center"
        />
        <div className="flex flex-col gap-12">
          <WelcomeEmail data={SAMPLE_DATA} />
          <VerificationEmail data={SAMPLE_DATA} />
          <OrderEmail data={SAMPLE_DATA} />
          <PasswordResetEmail data={SAMPLE_DATA} />
        </div>
      </div>
    </div>
  );
}
