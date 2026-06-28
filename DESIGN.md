---
name: Afterbloom
description: Postpartum daily support with a warm, private, steady interface.
colors:
  dawn-blush: "#C77E83"
  dawn-rose: "#AF636A"
  serif-ink: "#3E342C"
  body-ink: "#6C5F56"
  quiet-taupe: "#9C8E83"
  paper: "#FBF6F0"
  dawn-mist: "#FBF2EC"
  line-soft: "#EFE6DC"
  success-sage: "#5E8169"
  success-wash: "#E7EFE8"
  support-mint: "#F6FAF7"
typography:
  display:
    fontFamily: "Newsreader, serif"
    fontSize: "42px"
    fontWeight: 500
    lineHeight: 1
    letterSpacing: "-0.015em"
  headline:
    fontFamily: "Newsreader, serif"
    fontSize: "28px"
    fontWeight: 500
    lineHeight: 1.15
    letterSpacing: "-0.01em"
  title:
    fontFamily: "Plus Jakarta Sans, system-ui, sans-serif"
    fontSize: "14px"
    fontWeight: 700
    lineHeight: 1.4
  body:
    fontFamily: "Plus Jakarta Sans, system-ui, sans-serif"
    fontSize: "13.5px"
    fontWeight: 600
    lineHeight: 1.55
  label:
    fontFamily: "Plus Jakarta Sans, system-ui, sans-serif"
    fontSize: "11px"
    fontWeight: 800
    lineHeight: 1.2
    letterSpacing: "0.12em"
rounded:
  input: "8px"
  chip: "10px"
  card: "14px"
  panel: "16px"
  hero: "18px"
spacing:
  xs: "8px"
  sm: "12px"
  md: "16px"
  lg: "22px"
  xl: "28px"
components:
  button-primary:
    backgroundColor: "{colors.dawn-blush}"
    textColor: "#FFFFFF"
    typography: "{typography.title}"
    rounded: "15px"
    padding: "16px"
  button-primary-hover:
    backgroundColor: "{colors.dawn-rose}"
    textColor: "#FFFFFF"
    typography: "{typography.title}"
    rounded: "15px"
    padding: "16px"
  card-default:
    backgroundColor: "#FFFFFF"
    textColor: "{colors.serif-ink}"
    rounded: "{rounded.panel}"
    padding: "20px"
  chip-support:
    backgroundColor: "{colors.success-wash}"
    textColor: "{colors.success-sage}"
    typography: "{typography.label}"
    rounded: "18px"
    padding: "7px 13px"
  input-soft:
    backgroundColor: "#FFFFFF"
    textColor: "{colors.serif-ink}"
    rounded: "{rounded.input}"
    padding: "10px 12px"
---

# Design System: Afterbloom

## Overview

**Creative North Star: "The Dawn Recovery Journal"**

Afterbloom should feel like a private recovery companion opened in the quiet first hour of the day: warm enough to soften the experience, restrained enough to stay credible, and steady enough to support repeat use when the user is tired. The visual system already points in that direction through editorial serif headlines, soft rose-and-sage state cues, and paper-toned surfaces that feel intimate rather than clinical.

This is not a landing page language system. It is a task-first product UI for postpartum care. The interface should always privilege orientation, next steps, and emotional clarity over decorative flourish. Every gesture, label, and surface has to reduce cognitive load and preserve dignity.

Afterbloom explicitly rejects anything that reads like a period tracker, nursery app, or sugary self-care toy. It must never become childish, overly sweet, or wellness-generic.

**Key Characteristics:**
- Warm but not cute
- Private rather than performative
- Editorial typography on top of product UI discipline
- Low-friction, one-handed mobile-first interactions
- Calm support cues instead of alarm-heavy risk language

## Colors

The palette is a restrained dawn palette: blush and rose carry guidance and action, sage carries reassurance, and soft paper neutrals do most of the work.

### Primary
- **Dawn Blush** (`#C77E83`): The primary action and emotional anchor. Use it for the main check-in button, current-stage markers, and the strongest interactive emphasis.
- **Dawn Rose** (`#AF636A`): The secondary warm accent. Use it for badges, support-level highlights, stage emphasis, and supportive notices that need presence without becoming urgent.

### Tertiary
- **Recovery Sage** (`#5E8169`): The positive-state color. Use it for saved states, resolved actions, success tags, and reassurance moments. It must feel steady, never celebratory-neon.

### Neutral
- **Serif Ink** (`#3E342C`): Primary reading color for card titles, summaries, and editorial headings.
- **Body Ink** (`#6C5F56`): Main body copy on light surfaces. This is the reading workhorse.
- **Quiet Taupe** (`#9C8E83`): Metadata, timelines, helper text, and subdued labels. Never let it replace Body Ink for long text.
- **Paper** (`#FBF6F0`): Main sheet and app body surface.
- **Dawn Mist** (`#FBF2EC`): Warmer hero/header wash behind animated blobs and top-of-screen welcome moments.
- **Soft Line** (`#EFE6DC`): Borders, dividers, and low-contrast containment.
- **Support Mint** (`#F6FAF7`): Soft supportive container tint for daily goals and low-pressure guidance.

**The One Warm Accent Rule.** Blush and rose are not decorative confetti. On any given screen, one warm accent should lead and the rest of the interface should stay neutral enough for the user to read and act calmly.

## Typography

