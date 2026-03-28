// Copy this file into your app and customize
// DNA source: docs/design-dna/ — micro-interaction primitives showcase
// Demonstrates all animation primitives from starters/primitives/

import React, { useState, useCallback, useEffect } from 'react';
import { Button } from '../starters/primitives/Button';
import { Input } from '../starters/primitives/Input';
import { Toggle } from '../starters/primitives/Toggle';
import { Tooltip } from '../starters/primitives/Tooltip';
import { AnimatedCheckmark } from '../starters/primitives/AnimatedCheckmark';
import { NotificationDot } from '../starters/primitives/NotificationDot';
import { LoadingSpinner } from '../starters/primitives/LoadingSpinner';
import {
  DnaBackground,
  type DnaPattern,
  type DnaAnimatedBg,
} from '../starters/patterns/DnaBackground';

// ── Reveal hook ─────────────────────────────────────────────
function useReveal() {
  useEffect(() => {
    const els = document.querySelectorAll('.reveal');
    if (!els.length) return;
    const io = new IntersectionObserver(
      (entries) => entries.forEach((e) => e.isIntersecting && e.target.classList.add('visible')),
      { threshold: 0.1 },
    );
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, []);
}

// ── CSS animation keyframes + utility classes ────────────────
const dnaStyles = `
/* Reveal on scroll */
.reveal{opacity:0;transform:translateY(32px) scale(0.98);filter:blur(4px);transition:all .9s cubic-bezier(0.22,1,0.36,1)}
.reveal.visible{opacity:1;transform:none;filter:none}
.reveal-delay-1{transition-delay:.1s}.reveal-delay-2{transition-delay:.2s}.reveal-delay-3{transition-delay:.3s}

/* Glass card with accent top */
.anim-card{background:var(--bg-elevated);border-radius:var(--radius,12px);overflow:hidden}
.anim-card-inner{padding:40px 36px}

/* Ripple */
.ripple-effect{position:absolute;width:40px;height:40px;border-radius:50%;background:rgba(255,255,255,0.3);pointer-events:none;animation:apex-ripple .5s ease-out forwards}
@keyframes apex-ripple{0%{transform:scale(0);opacity:1}100%{transform:scale(6);opacity:0}}

/* Shake */
@keyframes apex-shake{0%,100%{transform:translateX(0)}20%{transform:translateX(-6px)}40%{transform:translateX(6px)}60%{transform:translateX(-4px)}80%{transform:translateX(4px)}}
.shake{animation:apex-shake .4s ease-in-out}

/* Stroke draw for AnimatedCheckmark */
@keyframes apex-stroke-draw{from{stroke-dashoffset:63}to{stroke-dashoffset:0}}
@keyframes apex-checkmark{from{stroke-dashoffset:24}to{stroke-dashoffset:0}}

/* Pulse ring for NotificationDot */
@keyframes apex-pulse-ring{0%{box-shadow:0 0 0 0 rgba(239,68,68,0.5)}100%{box-shadow:0 0 0 8px rgba(239,68,68,0)}}
.pulse-ring{animation:apex-pulse-ring 1.4s ease-out infinite}

/* Spin for LoadingSpinner */
@keyframes apex-spin{to{transform:rotate(360deg)}}

/* CSS animation class demos */
@keyframes apex-pop-in{0%{opacity:0;transform:scale(0.7)}60%{transform:scale(1.06)}100%{opacity:1;transform:scale(1)}}
@keyframes apex-slide-up{from{opacity:0;transform:translateY(24px)}to{opacity:1;transform:translateY(0)}}
@keyframes apex-slide-down{from{opacity:0;transform:translateY(-24px)}to{opacity:1;transform:translateY(0)}}
@keyframes apex-slide-left{from{opacity:0;transform:translateX(24px)}to{opacity:1;transform:translateX(0)}}
@keyframes apex-slide-right{from{opacity:0;transform:translateX(-24px)}to{opacity:1;transform:translateX(0)}}

/* Utility classes */
.pop-in{animation:apex-pop-in .25s var(--ease-spring,cubic-bezier(0.34,1.56,0.64,1)) forwards}
.slide-up{animation:apex-slide-up .3s cubic-bezier(0.22,1,0.36,1) forwards}
.slide-down{animation:apex-slide-down .3s cubic-bezier(0.22,1,0.36,1) forwards}
.slide-left{animation:apex-slide-left .3s cubic-bezier(0.22,1,0.36,1) forwards}
.slide-right{animation:apex-slide-right .3s cubic-bezier(0.22,1,0.36,1) forwards}

/* Responsive grids */
@media(max-width:768px){.anim-grid-2{grid-template-columns:1fr!important}.anim-grid-4{grid-template-columns:repeat(2,1fr)!important}}
@media(max-width:480px){.anim-grid-4{grid-template-columns:1fr!important}}

/* Reduced motion */
@media(prefers-reduced-motion:reduce){
  *,*::before,*::after{animation-duration:.01ms!important;transition-duration:.01ms!important}
  .reveal{opacity:1;transform:none;filter:none}
}
`;

// ── Section header helper ────────────────────────────────────
function SectionLabel({
  label,
  heading,
  description,
}: {
  label: string;
  heading: string;
  description: string;
}) {
  return (
    <div className="reveal" style={{ marginBottom: 40 }}>
      <div
        style={{
          fontSize: 11,
          textTransform: 'uppercase',
          letterSpacing: '0.1em',
          color: 'var(--accent)',
          fontWeight: 600,
          marginBottom: 12,
        }}
      >
        {label}
      </div>
      <h2
        style={{
          fontFamily: 'var(--font-display)',
          fontSize: 'clamp(32px, 5vw, 56px)',
          fontWeight: 400,
          letterSpacing: '-0.03em',
          lineHeight: 1.1,
          marginBottom: 12,
        }}
      >
        {heading}
      </h2>
      <p style={{ fontSize: 16, color: 'var(--text-secondary)', fontWeight: 300, maxWidth: 560 }}>
        {description}
      </p>
    </div>
  );
}

// ── Component path badge ─────────────────────────────────────
function PathBadge({ path }: { path: string }) {
  return (
    <span
      style={{
        fontFamily: 'var(--font-mono, monospace)',
        fontSize: 11,
        color: 'var(--accent)',
        background: 'var(--bg-surface, var(--bg-elevated))',
        padding: '4px 8px',
        borderRadius: 6,
        display: 'inline-block',
        marginTop: 12,
        border: '1px solid var(--border)',
      }}
    >
      {path}
    </span>
  );
}

// ── CSS Animation Demo Card ──────────────────────────────────
function AnimDemoCard({
  animClass,
  label,
  index,
}: {
  animClass: string;
  label: string;
  index: number;
}) {
  const [key, setKey] = useState(0);
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: 12,
        padding: '24px 16px',
        background: 'var(--bg-elevated)',
        border: '1px solid var(--border)',
        borderRadius: 'var(--radius, 12px)',
      }}
    >
      <div
        key={key}
        className={animClass}
        style={{
          width: 56,
          height: 56,
          borderRadius: 'var(--radius-sm, 8px)',
          background: 'var(--accent-glow, rgba(99,107,240,0.12))',
          border: '1px solid var(--border)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <span style={{ fontSize: 22 }}>✦</span>
      </div>
      <code
        style={{
          fontSize: 12,
          color: 'var(--text-secondary)',
          fontFamily: 'var(--font-mono, monospace)',
        }}
      >
        .{animClass}
      </code>
      <button
        onClick={() => setKey((k) => k + 1)}
        style={{
          fontSize: 12,
          fontWeight: 500,
          color: 'var(--text-muted, var(--text-secondary))',
          background: 'none',
          border: '1px solid var(--border)',
          borderRadius: 6,
          padding: '4px 12px',
          cursor: 'pointer',
          transition: 'all .2s',
        }}
      >
        Replay
      </button>
      <span style={{ fontSize: 11, color: 'var(--text-muted, var(--text-secondary))' }}>
        {label}
      </span>
    </div>
  );
}

