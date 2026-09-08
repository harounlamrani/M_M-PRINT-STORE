# MM PRINT — Design System Specification

## Overview
This design system defines the visual language, component standards, and interaction patterns for the MM PRINT landing page redesign. It is built on the **Feature-Rich Showcase** pattern with **Liquid Glass** style principles, tailored for a premium Algerian streetwear brand.

**Brand Colors:** Red (#E31B23), Black (#0A0A0A), White (#FFFFFF)
**Font:** Chillax (Light, Regular, Medium, Bold)
**Theme:** Light theme only (no dark mode)

---

## 1. Typography

### Font Stack
```css
--font-chillax: 'Chillax', 'Inter', system-ui, sans-serif;
--font-sans: 'Inter', system-ui, sans-serif;
--font-mono: 'JetBrains Mono', monospace;
```

### Type Scale (Clamp-based, responsive)
| Token | Size (clamp) | Line Height | Letter Spacing | Weight | Usage |
|-------|--------------|-------------|----------------|--------|-------|
| `display-xl` | clamp(3.5rem, 8vw, 7rem) | 0.95 | -0.03em | Bold | Hero main headline |
| `display-lg` | clamp(2.5rem, 6vw, 4.5rem) | 0.95 | -0.02em | Bold | Section headlines |
| `display-md` | clamp(2rem, 4vw, 3rem) | 1.0 | -0.01em | Bold | Large section titles |
| `display-sm` | clamp(1.5rem, 3vw, 2rem) | 1.1 | 0 | Bold | Card titles, subsection headers |
| `heading-lg` | clamp(1.75rem, 2.5vw, 2.25rem) | 1.2 | 0 | Bold | About/Delivery section titles |
| `heading-md` | clamp(1.375rem, 2vw, 1.75rem) | 1.25 | 0 | Bold | Component titles |
| `heading-sm` | clamp(1.125rem, 1.5vw, 1.375rem) | 1.3 | 0 | Bold | Product names, card headlines |
| `body-lg` | 1.125rem | 1.6 | 0 | Regular | Lead paragraphs, descriptions |
| `body-md` | 1rem | 1.6 | 0 | Regular | Body text, form labels |
| `body-sm` | 0.875rem | 1.5 | 0 | Regular | Secondary text, captions |
| `caption` | 0.75rem | 1.5 | 0.02em | Medium | Badges, metadata, fine print |

### Weight Hierarchy
- **Bold (700):** Display, headings, prices, CTAs
- **Medium (500):** Captions, labels, navigation, buttons
- **Regular (400):** Body text, descriptions, form inputs
- **Light (300):** Large display text (optional, for emphasis)

### Font Feature Settings
```css
font-feature-settings: 'cv02', 'cv03', 'cv04', 'cv11'; /* Chillax stylistic sets */
```

---

## 2. Color System

### Brand Colors (CSS Variables)
```css
/* Light Theme (Primary) */
--mm-red: #E31B23;
--mm-red-dark: #B8161D;
--mm-red-light: #FF3B44;
--mm-black: #0A0A0A;
--mm-black-soft: #141414;
--mm-white: #FFFFFF;
--mm-white-soft: #F5F5F5;
--mm-gray: #2A2A2A;
--mm-gray-light: #3A3A3A;
--mm-gray-border: #333333;
```

### Semantic Color Tokens
| Token | Light Value | Usage |
|-------|-------------|-------|
| `--color-bg` | `#FFFFFF` | Page background (white sections) |
| `--color-bg-soft` | `#F8F8F8` | Subtle section backgrounds |
| `--color-fg` | `#0A0A0A` | Primary text |
| `--color-fg-soft` | `#1A1A1A` | Secondary text |
| `--color-accent` | `#E31B23` | Primary CTA, links, accents |
| `--color-accent-dark` | `#B8161D` | Hover/active states |
| `--color-border` | `#E5E5E5` | Default borders, dividers |
| `--color-card` | `#FFFFFF` | Card backgrounds |
| `--color-card-hover` | `#FAFAFA` | Card hover state |
| `--color-muted` | `#737373` | Muted text, placeholders |

### Dark Section Tokens (Header, Delivery, Footer)
| Token | Value | Usage |
|-------|-------|-------|
| `--color-dark-bg` | `#0A0A0A` | Dark section backgrounds |
| `--color-dark-bg-soft` | `#141414` | Dark card backgrounds |
| `--color-dark-fg` | `#FFFFFF` | Dark section primary text |
| `--color-dark-fg-soft` | `#F5F5F5` | Dark section secondary text |
| `--color-dark-border` | `#333333` | Dark section borders |
| `--color-dark-card` | `#1A1A1A` | Dark card backgrounds |

### State Colors
| Token | Value | Usage |
|-------|-------|-------|
| `--color-success` | `#16A34A` | Success states |
| `--color-error` | `#DC2626` | Error states, destructive actions |
| `--color-warning` | `#F59E0B` | Warning states |
| `--color-focus` | `#E31B23` | Focus rings |

---

## 3. Spacing System

### Base Unit: 4px (0.25rem)
```css
--space-0: 0;
--space-1: 0.25rem;  /* 4px */
--space-2: 0.5rem;   /* 8px */
--space-3: 0.75rem;  /* 12px */
--space-4: 1rem;     /* 16px */
--space-5: 1.25rem;  /* 20px */
--space-6: 1.5rem;   /* 24px */
--space-8: 2rem;     /* 32px */
--space-10: 2.5rem;  /* 40px */
--space-12: 3rem;    /* 48px */
--space-16: 4rem;    /* 64px */
--space-20: 5rem;    /* 80px */
--space-24: 6rem;    /* 96px */
--space-32: 8rem;    /* 128px */
```

### Section Spacing
| Section Type | Vertical Padding | Notes |
|--------------|------------------|-------|
| Hero | 128px (clamp) | Full viewport height |
| Standard Section | 64px / 80px / 96px | Mobile / Tablet / Desktop |
| Compact Section | 48px / 64px | Between related content |
| Section Gap (internal) | 32px / 48px / 64px | Between elements within section |

---

## 4. Border Radius

```css
--radius-none: 0;
--radius-sm: 0.25rem;   /* 4px - badges, small elements */
--radius-md: 0.5rem;    /* 8px - inputs, buttons */
--radius-lg: 0.75rem;   /* 12px - cards, panels */
--radius-xl: 1rem;      /* 16px - large cards, modals */
--radius-2xl: 1.5rem;   /* 24px - hero elements, feature cards */
--radius-full: 9999px;  /* Pills, avatar, tags */
```

### Usage Rules
- **Inputs/Buttons:** `radius-md` (8px)
- **Product Cards:** `radius-lg` (12px)
- **Category Cards:** `radius-2xl` (24px)
- **Modals/Drawers:** `radius-xl` (16px)
- **Badges/Tags:** `radius-full`
- **Images:** Match parent container radius

---

## 5. Shadow System

### Elevation Scale
```css
/* Level 0 - Flat */
--shadow-0: none;

/* Level 1 - Subtle (cards at rest) */
--shadow-sm: 0 1px 2px 0 rgb(0 0 0 / 0.05);

/* Level 2 - Card hover (default cards) */
--shadow-md: 0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1);

/* Level 3 - Elevated (interactive cards, dropdowns) */
--shadow-lg: 0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1);

/* Level 4 - Modal/Sheet */
--shadow-xl: 0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1);

/* Level 5 - Floating (tooltips, popovers) */
--shadow-2xl: 0 25px 50px -12px rgb(0 0 0 / 0.25);

/* Brand accent shadow */
--shadow-red: 0 0 30px rgb(227 27 35 / 0.15);
--shadow-red-hover: 0 0 40px rgb(227 27 35 / 0.25);
```

### Dark Section Shadows
```css
--shadow-dark-sm: 0 1px 2px 0 rgb(0 0 0 / 0.3);
--shadow-dark-md: 0 4px 6px -1px rgb(0 0 0 / 0.4), 0 2px 4px -2px rgb(0 0 0 / 0.3);
--shadow-dark-lg: 0 20px 40px rgb(0 0 0 / 0.4);
```

---

## 6. Container & Layout

### Container Max Widths
```css
--container-sm: 640px;   /* Mobile */
--container-md: 768px;   /* Tablet */
--container-lg: 1024px;  /* Desktop */
--container-xl: 1280px;  /* Large desktop */
--container-2xl: 1400px; /* Max content width */
```

### Default Container
```css
.container {
  @apply mx-auto max-w-[1400px] px-4 sm:px-6 lg:px-8;
}
```

### Grid Systems
| Context | Columns | Gap | Use Case |
|---------|---------|-----|----------|
| Category Grid | 1 / 2 / 5 | 6 / 8 | Category cards |
| Product Grid | 1 / 2 / 3 / 4 | 6 / 8 | Product cards |
| Feature Grid | 1 / 2 / 4 | 6 / 8 | About section features |
| Footer Grid | 1 / 2 / 5 | 8 | Footer columns |

---

## 7. Button System

### Variants
| Variant | Background | Text | Border | Hover | Active | Usage |
|---------|------------|------|--------|-------|--------|-------|
| **Primary** | `--mm-red` | White | None | `--mm-red-dark` | `--mm-red-dark/90` | Main CTA: "Commander" |
| **Secondary** | `--mm-gray` | White | `--mm-gray-border` | `--mm-gray-light` | `--mm-gray-light/90` | Secondary actions |
| **Outline** | Transparent | `--mm-red` | 2px `--mm-red` | `--mm-red` bg + White text | `--mm-red-dark` bg | Alt CTA: "Nos catégories" |
| **Ghost** | Transparent | White/Black | None | `--mm-gray` / `--mm-gray-light` | `--mm-gray/50` | Tertiary actions |

### Sizes
| Size | Padding | Font Size | Min Height | Usage |
|------|---------|-----------|------------|-------|
| `sm` | 12px 16px | 0.875rem | 40px | Compact cards, secondary actions |
| `md` | 16px 24px | 1rem | 44px | Default forms, inline CTAs |
| `lg` | 20px 32px | 1.125rem | 48px | Primary page CTAs, hero buttons |

### States
```css
/* Base */
transition: all 150ms cubic-bezier(0.16, 1, 0.3, 1);

/* Focus (accessible) */
focus-visible: ring-2 ring-mm-red ring-offset-2 ring-offset-white;

/* Disabled */
disabled: opacity-50 cursor-not-allowed;

/* Loading */
loading: spinner animation + disabled state
```

### Button Hierarchy Rules
1. **One Primary CTA per view** — "Commander" is the only primary button
2. **WhatsApp = Secondary** — Outline or Ghost variant
3. **No competing CTAs** — Never place two primary buttons adjacent

---

## 8. Card System

### Product Card
```css
.card-product {
  @apply relative overflow-hidden rounded-lg bg-white border border-gray-200
         transition-all duration-normal;
}

.card-product-hover {
  @apply card-product hover:border-gray-300 hover:scale-[1.02] 
         hover:shadow-[0_20px_40px_rgba(0,0,0,0.1)];
}
```

**Structure:**
- Image area (aspect-[4/5]) with overlay on hover
- Badge area (New/Featured) — top-left
- Quick "Commander" button — bottom (appears on hover)
- Content area: category badge, name, description, color swatches, cut badges, price

### Category Card
```css
.card-category {
  @apply relative overflow-hidden rounded-2xl cursor-pointer group;
}
```

**Structure:**
- Full-bleed image with gradient overlay
- Content overlay (bottom): product count badge, title, description
- "Explorer" button — bottom-right (appears on hover)

### Feature Card (About Section)
```css
.card-feature {
  @apply p-6 rounded-xl bg-white border border-gray-200 h-full
         hover:border-mm-red/30 hover:shadow-lg transition-all duration-300;
}
```

### Order Flow Card (Sidebar)
```css
.card-order {
  @apply fixed right-0 top-0 h-full z-50 w-full max-w-2xl 
         bg-mm-black-soft border-l border-mm-gray-border
         flex flex-col;
}
```

---

## 9. Form System

### Input Fields
```css
.input {
  @apply w-full rounded-md bg-white px-4 py-3 text-body-md text-black
         placeholder:text-gray-400 border border-gray-300
         transition-all duration-fast focus:border-mm-red 
         focus:ring-2 focus:ring-mm-red/20 focus:outline-none
         disabled:opacity-50 disabled:cursor-not-allowed;
}

.input-dark {
  @apply w-full rounded-md bg-gray-800 px-4 py-3 text-body-md text-white
         placeholder:text-gray-500 border border-gray-700
         transition-all duration-fast focus:border-mm-red 
         focus:ring-2 focus:ring-mm-red/20 focus:outline-none
         disabled:opacity-50 disabled:cursor-not-allowed;
}
```

### Select/Dropdown
- Native `<select>` with custom arrow SVG
- Same styling as inputs
- Error state: `border-mm-red` + `focus:ring-mm-red/20`

### Labels
```css
.label { @apply block mb-2 text-body-sm font-medium text-black; }
.label-dark { @apply block mb-2 text-body-sm font-medium text-white; }
```

### Error States
- Red border (`--mm-red`)
- Error message below field: `text-body-sm text-mm-red` with `role="alert"`
- `aria-invalid="true"` on input
- `aria-describedby` linking to error message

### Quantity Control
```css
.quantity-control {
  @apply flex items-center gap-2 border border-gray-300 rounded-lg;
}
.quantity-btn { @apply p-2 text-gray-500 hover:text-black; }
.quantity-input { @apply w-16 bg-transparent border-none text-center text-body-md; }
```

---

## 10. Interaction States

### Hover (Desktop)
| Element | Transition | Transform | Shadow |
|---------|------------|-----------|--------|
| Product Card | 300ms ease-out | scale(1.02) | shadow-lg |
| Category Card | 300ms ease-out | translateY(-8px) scale(1.02) | — |
| Button | 150ms ease-out | — | — |
| Feature Card | 300ms spring | translateY(-6px) | shadow-lg |
| Link | 150ms ease-out | — | — |

### Focus (Keyboard)
- Visible ring: `ring-2 ring-mm-red ring-offset-2 ring-offset-white`
- Never remove focus styles
- Tab order matches visual order

### Active/Pressed
- Buttons: `active:bg-mm-red-dark/90` (primary), scale(0.98) optional
- Cards: No active state needed

### Disabled
- Opacity: 0.5
- Cursor: not-allowed
- No hover/active transitions

### Selected (Category, Variant, Delivery Method)
- Border: 2px `--mm-red`
- Background: `--mm-red/10`
- Check icon for radio-style selections

---

## 11. Animation System

### Timing Tokens
```css
--duration-fast: 150ms;      /* Micro-interactions, button hover */
--duration-normal: 250ms;    /* Card hover, transitions */
--duration-slow: 400ms;      /* Modal enter, section reveals */
--duration-cinematic: 600ms; /* Hero animations, page transitions */
```

### Easing Curves
```css
--ease-out-expo: cubic-bezier(0.16, 1, 0.3, 1);      /* Default enter */
--ease-in-expo: cubic-bezier(0.7, 0, 0.84, 0);       /* Default exit */
--ease-out-circ: cubic-bezier(0.08, 0.82, 0.17, 1);  /* Smooth deceleration */
--ease-spring: cubic-bezier(0.34, 1.56, 0.64, 1);    /* Playful, bouncy */
```

### Animation Patterns
| Pattern | Duration | Easing | Usage |
|---------|----------|--------|-------|
| Fade In | 400ms | ease-out | Content reveal |
| Slide Up | 500ms | ease-out | Section entrance |
| Scale In | 300ms | ease-out | Modal, popover |
| Stagger | 80ms/item | ease-out | Lists, grids |
| Shimmer | 2s | linear | Loading skeletons |

### Reduced Motion
```css
@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
    scroll-behavior: auto !important;
  }
}
```

---

## 12. Responsive System

### Breakpoints (Tailwind Default)
| Name | Min Width | Usage |
|------|-----------|-------|
| `sm` | 640px | Small tablets, large phones landscape |
| `md` | 768px | Tablets |
| `lg` | 1024px | Desktop |
| `xl` | 1280px | Large desktop |
| `2xl` | 1536px | Extra large |

### Two-Target Strategy
| Target | Width Range | Approach |
|--------|-------------|----------|
| **Mobile** | < 768px | Stacked, touch-optimized, single column |
| **Desktop** | ≥ 768px | Multi-column, hover states, sidebar layouts |

### Key Responsive Behaviors
- **Navigation:** Hamburger menu (mobile) → Horizontal nav (desktop)
- **Category Grid:** 1 col → 2 col → 5 col
- **Product Lane:** Horizontal scroll (mobile) → Fixed grid (desktop)
- **Order Flow:** Full-screen bottom sheet (mobile) → Right sidebar (desktop)
- **Footer:** Accordion groups (mobile) → Full grid (desktop)

### Touch Targets
- Minimum: 44×44px (iOS) / 48×48dp (Android)
- Spacing between targets: ≥ 8px
- Expanded hit areas for small icons

---

## 13. Icon System

### Library: Lucide React (`lucide-react`)
- Consistent stroke width (2px)
- 24×24px default size
- Sizes: `h-4 w-4` (16px), `h-5 w-5` (20px), `h-6 w-6` (24px), `h-7 w-7` (28px)

### Semantic Usage
| Icon | Purpose |
|------|---------|
| `ShoppingBag` | Cart, Commander CTA |
| `ArrowRight` | Forward navigation, CTA arrows |
| `ChevronLeft/Right` | Step navigation |
| `X` | Close modal, dismiss |
| `Menu` | Mobile menu trigger |
| `MapPin` | Location, delivery |
| `Truck` | Shipping, domicile delivery |
| `Shield` | Security, COD |
| `CheckCircle` | Success, selected state |
| `Mail/Phone/MessageSquare` | Contact methods |
| `Instagram/Facebook/Youtube` | Social links |

### Decorative Icons
- `aria-hidden="true"`
- No semantic meaning

---

## 14. Section Specifications

### Section Order (Current → Keep)
1. **Hero** — *Handle last per spec*
2. **Categories** — Grid of 5 category cards
3. **Products** — Horizontal lane with category groups
4. **About** — 4 feature cards + sticky sidebar
5. **Delivery** — Calculator + process steps + COD badge
6. **Contact** — Info cards + contact form
7. **Footer** — Links, benefits, copyright, contact

### Sections to Remove (Per Spec)
- ❌ Why MM PRINT
- ❌ How It Works (except in Delivery as process steps)
- ❌ Stats / Numbers
- ❌ Testimonials
- ❌ Newsletter
- ❌ Promotions

---

## 15. Order Flow Specifications

### Desktop: Right Sidebar (Current — Keep Structure)
- Width: `max-w-2xl` (672px)
- 4-step progress indicator (horizontal)
- Slide transitions between steps
- Scroll to top on step change

### Mobile: Full-Screen Bottom Sheet
- Full viewport width
- Product card visible at top (compact)
- Same 4-step logic
- Swipe-down to dismiss (native behavior)

### Steps
1. **Produit** — Variant selection (color/size/cut), quantity
2. **Livraison** — Wilaya → Commune → Method (Bureau/Domicile)
3. **Infos** — Name, phone, address (optional), notes (optional)
4. **Confirmation** — Order summary, COD notice, WhatsApp CTA

### Validation
- Inline errors below each field
- Step validation before proceeding
- No skip steps allowed

---

## 16. WhatsApp Integration

### Primary Flow
- Button: "Confirmer et ouvrir WhatsApp" (Primary variant)
- Opens `wa.me/213553385674` with prefilled message
- No loading state required

### Secondary Access
- Header cart drawer (mobile)
- Footer contact links
- Contact section WhatsApp link

### Fallback
- Copy message to clipboard
- Show WhatsApp Web link

---

## 17. Accessibility Baseline

| Requirement | Implementation |
|-------------|----------------|
| Color Contrast | ≥ 4.5:1 for text, ≥ 3:1 for UI elements |
| Focus Visible | Ring-2 on all interactive elements |
| ARIA Labels | Icon buttons, form fields, live regions |
| Keyboard Nav | Tab order = visual order, all actions reachable |
| Reduced Motion | Respect `prefers-reduced-motion` |
| Alt Text | All meaningful images |
| Semantic HTML | Proper heading hierarchy, landmarks |

---

## 18. Performance Guidelines

### Images
- WebP/AVIF via Next.js Image
- Responsive `sizes` attribute
- Lazy loading below fold
- Blur placeholders

### Fonts
- `font-display: swap`
- Preload Chillax variants (Light, Regular, Medium, Bold)
- Fallback: Inter → system-ui

### Code Splitting
- Dynamic imports for heavy components (Order Flow, Charts)
- Framer Motion only where needed

### No Skeleton Loading
- Per spec: do not add skeleton UI

---

## 19. Anti-Patterns (What to Avoid)

| ❌ Avoid | ✅ Use Instead |
|----------|----------------|
| Emoji as icons | Lucide SVG icons |
| Raw hex in components | CSS variables / Tailwind tokens |
| Fixed pixel containers | Max-width + fluid padding |
| Horizontal scroll on mobile | Responsive grids / accordions |
| Multiple primary CTAs | One primary + secondary/ghost |
| Invented stats/testimonials | Real content only |
| Dark mode | Light theme with dark sections |
| Tablet-specific breakpoints | Mobile / Desktop only |
| Page transitions | Single-page smooth scroll |
| Skeleton loaders | Direct content loading |
| Searchable dropdowns | Native selects (per spec) |

---

## 20. Implementation Checklist

### Phase 1: Design System Foundation
- [ ] Update `tailwind.config.ts` with new tokens
- [ ] Update `globals.css` with semantic variables
- [ ] Verify Chillax font weights (Light, Regular, Medium, Bold)
- [ ] Update Button component variants
- [ ] Update Input/Select components
- [ ] Update Card component variants

### Phase 2: Component Redesign
- [ ] ProductCard — visual polish, hover states, CTA hierarchy
- [ ] CategoryCard — spacing, typography, selected state
- [ ] HorizontalProductLane — responsive behavior, scroll indicators
- [ ] ProductOrderTransition — visual consistency, mobile layout
- [ ] Header — scroll behavior, mobile nav improvements
- [ ] Footer — full redesign, accordion mobile, legal links removed

### Phase 3: Section Redesign
- [ ] AboutSection — card styling, spacing
- [ ] DeliverySection — calculator UX, step presentation
- [ ] ContactSection — form styling, validation UX
- [ ] Hero — *Deferred per spec*

### Phase 4: Polish & QA
- [ ] Responsive testing (375px, 768px, 1024px, 1440px)
- [ ] Animation audit (reduced motion, performance)
- [ ] Accessibility audit (contrast, focus, ARIA)
- [ ] Functionality regression test
- [ ] Build + lint + typecheck pass

---

## 21. Changelog / Decisions Log

| Date | Decision | Reason |
|------|----------|--------|
| 2026-09-05 | Chillax as sole heading font | Brand requirement, 4 weights available |
| 2026-09-05 | Light theme only with dark sections | Spec requirement, brand colors are red/black/white |
| 2026-09-05 | No tablet breakpoint | Spec: only Desktop/Mobile targets |
| 2026-09-05 | Keep existing order flow structure | Spec: "Do NOT rebuild Desktop order structure" |
| 2026-09-05 | Remove Why/How/Stats/Testimonials/Newsletter/Promos | Explicitly rejected in spec |
| 2026-09-05 | Primary CTA = Commander, Secondary = WhatsApp | Spec hierarchy |
| 2026-09-05 | Native selects for Wilaya/Commune | Spec: "Do NOT replace with searchable dropdown" |
| 2026-09-05 | Footer accordion on mobile | Spec: "UI/UX Pro Max can use collapsible/accordion groups" |

---

*This document is the single source of truth for the MM PRINT redesign. All implementation decisions should reference this specification.*