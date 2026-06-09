# Design

## Color Palette

### Primary — Celo Green
- `--color-primary`: `#1D9E75`
- `--color-primary-light`: `#E1F5EE`
- `--color-primary-dark`: `#0F6E56`

### Neutral — Warm Gray
- `--color-bg`: `#FAFAF9`
- `--color-surface`: `#FFFFFF`
- `--color-surface-raised`: `#F5F4F2`
- `--color-border`: `rgba(0, 0, 0, 0.08)`
- `--color-border-strong`: `rgba(0, 0, 0, 0.15)`

### Text
- `--color-text-primary`: `#1A1916`
- `--color-text-secondary`: `#6B6A66`
- `--color-text-tertiary`: `#9B9A96`

### Semantic
- `--color-success`: `#16A34A`
- `--color-success-light`: `#DCFCE7`
- `--color-warning`: `#D97706`
- `--color-warning-light`: `#FEF3C7`
- `--color-danger`: `#DC2626`
- `--color-danger-light`: `#FEE2E2`

### Dark Mode
- `--color-bg-dark`: `#111110`
- `--color-surface-dark`: `#1C1C1A`
- `--color-surface-raised-dark`: `#242422`
- `--color-border-dark`: `rgba(255, 255, 255, 0.08)`
- `--color-text-primary-dark`: `#EEEEEC`
- `--color-text-secondary-dark`: `#9B9A96`

## Typography

### Font Stack
- **Display / Body**: Geist (500 medium, 400 regular)
- **Mono**: Geist Mono (wallet addresses, TX hashes, amounts)

### Scale
12 / 14 / 16 / 20 / 24 / 32px only (no in-between sizes)

**Weight**: 400 regular, 500 medium only (no 600 or 700)

## Spacing

4px base unit: 4 / 8 / 12 / 16 / 20 / 24 / 32 / 48px

## Border Radius

- Small (badges, tags): `6px`
- Inputs, buttons, cards: `10px`
- Large cards, modals: `14px`
- Pills: `999px`

## Shadows

- `--shadow-sm`: `0 1px 2px rgba(0, 0, 0, 0.05)`
- `--shadow-md`: `0 2px 8px rgba(0, 0, 0, 0.08), 0 1px 2px rgba(0, 0, 0, 0.04)`
- `--shadow-lg`: `0 8px 24px rgba(0, 0, 0, 0.10), 0 2px 4px rgba(0, 0, 0, 0.04)`

## Layout

### Page Container
- `max-width`: `430px`
- `margin`: `0 auto`
- `padding-bottom`: `80px` (nav height)

### Header
- `height`: `56px`
- No gradient, no colored background — just surface color
- Subtle bottom border only

### Bottom Navigation
- Fixed at bottom, 4 tabs
- `height`: `64px` + safe area inset
- Background: surface with `backdrop-filter: blur(12px)`
- Top border: `1px` using `--color-border`
- Active tab icon/label: `--color-primary`
- Inactive: `--color-text-tertiary`

## Components

### Button
**Variants**: primary, ghost, outline, danger

#### Primary
- Background: `--color-primary`
- Color: white
- Border radius: `10px`
- Active state: `scale(0.98)`

#### Ghost
- Background: transparent
- Color: `--color-text-secondary`
- Border: none

#### Outline
- Background: transparent
- Color: `--color-text-secondary`
- Border: `1px` `--color-border-strong`

#### Danger
- Background: `--color-danger`
- Color: white
- Border radius: `10px`

### Input
- Height: `48px`
- Background: `--color-surface-raised`
- Border: `1px` `--color-border`
- Focus border: `--color-primary`
- Border radius: `10px`
- Label: `12px` / `500` / `--color-text-secondary`
- Value: `14px` / `400` / `--color-text-primary`

### Badge
**Variants**: success, warning, danger, neutral, primary

- Height: `20px`
- Padding: `4px 8px`
- Border radius: `6px`
- Font size: `11px` / `500`