// ── Main showcase ────────────────────────────────────────────
export default function AnimationsShowcase() {
  useReveal();

  // Input shake state
  const [inputError, setInputError] = useState<string | undefined>(undefined);
  const [errorKey, setErrorKey] = useState(0);

  // Toggle states
  const [toggleDark, setToggleDark] = useState(true);
  const [toggleNotif, setToggleNotif] = useState(false);
  const [toggleSave, setToggleSave] = useState(true);

  // AnimatedCheckmark
  const [checkKey, setCheckKey] = useState(0);
  const [checkVisible, setCheckVisible] = useState(false);

  const handleComplete = useCallback(() => {
    setCheckKey((k) => k + 1);
    setCheckVisible(true);
    setTimeout(() => setCheckVisible(false), 1200);
  }, []);

  // Background picker
  const PATTERN_OPTIONS: DnaPattern[] = [
    'dots',
    'grid',
    'topo',
    'circuit',
    'hexagons',
    'constellation',
    'waves',
    'dna',
  ];
  const ANIMATED_OPTIONS: DnaAnimatedBg[] = [
    'orbs',
    'aurora',
    'particles',
    'gradient',
    'nebula',
    'spotlight',
  ];

  const [selectedPattern, setSelectedPattern] = useState<DnaPattern>('dots');
  const [selectedAnimated, setSelectedAnimated] = useState<DnaAnimatedBg>('orbs');
  const [bgKey, setBgKey] = useState(0);

  // Trigger shake with a new error value on each click
  const triggerShake = useCallback(() => {
    setErrorKey((k) => k + 1);
    setInputError('');
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        setInputError(`Error triggered #${errorKey + 1} — field is invalid`);
      });
    });
  }, [errorKey]);

  const CSS_ANIMATIONS = [
    { animClass: 'pop-in', label: 'Pop in' },
    { animClass: 'shake', label: 'Shake' },
    { animClass: 'slide-up', label: 'Slide up' },
    { animClass: 'slide-down', label: 'Slide down' },
    { animClass: 'slide-left', label: 'Slide left' },
    { animClass: 'slide-right', label: 'Slide right' },
  ];

  return (
    <div style={{ color: 'var(--text)', fontFamily: 'var(--font-body)' }}>
      <style>{dnaStyles}</style>

      {/* ═══ HERO ═══ */}
      <section style={{ padding: '140px 32px 100px', textAlign: 'center' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto' }}>
          <div
            className="reveal"
            style={{
              fontSize: 12,
              textTransform: 'uppercase',
              letterSpacing: '0.1em',
              color: 'var(--accent)',
              fontWeight: 500,
              marginBottom: 16,
            }}
          >
            v5.20 Primitives
          </div>
          <h1
            className="reveal reveal-delay-1"
            style={{
              fontFamily: 'var(--font-display)',
              fontSize: 'clamp(48px, 7vw, 80px)',
              fontWeight: 400,
              letterSpacing: '-0.04em',
              lineHeight: 1,
            }}
          >
            Micro-interactions.
          </h1>
          <p
            className="reveal reveal-delay-2"
            style={{
              fontSize: 20,
              color: 'var(--text-secondary)',
              fontWeight: 300,
              maxWidth: 480,
              margin: '20px auto 0',
              lineHeight: 1.6,
            }}
          >
            Soul over performance. Every animation earns its place.
          </p>
        </div>
      </section>

      {/* ═══ BUTTON RIPPLE ═══ */}
      <section style={{ padding: '100px 32px' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto' }}>
          <SectionLabel
            label="Button"
            heading="Ripple on tap."
            description="Click any button to trigger the ripple effect. Each variant respects your palette's accent color."
          />
          <div className="anim-card reveal">
            <div
              style={{
                height: 2,
                background: 'linear-gradient(90deg, var(--accent), transparent)',
              }}
            />
            <div className="anim-card-inner">
              <div
                className="anim-grid-2"
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(4, 1fr)',
                  gap: 24,
                  alignItems: 'center',
                  justifyItems: 'center',
                }}
              >
                {(['primary', 'ghost', 'accent', 'cta'] as const).map((v) => (
                  <div
                    key={v}
                    style={{
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      gap: 16,
                    }}
                  >
                    <Button variant={v} size="md">
                      {v.charAt(0).toUpperCase() + v.slice(1)}
                    </Button>
                    <code
                      style={{
                        fontSize: 11,
                        color: 'var(--text-muted)',
                        fontFamily: 'var(--font-mono, monospace)',
                      }}
                    >
                      variant="{v}"
                    </code>
                  </div>
                ))}
              </div>
              <PathBadge path="primitives/Button" />
            </div>
          </div>
        </div>
      </section>

      {/* ═══ INPUT FOCUS + SHAKE ═══ */}
      <section style={{ padding: '100px 32px' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto' }}>
          <SectionLabel
            label="Input"
            heading="Focus glow. Shake on error."
            description="Click into the first input to see the focus ring glow. Click the button to inject an error and trigger the shake animation."
          />
          <div
            className="anim-grid-2 reveal"
            style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}
          >
            <div className="anim-card">
              <div
                style={{
                  height: 2,
                  background: 'linear-gradient(90deg, var(--accent), transparent)',
                }}
              />
              <div className="anim-card-inner">
                <p style={{ fontSize: 13, fontWeight: 600, color: 'var(--text)', marginBottom: 4 }}>
                  Focus glow
                </p>
                <p style={{ fontSize: 12, color: 'var(--text-muted)', marginBottom: 20 }}>
                  Click into the field to see the accent ring
                </p>
                <Input label="Email address" placeholder="you@example.com" type="email" />
                <PathBadge path="primitives/Input" />
              </div>
            </div>
            <div className="anim-card">
              <div
                style={{
                  height: 2,
                  background: 'linear-gradient(90deg, transparent, var(--accent))',
                }}
              />
              <div className="anim-card-inner">
                <p style={{ fontSize: 13, fontWeight: 600, color: 'var(--text)', marginBottom: 4 }}>
                  Shake on error
                </p>
                <p style={{ fontSize: 12, color: 'var(--text-muted)', marginBottom: 20 }}>
                  Trigger an error to see the shake animation
                </p>
                <Input
                  key={errorKey}
                  label="Password"
                  placeholder="Enter password"
                  type="password"
                  error={inputError}
                />
                <div style={{ marginTop: 16 }}>
                  <Button variant="ghost" size="sm" onClick={triggerShake}>
                    Trigger error
                  </Button>
                </div>
                <PathBadge path="primitives/Input (error)" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ═══ TOGGLE ═══ */}
      <section style={{ padding: '100px 32px' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto' }}>
          <SectionLabel
            label="Toggle"
            heading="Smooth switch."
            description="Spring-eased thumb travel. Two sizes, all states."
          />
          <div className="anim-card reveal">
            <div
              style={{
                height: 2,
                background: 'linear-gradient(90deg, var(--accent), transparent 60%)',
              }}
            />
            <div className="anim-card-inner">
              <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
                <Toggle checked={toggleDark} onChange={setToggleDark} label="Dark mode" size="md" />
                <Toggle
                  checked={toggleNotif}
                  onChange={setToggleNotif}
                  label="Notifications"
                  size="md"
                />
                <Toggle checked={toggleSave} onChange={setToggleSave} label="Auto-save" size="sm" />
              </div>
              <PathBadge path="primitives/Toggle" />
            </div>
          </div>
        </div>
      </section>

      {/* ═══ TOOLTIP ═══ */}
      <section style={{ padding: '100px 32px' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto' }}>
          <SectionLabel
            label="Tooltip"
            heading="Positioned hints."
            description="Hover each target to reveal the tooltip. Four positions: top, bottom, left, right."
          />
          <div className="anim-card reveal">
            <div
              style={{
                height: 2,
                background: 'linear-gradient(90deg, transparent, var(--accent), transparent)',
              }}
            />
            <div className="anim-card-inner">
              <div
                className="anim-grid-4"
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(4, 1fr)',
                  gap: 32,
                  justifyItems: 'center',
                  alignItems: 'center',
                }}
              >
                {(['top', 'bottom', 'left', 'right'] as const).map((pos) => (
                  <div
                    key={pos}
                    style={{
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      gap: 12,
                    }}
                  >
                    <Tooltip content={`Tooltip ${pos}`} position={pos}>
                      <button
                        style={{
                          padding: '10px 20px',
                          background: 'var(--bg-surface)',
                          border: '1px solid var(--border)',
                          borderRadius: 'var(--radius-sm, 8px)',
                          color: 'var(--text)',
                          fontSize: 14,
                          cursor: 'pointer',
                          transition: 'all .2s',
                        }}
                      >
                        Hover me
                      </button>
                    </Tooltip>
                    <code
                      style={{
                        fontSize: 12,
                        color: 'var(--text-secondary)',
                        fontFamily: 'var(--font-mono, monospace)',
                      }}
                    >
                      position="{pos}"
                    </code>
                  </div>
                ))}
              </div>
              <PathBadge path="primitives/Tooltip" />
            </div>
          </div>
        </div>
      </section>

      {/* ═══ ANIMATED CHECKMARK ═══ */}
      <section style={{ padding: '100px 32px' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto' }}>
          <SectionLabel
            label="Animated Checkmark"
            heading="Stroke-drawn completion."
            description="Circle draws first, then the checkmark strokes in. Re-triggers on every click."
          />
          <div className="anim-card reveal">
            <div
              style={{
                height: 2,
                background:
                  'linear-gradient(90deg, var(--accent), transparent 40%, transparent 60%, var(--accent))',
              }}
            />
            <div
              className="anim-card-inner"
              style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 32 }}
            >
              <div
                style={{
                  minHeight: 64,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                {checkVisible && <AnimatedCheckmark key={checkKey} size={56} />}
                {!checkVisible && (
                  <div
                    style={{
                      width: 56,
                      height: 56,
                      borderRadius: '50%',
                      border: '2px dashed var(--border)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    <span style={{ fontSize: 20, opacity: 0.3 }}>✓</span>
                  </div>
                )}
              </div>
              <Button variant="primary" size="md" onClick={handleComplete}>
                Complete task
              </Button>
              <PathBadge path="primitives/AnimatedCheckmark" />
            </div>
          </div>
        </div>
      </section>

      {/* ═══ NOTIFICATION DOT ═══ */}
      <section style={{ padding: '100px 32px' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto' }}>
          <SectionLabel
            label="Notification Dot"
            heading="Pulsing presence."
            description="Four variants: plain pulse, small count, overflow count, capped at 99+."
          />
          <div className="anim-card reveal">
            <div
              style={{
                height: 2,
                background: 'linear-gradient(90deg, var(--accent), transparent)',
              }}
            />
            <div className="anim-card-inner">
              <div
                className="anim-grid-4"
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(4, 1fr)',
                  gap: 24,
                  justifyItems: 'center',
                  alignItems: 'center',
                }}
              >
                {[
                  { count: undefined, label: 'Pulse only' },
                  { count: 3, label: 'count=3' },
                  { count: 42, label: 'count=42' },
                  { count: 142, label: 'count=99+' },
                ].map((d) => (
                  <div
                    key={d.label}
                    style={{
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      gap: 16,
                    }}
                  >
                    <NotificationDot count={d.count} pulse />
                    <span style={{ fontSize: 12, color: 'var(--text-secondary)' }}>{d.label}</span>
                  </div>
                ))}
              </div>
              <PathBadge path="primitives/NotificationDot" />
            </div>
          </div>
        </div>
      </section>

      {/* ═══ LOADING SPINNER ═══ */}
      <section style={{ padding: '100px 32px' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto' }}>
          <SectionLabel
            label="Loading Spinner"
            heading="Four sizes."
            description="Arc spinner with track. Size prop accepts any pixel value — shown here at 16, 24, 32, and 48."
          />
          <div className="anim-card reveal">
            <div
              style={{
                height: 2,
                background: 'linear-gradient(90deg, transparent, var(--accent))',
              }}
            />
            <div className="anim-card-inner">
              <div
                className="anim-grid-4"
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(4, 1fr)',
                  gap: 24,
                  justifyItems: 'center',
                  alignItems: 'center',
                }}
              >
                {[16, 24, 32, 48].map((size) => (
                  <div
                    key={size}
                    style={{
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      gap: 16,
                    }}
                  >
                    <LoadingSpinner size={size} />
                    <span
                      style={{
                        fontSize: 12,
                        color: 'var(--text-secondary)',
                        fontFamily: 'var(--font-mono, monospace)',
                      }}
                    >
                      {size}px
                    </span>
                  </div>
                ))}
              </div>
              <PathBadge path="primitives/LoadingSpinner" />
            </div>
          </div>
        </div>
      </section>

      {/* ═══ CSS ANIMATION CLASSES ═══ */}
      <section style={{ padding: '100px 32px' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto' }}>
          <SectionLabel
            label="CSS Classes"
            heading="Utility animations."
            description="Global classes you can drop onto any element. Hit Replay to re-trigger the keyframe."
          />
          <div
            className="anim-grid-2 reveal"
            style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16 }}
          >
            {CSS_ANIMATIONS.map((a, i) => (
              <AnimDemoCard key={a.animClass} animClass={a.animClass} label={a.label} index={i} />
            ))}
          </div>
        </div>
      </section>

      {/* ═══ BACKGROUND PICKER ═══ */}
      <section style={{ padding: '100px 32px' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto' }}>
          <SectionLabel
            label="DnaBackground"
            heading="Live background preview."
            description="Choose a static SVG pattern and an animated layer to preview them composited together."
          />

          {/* Controls */}
          <div
            className="reveal"
            style={{ display: 'flex', gap: 16, marginBottom: 24, flexWrap: 'wrap' }}
          >
            <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
              <label style={{ fontSize: 12, color: 'var(--text-secondary)', fontWeight: 500 }}>
                Pattern
              </label>
              <select
                value={selectedPattern}
                onChange={(e) => {
                  setSelectedPattern(e.target.value as DnaPattern);
                  setBgKey((k) => k + 1);
                }}
                style={{
                  padding: '8px 12px',
                  background: 'var(--bg-elevated)',
                  border: '1px solid var(--border)',
                  borderRadius: 'var(--radius-sm, 8px)',
                  color: 'var(--text)',
                  fontSize: 14,
                  cursor: 'pointer',
                  minWidth: 160,
                }}
              >
                {PATTERN_OPTIONS.map((p) => (
                  <option key={p} value={p}>
                    {p}
                  </option>
                ))}
              </select>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
              <label style={{ fontSize: 12, color: 'var(--text-secondary)', fontWeight: 500 }}>
                Animated layer
              </label>
              <select
                value={selectedAnimated}
                onChange={(e) => {
                  setSelectedAnimated(e.target.value as DnaAnimatedBg);
                  setBgKey((k) => k + 1);
                }}
                style={{
                  padding: '8px 12px',
                  background: 'var(--bg-elevated)',
                  border: '1px solid var(--border)',
                  borderRadius: 'var(--radius-sm, 8px)',
                  color: 'var(--text)',
                  fontSize: 14,
                  cursor: 'pointer',
                  minWidth: 160,
                }}
              >
                {ANIMATED_OPTIONS.map((a) => (
                  <option key={a} value={a}>
                    {a}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Preview */}
          <div
            className="reveal"
            style={{
              position: 'relative',
              height: 400,
              borderRadius: 'var(--radius, 12px)',
              border: '1px solid var(--border)',
              overflow: 'hidden',
              background: 'var(--bg-elevated)',
            }}
          >
            <DnaBackground key={bgKey} pattern={selectedPattern} animated={selectedAnimated} />
            {/* Centered label */}
            <div
              style={{
                position: 'absolute',
                inset: 0,
                zIndex: 1,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 8,
              }}
            >
              <span
                style={{
                  fontFamily: 'var(--font-display)',
                  fontSize: 32,
                  fontWeight: 400,
                  letterSpacing: '-0.03em',
                }}
              >
                {selectedPattern} + {selectedAnimated}
              </span>
              <code
                style={{
                  fontSize: 13,
                  color: 'var(--text-secondary)',
                  fontFamily: 'var(--font-mono, monospace)',
                }}
              >
                &lt;DnaBackground pattern="{selectedPattern}" animated="{selectedAnimated}" /&gt;
              </code>
            </div>
          </div>
          <PathBadge path="patterns/DnaBackground" />
        </div>
      </section>
    </div>
  );
}
