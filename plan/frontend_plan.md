# CeloAgentPay — Frontend Build Plan

> This document is the complete frontend specification for Claude Code.
> Read this fully before writing a single line of code.
> Use the installed skills at every phase as instructed.

---

## Pre-Build: Skill Activation

Before building anything, run these in Claude Code:
/impeccable init

When prompted, answer:
- Surface type: **Product surface**
- Who is this for: "MiniPay users in emerging markets — people who want to send money as easily as sending a WhatsApp message. Mobile-first, low data, high trust needed."
- Brand voice in 3 words: **"Direct. Trustworthy. Frictionless."**
- Visual references: "Wise app transfer screen, Jago mobile banking Indonesia, Linear dashboard, Vercel dashboard"
- Anti-references: "ChatGPT chat UI, Metamask wallet, rainbow gradient crypto dashboards, generic shadcn demos"

Then run:
/impeccable document

This creates `PRODUCT.md` and `DESIGN.md` — do not skip this step.

---

## Design System

### Typography
- Font: **Geist** (already available via Next.js) for UI text
- Mono: **Geist Mono** for wallet addresses, TX hashes, amounts
- Scale: 12 / 14 / 16 / 20 / 24 / 32px only — no in-between sizes
- Weight: 400 regular, 500 medium only — never 600 or 700

### Color Palette
Do NOT use generic Tailwind colors. Use this exact palette:

```css
/* Primary — Celo Green */
--color-primary: #1D9E75;
--color-primary-light: #E1F5EE;
--color-primary-dark: #0F6E56;

/* Neutral — warm gray, not cool gray */
--color-bg: #FAFAF9;
--color-surface: #FFFFFF;
--color-surface-raised: #F5F4F2;
--color-border: rgba(0,0,0,0.08);
--color-border-strong: rgba(0,0,0,0.15);

/* Text */
--color-text-primary: #1A1916;
--color-text-secondary: #6B6A66;
--color-text-tertiary: #9B9A96;

/* Semantic */
--color-success: #16A34A;
--color-success-light: #DCFCE7;
--color-warning: #D97706;
--color-warning-light: #FEF3C7;
--color-danger: #DC2626;
--color-danger-light: #FEE2E2;

/* Dark mode */
--color-bg-dark: #111110;
--color-surface-dark: #1C1C1A;
--color-surface-raised-dark: #242422;
--color-border-dark: rgba(255,255,255,0.08);
--color-text-primary-dark: #EEEEEC;
--color-text-secondary-dark: #9B9A96;
```

### Spacing
Use 4px base unit: 4 / 8 / 12 / 16 / 20 / 24 / 32 / 48px only.

### Border Radius
- Small elements (badges, tags): 6px
- Inputs, buttons, cards: 10px
- Large cards, modals: 14px
- Pills: 999px

### Shadows
```css
--shadow-sm: 0 1px 2px rgba(0,0,0,0.05);
--shadow-md: 0 2px 8px rgba(0,0,0,0.08), 0 1px 2px rgba(0,0,0,0.04);
--shadow-lg: 0 8px 24px rgba(0,0,0,0.10), 0 2px 4px rgba(0,0,0,0.04);
```

---

## Global Layout

### Bottom Navigation Bar
Fixed at bottom. 4 tabs only.
[Chat]  [History]  [Groups]  [Schedules]
🤖       🕐        👥         🔁

- Active tab: `--color-primary` icon + label
- Inactive: `--color-text-tertiary`
- Height: 64px + safe area inset
- Background: surface with subtle blur `backdrop-filter: blur(12px)`
- Top border: 1px `--color-border`
- No heavy shadows — clean separator line only

### Page Container
max-width: 430px
margin: 0 auto
padding-bottom: 80px (nav height)

### Header
- Height: 56px
- App name left, action icons right
- No gradient, no colored background — just white/dark surface
- Subtle bottom border only

---

## Page 1: Chat Interface `/`

This is the core of the app. It must feel like a command bar, not a chatbot.

### Layout (top to bottom)
1. Header bar
2. Balance card (sticky below header)
3. Message thread (scrollable)
4. Quick action chips
5. Command input bar (fixed bottom, above nav)

### 1.1 Header
Left: Logo mark (small Celo-colored dot) + "AgentPay"
Right: [Settings icon] [History icon]
Font: 15px / 500. No subtitle. Clean.

