---
name: Luminous Education
colors:
  surface: '#f8f9fa'
  surface-dim: '#d9dadb'
  surface-bright: '#f8f9fa'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#f3f4f5'
  surface-container: '#edeeef'
  surface-container-high: '#e7e8e9'
  surface-container-highest: '#e1e3e4'
  on-surface: '#191c1d'
  on-surface-variant: '#3f4943'
  inverse-surface: '#2e3132'
  inverse-on-surface: '#f0f1f2'
  outline: '#6f7a73'
  outline-variant: '#bec9c1'
  surface-tint: '#026c4e'
  primary: '#005039'
  on-primary: '#ffffff'
  primary-container: '#006b4d'
  on-primary-container: '#93e8c2'
  inverse-primary: '#82d7b2'
  secondary: '#8f4e00'
  on-secondary: '#ffffff'
  secondary-container: '#fc9d41'
  on-secondary-container: '#6b3900'
  tertiary: '#004d5d'
  on-tertiary: '#ffffff'
  tertiary-container: '#00667b'
  on-tertiary-container: '#8be3ff'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#9ef4cd'
  primary-fixed-dim: '#82d7b2'
  on-primary-fixed: '#002115'
  on-primary-fixed-variant: '#00513a'
  secondary-fixed: '#ffdcc2'
  secondary-fixed-dim: '#ffb77a'
  on-secondary-fixed: '#2e1500'
  on-secondary-fixed-variant: '#6d3a00'
  tertiary-fixed: '#b3ebff'
  tertiary-fixed-dim: '#4ed6fb'
  on-tertiary-fixed: '#001f27'
  on-tertiary-fixed-variant: '#004e5f'
  background: '#f8f9fa'
  on-background: '#191c1d'
  surface-variant: '#e1e3e4'
typography:
  display-lg:
    fontFamily: Plus Jakarta Sans
    fontSize: 48px
    fontWeight: '800'
    lineHeight: 56px
    letterSpacing: -0.02em
  headline-lg:
    fontFamily: Plus Jakarta Sans
    fontSize: 32px
    fontWeight: '700'
    lineHeight: 40px
    letterSpacing: -0.01em
  headline-lg-mobile:
    fontFamily: Plus Jakarta Sans
    fontSize: 28px
    fontWeight: '700'
    lineHeight: 36px
  title-md:
    fontFamily: Plus Jakarta Sans
    fontSize: 20px
    fontWeight: '600'
    lineHeight: 28px
  body-lg:
    fontFamily: Plus Jakarta Sans
    fontSize: 18px
    fontWeight: '300'
    lineHeight: 28px
  body-md:
    fontFamily: Plus Jakarta Sans
    fontSize: 16px
    fontWeight: '400'
    lineHeight: 24px
  label-sm:
    fontFamily: Plus Jakarta Sans
    fontSize: 12px
    fontWeight: '600'
    lineHeight: 16px
    letterSpacing: 0.05em
rounded:
  sm: 0.5rem
  DEFAULT: 1rem
  md: 1.5rem
  lg: 2rem
  xl: 3rem
  full: 9999px
spacing:
  base: 8px
  container-max-width: 1280px
  gutter: 24px
  margin-desktop: 64px
  margin-mobile: 20px
  card-padding: 32px
---

## Brand & Style

The design system is built on a **Glassmorphic Soft-UI** aesthetic, designed to feel premium, safe, and technologically advanced. It departs from traditional medical aesthetics to embrace a sophisticated educational narrative. The brand personality is optimistic, inclusive, and visionary.

### Visual Style: Glassmorphism & Soft-UI
The interface utilizes a "frosted-glass" metaphor combined with soft, layered depth. It emphasizes:
- **Luminosity:** Elements appear to glow or catch light at the edges.
- **Dimensionality:** Surfaces occupy distinct vertical planes through the use of ambient occlusion shadows and backdrop blurs.
- **Softness:** Sharp edges are eliminated in favor of generous, organic curves that feel approachable and human-centric.

