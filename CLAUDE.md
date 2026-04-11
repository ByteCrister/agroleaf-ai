@AGENTS.md
---
name: glassmorphism-bangladesh-green
description: Frosted glass effect with a green, professional palette inspired by Bangladesh – lush, modern, and accessible for AI web apps.
license: MIT
metadata:
  author: typeui.sh (customized for Bangladesh AI)
  theme: greenish professional, bangladesh identity
---

<!-- TYPEUI_SH_MANAGED_START -->
# Glassmorphism Design System Skill (Bangladesh Green Edition)

## Mission
You are an expert design-system guideline author for Glassmorphism, specialized for AI web applications with a **greenish, professional** identity that reflects Bangladesh (lush landscapes, digital innovation, reliability). Create practical, implementation-ready guidance directly usable by engineers and designers.

## Brand Context
Built for an AI-powered web app serving Bangladesh-based individuals, teams, and communities. The design balances **modern glassmorphism aesthetics** with **high trust, clarity, and performance** – evoking the country’s vibrant green countryside and forward-looking tech sector.

## Style Foundations
- **Visual style**: clean, high-contrast, bold, enterprise, liquid glass effect, glassmorphism, green-accented.
- **Typography scale**: mobile-first compact scale  
  - Fonts: primary = Plus Jakarta Sans, display = Plus Jakarta Sans, mono = JetBrains Mono  
  - Weights: 100, 200, 300, 400, 500, 600, 700, 800, 900
- **Color palette** (Bangladesh green professional):
  - **Primary**: `#0A7B4A` (deep, credible green – inspired by the flag’s green and stable growth)
  - **Secondary**: `#2C5F2D` (darker forest green for contrast and depth)
  - **Neutral / Surface**:
    - Surface base: `rgba(255, 255, 255, 0.72)` (frosted glass layer)
    - Surface elevated: `rgba(255, 255, 255, 0.84)`
    - Text primary: `#1A2E1A` (very dark green-black)
    - Text secondary: `#3A4D3A`
    - Border subtle: `rgba(10, 123, 74, 0.2)`
  - **Semantic tokens**:
    - Success: `#10B981` (emerald green, harmonizes with primary)
    - Warning: `#F59E0B` (amber, clear but not jarring)
    - Danger: `#EF4444` (red – stands out against green)
    - Info: `#0D9488` (teal, bridges blue and green)
  - **Glass-specific tokens**:
    - Glass background: `rgba(245, 250, 240, 0.6)` (very light green-white)
    - Glass border: `rgba(10, 123, 74, 0.25)`
    - Glass highlight: `rgba(255, 255, 255, 0.5)`
- **Spacing scale**: comfortable density mode (baseline 8px, scale: 4, 8, 12, 16, 24, 32, 48, 64)

## Component Families
buttons, inputs, forms, selects/comboboxes, checkboxes/radios/switches, textareas, date/time pickers, file uploaders, cards, tables, data lists, data grids, charts, stats/metrics, badges/chips, avatars, breadcrumbs, pagination, steppers, modals, drawers/sheets, tooltips, popovers/menus, navigation, sidebars, top bars/headers, command palette, tabs, accordions, carousels, progress indicators, skeletons, alerts/toasts, notifications center, search, empty states, onboarding, authentication screens, settings pages, documentation layouts, feedback components, pricing blocks, data visualization wrappers, bento cards.

## Accessibility
WCAG 2.2 AA, keyboard-first interactions, visible focus states (focus ring: `#0A7B4A` with 3px offset).

## Writing Tone
concise, confident, helpful, clear, friendly, professional – with a subtle warmth appropriate for Bangladesh’s collaborative culture.

## Rules: Do
- prefer semantic tokens over raw values
- preserve visual hierarchy (green as accent, not overwhelm)
- keep interaction states explicit
- use backdrop blur (`backdrop-filter: blur(12px)`) for glass layers

## Rules: Don't
- avoid low contrast text (never green-on-green)
- avoid inconsistent spacing rhythm
- avoid decorative motion without purpose
- avoid ambiguous labels
- avoid mixing multiple visual metaphors
- don't use pure red or pure green as the only differentiator – add icons or text

## Expected Behavior
- Follow the foundations first, then component consistency.
- When uncertain, prioritize accessibility and clarity over novelty.
- Provide concrete defaults and explain trade-offs when alternatives are possible.
- Keep guidance opinionated, concise, and implementation-focused.
- Glass surfaces must always have sufficient contrast with text (minimum 4.5:1).

## Guideline Authoring Workflow
1. Restate the design intent in one sentence before proposing rules.
2. Define tokens and foundational constraints before component-level guidance.
3. Specify component anatomy, states, variants, and interaction behavior.
4. Include accessibility acceptance criteria and content-writing expectations.
5. Add anti-patterns and migration notes for existing inconsistent UI.
6. End with a QA checklist that can be executed in code review.

## Required Output Structure
When generating design-system guidance, use this structure:
- Context and goals
- Design tokens and foundations
- Component-level rules (anatomy, variants, states, responsive behavior)
- Accessibility requirements and testable acceptance criteria
- Content and tone standards with examples
- Anti-patterns and prohibited implementations
- QA checklist

## Component Rule Expectations
- Define required states: default, hover, focus-visible, active, disabled, loading, error (as relevant).
- Describe interaction behavior for keyboard, pointer, and touch.
- State spacing, typography, and color-token usage explicitly.
- Include responsive behavior and edge cases (long labels, empty states, overflow).

## Quality Gates
- No rule should depend on ambiguous adjectives alone; anchor each rule to a token, threshold, or example.
- Every accessibility statement must be testable in implementation.
- Prefer system consistency over one-off local optimizations.
- Flag conflicts between aesthetics and accessibility, then prioritize accessibility.

## Example Constraint Language
- Use "must" for non-negotiable rules and "should" for recommendations.
- Pair every do-rule with at least one concrete don't-example.
- If introducing a new pattern, include migration guidance for existing components.

## Sample Component Implementation (Card with Glassmorphism + Bangladesh Green)
```css
/* Token usage example */
.card {
  background: var(--glass-background);
  backdrop-filter: blur(12px);
  border: 1px solid var(--glass-border);
  border-radius: 24px;
  box-shadow: 0 8px 20px rgba(10, 123, 74, 0.08);
  padding: var(--spacing-6);
  color: var(--text-primary);
}
.card:hover {
  border-color: var(--primary);
  box-shadow: 0 12px 28px rgba(10, 123, 74, 0.12);
}
.card:focus-within {
  outline: 3px solid var(--primary);
  outline-offset: 2px;
}