### 1.2 Balance Card
Sticky card below header. Shows current cUSD balance.
┌─────────────────────────────┐
│  Your balance               │
│  $ 24.50 cUSD               │
│  0x742d...3f8a  [copy icon] │
└─────────────────────────────┘

- Background: `--color-primary-light`
- Amount: 32px / 500 / `--color-primary-dark`
- Address: 12px mono / `--color-text-secondary`
- Border radius: 14px
- No heavy shadow — 1px border `rgba(29,158,117,0.2)`

### 1.3 Message Thread

**User messages:**
- Right-aligned
- Background: `--color-primary`
- Text: white, 14px / 400
- Border radius: 14px 14px 4px 14px
- No avatar

**Agent responses (non-transaction):**
- Left-aligned
- Background: `--color-surface-raised`
- Text: `--color-text-primary`, 14px / 400
- Border radius: 14px 14px 14px 4px
- No robot avatar, no bot icon — just the bubble

**Transaction Confirmation Card** (replaces agent text bubble):

This is the most important component. Make it feel like a banking confirmation screen.
┌─────────────────────────────────┐
│  Send Payment                   │
│  ─────────────────────────────  │
│  To      0x742d...3f8a          │
│  Amount  5.00 cUSD              │
│  Fee     ~0.001 CELO            │
│  Memo    bayar makan siang      │
│  ─────────────────────────────  │
│  [Cancel]        [Approve →]    │
└─────────────────────────────────┘

Specs:
- Background: `--color-surface`
- Border: 1px `--color-border-strong`
- Border radius: 14px
- Label column: 12px / `--color-text-tertiary`
- Value column: 14px / 500 / `--color-text-primary`
- Addresses: Geist Mono 13px
- Divider: 1px `--color-border`
- Cancel button: ghost, `--color-text-secondary`
- Approve button: filled `--color-primary`, white text, 10px radius
- Subtle left border accent on the card: 3px `--color-primary`

**Success State** (after TX confirmed):
┌─────────────────────────────────┐
│  ✓  Sent successfully           │
│  5.00 cUSD to 0x742d...3f8a    │
│  View on explorer →             │
└─────────────────────────────────┘
- Left border: `--color-success`
- Icon: simple checkmark, `--color-success`
- Explorer link: 12px / `--color-primary`

### 1.4 Quick Action Chips

Horizontal scroll row above input. Tappable suggestion pills.
[Send payment]  [Split bill]  [Pay weekly]  [Check balance]

- Height: 32px
- Background: `--color-surface-raised`
- Border: 1px `--color-border`
- Text: 13px / 400 / `--color-text-secondary`
- Border radius: 999px
- Active/pressed: `--color-primary-light`, border `--color-primary`

### 1.5 Command Input Bar
┌──────────────────────────────────────┐
│  ✦  Type a payment command...    [→] │
└──────────────────────────────────────┘

- Height: 52px
- Background: `--color-surface-raised`
- Border: 1px `--color-border`
- Border radius: 999px (pill shape)
- Focus: border becomes `--color-primary`, subtle ring
- Left icon: small Sparkle/bolt icon, `--color-text-tertiary`
- Send button: circle 36px, `--color-primary` background, white arrow icon
- Placeholder: "Type a payment command..." / `--color-text-tertiary`
- Font: 14px / 400

**Loading state** (agent thinking):
- Three animated dots inside the agent bubble
- Dots color: `--color-text-tertiary`
- Animation: fade in/out stagger, 600ms cycle

---

## Page 2: Transaction History `/history`

Clean financial statement look. Think bank statement, not crypto explorer.

### Layout
1. Header with month selector
2. Summary stats row
3. Transaction list grouped by date

### 2.1 Header + Month Selector
← History                    June 2025 ▾
Month selector: tap to open a simple month picker bottom sheet.

### 2.2 Summary Stats Row

3 metric cards in a row:
┌──────────┐  ┌──────────┐  ┌──────────┐
│ Sent     │  │ Received │  │ TX Count │
│ 45.00    │  │ 12.00    │  │ 8        │
│ cUSD     │  │ cUSD     │  │ this mo  │
└──────────┘  └──────────┘  └──────────┘

- Background: `--color-surface-raised`
- Label: 11px / `--color-text-tertiary`
- Amount: 18px / 500 / `--color-text-primary`
- Unit: 11px / `--color-text-tertiary`
- No border — just background contrast
- Border radius: 10px

