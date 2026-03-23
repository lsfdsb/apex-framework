// Copy this file into your app and customize
// DNA source: docs/design-dna/social.html
// Palette: bg=#08080a, elevated=#111114, accent=#636bf0, font=Inter + Instrument Serif
// Self-contained — zero imports from starters/

import React, { useState, useEffect } from "react";

// --- CSS injected once ---

const STYLES = `
  @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&family=Instrument+Serif:ital@0;1&display=swap');
  :root{
    --bg:#08080a;--bg-elevated:#111114;--bg-surface:#19191d;
    --border:#222228;--border-hover:#33333a;
    --text:#ececf0;--text-secondary:#8a8a96;--text-muted:#55555e;
    --accent:#636bf0;--accent-hover:#5158d4;--accent-glow:rgba(99,107,240,0.12);
    --radius:12px;--radius-sm:8px;
    --font-body:'Inter',-apple-system,sans-serif;
    --font-display:'Instrument Serif',Georgia,serif;
  }
  .sf-root{font-family:var(--font-body);background:var(--bg);color:var(--text);-webkit-font-smoothing:antialiased;min-height:100vh}
  .reveal{opacity:0;transform:translateY(32px) scale(0.98);filter:blur(4px);transition:all 0.9s cubic-bezier(0.22,1,0.36,1)}
  .reveal.visible{opacity:1;transform:none;filter:none}
  .reveal-d1{transition-delay:0.1s}.reveal-d2{transition-delay:0.2s}.reveal-d3{transition-delay:0.3s}
  .sf-post{background:var(--bg-elevated);border:1px solid var(--border);border-radius:var(--radius);padding:20px;transition:border-color 0.3s}
  .sf-post:hover{border-color:var(--border-hover)}
  .sf-action{font-size:13px;color:var(--text-muted);cursor:pointer;display:flex;align-items:center;gap:6px;background:none;border:none;font-family:var(--font-body);padding:0;transition:color 0.2s}
  .sf-action:hover{color:var(--accent)}
  .sf-action.liked{color:var(--accent)}
  .sf-follow{font-size:11px;padding:4px 12px;border:1px solid var(--accent);border-radius:999px;background:none;color:var(--accent);cursor:pointer;font-family:var(--font-body);transition:all 0.2s}
  .sf-follow:hover,.sf-follow.following{background:var(--accent);color:#fff}
  .sf-trending-item{padding:10px 0;border-bottom:1px solid var(--border);cursor:pointer;transition:color 0.2s}
  .sf-trending-item:last-child{border:none}
  .sf-trending-item:hover{color:var(--accent)}
  .sf-comment-input{flex:1;padding:8px 14px;background:var(--bg);border:1px solid var(--border);border-radius:999px;color:var(--text);font-size:13px;font-family:var(--font-body);outline:none;transition:border-color 0.2s}
  .sf-comment-input:focus{border-color:var(--accent)}
  @media(max-width:900px){.sf-feed-grid{grid-template-columns:1fr!important}.sf-feed-grid>aside{display:none}}
  @media(prefers-reduced-motion:reduce){.reveal{opacity:1;transform:none;filter:none}}
`;

// --- Reveal hook ---

function useReveal() {
  useEffect(() => {
    const els = document.querySelectorAll<HTMLElement>(".reveal");
    const obs = new IntersectionObserver(
      (entries) => entries.forEach((e) => { if (e.isIntersecting) e.target.classList.add("visible"); }),
      { threshold: 0.1 }
    );
    els.forEach((el) => obs.observe(el));
    return () => obs.disconnect();
  }, []);
}

// --- Inline avatar (initials) ---

function Av({ name, size }: { name: string; size: number }) {
  const initials = name.split(" ").map((w) => w[0]).join("").slice(0, 2).toUpperCase();
  return (
    <div
      aria-hidden="true"
      style={{
        width: size, height: size, borderRadius: "50%",
        background: "var(--accent-glow)", border: "1px solid var(--border)",
        display: "flex", alignItems: "center", justifyContent: "center",
        fontSize: Math.round(size * 0.3), fontWeight: 600,
        color: "var(--accent)", flexShrink: 0,
      }}
    >
      {initials}
    </div>
  );
}

// --- Data ---

interface Post { id: string; author: string; time: string; content: string; hasImage?: boolean; likes: number; replies: number; }
interface TrendItem { tag: string; topic: string; count: string; }
interface SugUser { name: string; role: string; }