## Colors

The palette is anchored by a warm, off-white background that prevents the clinical feel of pure white.

- **Surface Strategy:** The primary background is `#F8F9FA`. Cards are pure white `#FFFFFF` with varying levels of opacity (80–95%) to allow the backdrop-blur effect to engage with underlying colors.
- **Accent Tones:** 
    - **Deep Green:** Represents growth and safety. Used for primary actions and success states.
    - **Orange-Yellow:** Evokes energy and warmth. Used for highlighted content and premium features.
    - **Teal:** Provides a modern, tech-forward contrast.
- **Gradients:** Use soft, diagonal gradients for large interactive cards and primary buttons to create a sense of depth and motion.

## Typography

This design system uses **Plus Jakarta Sans** for its geometric clarity and friendly character. 

### Typographic Contrast
- **Headlines:** Use heavy weights (700-800) with tight letter-spacing to create a bold, authoritative presence.
- **Body Text:** Utilize the "Light" (300) and "Regular" (400) weights for body copy to maintain a clean, airy feel that complements the glassmorphic surfaces.
- **Hierarchy:** Maintain a clear distinction between "Display" type for hero sections and "Title" type for card headings. Use uppercase labels for small metadata to ensure legibility against blurred backgrounds.

## Layout & Spacing

The layout follows a **Fluid Grid** system with generous whitespace to emphasize the "floating" nature of the UI components.

- **Grid Model:** A 12-column grid for desktop with 24px gutters. On mobile, transition to a 4-column grid.
- **Spacing Rhythm:** Use an 8px base unit. Internal card padding should be at least 32px to provide a premium, uncrowded feel.
- **Outer Margins:** High-end layouts require "breathing room." Desktop margins are set to 64px to center-align the content and create a pillar-like structure in the viewport.

## Elevation & Depth

Hierarchy is established through a combination of **Backdrop Blurs** and **Ambient Shadows**.

- **Level 1 (Base):** Off-white background, no shadow.
- **Level 2 (Cards):** Pure white with 90% opacity, `backdrop-filter: blur(20px)`, and a soft, multi-layered shadow:
  - Shadow A: `0px 4px 12px rgba(0,0,0,0.03)`
  - Shadow B: `0px 20px 40px rgba(0,0,0,0.05)`
- **Level 3 (Interactive/Floating):** Higher elevation for active buttons or modals. Increase the shadow spread and add a 1px semi-transparent white border to simulate a "light-catching" edge.

## Shapes

The design system utilizes **Extremely Rounded** geometry to align with a futuristic and safe aesthetic.

- **Primary Radius:** Use `24px` (rounded-3xl) for all standard cards and containers.
- **Buttons:** All buttons must be **Pill-shaped** (fully rounded) to maximize the "soft-UI" feel.
- **Inputs:** Use a `16px` radius for form fields to differentiate them slightly from the more organic card shapes.

## Components

### Buttons
- **Primary:** Pill-shaped with the `deep-emerald` or `vibrant-orange` gradient. Use a subtle inner-glow (white 10% opacity) on the top edge.
- **Secondary:** White background with a 1px soft-gray border or a subtle 5% tint of the primary color.

### Cards
- **Feature Cards:** Use full-bleed gradients with white text. Apply a subtle "glass" overlay on the bottom third for descriptive text.
- **Content Cards:** White glassmorphic background with `display-lg` or `headline-lg` titles.

### Input Fields
- Soft, off-white fills with no border in the default state. Upon focus, a 2px vibrant teal border and a soft outer glow should appear.

### Chips & Tags
- Small, pill-shaped elements with low-opacity background fills (e.g., 10% emerald with 100% emerald text) to keep the UI light and airy.

### Brand Integration
The **EduSex VN** logo should be treated with a high-end glass effect or simplified into a monochrome "Deep Emerald" mark to integrate seamlessly with the sophisticated, futuristic interface.