### 2.3 Transaction List

Grouped by date label: "Today", "Yesterday", "June 8", etc.

**Date label:**
Today
12px / 500 / `--color-text-tertiary`, uppercase, letter-spacing 0.05em

**Transaction row:**
┌────────────────────────────────────────────┐
│  [icon]  bayar makan siang    -5.00 cUSD  │
│          0x742d...3f8a  · 2:41 PM         │
└────────────────────────────────────────────┘

Icon variants (32px circle):
- Send: arrow up-right, background `--color-primary-light`, icon `--color-primary`
- Receive: arrow down-left, background `--color-success-light`, icon `--color-success`
- Group: people icon, background `--color-warning-light`, icon `--color-warning`
- Scheduled: repeat icon, background `rgba(99,102,241,0.1)`, icon `#6366F1`

Amount:
- Outgoing: `--color-text-primary` (not red — too alarming)
- Incoming: `--color-success`

Memo: 14px / 400 / `--color-text-primary`
Address + time: 12px / `--color-text-tertiary`

Row separator: 1px `--color-border` (inset, not full width)

**Tap row** → opens transaction detail bottom sheet:
TX Hash    0x8f3a...2c91  [copy]
Block      #28,441,293
Status     Confirmed ✓
Time       June 9, 2025 · 14:41
Network    Celo Mainnet
Bottom sheet: slides up, 60% screen height, drag handle at top, rounded top corners 20px.

---

## Page 3: Group Payment `/groups`

Patungan feature. Clean progress-based UI.

### 3.1 Header + New Button
Groups                          [+ New]
"+ New" button: `--color-primary`, 14px, rounded 10px, padding 8px 16px.

### 3.2 Tab Filter
[Active]  [Completed]  [Cancelled]
- Underline style, not pill tabs
- Active underline: `--color-primary`, 2px
- 14px / 500 for active, 14px / 400 / `--color-text-secondary` for inactive

### 3.3 Group Card
┌──────────────────────────────────────────┐
│  Makan malam bareng              [Open]  │
│  Target: 100 cUSD                        │
│  ████████████░░░░░  70 / 100 cUSD        │
│  4 contributors · Deadline: June 12      │
│  ─────────────────────────────────────── │
│  [Contribute]              [Share link]  │
└──────────────────────────────────────────┘

Progress bar:
- Track: `--color-border` / height 6px / radius 999px
- Fill: `--color-primary` / animated fill on mount (CSS transition 800ms ease-out)
- Near-complete (>90%): fill color `--color-success`
- Overdue: fill color `--color-warning`

Status badge:
- Open: `--color-primary-light` bg / `--color-primary-dark` text
- Completed: `--color-success-light` bg / `--color-success` text
- Cancelled: neutral bg / `--color-text-tertiary` text
- 11px / 500 / 6px radius

Contribute button: filled `--color-primary`
Share link button: outline, `--color-border-strong`

### 3.4 Create Group Bottom Sheet

Slides up full-screen. Clean form layout.

Fields:
Description
[What are you collecting for?           ]
Recipient address
[0x...                                  ]
Target amount
[$ _______ cUSD                         ]
Deadline
[Select date                     Jun 12 ]

Input style:
- Height: 48px
- Background: `--color-surface-raised`
- Border: 1px `--color-border`
- Focus border: `--color-primary`
- Label: 12px / 500 / `--color-text-secondary`, above input
- Value: 15px / 400 / `--color-text-primary`
- Border radius: 10px

Submit: full-width, 48px height, `--color-primary`, "Create Group", 15px / 500.

---

## Page 4: Recurring Payments `/schedules`

Payment scheduler. Dashboard-style overview.

### 4.1 Header
Schedules                       [+ New]

### 4.2 Active Schedules List

**Schedule card:**
┌──────────────────────────────────────────┐
│  🔁  Sewa kos                  [Active]  │
│      To: 0x456d...9f2b                   │
│      10 cUSD · Every week                │
│      Next: June 16 · Executed 4×         │
│                              [Cancel]    │
└──────────────────────────────────────────┘

- Icon: repeat icon, `--color-primary`
- Title: 15px / 500 / `--color-text-primary`
- Details: 13px / `--color-text-secondary`
- Next date highlight: 13px / `--color-primary`
- Cancel: text button, 13px / `--color-danger`, right-aligned
- Status badge: same system as groups

