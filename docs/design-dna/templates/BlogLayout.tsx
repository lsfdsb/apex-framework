// Copy this file into your app and customize
// Visual reference: docs/design-dna/blog.html
// DNA palette: light bg=#faf9f6, dark bg=#0f0d0b, accent=#e07850 (dark)/#c45d3e (light)
// Fonts: Newsreader (body), Instrument Serif (display), Inter (sans labels)

import React from "react";
import { Header } from "../starters/layout";
import { SectionHeader, Card, Badge } from "../starters/primitives";

// ── Types ─────────────────────────────────────────────────────
interface Author {
  name: string;
  initials: string;
}

interface Post {
  id: string;
  category: string;
  title: string;
  excerpt: string;
  author: Author;
  date: string;
  readTime: string;
  featured?: boolean;
}

// ── Sample data ───────────────────────────────────────────────
const featuredPost: Post = {
  id: "f1",
  category: "Design",
  title: "The invisible rules that make design feel intentional.",
  excerpt:
    "Design systems aren't about consistency for its own sake. They're about building trust through predictability — and then knowing exactly when to break the pattern.",
  author: { name: "L.B.", initials: "LB" },
  date: "March 19, 2026",
  readTime: "8 min read",
  featured: true,
};

const samplePosts: Post[] = [
  {
    id: "p1",
    category: "Design",
    title: "Why every pixel matters more than you think.",
    excerpt: "The difference between good and great is in the details nobody notices consciously.",
    author: { name: "Ana Souza", initials: "AS" },
    date: "Mar 18",
    readTime: "5 min",
  },
  {
    id: "p2",
    category: "Engineering",
    title: "Ship less, ship better.",
    excerpt: "The courage to delete features is the hardest skill in product development.",
    author: { name: "Marcus Chen", initials: "MC" },
    date: "Mar 17",
    readTime: "6 min",
  },
  {
    id: "p3",
    category: "Product",
    title: "Constraints are the best design tool.",
    excerpt: "Without limits, creativity becomes indecision. Embrace the constraint.",
    author: { name: "Priya Nair", initials: "PN" },
    date: "Mar 16",
    readTime: "4 min",
  },
  {
    id: "p4",
    category: "Engineering",
    title: "The case for boring technology.",
    excerpt: "Choosing battle-tested tools isn't cowardice — it's wisdom.",
    author: { name: "James Obi", initials: "JO" },
    date: "Mar 15",
    readTime: "7 min",
  },
  {
    id: "p5",
    category: "Design",
    title: "When typography does all the work.",
    excerpt: "Most pages don't need more components. They need better type choices.",
    author: { name: "Sara Lima", initials: "SL" },
    date: "Mar 14",
    readTime: "5 min",
  },
  {
    id: "p6",
    category: "Product",
    title: "The feedback loop that actually works.",
    excerpt: "Stop asking users what they want. Watch what they do instead.",
    author: { name: "Ana Souza", initials: "AS" },
    date: "Mar 13",
    readTime: "6 min",
  },
];

const sampleCategories = ["All", "Design", "Engineering", "Product", "Business"];

// ── Sub-components ────────────────────────────────────────────
function AuthorRow({ author, date, readTime }: { author: Author; date: string; readTime: string }) {
  return (
    <div className="flex items-center gap-3">
      <div
        className="w-9 h-9 rounded-full flex items-center justify-center text-[12px] font-semibold shrink-0"
        style={{ background: "var(--accent-glow)", border: "1px solid var(--border)", color: "var(--accent)" }}
      >
        {author.initials}
      </div>
      <div>
        <p className="text-[13px] font-medium" style={{ color: "var(--text)" }}>
          {author.name}
        </p>
        <p className="text-[12px]" style={{ color: "var(--text-muted)" }}>
          {date} · {readTime}
        </p>
      </div>
    </div>
  );
}

function PostCard({ post }: { post: Post }) {
  return (
    <article>
      <a href={`#post-${post.id}`} className="group block" style={{ textDecoration: "none", color: "inherit" }}>
        {/* Image placeholder */}
        <div
          className="aspect-[3/2] rounded-[var(--radius)] mb-5 overflow-hidden"
          style={{ background: "var(--bg-surface)" }}
        >
          <div
            className="w-full h-full transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-105"
            style={{ background: "var(--bg-elevated)" }}
          />
        </div>
        <Badge variant="accent">{post.category}</Badge>
        <h3
          className="text-[22px] font-normal tracking-[-0.02em] leading-[1.3] mt-2 mb-2 group-hover:opacity-80 transition-opacity"
          style={{ fontFamily: "var(--font-display)", color: "var(--text)" }}
        >
          {post.title}
        </h3>
        <p className="text-[15px] leading-relaxed mb-4" style={{ color: "var(--text-secondary)" }}>
          {post.excerpt}
        </p>
        <AuthorRow author={post.author} date={post.date} readTime={post.readTime} />
      </a>
    </article>
  );
}