const POSTS: Post[] = [
  { id: "1", author: "Marcus Chen", time: "2 hours ago", content: "Just shipped the new analytics dashboard. The team pulled off something incredible in just 3 weeks. Typography-first design, zero clutter. This is what focus looks like.", hasImage: true, likes: 142, replies: 28 },
  { id: "2", author: "Julia Park", time: "5 hours ago", content: "Hot take: the best design systems don't have documentation pages. They have examples that are so good you don't need documentation.", likes: 89, replies: 15 },
  { id: "3", author: "David Lee", time: "Yesterday", content: "Reduced our landing page from 47 components to 12. Conversion went up 23%. Subtraction is the hardest skill in design.", likes: 234, replies: 41 },
];

const TRENDING: TrendItem[] = [
  { tag: "Design", topic: "Design Systems in 2026", count: "1.2K posts" },
  { tag: "Engineering", topic: "Next.js 16 Release", count: "834 posts" },
  { tag: "Product", topic: "AI-First Interfaces", count: "567 posts" },
];

const SUGGESTED: SugUser[] = [
  { name: "Lucas Bueno", role: "Framework creator" },
  { name: "Claude", role: "AI pair programmer" },
];

// --- PostCard ---

function PostCard({ post }: { post: Post }) {
  const [liked, setLiked] = useState(false);
  const [comment, setComment] = useState("");

  return (
    <article className="sf-post">
      <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 12 }}>
        <Av name={post.author} size={36} />
        <div>
          <div style={{ fontSize: 14, fontWeight: 500 }}>{post.author}</div>
          <div style={{ fontSize: 12, color: "var(--text-muted)" }}>{post.time}</div>
        </div>
      </div>
      <p style={{ fontSize: 15, lineHeight: 1.7, color: "var(--text-secondary)", marginBottom: 16 }}>
        {post.content}
      </p>
      {post.hasImage && (
        <div style={{ aspectRatio: "16/9", background: "var(--bg-surface)", borderRadius: "var(--radius-sm)", marginBottom: 16, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 12, color: "var(--text-muted)" }}>
          Screenshot
        </div>
      )}
      <div style={{ display: "flex", gap: 24, paddingTop: 12, borderTop: "1px solid var(--border)" }}>
        <button className={`sf-action${liked ? " liked" : ""}`} onClick={() => setLiked(!liked)} aria-label="Like post">
          {liked ? "♥" : "♡"} {post.likes + (liked ? 1 : 0)}
        </button>
        <button className="sf-action" aria-label="View comments">💬 {post.replies}</button>
        <button className="sf-action" aria-label="Share post">↗ Share</button>
      </div>
      {post.id === "1" && (
        <div style={{ marginTop: 12, paddingTop: 16, borderTop: "1px solid var(--border)" }}>
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            {[{ author: "Julia Park", text: "This is gorgeous. The spacing alone tells me how much thought went into it.", time: "1h ago" },
              { author: "Ana Souza", text: "The type hierarchy is perfect. Instrument Serif was the right call.", time: "45m ago" }]
              .map((c, i) => (
                <div key={i} style={{ display: "flex", gap: 10 }}>
                  <Av name={c.author} size={28} />
                  <div>
                    <div style={{ fontSize: 13, fontWeight: 500 }}>{c.author}</div>
                    <div style={{ fontSize: 13, color: "var(--text-secondary)", lineHeight: 1.5 }}>{c.text}</div>
                    <div style={{ fontSize: 11, color: "var(--text-muted)", marginTop: 2 }}>{c.time}</div>
                  </div>
                </div>
              ))}
          </div>
          <div style={{ display: "flex", gap: 8, marginTop: 12 }}>
            <input className="sf-comment-input" value={comment} onChange={(e) => setComment(e.target.value)} placeholder="Write a comment..." aria-label="Write a comment" />
          </div>
        </div>
      )}
    </article>
  );
}

// --- ProfileSidebar ---

