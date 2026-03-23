// Copy this file into your app and customize
// DNA source: docs/design-dna/social.html
// Palette: bg=#08080a, elevated=#111114, accent=#636bf0, font=Inter + Instrument Serif

import React, { useState, useEffect } from "react";
import { Header } from "../starters/layout";
import { Card, Button, Badge, Input, Avatar } from "../starters/primitives";

// --- Reveal animation hook ---

function useReveal() {
  useEffect(() => {
    const els = document.querySelectorAll<HTMLElement>(".reveal");
    const observer = new IntersectionObserver(
      (entries) => entries.forEach((e) => { if (e.isIntersecting) e.target.classList.add("visible"); }),
      { threshold: 0.1 }
    );
    els.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);
}

// --- Sample data ---

interface Post {
  id: string;
  author: string;
  handle: string;
  time: string;
  content: string;
  hasImage?: boolean;
  likes: number;
  comments: number;
}

interface Comment {
  author: string;
  text: string;
  time: string;
}

interface TrendingItem {
  tag: string;
  topic: string;
  count: string;
}

interface SuggestedUser {
  name: string;
  handle: string;
  role: string;
}

const SAMPLE_POSTS: Post[] = [
  {
    id: "1",
    author: "Marcus Chen",
    handle: "@marcuschen",
    time: "2 hours ago",
    content:
      "Just shipped the new analytics dashboard. The team pulled off something incredible in just 3 weeks. Typography-first design, zero clutter. This is what focus looks like.",
    hasImage: true,
    likes: 142,
    comments: 28,
  },
  {
    id: "2",
    author: "Julia Park",
    handle: "@juliapark",
    time: "5 hours ago",
    content:
      "Hot take: the best design systems don't have documentation pages. They have examples that are so good you don't need documentation.",
    likes: 89,
    comments: 15,
  },
  {
    id: "3",
    author: "David Lee",
    handle: "@davidlee",
    time: "Yesterday",
    content:
      "Reduced our landing page from 47 components to 12. Conversion went up 23%. Subtraction is the hardest skill in design.",
    likes: 234,
    comments: 41,
  },
];

const SAMPLE_COMMENTS: Comment[] = [
  { author: "Julia Park", text: "This is gorgeous. The spacing alone tells me how much thought went into it.", time: "1h ago" },
  { author: "Ana Souza", text: "The type hierarchy is perfect. Instrument Serif was the right call.", time: "45m ago" },
];

const TRENDING: TrendingItem[] = [
  { tag: "Design", topic: "Design Systems in 2026", count: "1.2K posts" },
  { tag: "Engineering", topic: "Next.js 16 Release", count: "834 posts" },
  { tag: "Product", topic: "AI-First Interfaces", count: "567 posts" },
];

const SUGGESTED: SuggestedUser[] = [
  { name: "Lucas Bueno", handle: "@lucasbueno", role: "Framework creator" },
  { name: "Claude", handle: "@claude", role: "AI pair programmer" },
];

// --- Sub-components ---

function PostCard({ post }: { post: Post }) {
  const [liked, setLiked] = useState(false);
  const [commentText, setCommentText] = useState("");

  return (
    <article
      className="rounded-[var(--radius)] border p-5 transition-colors duration-300"
      style={{ background: "var(--bg-elevated)", borderColor: "var(--border)" }}
    >
      <div className="flex items-center gap-2.5 mb-3">
        <Avatar name={post.author} size={36} />
        <div>
          <p className="text-[14px] font-medium" style={{ color: "var(--text)" }}>{post.author}</p>
          <p className="text-[12px]" style={{ color: "var(--text-muted)" }}>{post.time}</p>
        </div>
      </div>
      <p className="text-[15px] leading-[1.7] mb-4" style={{ color: "var(--text-secondary)" }}>
        {post.content}
      </p>
      {post.hasImage && (
        <div
          className="aspect-video rounded-[var(--radius-sm)] mb-4 flex items-center justify-center text-[12px]"
          style={{ background: "var(--bg-surface)", color: "var(--text-muted)" }}
        >
          Image placeholder
        </div>
      )}
      <div
        className="flex gap-6 pt-3 border-t text-[13px]"
        style={{ borderColor: "var(--border)", color: "var(--text-muted)" }}
      >
        <button
          onClick={() => setLiked(!liked)}
          className="flex items-center gap-1.5 transition-colors duration-200 hover:text-[var(--accent)]"
          style={{ color: liked ? "var(--accent)" : "var(--text-muted)" }}
          aria-label="Like post"
        >
          {liked ? "♥" : "♡"} {post.likes + (liked ? 1 : 0)}
        </button>
        <button
          className="flex items-center gap-1.5 transition-colors duration-200 hover:text-[var(--accent)]"
          aria-label="View comments"
        >
          💬 {post.comments}
        </button>
        <button
          className="flex items-center gap-1.5 transition-colors duration-200 hover:text-[var(--accent)]"
          aria-label="Share post"
        >
          ↗ Share
        </button>
      </div>
      {post.id === "1" && (
        <div
          className="mt-3 pt-3 border-t flex flex-col gap-3"
          style={{ borderColor: "var(--border)" }}
        >
          {SAMPLE_COMMENTS.map((c, i) => (
            <div key={i} className="flex gap-2.5">
              <Avatar name={c.author} size={28} />
              <div>
                <p className="text-[13px] font-medium" style={{ color: "var(--text)" }}>{c.author}</p>
                <p className="text-[13px]" style={{ color: "var(--text-secondary)" }}>{c.text}</p>
                <p className="text-[11px] mt-0.5" style={{ color: "var(--text-muted)" }}>{c.time}</p>
              </div>
            </div>
          ))}
          <div className="flex gap-2 mt-1">
            <input
              value={commentText}
              onChange={e => setCommentText(e.target.value)}
              placeholder="Write a comment..."
              className="flex-1 px-3.5 py-2 rounded-full text-[13px] outline-none transition-colors duration-200"
              style={{
                background: "var(--bg)",
                border: "1px solid var(--border)",
                color: "var(--text)",
              }}
              aria-label="Comment input"
            />
          </div>
        </div>
      )}
    </article>
  );
}

function ProfileSidebar() {
  return (
    <Card hover={false}>
      <div
        className="h-20"
        style={{ background: "linear-gradient(135deg, var(--accent-glow), var(--bg-surface))" }}
        aria-hidden="true"
      />
      <Card.Body>
        <div style={{ marginTop: "-28px" }}>
          <Avatar name="Ana Souza" size={56} />
        </div>
        <p className="text-[16px] font-semibold mt-2.5" style={{ color: "var(--text)" }}>Ana Souza</p>
        <p className="text-[13px] mb-3" style={{ color: "var(--text-muted)" }}>@anasouza</p>
        <p className="text-[13px] leading-relaxed mb-3" style={{ color: "var(--text-secondary)" }}>
          Product designer. Building beautiful things in São Paulo.
        </p>
        <div className="flex gap-4">
          {([["847", "Posts"], ["12.4K", "Followers"], ["342", "Following"]] as [string, string][]).map(([n, l]) => (
            <div key={l} className="text-center">
              <p className="text-[16px] font-bold" style={{ color: "var(--text)" }}>{n}</p>
              <p className="text-[10px] uppercase tracking-[0.05em]" style={{ color: "var(--text-muted)" }}>{l}</p>
            </div>
          ))}
        </div>
      </Card.Body>
    </Card>
  );
}

function TrendingSidebar() {
  return (
    <>
      <Card hover={false}>
        <Card.Body>
          <h3 className="text-[14px] font-semibold mb-4" style={{ color: "var(--text)" }}>Trending</h3>
          {TRENDING.map((item, i) => (
            <div
              key={i}
              className="py-2.5 border-b last:border-0 cursor-pointer transition-colors duration-200 hover:text-[var(--accent)]"
              style={{ borderColor: "var(--border)" }}
            >
              <p className="text-[12px]" style={{ color: "var(--text-muted)" }}>{item.tag}</p>
              <p className="text-[14px] font-medium">{item.topic}</p>
              <p className="text-[11px]" style={{ color: "var(--text-muted)" }}>{item.count}</p>
            </div>
          ))}
        </Card.Body>
      </Card>
      <Card hover={false} className="mt-4">
        <Card.Body>
          <h3 className="text-[14px] font-semibold mb-4" style={{ color: "var(--text)" }}>Suggested</h3>
          {SUGGESTED.map((user) => (
            <div key={user.handle} className="flex items-center gap-2.5 py-2">
              <Avatar name={user.name} size={32} />
              <div className="flex-1 min-w-0">
                <p className="text-[13px] font-medium truncate" style={{ color: "var(--text)" }}>{user.name}</p>
                <p className="text-[11px]" style={{ color: "var(--text-muted)" }}>{user.role}</p>
              </div>
              <Button variant="ghost" size="sm">Follow</Button>
            </div>
          ))}
        </Card.Body>
      </Card>
    </>
  );
}

// --- Create post input ---

function CreatePost() {
  const [text, setText] = useState("");
  return (
    <div
      className="rounded-[var(--radius)] border p-4 mb-4"
      style={{ background: "var(--bg-elevated)", borderColor: "var(--border)" }}
    >
      <div className="flex gap-3 items-start">
        <Avatar name="Ana Souza" size={36} />
        <div className="flex-1">
          <textarea
            value={text}
            onChange={e => setText(e.target.value)}
            placeholder="What's on your mind?"
            rows={3}
            className="w-full resize-none text-[14px] outline-none rounded-[var(--radius-sm)] p-2.5 placeholder:opacity-40"
            style={{ background: "var(--bg)", border: "1px solid var(--border)", color: "var(--text)" }}
            aria-label="Create post"
          />
          <div className="flex justify-end mt-2">
            <Button size="sm" disabled={!text.trim()}>Post</Button>
          </div>
        </div>
      </div>
    </div>
  );
}

// --- Page ---

export default function SocialFeed() {
  useReveal();

  return (
    <div className="min-h-screen apex-enter" style={{ color: "var(--text)" }}>
      <style>{`
        .reveal{opacity:0;transform:translateY(32px) scale(0.98);filter:blur(4px);transition:all 0.9s cubic-bezier(0.22,1,0.36,1)}
        .reveal.visible{opacity:1;transform:none;filter:none}
        .reveal-delay-1{transition-delay:0.1s}
        .reveal-delay-2{transition-delay:0.2s}
        .reveal-delay-3{transition-delay:0.3s}
        @media(prefers-reduced-motion:reduce){.reveal{opacity:1;transform:none;filter:none}}
      `}</style>
      <Header
        logo={<span className="text-[15px] font-semibold tracking-tight">Social</span>}
        actions={<Button size="sm">Sign in</Button>}
      />
      <section style={{ paddingTop: 140, paddingBottom: 0, textAlign: "center", paddingLeft: 32, paddingRight: 32 }}>
        <div style={{ maxWidth: 1200, margin: "0 auto" }}>
          <div
            className="reveal"
            style={{ fontSize: 11, textTransform: "uppercase", letterSpacing: "0.12em", color: "var(--accent)", fontWeight: 500, marginBottom: 16 }}
          >
            Social + Community
          </div>
          <h1
            className="reveal reveal-delay-1"
            style={{ fontFamily: "var(--font-display)", fontSize: "clamp(48px,7vw,80px)", fontWeight: 400, letterSpacing: "-0.04em", lineHeight: 1 }}
          >
            Conversations<br />
            with <em style={{ fontStyle: "italic", color: "var(--accent)" }}>context.</em>
          </h1>
          <p
            className="reveal reveal-delay-2"
            style={{ fontSize: 18, color: "var(--text-secondary)", fontWeight: 300, maxWidth: 440, margin: "20px auto 0" }}
          >
            Feeds, profiles, comments, trending. Social patterns that feel human.
          </p>
        </div>
      </section>
      <main className="px-4 pb-16 pt-16">
        <div className="mx-auto" style={{ maxWidth: 1000 }}>
          {/* 3-col feed layout — left sidebar hidden on mobile */}
          <div className="hidden lg:grid gap-6 reveal reveal-delay-3" style={{ gridTemplateColumns: "280px 1fr 280px" }}>
            <aside className="sticky top-24 self-start">
              <ProfileSidebar />
            </aside>
            <section aria-label="Feed">
              <CreatePost />
              <div className="flex flex-col gap-4">
                {SAMPLE_POSTS.map(post => <PostCard key={post.id} post={post} />)}
              </div>
            </section>
            <aside className="sticky top-24 self-start">
              <TrendingSidebar />
            </aside>
          </div>
          {/* Mobile: single column */}
          <div className="lg:hidden flex flex-col gap-4">
            <CreatePost />
            {SAMPLE_POSTS.map(post => <PostCard key={post.id} post={post} />)}
          </div>
        </div>
      </main>
    </div>
  );
}
