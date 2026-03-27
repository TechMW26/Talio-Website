---
description: "Use when creating new page sections, homepage components, section headings, subheadings, labels, or any UI section layout. Covers heading hierarchy, spacing tokens, animation patterns, and container structure for Talio website sections."
applyTo: "src/app/components/**"
---

# Section & Element Conventions — Talio Website

## Section Container

Every homepage/page section uses this outer wrapper:

```tsx
<section className="relative py-20 md:py-28 bg-{color} overflow-hidden">
```

- Dark sections: `bg-black` or `bg-zinc-950`
- Light sections: `bg-white` or `bg-gray-50`
- Add `overflow-hidden` to prevent animation bleed

## Heading Group Structure

**ALWAYS** use `flex flex-col items-center` — never rely on `text-center` alone for centering block elements.

```tsx
<div className="flex flex-col items-center text-center  px-6">
  {/* Label */}
  <motion.div className="inline-flex items-center gap-2 text-sm font-semibold text-{accent}-400 uppercase tracking-widest mb-10">
    <IconComponent className="w-4 h-4" /> {/* optional */}
    Label Text
  </motion.div>

  {/* Main heading */}
  <motion.h2 className="text-4xl md:text-6xl lg:text-7xl font-bold text-white mb-10 leading-[1.05] tracking-tighter text-center">
    Section Heading
  </motion.h2>

  {/* Subheading */}
  <motion.p className="text-lg md:text-xl text-gray-400 font-light leading-relaxed max-w-2xl text-center">
    Description text here.
  </motion.p>
</div>
```

### Label Colors by Section Context

| Context | Color |
|---------|-------|
| Features / Integrations | `text-purple-400` |
| Project Management / Productivity | `text-blue-400` |
| AI / Automation | `text-gray-400` |
| Pricing / Business | `text-gray-500` |

### Spacing Tokens

| Element | Margin |
|---------|--------|
| Label → Heading | `mb-10` |
| Heading → Subheading | `mb-10` |
| Heading group → Content | `` |

### IMPORTANT: Global CSS Overrides

`global.css` sets `h1, h2 { margin-bottom: 1em !important; }` and `p { margin-top: 1em !important; }`.
These `!important` rules override Tailwind margin utilities. The `flex flex-col items-center` pattern mitigates centering issues, but be aware that heading `mb-*` classes may be overridden. Use wrapper divs with margins when precise spacing is critical.

## Animation Pattern (Standard)

All section elements use the same entrance animation:

```tsx
// Label
initial={{ opacity: 0, y: 20 }}
whileInView={{ opacity: 1, y: 0 }}
viewport={{ once: true }}
transition={{ duration: 0.6 }}

// Heading
initial={{ opacity: 0, y: 30 }}
whileInView={{ opacity: 1, y: 0 }}
viewport={{ once: true }}
transition={{ duration: 0.8, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}

// Subheading
initial={{ opacity: 0, y: 20 }}
whileInView={{ opacity: 1, y: 0 }}
viewport={{ once: true }}
transition={{ duration: 0.6, delay: 0.2 }}
```

- Easing: `[0.16, 1, 0.3, 1]` (smooth decelerate)
- Always `viewport={{ once: true }}`
- Stagger delay: label `0`, heading `0.1`, subheading `0.2`

## Content Container Width

| Layout | Max Width |
|--------|-----------|
| Standard centered | `max-w-7xl mx-auto px-6 md:px-8 lg:px-12` |
| Wide/immersive | `max-w-[1600px] mx-auto px-6 md:px-8 lg:px-12` |
| Subheading text | `max-w-2xl` (centered via flex parent) |

## Typography Hierarchy

| Element | Weight | Size |
|---------|--------|------|
| Section label | `font-semibold` | `text-sm` |
| Main heading | `font-bold` | `text-4xl md:text-6xl lg:text-7xl` |
| Subheading | `font-light` | `text-lg md:text-xl` |
| Body text | `font-light` or default | `text-base md:text-lg` |

## Gradient Text (Optional)

For highlighted words in headings:

```tsx
<span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-600 via-blue-600 to-purple-600">
  highlighted text
</span>
```

## Font Family

- Primary: **Inter** (loaded via Google Fonts)
- Handwriting accents: **Cedarville Cursive** (loaded via Google Fonts)
- Never use system serif or sans-serif fallbacks for visible text

## Buttons in Sections

Use the shared `AnimatedButton` component:

```tsx
import { AnimatedButton } from './AnimatedButton';

<AnimatedButton to="/path" size="lg">Button Text</AnimatedButton>
```

Sizes: `sm`, `md` (default), `lg`
