// Copy this file into your app and customize
// Visual reference: docs/design-dna/ecommerce.html
// DNA palette: bg=var(--bg), accent=var(--accent), cards with thumbnail+body pattern

"use client";

import React, { useState } from "react";
import { Header } from "../starters/layout";
import { SectionHeader, Card, Badge, Button } from "../starters/primitives";

// ── Types ─────────────────────────────────────────────────────
interface Product {
  id: string;
  name: string;
  brand: string;
  price: string;
  originalPrice?: string;
  category: string;
  badge?: { label: string; variant: "success" | "warning" | "error" | "accent" };
  rating: number;
  reviews: number;
}

// ── Sample data ───────────────────────────────────────────────
const sampleCategories = ["All", "Electronics", "Design", "Books", "Tools", "Accessories"];

const sampleProducts: Product[] = [
  {
    id: "p1",
    name: "Mechanical Keyboard Pro",
    brand: "APEX Hardware",
    price: "$189",
    originalPrice: "$249",
    category: "Electronics",
    badge: { label: "Sale", variant: "error" },
    rating: 5,
    reviews: 214,
  },
  {
    id: "p2",
    name: "Design Systems Handbook",
    brand: "Design Better",
    price: "$39",
    category: "Books",
    badge: { label: "Bestseller", variant: "accent" },
    rating: 5,
    reviews: 892,
  },
  {
    id: "p3",
    name: "Wireless Trackpad",
    brand: "Arc Peripherals",
    price: "$129",
    category: "Electronics",
    rating: 4,
    reviews: 156,
  },
  {
    id: "p4",
    name: "Focus Timer",
    brand: "Drift",
    price: "$59",
    category: "Tools",
    badge: { label: "New", variant: "success" },
    rating: 5,
    reviews: 48,
  },
  {
    id: "p5",
    name: "Cable Organizer Kit",
    brand: "Beacon",
    price: "$24",
    category: "Accessories",
    rating: 4,
    reviews: 331,
  },
  {
    id: "p6",
    name: "Ergonomic Mouse",
    brand: "APEX Hardware",
    price: "$89",
    category: "Electronics",
    rating: 4,
    reviews: 507,
  },
  {
    id: "p7",
    name: "Desk Lamp Pro",
    brand: "Lumina",
    price: "$149",
    originalPrice: "$179",
    category: "Tools",
    badge: { label: "Sale", variant: "error" },
    rating: 5,
    reviews: 89,
  },
  {
    id: "p8",
    name: "Notebook Set",
    brand: "Forma",
    price: "$19",
    category: "Accessories",
    rating: 4,
    reviews: 1203,
  },
];

// ── Sub-components ────────────────────────────────────────────
function StarRating({ rating, reviews }: { rating: number; reviews: number }) {
  return (
    <div className="flex items-center gap-1.5">
      <div className="flex gap-0.5">
        {Array.from({ length: 5 }).map((_, i) => (
          <svg
            key={i}
            width="12"
            height="12"
            viewBox="0 0 12 12"
            fill={i < rating ? "var(--warning, #fbbf24)" : "var(--border)"}
          >
            <path d="M6 1l1.5 3 3.5.5-2.5 2.5.6 3.5L6 9 3 10.5l.6-3.5L1 4.5 4.5 4z" />
          </svg>
        ))}
      </div>
      <span className="text-[11px]" style={{ color: "var(--text-muted)" }}>
        ({reviews})
      </span>
    </div>
  );
}

