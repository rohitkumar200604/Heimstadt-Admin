---
name: Heimstadt Architectural Ledger
colors:
  surface: '#f8f9ff'
  surface-dim: '#cbdbf5'
  surface-bright: '#f8f9ff'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#eff4ff'
  surface-container: '#e5eeff'
  surface-container-high: '#dce9ff'
  surface-container-highest: '#d3e4fe'
  on-surface: '#0b1c30'
  on-surface-variant: '#44474e'
  inverse-surface: '#213145'
  inverse-on-surface: '#eaf1ff'
  outline: '#74777f'
  outline-variant: '#c4c6cf'
  surface-tint: '#465f88'
  primary: '#002046'
  on-primary: '#ffffff'
  primary-container: '#1b365d'
  on-primary-container: '#87a0cd'
  inverse-primary: '#aec7f7'
  secondary: '#735c00'
  on-secondary: '#ffffff'
  secondary-container: '#fddd7c'
  on-secondary-container: '#776005'
  tertiary: '#321c00'
  on-tertiary: '#ffffff'
  tertiary-container: '#4f2f00'
  on-tertiary-container: '#c6965e'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#d6e3ff'
  primary-fixed-dim: '#aec7f7'
  on-primary-fixed: '#001b3d'
  on-primary-fixed-variant: '#2e476f'
  secondary-fixed: '#ffe085'
  secondary-fixed-dim: '#e3c466'
  on-secondary-fixed: '#231b00'
  on-secondary-fixed-variant: '#574500'
  tertiary-fixed: '#ffddb9'
  tertiary-fixed-dim: '#f1bd81'
  on-tertiary-fixed: '#2b1700'
  on-tertiary-fixed-variant: '#623f0f'
  background: '#f8f9ff'
  on-background: '#0b1c30'
  surface-variant: '#d3e4fe'
  accent-gold: '#fed65b'
  surface-blue: '#f8f9ff'
  glass-border: rgba(27, 54, 93, 0.08)
  gold-gradient: 'linear-gradient(135deg, #735c00 0%, #fed65b 50%, #735c00 100%)'
typography:
  display-lg:
    fontFamily: Inter
    fontSize: 48px
    fontWeight: '700'
    lineHeight: 56px
    letterSpacing: -0.04em
  display-lg-mobile:
    fontFamily: Inter
    fontSize: 32px
    fontWeight: '700'
    lineHeight: 40px
    letterSpacing: -0.02em
  headline-lg:
    fontFamily: Inter
    fontSize: 32px
    fontWeight: '600'
    lineHeight: 40px
    letterSpacing: -0.01em
  headline-md:
    fontFamily: Inter
    fontSize: 24px
    fontWeight: '500'
    lineHeight: 32px
  body-lg:
    fontFamily: Inter
    fontSize: 18px
    fontWeight: '300'
    lineHeight: 28px
  body-md:
    fontFamily: Inter
    fontSize: 16px
    fontWeight: '400'
    lineHeight: 24px
  label-md:
    fontFamily: Inter
    fontSize: 14px
    fontWeight: '500'
    lineHeight: 20px
    letterSpacing: 0.05em
  label-sm:
    fontFamily: Inter
    fontSize: 12px
    fontWeight: '600'
    lineHeight: 16px
    letterSpacing: 0.1em
rounded:
  sm: 0.25rem
  DEFAULT: 0.5rem
  md: 0.75rem
  lg: 1rem
  xl: 1.5rem
  full: 9999px
spacing:
  base: 8px
  gutter: 24px
  margin-mobile: 20px
  margin-desktop: 48px
  container-max: 1280px
---

## Brand & Style
The brand identity is rooted in high-end real estate and architectural precision. It targets professional administrators and internal employees who require a sense of stability, exclusivity, and structural clarity. 

