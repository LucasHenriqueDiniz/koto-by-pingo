---
name: Koto Learning
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
  on-surface-variant: '#59413f'
  inverse-surface: '#213145'
  inverse-on-surface: '#eaf1ff'
  outline: '#8c706f'
  outline-variant: '#e0bfbc'
  surface-tint: '#af2d32'
  primary: '#ac2b2f'
  on-primary: '#ffffff'
  primary-container: '#ce4445'
  on-primary-container: '#fffbff'
  inverse-primary: '#ffb3af'
  secondary: '#565e74'
  on-secondary: '#ffffff'
  secondary-container: '#dae2fd'
  on-secondary-container: '#5c647a'
  tertiary: '#006856'
  on-tertiary: '#ffffff'
  tertiary-container: '#00846d'
  on-tertiary-container: '#f4fffa'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#ffdad7'
  primary-fixed-dim: '#ffb3af'
  on-primary-fixed: '#410005'
  on-primary-fixed-variant: '#8d131d'
  secondary-fixed: '#dae2fd'
  secondary-fixed-dim: '#bec6e0'
  on-secondary-fixed: '#131b2e'
  on-secondary-fixed-variant: '#3f465c'
  tertiary-fixed: '#86f7d9'
  tertiary-fixed-dim: '#69dabd'
  on-tertiary-fixed: '#002019'
  on-tertiary-fixed-variant: '#005142'
  background: '#f8f9ff'
  on-background: '#0b1c30'
  surface-variant: '#d3e4fe'
  background-surface: '#F8FAFC'
  cherry-blossom-light: '#FFF1F1'
  border-subtle: '#E2E8F0'
typography:
  display:
    fontFamily: Plus Jakarta Sans
    fontSize: 48px
    fontWeight: '700'
    lineHeight: 56px
    letterSpacing: -0.02em
  headline-lg:
    fontFamily: Plus Jakarta Sans
    fontSize: 32px
    fontWeight: '600'
    lineHeight: 40px
  headline-lg-mobile:
    fontFamily: Plus Jakarta Sans
    fontSize: 24px
    fontWeight: '600'
    lineHeight: 32px
  headline-md:
    fontFamily: Plus Jakarta Sans
    fontSize: 24px
    fontWeight: '600'
    lineHeight: 32px
  body-lg:
    fontFamily: Inter
    fontSize: 18px
    fontWeight: '400'
    lineHeight: 28px
  body-md:
    fontFamily: Inter
    fontSize: 16px
    fontWeight: '400'
    lineHeight: 24px
  body-sm:
    fontFamily: Inter
    fontSize: 14px
    fontWeight: '400'
    lineHeight: 20px
  label-md:
    fontFamily: Inter
    fontSize: 14px
    fontWeight: '600'
    lineHeight: 16px
    letterSpacing: 0.01em
  label-sm:
    fontFamily: Inter
    fontSize: 12px
    fontWeight: '500'
    lineHeight: 16px
rounded:
  sm: 0.25rem
  DEFAULT: 0.5rem
  md: 0.75rem
  lg: 1rem
  xl: 1.5rem
  full: 9999px
spacing:
  unit: 8px
  container-max: 1200px
  gutter: 24px
  margin-mobile: 16px
  margin-desktop: 32px
---

## Brand & Style

The design system is built for a progressive Japanese learning experience that balances cultural heritage with modern educational technology. The brand personality is "Enlightened Simplicity"—removing the intimidation factor often associated with language learning to create a pressure-free, inviting atmosphere.

The aesthetic follows a **Modern Minimalist** approach with subtle **Zen-inspired** influences. It utilizes heavy whitespace to reduce cognitive load, allowing Japanese characters (Kanji, Hiragana, and Katakana) to breathe and maintain high legibility. The interface feels intentional and rhythmic, guiding students through their learning journey with clarity and grace.

## Colors

The palette is anchored by a soft, contemporary red—reminiscent of the sun and traditional lacquerware, but tuned for digital endurance. 