### Message Bubble

#### User Message
- Right-aligned
- Background: `--color-primary`
- Text: white, `14px` / `400`
- Border radius: `14px 14px 4px 14px`

#### Agent Response
- Left-aligned
- Background: `--color-surface-raised`
- Text: `--color-text-primary`, `14px` / `400`
- Border radius: `14px 14px 14px 4px`

### Transaction Confirmation Card
- Background: `--color-surface`
- Border: `1px` `--color-border-strong`
- Border radius: `14px`
- Left accent border: `3px` `--color-primary`
- Label: `12px` / `--color-text-tertiary`
- Value: `14px` / `500` / `--color-text-primary`
- Divider: `1px` `--color-border`

### Bottom Sheet
- Backdrop: `rgba(0, 0, 0, 0.4)`
- Sheet background: `--color-surface`
- Drag handle: `36px × 4px`, `--color-border-strong`, centered, rounded
- Border radius top: `20px`
- Animation: slide up `300ms cubic-bezier(0.32, 0.72, 0, 1)`

### Toast Notification
- Width: `340px` max, mobile `90vw`
- Border radius: `10px`
- Shadow: `--shadow-md`
- Auto-dismiss: `3s`

**Variants**:
- Success: left border `--color-success`
- Error: left border `--color-danger`
- Info: left border `--color-primary`

### Skeleton Loading
- Base color: `--color-surface-raised`
- Highlight: slightly lighter shade
- Animation: shimmer across the element

## Motion & Micro-interactions

### Timing
- Standard transition: `all 150ms ease`
- Page transition: `opacity 200ms ease, transform 200ms ease`
- Progress bar fill: `width 800ms cubic-bezier(0.4, 0, 0.2, 1)`
- Bottom sheet entrance: `transform 300ms cubic-bezier(0.32, 0.72, 0, 1)`

### Key Frames
```css
@keyframes success-pop {
  0%   { transform: scale(0.95); opacity: 0; }
  60%  { transform: scale(1.02); }
  100% { transform: scale(1); opacity: 1; }
}

@keyframes pulse {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.5; }
}

@keyframes loading-dots {
  0%, 20%, 50%, 80%, 100% { opacity: 0.4; }
  40% { opacity: 1; }
}
```

### Rules
- Button press: `scale(0.98)` on active
- Card hover: subtle shadow increase (desktop only)
- No bounce, no spring, no looping animations
- Agent "thinking" dots: opacity pulse only, no movement
- Respect `@media (prefers-reduced-motion: reduce)` for all animations

## Pages & Templates

### Page 1: Chat Interface `/`
- Balance card (sticky below header)
- Message thread (scrollable)
- Quick action chips (horizontal scroll)
- Command input bar (fixed bottom, above nav)

### Page 2: History `/history`
- Header with month selector
- Summary stats row (3 cards)
- Transaction list grouped by date
- Transaction detail bottom sheet

### Page 3: Groups `/groups`
- Header + New button
- Tab filter (Active / Completed / Cancelled)
- Group cards with progress bar
- Create group bottom sheet

### Page 4: Schedules `/schedules`
- Header + New button
- Schedule cards (list)
- Execute now button (when due)
- Create schedule bottom sheet

## Responsive

### Breakpoints
- Mobile: `360px` minimum (MiniPay target)
- Tablet: `768px`
- Desktop: `1024px`

### Grid
- Mobile: `1 column`, full bleed with padding `16px`
- Tablet+: `max-width 430px`, centered

## Dark Mode

All components support dark mode using CSS variables. Light mode is the default; dark mode is activated via `prefers-color-scheme: dark`.

## Accessibility

- Minimum contrast: `4.5:1` for body text, `3:1` for large text
- Touch targets: minimum `44px × 44px`
- Focus indicator: `2px` solid `--color-primary` with `2px` offset
- No hover-only interactions
- All form inputs have associated labels
- Error messages are readable and descriptive