The design style is **Sophisticated Glassmorphism** blended with **Modern Corporate** elements. It utilizes translucent surfaces, subtle backdrop blurs, and high-quality typography to create a "premium digital lobby" experience. The aesthetic should feel light, airy, and expensive, utilizing radial background gradients and thin-stroke architectural overlays to reinforce the real estate context.

## Colors
The palette is dominated by "Deep Navy" (Primary) and "Antique Gold" (Secondary). 

- **Primary (#1b365d):** Used for core branding, administrative actions, and high-priority headings.
- **Secondary (#735c00):** Used for employee-facing paths and subtle premium accents.
- **Surface (#f8f9ff):** A cool-tinted off-white background that prevents the clinical feel of pure white.
- **Accents:** A gold gradient is used sparingly for decorative dividers and interactive states to signify prestige. 
- **Translucency:** Functional surfaces use `rgba(255, 255, 255, 0.7)` with a heavy blur to maintain legibility over background graphics.

## Typography
The system uses **Inter** exclusively to maintain a clean, systematic, and utilitarian feel that contrasts with the more decorative background elements. 

- **Display Titles:** Use heavy weights (700) and negative letter spacing to create a compact, authoritative look.
- **Secondary Labels:** Utilize wide letter spacing (0.4em in specific portal contexts) and uppercase transformations for a "luxury blueprint" aesthetic.
- **Body Text:** Kept at a lighter weight (300 for LG) to emphasize the airy, modern feel of the interface.

## Layout & Spacing
The layout follows a **Fixed Grid** approach for centered landing experiences, transitioning to a fluid model for internal dashboards. 

- **Rhythm:** An 8px base unit drives all padding and margin increments.
- **Container:** Main content is capped at 1280px to ensure readability on ultra-wide displays.
- **Padding:** High-level cards use generous internal padding (40px-48px) to reinforce the premium, "un-crowded" brand feel. 
- **Responsive:** Mobile margins are set to 20px, with vertical spacing between sections increasing significantly (80px+) on desktop to allow the background graphics to breathe.

## Elevation & Depth
Hierarchy is established through **Glassmorphism** and **Ambient Shadows** rather than solid color blocks.

- **The Glass Card:** The primary surface container uses a semi-transparent white fill (70%) with a 12px backdrop blur. 
- **Shadows:** Shadows are soft and tinted with the primary color (`rgba(27, 54, 93, 0.1)`). They utilize a large blur radius (40px) and a negative spread to create a floating effect.
- **Micro-interactions:** Interactive cards use a 3D parallax effect on hover, combined with a slight vertical translation (-8px), to provide tactile feedback without relying on heavy borders.

## Shapes
The shape language is "Substantially Rounded," balancing the sharpness of architectural lines with the approachability of modern SaaS.

- **Primary Containers:** 16px (1rem) corner radius for main cards and portal selections.
- **Interactive Elements:** Buttons use a slightly sharper 8px (0.5rem) radius to feel more "active" and precise.
- **Decorative:** Icons and brand marks are housed in 16px rounded squares, often rotated (e.g., 45 degrees) to add visual interest and break the strict horizontal/vertical grid.

## Components

- **Buttons (Hollow-to-Solid):** Buttons start with a light border and primary/secondary colored text. On hover, a solid color fill slides in from the bottom, and the text flips to the "on-color" (white). This "reveal" animation adds a layer of premium polish.
- **Glass Cards:** These are the primary layout building blocks. They must include the standard 1px border (`glass-border`) to ensure edge definition against the light background.
- **Dividers:** Decorative dividers should use the `gold-gradient`, restricted to a thin height (1px) and limited width (approx 100px) to maintain subtlety.
- **Icons:** Use "Material Symbols Outlined" with a light stroke weight (200-300). Icons should be treated as aesthetic markers, often colored in the primary or secondary hue with reduced opacity (60%) until hovered.
- **Background Elements:** Large, blurred radial circles in `primary/5%` and `secondary/5%` should be placed at the screen edges to provide depth without distracting from the content.