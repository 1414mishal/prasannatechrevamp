---
name: Enterprise Logic
colors:
  surface: '#fbf9f8'
  surface-dim: '#dbd9d9'
  surface-bright: '#fbf9f8'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#f5f3f3'
  surface-container: '#f0eded'
  surface-container-high: '#eae8e7'
  surface-container-highest: '#e4e2e2'
  on-surface: '#1b1c1c'
  on-surface-variant: '#43474f'
  inverse-surface: '#303030'
  inverse-on-surface: '#f2f0f0'
  outline: '#737780'
  outline-variant: '#c3c6d1'
  surface-tint: '#3a5f94'
  primary: '#001e40'
  on-primary: '#ffffff'
  primary-container: '#003366'
  on-primary-container: '#799dd6'
  inverse-primary: '#a7c8ff'
  secondary: '#006689'
  on-secondary: '#ffffff'
  secondary-container: '#5bcaff'
  on-secondary-container: '#005371'
  tertiary: '#1b1f21'
  on-tertiary: '#ffffff'
  tertiary-container: '#303436'
  on-tertiary-container: '#999c9e'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#d5e3ff'
  primary-fixed-dim: '#a7c8ff'
  on-primary-fixed: '#001b3c'
  on-primary-fixed-variant: '#1f477b'
  secondary-fixed: '#c3e8ff'
  secondary-fixed-dim: '#78d1ff'
  on-secondary-fixed: '#001e2c'
  on-secondary-fixed-variant: '#004c68'
  tertiary-fixed: '#e0e3e5'
  tertiary-fixed-dim: '#c4c7c9'
  on-tertiary-fixed: '#181c1e'
  on-tertiary-fixed-variant: '#434749'
  background: '#fbf9f8'
  on-background: '#1b1c1c'
  surface-variant: '#e4e2e2'
typography:
  display-lg:
    fontFamily: Hanken Grotesk
    fontSize: 56px
    fontWeight: '700'
    lineHeight: 64px
    letterSpacing: -0.02em
  display-lg-mobile:
    fontFamily: Hanken Grotesk
    fontSize: 36px
    fontWeight: '700'
    lineHeight: 44px
    letterSpacing: -0.01em
  headline-lg:
    fontFamily: Hanken Grotesk
    fontSize: 32px
    fontWeight: '600'
    lineHeight: 40px
  headline-md:
    fontFamily: Hanken Grotesk
    fontSize: 24px
    fontWeight: '600'
    lineHeight: 32px
  body-lg:
    fontFamily: Hanken Grotesk
    fontSize: 18px
    fontWeight: '400'
    lineHeight: 28px
  body-md:
    fontFamily: Hanken Grotesk
    fontSize: 16px
    fontWeight: '400'
    lineHeight: 24px
  label-md:
    fontFamily: Hanken Grotesk
    fontSize: 14px
    fontWeight: '600'
    lineHeight: 20px
    letterSpacing: 0.05em
rounded:
  sm: 0.125rem
  DEFAULT: 0.25rem
  md: 0.375rem
  lg: 0.5rem
  xl: 0.75rem
  full: 9999px
spacing:
  unit: 8px
  container-max: 1280px
  gutter: 24px
  section-padding-desktop: 96px
  section-padding-mobile: 48px
---

## Brand & Style

This design system is engineered for Prasanna Technologies to project an image of absolute reliability, technical mastery, and corporate maturity. The visual narrative shifts from a legacy "IT provider" look to a "Strategic Technology Partner" aesthetic, heavily influenced by modern enterprise leaders like Oracle and IBM.

The style is **Corporate Modern**. It prioritizes clarity over decoration, using structured layouts, generous white space, and a precise mathematical rhythm. The emotional response is one of confidence and stability—essential for a company handling critical workforce, warehouse, and asset lifecycle management systems.

Visual cues include:
- **Professional Imagery:** High-resolution business photography focusing on technology in action, collaboration, and industrial precision.
- **Clean Lines:** Elimination of unnecessary gradients or complex textures in favor of solid fills and subtle depth.
- **Data-Driven:** Information is presented with high legibility, using clear labeling and a strict typographic hierarchy to handle dense software specifications.

## Colors

The palette is anchored by a **Deep Corporate Blue**, symbolizing authority and intelligence. This is complemented by a **Sky Blue** secondary tone used for action items and highlights, ensuring the interface feels modern rather than dated.