// ── Page ──────────────────────────────────────────────────────
export default function BlogLayout() {
  return (
    <div className="apex-enter" style={{ background: "var(--bg)", color: "var(--text)" }}>
      <Header
        logo={
          <span
            className="text-[15px] font-semibold tracking-[-0.02em]"
            style={{ fontFamily: "var(--font-display)" }}
          >
            The Journal
          </span>
        }
        links={
          sampleCategories.slice(1).map((c) => ({ label: c, href: `#${c.toLowerCase()}` }))
        }
        actions={
          <a
            href="#subscribe"
            className="text-[13px] font-medium px-3 py-1.5 rounded-lg transition-colors"
            style={{ background: "var(--accent)", color: "#fff" }}
          >
            Subscribe
          </a>
        }
      />

      {/* Featured post — asymmetric 2-col layout */}
      <section id="main-content" className="px-6 pt-24 pb-16 sm:pt-32">
        <div className="max-w-5xl mx-auto">
          <a
            href={`#post-${featuredPost.id}`}
            className="group grid md:grid-cols-2 gap-12 items-center"
            style={{ textDecoration: "none", color: "inherit" }}
          >
            {/* Image */}
            <div
              className="aspect-[4/3] rounded-[var(--radius)] overflow-hidden"
              style={{ background: "var(--bg-surface)" }}
            >
              <div
                className="w-full h-full transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-105"
                style={{ background: "var(--bg-elevated)" }}
              />
            </div>
            {/* Content */}
            <div>
              <Badge variant="accent">{featuredPost.category}</Badge>
              <h1
                className="text-[clamp(28px,4vw,44px)] font-normal tracking-[-0.03em] leading-[1.15] mt-3 mb-4 group-hover:opacity-80 transition-opacity"
                style={{ fontFamily: "var(--font-display)", color: "var(--text)" }}
              >
                {featuredPost.title}
              </h1>
              <p className="text-[17px] leading-[1.7] mb-6" style={{ color: "var(--text-secondary)" }}>
                {featuredPost.excerpt}
              </p>
              <AuthorRow
                author={featuredPost.author}
                date={featuredPost.date}
                readTime={featuredPost.readTime}
              />
            </div>
          </a>
        </div>
      </section>

      {/* Article grid + sidebar */}
      <section className="px-6 py-16">
        <div className="max-w-5xl mx-auto grid lg:grid-cols-[1fr_260px] gap-12 items-start">
          {/* Main grid */}
          <div>
            <SectionHeader title="Latest stories." />
            <div className="grid sm:grid-cols-2 gap-10">
              {samplePosts.map((post) => (
                <PostCard key={post.id} post={post} />
              ))}
            </div>
          </div>

          {/* Sidebar */}
          <aside className="space-y-8 lg:sticky" style={{ top: "96px" }}>
            {/* Categories */}
            <Card hover={false}>
              <Card.Body>
                <h3
                  className="text-[13px] uppercase tracking-[0.1em] font-medium mb-4"
                  style={{ color: "var(--text-muted)" }}
                >
                  Categories
                </h3>
                <ul className="space-y-1">
                  {sampleCategories.map((cat) => (
                    <li key={cat}>
                      <a
                        href={`#${cat.toLowerCase()}`}
                        className="flex items-center justify-between py-1.5 text-[14px] transition-opacity hover:opacity-70"
                        style={{ color: cat === "All" ? "var(--accent)" : "var(--text-secondary)", textDecoration: "none" }}
                      >
                        <span>{cat}</span>
                        <span className="text-[12px]" style={{ color: "var(--text-muted)" }}>
                          {cat === "All" ? samplePosts.length : samplePosts.filter((p) => p.category === cat).length}
                        </span>
                      </a>
                    </li>
                  ))}
                </ul>
              </Card.Body>
            </Card>

            {/* Newsletter */}
            <Card hover={false}>
              <Card.Body>
                <h3
                  className="text-[18px] font-normal tracking-[-0.02em] mb-2"
                  style={{ fontFamily: "var(--font-display)", color: "var(--text)" }}
                >
                  Stay in the loop.
                </h3>
                <p className="text-[13px] mb-4" style={{ color: "var(--text-muted)" }}>
                  One essay per week. No noise.
                </p>
                <div className="flex flex-col gap-2">
                  <input
                    type="email"
                    placeholder="you@example.com"
                    className="w-full px-3.5 py-2.5 rounded-[var(--radius-sm)] text-[14px] outline-none transition-all"
                    style={{
                      background: "var(--bg)",
                      border: "1px solid var(--border)",
                      color: "var(--text)",
                    }}
                  />
                  <button
                    className="w-full py-2.5 rounded-[var(--radius-sm)] text-[14px] font-medium transition-all hover:opacity-90"
                    style={{ background: "var(--accent)", color: "#fff" }}
                  >
                    Subscribe
                  </button>
                </div>
              </Card.Body>
            </Card>
          </aside>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t px-6 py-10" style={{ borderColor: "var(--border)" }}>
        <div className="max-w-5xl mx-auto flex flex-col sm:flex-row justify-between items-center gap-4">
          <span
            className="text-[15px] font-semibold tracking-[-0.02em]"
            style={{ fontFamily: "var(--font-display)" }}
          >
            The Journal
          </span>
          <p className="text-[12px]" style={{ color: "var(--text-muted)" }}>
            &copy; {new Date().getFullYear()} · All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}
