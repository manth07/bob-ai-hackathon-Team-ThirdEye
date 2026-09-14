---
name: dashboard-component
description: Use when building any file in components/ — encodes Tailwind conventions, colour tokens, component structure, and design system rules for GridSentry.
---

# Dashboard Component Guidelines

## Colour Tokens (use these Tailwind arbitrary values or CSS variables)

Define these in `src/styles/theme.css` as CSS custom properties:

```css
:root {
  --bg: #0B1220;
  --surface: #131B2E;
  --border: #1F2A44;
  --text-primary: #E7ECF5;
  --text-muted: #8B95A8;
  --accent: #3B82F6;
  --risk-low: #22C55E;
  --risk-medium: #EAB308;
  --risk-high: #F97316;
  --risk-critical: #EF4444;
}
```

In Tailwind, use arbitrary values: `bg-[#0B1220]`, `text-[#E7ECF5]`, `border-[#1F2A44]`, etc.

## Typography

- Inter font (already included via Tailwind or Google Fonts CDN in index.html).
- JetBrains Mono for numeric/KPI values.
- Scale: `text-2xl font-semibold` (page title), `text-xl font-semibold` (section), `text-base font-semibold` (card title), `text-sm` (body), `text-xs` (captions).

## Card Component Pattern

```tsx
<div className="rounded-lg border border-[#1F2A44] bg-[#131B2E] p-4 shadow-sm">
  {children}
</div>
```

## Risk Badge Pattern

```tsx
// Tier-to-colour mapping:
const RISK_COLORS = {
  low: { bg: 'bg-[#22C55E]/15', text: 'text-[#22C55E]' },
  medium: { bg: 'bg-[#EAB308]/15', text: 'text-[#EAB308]' },
  high: { bg: 'bg-[#F97316]/15', text: 'text-[#F97316]' },
  critical: { bg: 'bg-[#EF4444]/15', text: 'text-[#EF4444]' },
};

// Usage: pill shape, always show text label alongside colour
<span className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-medium ${RISK_COLORS[tier].bg} ${RISK_COLORS[tier].text}`}>
  <span>●</span> {tier.charAt(0).toUpperCase() + tier.slice(1)}
</span>
```

## Button Patterns

```tsx
// Primary
<button className="rounded-lg bg-[#3B82F6] px-4 py-2 text-sm font-medium text-white hover:bg-blue-500 transition-colors duration-150">

// Secondary/Ghost
<button className="rounded-lg border border-[#1F2A44] px-4 py-2 text-sm font-medium text-[#8B95A8] hover:border-[#3B82F6] hover:text-[#E7ECF5] transition-colors duration-150">
```

## Layout Structure

```
App
├── Header (h-14, bg-[#0B1220], border-b border-[#1F2A44])
│   └── Logo + "GridSentry" + status badge
├── Main (flex, h-[calc(100vh-3.5rem)])
│   ├── Sidebar (w-72, bg-[#131B2E], border-r border-[#1F2A44], overflow-y-auto)
│   │   ├── KpiBar (3 stat cards stacked)
│   │   └── AssetList (scrollable ranked cards)
│   └── Content (flex-1, overflow-hidden)
│       ├── RiskMap (h-[55%])
│       └── AssetDetail or MaintenancePlan (h-[45%], overflow-y-auto)
```

## Map Styling

- Use CARTO dark matter tiles: `https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png`
- Attribution: `&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>`
- Markers: CircleMarker, radius = 6 (medium criticality) up to 12 (critical).
- Marker fillColor = risk tier colour. fillOpacity=0.85, weight=1, color='white'.

## Recharts Dark Theme

```tsx
// Common props for all Recharts charts
const CHART_STYLE = {
  backgroundColor: '#131B2E',
  cartesianGrid: { stroke: '#1F2A44', strokeDasharray: '3 3' },
  tooltip: { contentStyle: { backgroundColor: '#131B2E', border: '1px solid #1F2A44', color: '#E7ECF5' } },
  text: { fill: '#8B95A8', fontSize: 12 },
};
```

## Spacing Rules

Use ONLY Tailwind's 4px-based scale: `p-1` (4px), `p-2` (8px), `p-3` (12px), `p-4` (16px), `p-6` (24px), `p-8` (32px). No arbitrary spacing values.

## State Rendering Rules

Every async component MUST render all three states:
1. Loading: `<div className="flex items-center justify-center p-8"><span className="text-[#8B95A8] text-sm">Loading...</span></div>`
2. Error: `<div className="rounded-lg border border-[#EF4444]/30 bg-[#EF4444]/10 p-4 text-sm text-[#EF4444]">{errorMessage}</div>`
3. Success: the actual content.

Never let a component render `null` or an empty `<div>` on error.

## Transition Rules

Only on hover/selection states: `transition-colors duration-150` or `transition-all duration-200`. No page-transition animations.

## Accessibility

- Risk tier always communicated by colour AND text label.
- Text contrast ≥ 4.5:1 (guaranteed by the palette above).
- Use semantic HTML: `<header>`, `<main>`, `<nav>`, `<section>`, `<article>` where appropriate.