function ProfileSidebar() {
  return (
    <div style={{ background: "var(--bg-elevated)", border: "1px solid var(--border)", borderRadius: "var(--radius)", overflow: "hidden", marginBottom: 16 }}>
      <div style={{ height: 80, background: "linear-gradient(135deg, var(--accent-glow), var(--bg-surface))" }} aria-hidden="true" />
      <div style={{ padding: "0 20px 20px", marginTop: -28 }}>
        <div style={{ width: 56, height: 56, borderRadius: "50%", background: "var(--bg-elevated)", border: "3px solid var(--bg-elevated)", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 10 }}>
          <svg viewBox="0 0 24 24" width={24} height={24} stroke="var(--accent)" fill="none" strokeWidth={1.5} aria-hidden="true">
            <circle cx="12" cy="8" r="4" /><path d="M20 21a8 8 0 0 0-16 0" />
          </svg>
        </div>
        <div style={{ fontSize: 16, fontWeight: 600, letterSpacing: "-0.01em" }}>Ana Souza</div>
        <div style={{ fontSize: 13, color: "var(--text-muted)", marginBottom: 12 }}>@anasouza</div>
        <div style={{ fontSize: 13, color: "var(--text-secondary)", lineHeight: 1.5, marginBottom: 12 }}>
          Product designer. Building beautiful things in São Paulo.
        </div>
        <div style={{ display: "flex", gap: 16 }}>
          {([["847", "Posts"], ["12.4K", "Followers"], ["342", "Following"]] as [string, string][]).map(([n, l]) => (
            <div key={l} style={{ textAlign: "center" }}>
              <div style={{ fontSize: 16, fontWeight: 700 }}>{n}</div>
              <div style={{ fontSize: 10, color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.05em" }}>{l}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// --- TrendingSidebar ---

function TrendingSidebar() {
  const [following, setFollowing] = useState<Set<string>>(new Set());
  const toggle = (name: string) => setFollowing((prev) => { const s = new Set(prev); s.has(name) ? s.delete(name) : s.add(name); return s; });

  return (
    <>
      <div style={{ background: "var(--bg-elevated)", border: "1px solid var(--border)", borderRadius: "var(--radius)", padding: 20 }}>
        <h3 style={{ fontSize: 14, fontWeight: 600, marginBottom: 16 }}>Trending</h3>
        {TRENDING.map((item) => (
          <div key={item.topic} className="sf-trending-item">
            <div style={{ fontSize: 12, color: "var(--text-muted)" }}>{item.tag}</div>
            <div style={{ fontSize: 14, fontWeight: 500 }}>{item.topic}</div>
            <div style={{ fontSize: 11, color: "var(--text-muted)" }}>{item.count}</div>
          </div>
        ))}
      </div>
      <div style={{ background: "var(--bg-elevated)", border: "1px solid var(--border)", borderRadius: "var(--radius)", padding: 20, marginTop: 16 }}>
        <h3 style={{ fontSize: 14, fontWeight: 600, marginBottom: 16 }}>Suggested</h3>
        {SUGGESTED.map((user) => (
          <div key={user.name} style={{ display: "flex", alignItems: "center", gap: 10, padding: "8px 0" }}>
            <Av name={user.name} size={32} />
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontSize: 13, fontWeight: 500 }}>{user.name}</div>
              <div style={{ fontSize: 11, color: "var(--text-muted)" }}>{user.role}</div>
            </div>
            <button
              className={`sf-follow${following.has(user.name) ? " following" : ""}`}
              onClick={() => toggle(user.name)}
              aria-label={`${following.has(user.name) ? "Unfollow" : "Follow"} ${user.name}`}
            >
              {following.has(user.name) ? "Following" : "Follow"}
            </button>
          </div>
        ))}
      </div>
    </>
  );
}

// --- Page ---

export default function SocialFeed() {
  useReveal();

  return (
    <div className="sf-root">
      <style>{STYLES}</style>

      {/* Hero */}
      <section style={{ paddingTop: 140, paddingBottom: 0, textAlign: "center", paddingLeft: 32, paddingRight: 32 }}>
        <div style={{ maxWidth: 1200, margin: "0 auto" }}>
          <div className="reveal" style={{ fontSize: 11, textTransform: "uppercase", letterSpacing: "0.12em", color: "var(--accent)", fontWeight: 500, marginBottom: 16 }}>
            Social + Community
          </div>
          <h1 className="reveal reveal-d1" style={{ fontFamily: "var(--font-display)", fontSize: "clamp(48px,7vw,80px)", fontWeight: 400, letterSpacing: "-0.04em", lineHeight: 1 }}>
            Conversations<br />
            with <em style={{ fontStyle: "italic", color: "var(--accent)" }}>context.</em>
          </h1>
          <p className="reveal reveal-d2" style={{ fontSize: 18, color: "var(--text-secondary)", fontWeight: 300, maxWidth: 440, margin: "20px auto 0" }}>
            Feeds, profiles, comments, trending. Social patterns that feel human.
          </p>
        </div>
      </section>

      {/* Feed */}
      <section style={{ padding: "64px 32px 100px" }}>
        <div className="sf-feed-grid reveal reveal-d3" style={{ maxWidth: 1000, margin: "0 auto", display: "grid", gridTemplateColumns: "280px 1fr 280px", gap: 24 }}>
          {/* Left sidebar */}
          <aside style={{ position: "sticky", top: 80, alignSelf: "start" }}>
            <ProfileSidebar />
          </aside>

          {/* Main feed */}
          <main aria-label="Feed" style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            {POSTS.map((post) => <PostCard key={post.id} post={post} />)}
          </main>

          {/* Right sidebar */}
          <aside style={{ position: "sticky", top: 80, alignSelf: "start" }}>
            <TrendingSidebar />
          </aside>
        </div>

      </section>
    </div>
  );
}
