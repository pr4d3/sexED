---
version: alpha
name: analytics-dashboard-design
description: A data-forward analytics dashboard anchored on a soft off-white canvas with white cards and a rounded sans-serif typeface (Nunito or Inter) used at normal sentence-case. Brand energy comes from tightly arranged KPI cards, micro-badge deltas (+18% / -5%), sparklines, and grouped chart sections — not from photography or decoration. The accent palette is functional: teal for positive/growth, red-pink for negative/loss, orange for caution, near-black for primary actions. Every card floats on the canvas with a soft shadow; border radius is generous and consistent throughout.

colors:
  primary: "#000000"
  ink: "#344767"
  body: "#67748e"
  body-strong: "#344767"
  muted: "#ced4da"
  hairline: "#e9ecef"
  hairline-strong: "#dee2e6"
  canvas: "#f8f9fa"
  surface-card: "#ffffff"
  surface-elevated: "#f0f2f5"
  surface-soft: "#f8f9fa"
  on-primary: "#ffffff"
  on-dark: "#ffffff"
  success: "#2dce89"
  success-bg: "#d4f5e9"
  danger: "#f5365c"
  danger-bg: "#fde8ec"
  warning: "#fb6340"
  warning-bg: "#ffe8e0"
  info: "#5e72e4"
  info-bg: "#eaecfb"
  teal: "#11cdef"
  teal-bg: "#e0f9fd"
  chart-primary: "#1a1a1a"
  chart-secondary: "#d1d1d1"
  chart-usa: "#1a1a1a"
  chart-india: "#c8c8c8"

typography:
  display-xl:
    fontFamily: "Nunito, Inter, sans-serif"
    fontSize: 36px
    fontWeight: 700
    lineHeight: 1.2
    letterSpacing: 0
  display-lg:
    fontFamily: "Nunito, Inter, sans-serif"
    fontSize: 28px
    fontWeight: 700
    lineHeight: 1.25
    letterSpacing: 0
  display-md:
    fontFamily: "Nunito, Inter, sans-serif"
    fontSize: 24px
    fontWeight: 700
    lineHeight: 1.3
    letterSpacing: 0
  display-sm:
    fontFamily: "Nunito, Inter, sans-serif"
    fontSize: 20px
    fontWeight: 700
    lineHeight: 1.35
    letterSpacing: 0
  title-lg:
    fontFamily: "Nunito, Inter, sans-serif"
    fontSize: 18px
    fontWeight: 700
    lineHeight: 1.4
    letterSpacing: 0
  title-md:
    fontFamily: "Nunito, Inter, sans-serif"
    fontSize: 16px
    fontWeight: 600
    lineHeight: 1.4
    letterSpacing: 0
  title-sm:
    fontFamily: "Nunito, Inter, sans-serif"
    fontSize: 14px
    fontWeight: 600
    lineHeight: 1.4
    letterSpacing: 0
  label-regular:
    fontFamily: "Nunito, Inter, sans-serif"
    fontSize: 13px
    fontWeight: 400
    lineHeight: 1.4
    letterSpacing: 0
  body-md:
    fontFamily: "Nunito, Inter, sans-serif"
    fontSize: 14px
    fontWeight: 400
    lineHeight: 1.6
    letterSpacing: 0
  body-sm:
    fontFamily: "Nunito, Inter, sans-serif"
    fontSize: 12px
    fontWeight: 400
    lineHeight: 1.5
    letterSpacing: 0
  caption:
    fontFamily: "Nunito, Inter, sans-serif"
    fontSize: 11px
    fontWeight: 400
    lineHeight: 1.4
    letterSpacing: 0
  metric-xl:
    fontFamily: "Nunito, Inter, sans-serif"
    fontSize: 28px
    fontWeight: 700
    lineHeight: 1.1
    letterSpacing: -0.5px
  metric-lg:
    fontFamily: "Nunito, Inter, sans-serif"
    fontSize: 22px
    fontWeight: 700
    lineHeight: 1.1
    letterSpacing: -0.3px
  metric-sm:
    fontFamily: "Nunito, Inter, sans-serif"
    fontSize: 18px
    fontWeight: 600
    lineHeight: 1.2
    letterSpacing: 0
  badge:
    fontFamily: "Nunito, Inter, sans-serif"
    fontSize: 12px
    fontWeight: 700
    lineHeight: 1
    letterSpacing: 0
  button:
    fontFamily: "Nunito, Inter, sans-serif"
    fontSize: 14px
    fontWeight: 600
    lineHeight: 1
    letterSpacing: 0
  table-header:
    fontFamily: "Nunito, Inter, sans-serif"
    fontSize: 13px
    fontWeight: 600
    lineHeight: 1.3
    letterSpacing: 0
  nav-link:
    fontFamily: "Nunito, Inter, sans-serif"
    fontSize: 14px
    fontWeight: 400
    lineHeight: 1.4
    letterSpacing: 0

