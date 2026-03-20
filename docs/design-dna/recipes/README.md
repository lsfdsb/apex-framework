# APEX Design DNA Recipes

> "People don't know what they want until you show it to them." — Steve Jobs

## What Are Recipes?

Recipes are **pre-configured blueprints** for each app type. Instead of reading 400 lines of HTML and guessing colors, you pick a recipe and get:

- The exact **palette** to use
- The exact **background pattern**
- Which **starter components** to import
- Which **pages and sections** to build
- The **layout pattern** (sidebar vs header)

## Quick Reference

| Building... | Recipe | Palette | Background | Layout |
|-------------|--------|---------|-----------|--------|
| LMS / Courses | [lms.md](lms.md) | creative-warm | nebula | Sidebar |
| CRM / Contacts | [crm.md](crm.md) | fintech-teal | grid | Sidebar |
| SaaS Dashboard | [saas.md](saas.md) | saas-blue | dots | Sidebar |
| Landing Page | [landing.md](landing.md) | startup-mono | constellation | Header |
| Blog / Editorial | [blog.md](blog.md) | editorial-warm | topographic | Header |
| E-Commerce | [ecommerce.md](ecommerce.md) | fintech-teal | hexagons | Header |
| Portfolio | [portfolio.md](portfolio.md) | creative-warm | rings | Header |
| Backoffice | [backoffice.md](backoffice.md) | saas-blue | dots | Sidebar |
| Social Feed | [social.md](social.md) | saas-blue | none | Sidebar |
| Email Templates | [email.md](email.md) | any (inline) | none | Table-based |
| Presentation | [presentation.md](presentation.md) | startup-mono | gradient | Full-screen |
| E-Book | [ebook.md](ebook.md) | editorial-warm | none | Centered prose |

## Background Selection Guide

| Background | Type | Best For | Mood |
|-----------|------|----------|------|
| **dots** | static | SaaS, admin panels | Clean, professional |
| **grid** | static | CRM, structured data | Organized, technical |
| **topographic** | static | Blog, editorial | Organic, literary |
| **hexagons** | static | E-commerce, fintech | Modern, geometric |
| **circuit** | static | Tech products | Technical, innovative |
| **constellation** | animated | Landing pages | Dynamic, attention-grabbing |
| **nebula** | animated | Creative apps, LMS | Inspiring, artistic |
| **rings** | animated | Portfolio, showcase | Flowing, artistic |
| **aurora** | animated | Premium features | Premium, immersive |
| **gradient** | animated | Presentations | Shifting, storytelling |
| **particles** | animated | Interactive tools | Alive, dynamic |
| none | — | Content-heavy (blog, ebook, social) | Focused, minimal |

## How Builders Use Recipes

```
1. Read the recipe for your app type
2. Run the setup commands (copy tokens + starters)
3. Set up globals.css with the palette import
4. Build pages using the component table as a checklist
5. Every color comes from tokens — NEVER hardcode hex
```

The recipe IS the spec. Match it.