- **Primary (#E15252):** Used for primary actions, progress indicators, and key brand moments. It is energetic yet warm, avoiding the aggressive "error red" associated with traditional grading.
- **Secondary (#0F172A):** A deep navy used for high-contrast typography and essential navigation elements.
- **Neutral / Surface (#64748B, #F8FAFC):** A foundation of cool grays and off-whites provides a calm environment that doesn't strain the eyes during long study sessions.
- **System Colors:** Use the primary red sparingly for success and celebratory states by adjusting saturation; use standard semantic tokens for warnings or errors in secondary contexts.

## Typography

The typography system prioritizes the harmonious coexistence of Latin and Japanese scripts. 

**Plus Jakarta Sans** is used for headlines to provide a friendly, open, and modern geometric feel. **Inter** handles all body copy and interface labels due to its exceptional legibility and systematic weights. For Japanese characters, the system defaults to a clean Gothic (Sans-Serif) stack to match the weight of Inter, ensuring that Kanji characters do not appear overly heavy or "noisy" next to Portuguese text.

- Use **display** styles for lesson titles and achievement milestones.
- Ensure a minimum line height of 1.6x for Japanese text blocks to prevent character collisions and improve stroke recognition.

## Layout & Spacing

The layout philosophy follows a **Fixed-Fluid hybrid** grid. Content is centered within a maximum width of 1200px for desktop to prevent overly long line lengths that hinder reading speed. 

- **The 8px Rhythm:** All spacing (padding, margins, gaps) must be a multiple of 8px. 
- **Learning Zones:** Lessons utilize a "focused center column" (600px - 800px) to minimize distractions.
- **Vertical Air:** Use generous vertical spacing (48px - 64px) between major sections to reinforce the sense of "Zen" and prevent the UI from feeling cluttered.
- **Mobile:** Transition to a single-column layout with 16px side margins and 16px gutters between cards.

## Elevation & Depth

This design system uses **Tonal Layering** rather than traditional shadows to maintain a clean, flat aesthetic that feels contemporary.

- **Level 0 (Base):** The main background color (#F8FAFC).
- **Level 1 (Cards):** Pure white (#FFFFFF) surfaces with a subtle 1px border (#E2E8F0). 
- **Level 2 (Interactive):** Elements that are clickable or hoverable use a very soft, ambient shadow (4px blur, 2% opacity) or a slight color shift to a light red wash (#FFF1F1).
- **Overlays:** Use a semi-transparent backdrop blur (8px) for modals to keep the user grounded in their current context while focusing on the specific task at hand.

## Shapes

The shape language is "Soft-Modern." Sharp corners are avoided to keep the experience approachable and gentle. 

- **Standard Elements:** Buttons, input fields, and cards use a 0.5rem (8px) radius.
- **Large Elements:** Featured lesson cards or promotional banners use a 1rem (16px) radius.
- **Micro-elements:** Tags and chips use a pill shape (full radius) to distinguish them from actionable buttons.

## Components

### Buttons
- **Primary:** Solid #E15252 with white text. High contrast, slightly rounded (8px). On hover, darkens slightly.
- **Secondary:** White background with #E15252 border and text. Used for less critical actions.
- **Ghost:** No background or border, #64748B text. Used for "Cancel" or "Back" actions.

### Input Fields
- Inputs feature a light gray border (#E2E8F0) that transitions to Primary Red (#E15252) on focus. Labels sit clearly above the field in `label-md`.

### Cards
- Standard white background with 8px corner radius and a 1px subtle border. No heavy shadows. Cards for Kanji flashcards should have increased padding (32px) to center the character prominently.

### Progress Indicators
- Linear bars using #E15252 for the fill and #FFF1F1 for the track. Progress should feel fluid and encouraging.

### Flashcards
- A specialized component with a clear distinction between the "Front" (Kanji/Kana) and "Back" (Meaning/Reading). Front-side typography should be at least 64px for clarity of strokes.

### Chips & Tags
- Used for difficulty levels (N5, N4, etc.) or categories. Pill-shaped with low-saturation background tints derived from the primary color.