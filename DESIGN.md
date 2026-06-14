# Agent Wallet Design System: Memphis Style

## Overview

A playful, vibrant, and retro-inspired design system characterized by:

- Bold geometric shapes
- High-contrast colors
- Thick borders
- Hard offset shadows

The interface follows a **mobile-first approach** and uses a **Single-Page Application (SPA)** structure.

---

## Color Palette

### Core Colors

| Role | Color | Hex |
|---|---|---|
| Primary | Rose / Pink | `#e8879f` |
| Secondary | Teal / Green | `#4db8a8` |
| Accent | Yellow | `#f5d76e` |

### Backgrounds and Surfaces

| Role | Color | Hex |
|---|---|---|
| Background | Off-white | `#faf8f5` |
| Surface | Warm White | `#fffef7` |

### Text Colors

| Role | Color | Hex |
|---|---|---|
| Primary Text | Dark Navy / Black | `#1a1a2e` |
| Secondary Text | Muted Navy | `#4a4a68` |
| Tertiary Text | Light Navy | `#7a7a92` |

### Borders and Shadows

| Role | Color | Hex |
|---|---|---|
| Border and Shadow | Dark Navy / Black | `#1a1a2e` |

---

## Typography

### Font Stack

- **Primary Font:** `Poppins, sans-serif`
- **Monospace / Numbers:** `Poppins`
- Use `tabular-nums` for numerical alignment.

### Font Weights

| Weight | Value | Usage |
|---|---:|---|
| Regular | `400` | Body text and placeholders |
| Medium | `500` | Chat bubbles and list subtitles |
| Semi-Bold | `600` | Action buttons, primary values, and chips |
| Bold | `700` | Headers, balance amounts, badges, and schedule titles |

---

## Design Properties

### Borders and Shadows

```css
border: 3px solid #1a1a2e;
border-radius: 12px;
box-shadow: 4px 4px 0 #1a1a2e;
```

#### Default Properties

- **Border Width:** `3px solid`
- **Border Radius:** `12px`
- **Shadow:** `4px 4px 0 #1a1a2e`
- Shadows must be hard and unblurred.

#### Active State

When an element is clicked:

- Compress the shadow to `0 0 0`
- Translate the element `4px` down
- Translate the element `4px` to the right

This creates the appearance of a physical button being pressed.

```css
.element:active {
  box-shadow: 0 0 0 #1a1a2e;
  transform: translate(4px, 4px);
}
```

### Background Texture

The background uses a CSS polka-dot pattern created with a radial gradient.

- **Dot Size:** `2px`
- **Pattern Spacing:** `24px`

```css
background-image: radial-gradient(
  circle,
  #1a1a2e 2px,
  transparent 2px
);

background-size: 24px 24px;
```

---

## Components

### Buttons and Chips

#### Ghost Buttons

Ghost buttons use:

- Surface-colored background
- `3px` border
- Hard offset shadow
- Accent-colored active state

#### Action Chips

Action chips use:

- Thick borders
- Bold text
- Vibrant background colors
- Primary, Secondary, or Accent color variants

They are used for quick actions such as:

- Send
- Receive
- Swap

#### Send Button

The send button uses:

- Accent-colored background
- `2px` border
- `2px` offset shadow

---

### Badges

Badges use the following properties:

- **Height:** `24px`
- **Text Transform:** Uppercase
- **Font Size:** `11px`
- **Font Weight:** Bold
- **Border:** `2px solid`
- **Shadow:** `2px` offset

#### Badge Variants

| Variant | Color |
|---|---|
| Success | Secondary |
| Warning | Accent |
| Active | Primary |

---

### Chat Bubbles

#### User Message

- Primary-colored background
- Surface-colored text
- Bottom-right corner has no border radius

#### Agent Message

- Surface-colored background
- Primary text color
- Bottom-left corner has no border radius

#### Shared Styling

```css
border: 3px solid #1a1a2e;
box-shadow: 4px 4px 0 #1a1a2e;
```

---

### Cards

Cards are used for:

- Transactions
- Groups
- Schedules

#### Container Styling

- Surface-colored background
- `3px` border
- `12px` border radius
- `4px` offset shadow

```css
.card {
  background: #fffef7;
  border: 3px solid #1a1a2e;
  border-radius: 12px;
  box-shadow: 4px 4px 0 #1a1a2e;
}
```

#### Interactive State

When clicked, the card:

- Translates down and to the right
- Flattens its shadow

#### Separators

Use dashed lines to separate rows or card footers.

```css
border-top: 2px dashed #1a1a2e;
```

---

### Bottom Navigation

#### Container

The bottom navigation uses:

- Fixed positioning at the bottom
- `80px` height
- Surface-colored background
- Thick top, left, and right borders

#### Navigation Items

- Uppercase text
- `11px` font size
- Bold font weight

#### Active State

The active navigation item:

- Changes its icon and text to the Primary color
- Translates `4px` upward

```css
.nav-item.active {
  color: #e8879f;
  transform: translateY(-4px);
}
```

---

## Layout Structure

### Application Container

The main application container uses:

- **Maximum Width:** `430px`
- Centered positioning on larger screens
- `3px` borders on the left and right in desktop view
- `80px` bottom padding for the fixed navigation bar

```css
.app-container {
  width: 100%;
  max-width: 430px;
  margin: 0 auto;
  padding-bottom: 80px;
  border-left: 3px solid #1a1a2e;
  border-right: 3px solid #1a1a2e;
}
```

---

## Pages and Views

### Page 1: Chat

The Chat page includes:

- Sticky balance card
- Horizontally scrolling quick actions
- Scrollable chat thread
- Fixed bottom input bar

### Page 2: History

The History page includes:

- Rotated date header
- Top-level statistical cards:
  - In
  - Out
  - Saved
- Transaction list categorized by day

### Page 3: Groups

The Groups page includes:

- Tabbed filters:
  - Active
  - Done
  - Void
- Group cards
- Custom animated progress bars

### Page 4: Schedules

The Schedules page displays active recurring plans, such as:

- Weekly Rent
- DCA Ethereum

Each schedule card includes:

- Highlighted **Next Run** date
- Execute button
- Recurring plan information