rounded:
  none: 0px
  xs: 4px
  sm: 8px
  md: 12px
  lg: 16px
  xl: 20px
  full: 9999px

spacing:
  xxs: 4px
  xs: 8px
  sm: 12px
  md: 16px
  lg: 24px
  xl: 32px
  xxl: 48px
  section: 64px

shadow:
  card: "0 2px 12px rgba(0,0,0,0.08)"
  card-hover: "0 4px 20px rgba(0,0,0,0.12)"
  dropdown: "0 8px 24px rgba(0,0,0,0.12)"

components:
  button-primary:
    backgroundColor: "{colors.primary}"
    textColor: "{colors.on-primary}"
    typography: "{typography.button}"
    rounded: "{rounded.sm}"
    padding: 12px 24px
    height: 42px
  button-outline:
    backgroundColor: transparent
    textColor: "{colors.ink}"
    typography: "{typography.button}"
    rounded: "{rounded.sm}"
    padding: 12px 24px
    height: 42px
  button-ghost:
    backgroundColor: transparent
    textColor: "{colors.body}"
    typography: "{typography.button}"
    rounded: "{rounded.sm}"
    padding: 8px 16px
    height: 36px
  badge-success:
    backgroundColor: "{colors.success-bg}"
    textColor: "{colors.success}"
    typography: "{typography.badge}"
    rounded: "{rounded.full}"
    padding: 4px 8px
  badge-danger:
    backgroundColor: "{colors.danger-bg}"
    textColor: "{colors.danger}"
    typography: "{typography.badge}"
    rounded: "{rounded.full}"
    padding: 4px 8px
  badge-warning:
    backgroundColor: "{colors.warning-bg}"
    textColor: "{colors.warning}"
    typography: "{typography.badge}"
    rounded: "{rounded.full}"
    padding: 4px 8px
  badge-info:
    backgroundColor: "{colors.info-bg}"
    textColor: "{colors.info}"
    typography: "{typography.badge}"
    rounded: "{rounded.full}"
    padding: 4px 8px
  kpi-card:
    backgroundColor: "{colors.surface-card}"
    textColor: "{colors.ink}"
    rounded: "{rounded.md}"
    padding: 20px 24px
    shadow: "{shadow.card}"
  chart-card:
    backgroundColor: "{colors.surface-card}"
    textColor: "{colors.ink}"
    rounded: "{rounded.md}"
    padding: 20px 24px
    shadow: "{shadow.card}"
  metric-value:
    textColor: "{colors.ink}"
    typography: "{typography.metric-xl}"
  metric-label:
    textColor: "{colors.body}"
    typography: "{typography.body-sm}"
  delta-badge:
    rounded: "{rounded.full}"
    typography: "{typography.badge}"
    padding: 3px 8px
  transaction-row:
    backgroundColor: "{colors.surface-card}"
    textColor: "{colors.ink}"
    typography: "{typography.body-md}"
    padding: 12px 0
  transaction-icon:
    size: 36px
    rounded: "{rounded.full}"
  data-table:
    backgroundColor: "{colors.surface-card}"
    textColor: "{colors.ink}"
    rounded: "{rounded.md}"
    headerColor: "{colors.body}"
    rowHeight: 52px
  performance-bar:
    backgroundColor: "{colors.hairline}"
    height: 6px
    rounded: "{rounded.full}"
  search-input:
    backgroundColor: "{colors.surface-card}"
    textColor: "{colors.ink}"
    typography: "{typography.body-md}"
    rounded: "{rounded.full}"
    padding: 8px 16px
    height: 38px
    shadow: "{shadow.card}"
  dropdown-selector:
    backgroundColor: "{colors.surface-card}"
    textColor: "{colors.ink}"
    typography: "{typography.body-sm}"
    rounded: "{rounded.sm}"
    padding: 6px 12px
    height: 32px
    shadow: "{shadow.card}"
  icon-wrapper:
    size: 40px
    rounded: "{rounded.full}"
    backgroundColor: "{colors.hairline}"
  sparkline-card:
    backgroundColor: "{colors.surface-card}"
    rounded: "{rounded.md}"
    shadow: "{shadow.card}"
    padding: 20px 24px
  donut-chart:
    backgroundColor: "{colors.surface-card}"
    rounded: "{rounded.md}"
    shadow: "{shadow.card}"
    padding: 20px 24px
  country-list-row:
    backgroundColor: transparent
    textColor: "{colors.ink}"
    typography: "{typography.body-md}"
    padding: 10px 0
  avatar-group:
    size: 28px
    border: "2px solid {colors.surface-card}"
    rounded: "{rounded.full}"
  footer:
    backgroundColor: "{colors.canvas}"
    textColor: "{colors.body}"
    typography: "{typography.body-sm}"
    padding: 24px