- **Primary (#003366):** Used for headers, primary buttons, and core branding elements.
- **Secondary (#0099CC):** Used for links, secondary call-to-actions, and active states.
- **Tertiary/Surface (#F4F7F9):** A very light, cool gray/blue used for section backgrounds and card containers to differentiate content without the harshness of pure white.
- **Neutral/Text (#454545):** A soft black/dark gray for body text to reduce eye strain while maintaining high contrast.
- **Success/Warning/Error:** Standard enterprise signals (Green/Amber/Red) should be desaturated to fit the professional tone.

## Typography

The typography system utilizes **Hanken Grotesk**, a font that captures the precise, technical, and highly legible characteristics of Oracle Sans. It provides the "professional tech" feel required for enterprise software marketing.

- **Hierarchy:** Dramatic scale differences between headlines and body text create a clear path for the eye.
- **Display Styles:** Reserved for hero sections and major product announcements, using tight letter-spacing for a modern look.
- **Labels:** Small caps or all-caps with increased tracking are used for "breadcrumbs" or category tags (e.g., "THE BLOG", "CSR") to create a distinct visual layer from the body text.
- **Readability:** Body text uses a generous line-height (1.5x - 1.6x) to ensure large blocks of technical information remain digestible.

## Layout & Spacing

The design system employs a **Fixed Grid** model for desktop to maintain a structured, editorial feel, transitioning to a fluid model for mobile devices.

- **Grid:** A standard 12-column grid with 24px gutters. Content should be centered within a 1280px maximum container.
- **Vertical Rhythm:** An 8px base unit governs all padding and margins. Section spacing is aggressive (96px+) to emphasize "Plenty of White Space," allowing individual service offerings (like Workforce Management) to stand out.
- **Responsive Behavior:** 
    - **Desktop:** 12 columns, wide margins.
    - **Tablet:** 8 columns, 32px margins.
    - **Mobile:** 4 columns, 16px margins, with components stacking vertically.

## Elevation & Depth

To maintain a "high-tech" and "modern" feel, depth is achieved through **Tonal Layers** and extremely **Subtle Shadows**.

- **Surface Tiers:** Backgrounds are primary white (#FFFFFF), with secondary containers or "cards" using the Tertiary Blue-Gray (#F4F7F9).
- **Shadows:** Avoid heavy, dark shadows. Use long, diffused, low-opacity shadows (e.g., `box-shadow: 0 4px 20px rgba(0, 51, 102, 0.08)`) to give the impression of elements floating slightly above the page.
- **Interactions:** On hover, cards may lift slightly (decrease blur, increase offset) to provide tactile feedback without breaking the professional aesthetic.
- **Outlines:** Use 1px borders in a light gray (#E0E0E0) for input fields and non-elevated cards to maintain structure.

## Shapes

The shape language is **Soft (0.25rem)**. 

In a corporate IT context, sharp corners (0px) can feel too aggressive, while pill-shapes (3) feel too casual or consumer-focused. A small radius provides a hint of modern refinement while maintaining the "blocky" structural integrity expected of enterprise software.

- **Buttons:** 4px border radius.
- **Cards:** 8px (rounded-lg) for a slightly softer container feel.
- **Inputs:** 4px to match buttons.

## Components

### Buttons
- **Primary:** Solid Deep Corporate Blue (#003366) with White text. No gradients.
- **Secondary:** Outline Deep Corporate Blue with 1px border.
- **Tertiary:** Sky Blue text only with an icon for "Learn More" links.

### Cards
- Used for "Service Offerings." Feature a high-quality background image with a semi-transparent overlay at the bottom for text. 
- Content should be bottom-aligned within the card to mirror the "Workforce Management" style from the reference, but with improved typography.

### Input Fields
- Understated design: 1px light gray border, white background. 
- Labels sit above the field in `label-md` style. 
- Focus state uses a 2px Sky Blue (#0099CC) border.

### Logos & Branding
- The existing logo should be simplified. Use the 4-square icon element in a single color (Primary Blue or White) and pair it with the updated Hanken Grotesk typeface for the "Prasanna" wordmark to ensure visual harmony with the rest of the UI.

### Chips/Tags
- Used for categories like "SMART METERING" or "CASE STUDY." Small, light gray background with dark gray text, using the `label-md` typographic style.