function ProductCard({ product }: { product: Product }) {
  const [added, setAdded] = useState(false);

  function handleAdd() {
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  }

  return (
    <Card hover as="article">
      <Card.Thumbnail>
        <div
          className="absolute inset-0 flex items-center justify-center"
          style={{ background: "var(--bg-surface)" }}
        >
          <span className="text-[11px]" style={{ color: "var(--text-muted)" }}>
            {product.brand}
          </span>
        </div>
        {product.badge && (
          <div className="absolute top-3 left-3 z-10">
            <Badge variant={product.badge.variant}>{product.badge.label}</Badge>
          </div>
        )}
      </Card.Thumbnail>
      <Card.Body>
        <p className="text-[11px] uppercase tracking-[0.08em] mb-1" style={{ color: "var(--text-muted)" }}>
          {product.brand}
        </p>
        <h3 className="text-[15px] font-medium tracking-[-0.01em] mb-1.5" style={{ color: "var(--text)" }}>
          {product.name}
        </h3>
        <StarRating rating={product.rating} reviews={product.reviews} />
        <div className="flex items-center gap-2 mt-2">
          <span className="text-[16px] font-semibold" style={{ color: "var(--text)" }}>
            {product.price}
          </span>
          {product.originalPrice && (
            <span
              className="text-[13px] line-through"
              style={{ color: "var(--text-muted)" }}
            >
              {product.originalPrice}
            </span>
          )}
        </div>
      </Card.Body>
      <Card.Footer>
        <Button
          variant={added ? "accent" : "ghost"}
          size="sm"
          className="w-full"
          onClick={handleAdd}
        >
          {added ? "Added to cart" : "Add to cart"}
        </Button>
      </Card.Footer>
    </Card>
  );
}

// ── Page ──────────────────────────────────────────────────────
export default function EcommercePage() {
  const [activeCategory, setActiveCategory] = useState("All");

  const filtered =
    activeCategory === "All"
      ? sampleProducts
      : sampleProducts.filter((p) => p.category === activeCategory);

  return (
    <div className="apex-enter" style={{ color: "var(--text)" }}>
      <Header
        logo={
          <span className="text-[14px] font-semibold tracking-[-0.01em]" style={{ color: "var(--text)" }}>
            APEX Store
          </span>
        }
        links={[
          { label: "Products", href: "#products", active: true },
          { label: "Collections", href: "#collections" },
          { label: "About", href: "#about" },
        ]}
        actions={
          <button
            className="relative p-2 rounded-lg transition-colors"
            style={{ color: "var(--text-secondary)" }}
            aria-label="Cart (0 items)"
          >
            <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5" width="20" height="20">
              <path d="M6 2L3 6v12a2 2 0 002 2h10a2 2 0 002-2V6l-3-4z" />
              <line x1="3" y1="6" x2="17" y2="6" />
              <path d="M13 10a3 3 0 01-6 0" />
            </svg>
          </button>
        }
      />

      <main id="main-content">
        {/* Hero banner */}
        <section
          className="px-6 py-20 sm:py-28 text-center"
          style={{ background: "var(--bg-elevated)", borderBottom: "1px solid var(--border)" }}
        >
          <p className="text-[12px] uppercase tracking-[0.12em] mb-4" style={{ color: "var(--accent)" }}>
            Spring collection
          </p>
          <h1
            className="text-[clamp(40px,6vw,72px)] font-normal tracking-[-0.04em] leading-none mb-4"
            style={{ fontFamily: "var(--font-display)", color: "var(--text)" }}
          >
            Tools for people who{" "}
            <em className="not-italic" style={{ color: "var(--accent)" }}>care.</em>
          </h1>
          <p className="text-[17px] font-light max-w-md mx-auto" style={{ color: "var(--text-secondary)" }}>
            Curated hardware, books, and tools for focused work.
          </p>
        </section>

        {/* Products */}
        <section id="products" className="px-6 py-16">
          <div className="max-w-6xl mx-auto">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 mb-10">
              <SectionHeader
                title="All products"
                subtitle={`${filtered.length} items`}
              />
              {/* Category filters */}
              <div className="flex flex-wrap gap-2">
                {sampleCategories.map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setActiveCategory(cat)}
                    className="px-3 py-1.5 rounded-full text-[12px] font-medium transition-all"
                    style={{
                      background: activeCategory === cat ? "var(--accent)" : "var(--bg-surface)",
                      color: activeCategory === cat ? "#fff" : "var(--text-secondary)",
                      border: "1px solid var(--border)",
                    }}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>

            {/* Product grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filtered.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>

            {filtered.length === 0 && (
              <div className="text-center py-20">
                <p className="text-[16px]" style={{ color: "var(--text-muted)" }}>
                  No products in this category.
                </p>
              </div>
            )}
          </div>
        </section>
      </main>

      <footer className="border-t px-6 py-10" style={{ borderColor: "var(--border)" }}>
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row justify-between items-center gap-4">
          <span className="text-[14px] font-semibold">APEX Store</span>
          <p className="text-[12px]" style={{ color: "var(--text-muted)" }}>
            &copy; {new Date().getFullYear()} · All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}