**Display Font:** Newsreader (serif)
**Body Font:** Plus Jakarta Sans (system-ui fallback)
**Label/Mono Font:** Plus Jakarta Sans

**Character:** The system pairs a soft editorial serif for emotional framing with a crisp sans for product work. That contrast is the core signature: the serif invites reflection, the sans keeps the workflow trustworthy and legible.

### Hierarchy
- **Display** (`500`, `42px`, `1.0`): Used in top-of-screen emotional framing such as Home and Mood headers. Keep it short and intimate.
- **Headline** (`500`, `28px`, `1.15`): Used for card-level focus states such as the care journey phase and major check-in prompts.
- **Title** (`700`, `14px`, `1.4`): Used for card summaries, support labels, and action headings.
- **Body** (`600`, `13.5px`, `1.55`): Used for explanatory copy and guidance. Keep longer passages within a calm, narrow measure on mobile.
- **Label** (`800`, `11px`, `0.12em`): Used for compact metadata, overlines, and supportive chip text. Uppercase is allowed here only when the text is short and functional.

**The Serif-for-Meaning Rule.** Newsreader appears only where the product is framing feeling, progress, or reflection. Labels, controls, data, and dense UI stay in Plus Jakarta Sans.

## Elevation

Afterbloom uses a hybrid elevation model: flat paper-toned surfaces define the main app shell, while white cards gain a very soft ambient lift to separate action zones from the background. Depth should feel breathable, not glossy.

### Shadow Vocabulary
- **Ambient Card Lift** (`0 2px 12px rgba(80,56,42,.05)`): The default shadow for cards such as timelines, trend panels, and summaries. It is structural, not decorative.
- **Hero Card Lift** (`0 12px 32px rgba(80,56,42,.09)`): Reserved for the main check-in card where a stronger entry point is needed.
- **Action Glow** (`0 12px 30px rgba(168,72,72,.4)` plus supporting inset layers): Reserved for the primary check-in button only.

**The Flat-by-Default Rule.** Surfaces do not stack shadow on shadow. If a card already has a border and ambient lift, nested controls should rely on tint, type, or spacing before introducing more depth.

## Components

### Buttons
- **Shape:** Rounded and reassuring, but not toy-like (`15px` primary, `18px` pill actions).
- **Primary:** Warm blush gradient-led CTA with white text, full-width layout, and generous vertical padding (`16px`). This is the main daily action vocabulary.
- **Hover / Focus:** State feedback should come from contrast shifts, a clear focus ring, and subtle press behavior. Reduced-motion mode should disable shimmer, ripple, and bounce-style feedback.
- **Secondary / Text:** Smaller sage or taupe actions can exist for low-pressure moments, but they should never compete with the primary check-in CTA.

### Chips
- **Style:** Small rounded support tags and status pills use tinted backgrounds with strong text contrast, usually sage or blush families.
- **State:** Saved, support-level, and micro-status chips should read immediately without feeling like gamified badges.

### Cards / Containers
- **Corner Style:** Softly rounded panels (`14px` to `18px`) with clear containment.
- **Background:** White action cards on paper-toned app surfaces. Supportive secondary containers may use mint or blush tints sparingly.
- **Shadow Strategy:** One soft lift per card. No glassmorphism and no stacked nested-card grids.
- **Border:** Fine warm-taupe borders (`#EFE6DC`) define most containers.
- **Internal Padding:** The working rhythm is `18px` to `22px`, giving mobile cards enough breathing room without wasting vertical space.

### Inputs / Fields
- **Style:** White or near-white fields with warm neutral borders, small radii (`8px`), and body-text sizing that stays readable under fatigue.
- **Focus:** Focus must be unmistakable at WCAG AA. Use border darkening and a visible outline treatment rather than relying on color alone.
- **Error / Disabled:** Error states should feel guiding, not punitive. Disabled states should preserve legibility and never wash out placeholder text below readable contrast.

### Navigation
- **Style:** Navigation should feel quiet and obvious. Labels must be plain, tap targets generous, and active states clear through color and weight rather than novelty.
- **Mobile Treatment:** The app is phone-first. Keep primary actions near thumb reach and avoid forcing the user to decode hidden or clever navigation patterns.

### Signature Component
- **The Check-in Hero Card:** This is the product's center of gravity. It pairs a status chip, a serif emotional prompt, one short explanation, and one dominant action. Any redesign that dilutes this clarity is wrong.

## Do's and Don'ts

### Do:
- **Do** keep the main action singular and obvious on every screen, especially Home and Mood.
- **Do** preserve the serif-plus-sans pairing; it is the product's strongest non-color identity cue.
- **Do** keep body text in the darker ink colors (`#3E342C` or `#6C5F56`) to maintain WCAG AA readability on paper surfaces.
- **Do** support `prefers-reduced-motion: reduce` by removing blob drift, shimmer, ripple, and spring-heavy feedback where motion is decorative.
- **Do** use sage for reassurance and recovery states, not bright green celebration language.

### Don't:
- **Don't** make this look like a landing surface or marketing splash page.
- **Don't** make this look like a period tracker.
- **Don't** make it childish, sugary, overly sweet, or pastel-toy soft.
- **Don't** rely on low-contrast taupe text for explanatory copy or placeholders.
- **Don't** solve hierarchy by stacking cards inside cards or by adding decorative gradients everywhere.