---

## Overview

This analytics dashboard uses a soft off-white canvas (`{colors.canvas}` — #f8f9fa) as the page floor, with white cards (`{colors.surface-card}` — #fff) floating above it via a gentle box shadow. The system is entirely data-driven: every visual element serves a metric or action. Decoration is absent — visual hierarchy comes from card grouping, metric scale, and a tightly controlled semantic color palette.

The **functional accent palette** carries all the brand energy: `{colors.success}` (#2dce89) for positive delta, `{colors.danger}` (#f5365c) for negative delta, `{colors.warning}` (#fb6340) for caution signals, `{colors.info}` (#5e72e4) for informational callouts, and `{colors.teal}` (#11cdef) for highlight accents. These colors appear only on badges, delta values, chart fill segments, and performance bars — never as large surface fills.

Charts use a **near-black / light-gray pair** (`{colors.chart-primary}` / `{colors.chart-secondary}`) for bar series to keep visual weight neutral when data is not semantically coded. Area sparklines and line charts use the same near-black stroke on a transparent fill.

Type runs in **Nunito** (or Inter as a fallback) — a rounded geometric sans-serif that feels approachable, not corporate. Weight pairs: 700 for metric values and card titles, 600 for table headers and button labels, 400 for body text and metadata. All text is sentence-case; no all-caps treatments exist in the system.

**Key Characteristics:**

- Off-white canvas (`{colors.canvas}` — #f8f9fa) holding white cards with `{shadow.card}` (0 2px 12px rgba(0,0,0,0.08)). Cards are never flush to the canvas.
- All-rounded language: `{rounded.md}` (12px) on cards, `{rounded.full}` (9999px) on badges and icon circles. The radius is the system's visual signature — nothing is sharp-edged.
- Semantic badge system: green for positive delta, red for negative, orange for warning, with pill-shaped full-radius badges.
- Metric typography is the headline: large `{typography.metric-xl}` (28px / 700) values paired with tiny `{typography.body-sm}` labels below them.
- Charts are chromatic-neutral (black/gray series) unless data carries semantic meaning (positive/negative, country breakdowns). Never use accent colors on charts without semantic purpose.
- Spacing is compact but breathable: `{spacing.md}` (16px) inside cards; `{spacing.lg}` (24px) between card sections; `{spacing.section}` (64px) between major page zones.
- Primary actions ("View Full Report") use a near-black filled button with white text and `{rounded.sm}` (8px) corners. No flat or sharp-edged buttons.

## Colors

### Semantic Accent Colors

- **Success** (`{colors.success}` — #2dce89): Positive delta indicators (+18%, +4.7%). Also used as a performance bar fill for high-performing campaigns.
- **Success Background** (`{colors.success-bg}` — #d4f5e9): Pill background for positive delta badges. Always paired with `{colors.success}` text.
- **Danger** (`{colors.danger}` — #f5365c): Negative delta indicators (-5%, -1.7%). Also used as a performance bar fill for declining campaigns.
- **Danger Background** (`{colors.danger-bg}` — #fde8ec): Pill background for negative delta badges. Always paired with `{colors.danger}` text.
- **Warning** (`{colors.warning}` — #fb6340): Caution-level performance bars. Also the campaign "orange" series on bar charts.
- **Warning Background** (`{colors.warning-bg}` — #ffe8e0): Pill background for warning state badges.
- **Info** (`{colors.info}` — #5e72e4): Informational callouts and selected states. Not used for CTA actions.
- **Info Background** (`{colors.info-bg}` — #eaecfb): Pill background for info badges.
- **Teal** (`{colors.teal}` — #11cdef): Highlight accent on specific KPI deltas and sparkline callouts. Not interchangeable with `{colors.success}` — teal is an aesthetic accent; green is a semantic signal.

### Surface

- **Canvas** (`{colors.canvas}` — #f8f9fa): The page background. Slightly warm gray — never pure white at the page level.
- **Surface Card** (`{colors.surface-card}` — #ffffff): All cards, dropdowns, and modal surfaces. Pure white.
- **Surface Elevated** (`{colors.surface-elevated}` — #f0f2f5): Hover states, selected table rows, secondary backgrounds nested inside cards.
- **Surface Soft** (`{colors.surface-soft}` — #f8f9fa): Same as canvas — used inside cards as a nested soft section (e.g., chart plot area background).

### Hairlines & Borders

- **Hairline** (`{colors.hairline}` — #e9ecef): The default 1px divider. Used between table rows, around card outlines when shadow is insufficient, inside search inputs.
- **Hairline Strong** (`{colors.hairline-strong}` — #dee2e6): Stronger dividers between major sections within a card or below the table header row.

### Text

- **Ink / Body Strong** (`{colors.body-strong}` / `{colors.ink}` — #344767): All card titles, metric values, table content, and primary text on white surfaces.
- **Body** (`{colors.body}` — #67748e): Secondary labels, column headers, subtitles, metric sub-labels.
- **Muted** (`{colors.muted}` — #ced4da): Placeholder text, tertiary metadata, disabled states.
- **On Primary / On Dark** (`{colors.on-primary}` — #ffffff): Text on dark/primary-color backgrounds (e.g., black buttons, teal accents).

### Chart Colors

- **Chart Primary** (`{colors.chart-primary}` — #1a1a1a): Main bar series, primary line stroke. Near-black for visual weight.
- **Chart Secondary** (`{colors.chart-secondary}` — #d1d1d1): Secondary bar series, grid lines, reference bars.
- **Chart USA / India** (`{colors.chart-usa}` / `{colors.chart-india}`): Grouped series identifiers in the "Sales from Locations" chart — black and light gray.

## Typography

### Font Family

**Nunito** (or **Inter** as system fallback) is the dashboard typeface. Nunito's slightly rounded terminal shapes give the system an approachable, modern feel without reading as playful. The fallback stack is `Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif`.

The system uses **three weight tiers**:

- **700 Bold** — metric values, card titles, dashboard section headers
- **600 SemiBold** — table headers, button labels, badge text, emphasized body
- **400 Regular** — all body text, metadata, secondary labels, nav links

Never use weights outside these three (no 300 Light, no 500 Medium, no 800 ExtraBold). The contrast between 700 metric values and 400 body labels is the system's editorial signal.

### Hierarchy

| Token                        | Size | Weight | Line Height | Letter Spacing | Use                                                    |
| ---------------------------- | ---- | ------ | ----------- | -------------- | ------------------------------------------------------ |
| `{typography.metric-xl}`     | 28px | 700    | 1.1         | -0.5px         | KPI card primary metric ($27,850, $63,489.50)          |
| `{typography.metric-lg}`     | 22px | 700    | 1.1         | -0.3px         | Secondary metric values ($6,820, $36,358)              |
| `{typography.metric-sm}`     | 18px | 600    | 1.2         | 0              | Smaller metric values, totals in sub-cards             |
| `{typography.display-sm}`    | 20px | 700    | 1.35        | 0              | Chart card titles ("Revenue Updates", "Weekly Stats")  |
| `{typography.title-lg}`      | 18px | 700    | 1.4         | 0              | Section headings, page title                           |
| `{typography.title-md}`      | 16px | 600    | 1.4         | 0              | Card sub-headers, table section titles                 |
| `{typography.title-sm}`      | 14px | 600    | 1.4         | 0              | Transaction item names, country names                  |
| `{typography.table-header}`  | 13px | 600    | 1.3         | 0              | Data table column headers (#, Campaign Name, Channel…) |
| `{typography.body-md}`       | 14px | 400    | 1.6         | 0              | Transaction descriptions, table cell content           |
| `{typography.body-sm}`       | 12px | 400    | 1.5         | 0              | Metric sub-labels ("Earnings", "Expense"), captions    |
| `{typography.label-regular}` | 13px | 400    | 1.4         | 0              | Secondary metadata, subtitles under card titles        |
| `{typography.badge}`         | 12px | 700    | 1.0         | 0              | Delta badges (+18%, -5%), status pills                 |
| `{typography.button}`        | 14px | 600    | 1.0         | 0              | Button labels ("View Full Report", "See Report")       |
| `{typography.caption}`       | 11px | 400    | 1.4         | 0              | Footer text, axis labels, fine print                   |
| `{typography.nav-link}`      | 14px | 400    | 1.4         | 0              | Footer links (About Us, Blog, License)                 |

### Principles

Metric values dominate visually — they are always the biggest, boldest element on any given card. Labels orbit the metric at smaller weight (400) and smaller size (12–13px). The hierarchy is: metric value → metric label → card title → body text. Never let a card title compete with the metric value in size or weight.

All type is sentence-case. No ALL-CAPS, no small-caps. Buttons, badges, table headers, nav items — all sentence-case. The system reads as professional and neutral, not performative.

Negative letter-spacing (-0.5px, -0.3px) on large metric values gives them a tighter, more typeset feel. Body and label type stays at 0 tracking.

### Note on Font Substitutes

If Nunito is unavailable, **Inter** is a nearly identical fit at the same weights. **Poppins** is an acceptable alternative if a slightly more geometric feel is desired. Adjust metric value tracking to 0 when substituting (Poppins has tighter natural spacing than Nunito at large sizes).

## Layout

### Spacing System

- **Base unit:** 4px.
- **Tokens:** `{spacing.xxs}` 4px · `{spacing.xs}` 8px · `{spacing.sm}` 12px · `{spacing.md}` 16px · `{spacing.lg}` 24px · `{spacing.xl}` 32px · `{spacing.xxl}` 48px · `{spacing.section}` 64px.
- **Card internal padding:** `{spacing.lg}` (24px) on all sides for chart cards and KPI cards.
- **Card internal padding (compact):** `{spacing.md}` (16px) for smaller sub-cards (Weekly Sales, Purchase Orders).
- **Between cards in a row:** `{spacing.lg}` (24px) gap.
- **Between major page sections:** `{spacing.section}` (64px).
- **Table row height:** 52px for data table rows; 44px for transaction rows.
- **Chart bottom axis labels:** `{spacing.xs}` (8px) above the label baseline.

### Grid & Container

- **Page layout:** 12-column grid at desktop. Left sidebar (if present) is typically 240px; content area fills the rest.
- **KPI top row:** 3-up or 4-up cards at desktop. Responsive: 2-up at tablet, 1-up at mobile.
- **Chart section:** 2-column layout (large chart left, small card stack right) at desktop. Stacks vertically at tablet.
- **Data table + country list:** 2-column split (wide table left, narrow list right) at desktop.
- **Card max-width:** Contained within page max-width of ~1400px.
- **No full-bleed elements:** All content stays within padded container. Unlike editorial/marketing systems, no edge-to-edge bands.

### Whitespace Philosophy

Cards are the unit of layout — whitespace lives _between_ cards (via gap) and _inside_ cards (via padding). The canvas shows through between cards as the connective tissue. Avoid crowding; each card needs breathing room on all four sides. Content inside cards is left-aligned; metric values and chart elements may span the full card width.

## Elevation & Depth

| Level            | Treatment                                   | Use                                     |
| ---------------- | ------------------------------------------- | --------------------------------------- |
| Canvas           | No shadow, no border — soft gray (#f8f9fa)  | Page background                         |
| Card             | `{shadow.card}` (0 2px 12px rgba 8%)        | All KPI cards, chart cards, data tables |
| Card hover       | `{shadow.card-hover}` (0 4px 20px rgba 12%) | Hovered card or interactive row         |
| Elevated surface | `{colors.surface-elevated}` background      | Selected table rows, hovered list items |
| Dropdown/modal   | `{shadow.dropdown}` (0 8px 24px rgba 12%)   | Dropdowns, year selectors, tooltips     |

The system uses **only box shadows for elevation** — no borders on cards unless a shadow would be visually insufficient (e.g., a white card on a white background inside a modal). Shadow intensity scales with z-level: cards sit low, dropdowns sit higher.

### No Decorative Elements

There are no dividers, stripes, gradients, or pattern fills used as decoration. Hairline borders (`{colors.hairline}`) appear only as functional dividers — between table rows, below chart card headers, around input fields. The card shadow is the only "decorative" depth element.

## Shapes

### Border Radius Scale

| Token            | Value  | Use                                                                                           |
| ---------------- | ------ | --------------------------------------------------------------------------------------------- |
| `{rounded.none}` | 0px    | Almost never used — only for inner progress bar tracks inside larger rounded containers       |
| `{rounded.xs}`   | 4px    | Small tags, chart tooltip corners                                                             |
| `{rounded.sm}`   | 8px    | Buttons, dropdown selectors, input fields, icon wrappers                                      |
| `{rounded.md}`   | 12px   | Cards — the dominant radius for all major containers                                          |
| `{rounded.lg}`   | 16px   | Large modal containers, full-page overlays                                                    |
| `{rounded.xl}`   | 20px   | Rarely used; decorative panel variants                                                        |
| `{rounded.full}` | 9999px | Badges (delta pills), avatar circles, transaction icons, search input, performance bar tracks |

The radius hierarchy is "cards at 12px, interactive elements at 8px, pills and circles at full." Unlike sharp-edged design systems, rounded corners appear at every level. `{rounded.none}` is explicitly avoided for user-facing elements.

### Icon & Avatar Geometry

Transaction icons use a `{rounded.full}` circle wrapper, 36×36px, with a brand-colored logo or icon inside. Avatar group stacks use `{rounded.full}` at 28px with a 2px white border to create the layered overlap effect. Country flags appear as emoji or circular flag icons.

### Performance Bar Geometry

Progress/performance bars use `{rounded.full}` on both the track and the fill — there are no flat-ended bars in the system. Bar height is 6px (compact) or 8px (prominent). Bar fill colors map semantically: green for high-performing, red for declining, orange for mid-tier campaigns.

## Components

### KPI Cards (Top Row)

**`kpi-card`** — The primary summary card at the top of the page. Background `{colors.surface-card}` (white), shadow `{shadow.card}`, rounded `{rounded.md}` (12px), padding `{spacing.lg}` (24px). Each card holds: a card title in `{typography.title-md}`, a subtitle in `{typography.label-regular}`, then two metric+delta pairs (Earnings + Expense, or a single metric). The delta badge sits inline with the metric value — a `{component.badge-success}` or `{component.badge-danger}` pill immediately to the right of the number. Some cards include a decorative illustration (person at laptop) — this is an optional visual accent, not a system requirement.

**Secondary KPI cards** ("Weekly Sales", "Purchase Orders") — A narrower 2-column layout in the top row. These hold a single large metric and delta badge, a "See Report →" text-link CTA, and a calendar or bag icon in a circular wrapper at top-right.

### Metric Display

**`metric-value`** — The largest number on a card. Always `{typography.metric-xl}` (28px / 700) for primary values, `{typography.metric-lg}` (22px / 700) for secondary values. Negative spacing at -0.5px makes dollar amounts feel typeset. The value is always left-aligned or centered within its card area.

**`delta-badge`** — A pill badge immediately following a metric value. Uses `{component.badge-success}` for positive values (+18%, +4.7%) and `{component.badge-danger}` for negative values (-5%, -1.7%). Badge text always includes the ± symbol. The badge is `{rounded.full}` and `{typography.badge}` (12px / 700). Never use a plain text delta — it must always be wrapped in a semantic badge.

### Chart Cards

**`chart-card`** — The container for all chart types (bar, line, area, donut). Background `{colors.surface-card}`, rounded `{rounded.md}`, shadow `{shadow.card}`, padding `{spacing.lg}` (24px). The card header holds: chart title in `{typography.display-sm}`, a subtitle/description in `{typography.label-regular}`. Controls (year selector dropdown, view-toggle icon) sit at the top-right of the header.

**Bar chart** — Used for Revenue Updates and Sales from Locations. Bar color: `{colors.chart-primary}` (near-black) for the primary series; `{colors.chart-secondary}` (light gray) for the secondary series. Bar width is narrow (8–12px) for a dense, data-forward look. Y-axis labels use `{typography.caption}` in `{colors.body}`; x-axis date labels use the same. No horizontal grid lines — only the x-axis baseline. The "View Full Report" `{component.button-primary}` appears below the chart.

**Line/area chart** — Used for sparklines (Monthly Earnings, Weekly Stats). Stroke color `{colors.chart-primary}`. Area fill is a very subtle gradient from 15% black to 0% transparency — barely visible, used only to give the line visual weight. No data point dots unless hover-interactive. Chart area background is `{colors.surface-soft}` or transparent.

**`donut-chart`** — Used for Yearly Backup. A thick ring donut with two segments: teal (2024) and orange/red (2025). Center displays the total value. Legend uses color dots + `{typography.body-sm}` labels below the chart.

**`sparkline-card`** — Compact area sparkline embedded inline in a KPI card (Monthly Earnings). No axes, no labels — pure shape. The line + fill area communicates trend direction only.

### Transaction & List Components

**`transaction-row`** — A single row in the Recent Transactions list. Height 44–52px. Left: `{component.transaction-icon}` (36px circle with brand logo). Center: transaction name in `{typography.title-sm}` (600) with a sub-label in `{typography.body-sm}` (400) in `{colors.body}`. Right: amount in `{typography.title-sm}` (600), right-aligned — positive in `{colors.success}`, negative in `{colors.danger}`.

**`transaction-icon`** — A 36×36px `{rounded.full}` circle wrapping a logo icon. Background is the brand's color (PayPal blue, Wallet teal, etc.) or a neutral gray for generic icons.

The "View full report" `{component.button-primary}` appears below the transaction list, full-width within the card.

### Data Table

**`data-table`** — A multi-column table for Top Campaigns. Card background `{colors.surface-card}`, rounded `{rounded.md}`, shadow `{shadow.card}`. Columns: #, Campaign Name (with date), Channel, Audience (avatar group), Performance (progress bar), Action (three-dot icon).

- **Header row** — `{typography.table-header}` (13px / 600) in `{colors.body}`. Row height 44px. Bottom border `{colors.hairline-strong}`.
- **Body rows** — `{typography.body-md}` (14px / 400) in `{colors.ink}`. Row height 52px. Bottom border `{colors.hairline}`. Hover state: background shifts to `{colors.surface-elevated}`.
- **Campaign name sub-label** — Date shown in `{typography.body-sm}` (12px / 400) in `{colors.body}`, directly below the campaign name.
- **`avatar-group`** — Overlapping audience avatars at 28px with 2px white border ring. Max 3 shown; if more, display "+N" count.
- **`performance-bar`** — A 6px-tall `{rounded.full}` progress bar. Track color `{colors.hairline}`. Fill color: `{colors.success}` (green), `{colors.danger}` (red), or `{colors.warning}` (orange) depending on campaign performance.
- **Action column** — A three-dot vertical ellipsis icon in `{colors.body}`, triggering a dropdown menu on click.

### Country & Geographic List

**`country-list-row`** — A single row in the Sales by Countries panel. Left: flag emoji or circular flag icon. Center: country name in `{typography.title-sm}`, monetary value in `{typography.display-sm}` (left-aligned, stacked above name). Right: delta badge (`{component.badge-success}` or `{component.badge-danger}`).

### Search & Inputs

**`search-input`** — Full-radius (`{rounded.full}`) search field used above the campaign table. Height 38px, background `{colors.surface-card}`, shadow `{shadow.card}`, padding `{spacing.md}`. A search icon sits inside the left edge at 16px from the border. Placeholder text in `{colors.muted}`.

**`dropdown-selector`** — The year/period selector ("Year 2026 ▾") on chart cards. Height 32px, background `{colors.surface-card}`, rounded `{rounded.sm}`, shadow `{shadow.card}`. On click, opens a dropdown with `{shadow.dropdown}`.

### Buttons

**`button-primary`** — Near-black filled button. Background `{colors.primary}` (#000), text `{colors.on-primary}` (white), rounded `{rounded.sm}` (8px), padding 12px × 24px, height 42px. Type `{typography.button}` (14px / 600). Used for primary actions: "View Full Report", "View full report" inside chart and transaction cards.

**`button-outline`** — Same shape as primary but transparent background with a `{colors.hairline-strong}` border. Used for secondary actions.

**`button-ghost`** — Text-only button in `{colors.body}`, no background or border. Used for tertiary actions and inline links ("See Report →").

### Footer

**`footer`** — Light-gray footer matching the canvas color (`{colors.canvas}`). Text in `{colors.body}`. Left: copyright line in `{typography.caption}`. Right: footer links (About Us, Blog, License) in `{typography.nav-link}`. No full-width divider — the footer connects visually to the canvas without a border.

## Do's and Don'ts

### Do

- Anchor every delta value in a `{component.delta-badge}` pill — never display raw +/- numbers as plain text.
- Use `{rounded.md}` (12px) on all card containers consistently. Inconsistent card radius is the fastest way to break system cohesion.
- Pair metric values (`{typography.metric-xl}`) with body-sm sub-labels immediately below — the label grounds the metric.
- Use `{colors.chart-primary}` (near-black) as the default bar/line series color when data has no semantic meaning.
- Reserve `{colors.success}`, `{colors.danger}`, `{colors.warning}` exclusively for semantic use (positive/negative/caution). Never use them as aesthetic colors on non-data elements.
- Keep performance bars at 6px height — thicker bars feel heavy and compete with the text data in the same row.
- Use `{shadow.card}` on every card surface. Shadowless white cards on a white canvas are invisible.
- Use sentence-case throughout — no ALL-CAPS labels, no title-cased column headers.

### Don't

- Don't use full-bleed photography or large illustration panels. This is a dense data dashboard — visual space belongs to charts and metrics.
- Don't create cards without the standard `{shadow.card}` — cards without shadow disappear against the canvas.
- Don't use sharp corners (`{rounded.none}`) on any user-facing card or interactive element. The rounded language is the system's signature.
- Don't use accent colors (success, danger, warning, info) for non-semantic decoration. A green card header has no meaning; a green delta badge means growth.
- Don't mix font weights outside the three approved tiers (700/600/400). Introducing 500 or 300 blurs the hierarchy.
- Don't use colored backgrounds on large surfaces (cards, sections). All color lives in badges, chart fills, and icon wrappers — never in card backgrounds.
- Don't display more than 3 stacked avatar images in `{component.avatar-group}` — truncate to "+N" after 3.
- Don't bold body text. Body stays at 400 weight — using 600 in paragraph copy makes the table feel as heavy as a heading.
- Don't use `{colors.teal}` and `{colors.success}` interchangeably. Teal (#11cdef) is an aesthetic highlight accent; green (#2dce89) is the positive-delta semantic signal. Mixing them creates false meaning.

## Responsive Behavior

### Breakpoints

| Name    | Width       | Key Changes                                                                                                                                           |
| ------- | ----------- | ----------------------------------------------------------------------------------------------------------------------------------------------------- |
| Mobile  | < 640px     | Top KPI row 1-up stacked; charts full-width single column; data table collapses to card-list view; avatar group hidden; footer links stack vertically |
| Tablet  | 640–1024px  | KPI row 2-up; chart+sidebar stacks vertically; table shows 4 columns max; country list moves below table                                              |
| Desktop | 1024–1440px | Full layout: KPI 3-up top row; 2-column chart+sidebar; full data table; country list sidebar                                                          |
| Wide    | > 1440px    | Max content width ~1400px centered; additional breathing room around cards                                                                            |

### Touch Targets

- `{component.button-primary}` height 42px meets WCAG touch minimum.
- `{component.search-input}` height 38px — acceptable for secondary interaction; 44px preferred on mobile.
- `{component.transaction-row}` height 44–52px — comfortable tap target for list rows.
- Three-dot action icon in table: minimum 36×36px tap area with surrounding padding.
- `{component.dropdown-selector}` height 32px — suitable for desktop pointer; increase to 40px on mobile.

### Collapsing Strategy

- KPI cards reduce from 3-up to 2-up to 1-up as viewport narrows. Cards never truncate their metric values — font size scales down one step (28px → 22px → 18px) before text wraps.
- The Revenue chart card and its right-side companion (Monthly Earnings, Yearly Backup) stack vertically at tablet.
- The data table collapses at mobile: hide Channel, Audience, and Action columns; show only # and Campaign Name + performance bar as a summary row. A "View all" link opens the full table.
- Country list moves from a right-side panel to a below-table section at tablet.
- The search field above the table remains visible at all breakpoints but reduces width proportionally.

### Chart Behavior

- Bar charts maintain their relative proportions at different widths — x-axis labels may reduce from date-range labels to month abbreviations at tablet.
- Sparkline area charts scale fully to card width at all breakpoints.
- Donut chart maintains its aspect ratio (1:1) and scales proportionally; legend moves from below to right-side at desktop if space allows.

## Iteration Guide

1. Focus on ONE component at a time. Reference its YAML key (`{component.kpi-card}`, `{component.data-table}`).
2. New components default to `{rounded.md}` (12px). Use `{rounded.full}` only for pills, badges, avatar circles, and search inputs.
3. All delta/change indicators must use a semantic badge — never raw text.
4. Variants (`-success`, `-danger`, `-warning`) live as separate badge entries in `components:`.
5. Use `{token.refs}` everywhere — never inline hex.
6. Charts default to `{colors.chart-primary}` unless data carries a positive/negative semantic meaning.
7. Shadows are mandatory on cards — `{shadow.card}` is non-negotiable.
8. When in doubt about emphasis: larger metric value before more color.

## Known Gaps

- The exact font (Nunito vs Inter vs a licensed variant) is inferred from the rounded terminal shapes visible in the screenshot. Confirm the exact typeface with the source project's CSS.
- Animation and transition timings for card hover (shadow deepening), row hover (background shift), and badge pulse states are not captured — these are micro-interaction details not visible in a static screenshot.
- The dashboard illustration (person at laptop in the top KPI card) appears to be a bespoke SVG illustration. Its exact source (custom-drawn, from an illustration library like Storyset or unDraw) is not confirmed.
- Dark mode variants are not documented — the captured design is exclusively light mode. A dark mode would require re-mapping canvas to ~#1a1a2e, surface-card to ~#242435, and adjusting all shadow values to rgba(0,0,0,0.3)+.
- The "Top Campaigns" table performance bars use a mixed color scheme (orange-red-green per row) that suggests individual campaign-level color assignment rather than a fixed threshold rule. The exact assignment logic (threshold-based or pre-assigned per campaign) is not confirmed.
- Tooltip and hover-state designs for chart bars and sparklines are not captured.
- The avatar images in the Audience column appear to be photo avatars — placeholder behavior (initials + colored background) for absent photos is not documented.
- Mobile-specific navigation (hamburger, sidebar drawer) is not shown in the captured layout.