**Execute Now button** (visible when isDue = true):
┌──────────────────────────┐
│  ▶  Execute now          │
└──────────────────────────┘
- Background: `--color-success-light`
- Text: `--color-success`
- Appears with subtle pulse animation when due

### 4.3 Create Schedule Bottom Sheet

Fields:
Recipient address
[0x...                                  ]
Amount
[$ _______ cUSD                         ]
Repeat every
[Weekly ▾]   (Daily / Weekly / Monthly)
Start date
[Today ▾]
Memo (optional)
[e.g. Sewa kos                          ]

Submit: "Set Schedule" / full-width / `--color-primary`

---

## Shared Components

### Loading States
- Skeleton loading: animated shimmer, `--color-surface-raised` base, slightly lighter highlight
- Never use spinners for content loading — use skeleton only
- Spinner only for button loading states (16px, white, centered in button)

### Error States
┌─────────────────────────────────┐
│  ⚠  Transaction failed          │
│  Insufficient allowance.        │
│  [Try again]                    │
└─────────────────────────────────┘
- Left border: `--color-danger`, 3px
- Background: `--color-danger-light`
- Text: 14px / `--color-text-primary`

### Empty States
Each page needs an empty state. Design: centered icon (48px, `--color-text-tertiary`), 2-line message, optional CTA button.
No transactions yet
Start by sending your first payment
[Send payment]

### Toast Notifications
Top-center, slides down. Auto-dismiss 3 seconds.
- Success: `--color-success` left border
- Error: `--color-danger` left border
- Info: `--color-primary` left border
- Width: 340px max, mobile 90vw
- Border radius: 10px
- Shadow: `--shadow-md`

### Bottom Sheets
- Backdrop: `rgba(0,0,0,0.4)`
- Sheet background: `--color-surface`
- Drag handle: 36px × 4px, `--color-border-strong`, centered, rounded
- Border radius top: 20px
- Animation: slide up 300ms cubic-bezier(0.32, 0.72, 0, 1)

---

## Micro-interactions & Motion

Keep motion subtle and purposeful. No decorative animations.

```css
/* Standard transition */
transition: all 150ms ease;

/* Page transitions */
transition: opacity 200ms ease, transform 200ms ease;

/* Progress bar fill */
transition: width 800ms cubic-bezier(0.4, 0, 0.2, 1);

/* Bottom sheet entrance */
transition: transform 300ms cubic-bezier(0.32, 0.72, 0, 1);

/* Success state pop */
@keyframes success-pop {
  0%   { transform: scale(0.95); opacity: 0; }
  60%  { transform: scale(1.02); }
  100% { transform: scale(1); opacity: 1; }
}
```

Rules:
- Button press: scale(0.98) on active
- Card hover: subtle shadow increase (desktop only)
- No bounce, no spring, no looping animations
- Agent "thinking" dots: opacity pulse only, no movement

---

## MiniPay-Specific Requirements

```typescript
// Detect MiniPay environment
const isMiniPay = typeof window !== 'undefined' && 
  (window as any).ethereum?.isMiniPay === true;

// If MiniPay: hide bottom nav wallet connect button
// If MiniPay: show "Connected via MiniPay" indicator in header
// If MiniPay: use MiniPay's built-in approval flow
```

- Bottom nav height must account for MiniPay's bottom bar
- All touch targets minimum 44×44px
- No hover-only interactions
- Test at 360px width minimum

---

## File Structure
src/
├── app/
│   ├── layout.tsx              # root layout, bottom nav
│   ├── page.tsx                # chat interface
│   ├── history/page.tsx
│   ├── groups/page.tsx
│   └── schedules/page.tsx
├── components/
│   ├── layout/
│   │   ├── BottomNav.tsx
│   │   ├── PageHeader.tsx
│   │   └── BottomSheet.tsx
│   ├── chat/
│   │   ├── ChatThread.tsx
│   │   ├── MessageBubble.tsx
│   │   ├── TxConfirmCard.tsx
│   │   ├── TxSuccessCard.tsx
│   │   ├── CommandInput.tsx
│   │   ├── QuickChips.tsx
│   │   └── BalanceCard.tsx
│   ├── history/
│   │   ├── TxList.tsx
│   │   ├── TxRow.tsx
│   │   ├── TxDetail.tsx
│   │   └── StatCards.tsx
│   ├── groups/
│   │   ├── GroupCard.tsx
│   │   ├── GroupProgress.tsx
│   │   └── CreateGroupSheet.tsx
│   ├── schedules/
│   │   ├── ScheduleCard.tsx
│   │   └── CreateScheduleSheet.tsx
│   └── ui/
│       ├── Badge.tsx
│       ├── Button.tsx
│       ├── Input.tsx
│       ├── Toast.tsx
│       ├── Skeleton.tsx
│       └── EmptyState.tsx
├── styles/
│   └── globals.css             # CSS variables, base styles
└── lib/
└── utils.ts

---

## Build Sequence for Claude Code

Follow this order strictly. Do not skip ahead.

### Step 1 — Design System Foundation
1. Set up CSS variables in `globals.css` (full palette above)
2. Configure Geist font in `layout.tsx`
3. Build `Button.tsx` — variants: primary, ghost, outline, danger
4. Build `Input.tsx` — with label, error state, focus ring
5. Build `Badge.tsx` — variants: success, warning, danger, neutral, primary
6. Build `Skeleton.tsx` — shimmer animation
7. Build `Toast.tsx` — with variants and auto-dismiss
8. Build `BottomSheet.tsx` — with drag handle, backdrop, animation

After Step 1, run:
/impeccable audit the UI components
/impeccable polish the button and input components

### Step 2 — Layout Shell
1. Build `BottomNav.tsx` with 4 tabs
2. Build `PageHeader.tsx`
3. Set up `layout.tsx` with nav + page transitions
4. Verify mobile layout at 360px, 390px, 430px

### Step 3 — Chat Page (most critical)
1. Build `BalanceCard.tsx`
2. Build `MessageBubble.tsx` — user and agent variants
3. Build `TxConfirmCard.tsx` — the banking-style confirmation
4. Build `TxSuccessCard.tsx`
5. Build `QuickChips.tsx` — horizontal scroll
6. Build `CommandInput.tsx` — pill input with send button
7. Assemble `ChatThread.tsx`
8. Wire up `/api/agent` call with loading state

After Step 3, run:
/impeccable polish the chat interface
/impeccable critique the payment confirmation card

### Step 4 — History Page
1. Build `StatCards.tsx`
2. Build `TxRow.tsx` with icon variants
3. Build `TxList.tsx` with date grouping
4. Build `TxDetail.tsx` bottom sheet
5. Assemble history page

### Step 5 — Groups Page
1. Build `GroupProgress.tsx` — animated progress bar
2. Build `GroupCard.tsx`
3. Build `CreateGroupSheet.tsx` — form with validation
4. Assemble groups page

### Step 6 — Schedules Page
1. Build `ScheduleCard.tsx` — with execute now state
2. Build `CreateScheduleSheet.tsx`
3. Assemble schedules page

### Step 7 — Polish Pass
Run these in sequence:
/impeccable polish the entire app
/impeccable audit the chat interface
/impeccable audit the transaction history
/minimalist-ui
/impeccable colorize
/impeccable typeset

### Step 8 — Final Review
/design-review
/review

---

## Anti-Pattern Checklist

Before considering any component done, verify:

- [ ] No generic gray (`gray-100`, `gray-500`) — use custom palette only
- [ ] No blue focus rings — use `--color-primary` focus
- [ ] No robot/AI avatar icons anywhere in the chat
- [ ] No "loading..." text — use skeleton or dots only
- [ ] No heavy drop shadows on flat elements
- [ ] No all-caps buttons — sentence case only
- [ ] No emoji in UI — use Lucide icons instead
- [ ] All wallet addresses truncated to `0x742d...3f8a` format
- [ ] All amounts formatted to 2 decimal places: `5.00 cUSD`
- [ ] All touch targets ≥ 44px
- [ ] Dark mode works for every component
- [ ] No hardcoded colors anywhere — CSS variables only

---

## Definition of Done

The frontend is complete when:
1. All 4 pages are built and functional
2. `/impeccable audit` returns no critical issues
3. App renders correctly at 360px width
4. Dark mode matches light mode quality
5. MiniPay detection works
6. TX confirm card feels like a banking app, not a chatbot
7. No component looks like it came from a generic shadcn demo