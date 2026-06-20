# Memphis Frontend Redesign Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Convert the existing CeloPay Agent frontend into a Memphis-style mobile wallet shell while preserving wallet connect and chat transaction behavior.

**Architecture:** Keep the current Next.js App Router and component layout. Apply global Memphis design tokens, then refactor existing layout/chat components and add static visual pages for History, Groups, and Schedules. Do not modify smart contracts or contract deployment files.

**Tech Stack:** Next.js 16, React 19, TypeScript, Tailwind CSS v4, wagmi, viem, lucide-react.

---

## File Structure

**Modify:**
- `.gitignore` — ignore envs, local tooling, build outputs, Foundry artifacts.
- `src/styles/globals.css` — Memphis tokens, dotted background, app shell, reusable utility classes.
- `src/app/layout.tsx` — keep providers/nav, ensure Poppins font variables and app shell work.
- `src/components/layout/PageHeader.tsx` — Memphis header with wallet connect/network state.
- `src/components/layout/BottomNav.tsx` — Memphis bottom nav, active state via `usePathname()`.
- `src/components/ui/Button.tsx` — Memphis button variants.
- `src/components/ui/Badge.tsx` — Memphis badge variants.
- `src/components/chat/BalanceCard.tsx` — Memphis balance card, keep wallet/balance hooks.
- `src/components/chat/QuickChips.tsx` — Memphis chips, keep `onSelect`.
- `src/components/chat/MessageBubble.tsx` — Memphis bubbles, loading dots.
- `src/components/chat/TxConfirmCard.tsx` — Memphis tx-card, keep approve/cancel props.
- `src/components/chat/TxSuccessCard.tsx` — Memphis success card.
- `src/components/chat/CommandInput.tsx` — fixed Memphis input bar.
- `src/components/chat/ChatThread.tsx` — preserve flow, adjust copy/classes.
- `src/app/page.tsx` — chat page shell.
- `src/app/history/page.tsx` — static Memphis history shell.
- `src/app/groups/page.tsx` — static Memphis groups shell.
- `src/app/schedules/page.tsx` — static Memphis schedules shell.

**Do not modify:**
- `contracts/**`

---

### Task 1: Branch and Safety Baseline

**Files:**
- Verify only: git state

- [ ] **Step 1: Confirm branch**

Run:
```bash
git branch --show-current
```
Expected:
```txt
feat/memphis-redesign-2026-06-14
```

- [ ] **Step 2: Confirm smart contracts are unchanged before work**

Run:
```bash
git status --short -- contracts
```
Expected: no output, or only pre-existing unrelated state that must not be touched.

---

### Task 2: Update `.gitignore`

**Files:**
- Modify: `.gitignore`

- [ ] **Step 1: Replace `.gitignore` content**

Set `.gitignore` to:

```gitignore
# dependencies
node_modules/
.pnp
.pnp.*
.yarn/*
!.yarn/patches
!.yarn/plugins
!.yarn/releases
!.yarn/versions

# next.js
.next/
out/
build/
dist/

# testing
coverage/

# env / secrets
.env
.env.*
!.env.example
*.pem

# logs
npm-debug.log*
yarn-debug.log*
yarn-error.log*
pnpm-debug.log*
.pnpm-debug.log*
*.log

# vercel
.vercel/

# typescript
*.tsbuildinfo
next-env.d.ts

# foundry generated artifacts
cache/
out/
broadcast/
contracts/cache/
contracts/out/
contracts/broadcast/

# local tooling / agent plugin dumps
.claude/
.agents/
.gemini/
.kiro/
.impeccable/
.gstack/

# editors / OS
.vscode/
.idea/
.DS_Store
Thumbs.db
*.local
```

- [ ] **Step 2: Check ignored files behavior**

Run:
```bash
git status --short --ignored | head -80
```
Expected: ignored generated/local dirs show as `!!`, not newly staged.

- [ ] **Step 3: Do not remove tracked files yet**

If `.claude/`, `.agents/`, `.gemini/`, `.kiro/`, `.impeccable/`, `contracts/broadcast/`, or `contracts/cache/` are already tracked, do not delete them physically. If cleanup is needed later, use `git rm --cached` only after user approval.

---

### Task 3: Add Memphis Global Design Tokens

**Files:**
- Modify: `src/styles/globals.css`

- [ ] **Step 1: Replace global tokens and base styles**

Use this full structure in `src/styles/globals.css`:

```css
@import "tailwindcss";

:root {
  --color-primary: #e8879f;
  --color-secondary: #4db8a8;
  --color-accent: #f5d76e;
  --color-bg: #faf8f5;
  --color-surface: #fffef7;
  --color-text-primary: #1a1a2e;
  --color-text-secondary: #4a4a68;
  --color-text-tertiary: #7a7a92;
  --color-success: #4db8a8;
  --color-success-light: #dff5f0;
  --color-warning: #f5d76e;
  --color-warning-light: #fff3bd;
  --color-danger: #e8879f;
  --color-danger-light: #fde3ea;
  --border-color: #1a1a2e;
  --border-width: 3px;
  --border-radius: 12px;
  --shadow-offset: 4px 4px 0px var(--border-color);
  --shadow-active: 0px 0px 0px var(--border-color);
  --bubble-user-bg: var(--color-primary);
  --bubble-user-text: var(--color-surface);
  --bubble-agent-bg: var(--color-surface);
  --bubble-agent-text: var(--color-text-primary);
}

@theme inline {
  --color-background: var(--color-bg);
  --color-foreground: var(--color-text-primary);
  --color-primary: var(--color-primary);
  --color-primary-light: var(--color-danger-light);
  --color-primary-dark: var(--border-color);
  --color-surface: var(--color-surface);
  --color-surface-raised: #ffffff;
  --color-border: var(--border-color);
  --color-border-strong: var(--border-color);
  --color-text-secondary: var(--color-text-secondary);
  --color-text-tertiary: var(--color-text-tertiary);
  --color-success: var(--color-success);
  --color-success-light: var(--color-success-light);
  --color-warning: var(--color-warning);
  --color-warning-light: var(--color-warning-light);
  --color-danger: var(--color-danger);
  --color-danger-light: var(--color-danger-light);
  --font-sans: var(--font-poppins), var(--font-geist-sans);
  --font-mono: var(--font-poppins), var(--font-geist-mono);
}

* {
  box-sizing: border-box;
}

html {
  scroll-behavior: smooth;
}

body {
  background-color: var(--color-bg);
  background-image: radial-gradient(rgba(26, 26, 46, 0.1) 2px, transparent 2px);
  background-size: 24px 24px;
  color: var(--color-text-primary);
  font-family: var(--font-poppins), var(--font-geist-sans), sans-serif;
  font-size: 14px;
  line-height: 1.5;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

button,
input {
  font: inherit;
}

button {
  cursor: pointer;
}

.mono {
  font-family: var(--font-poppins), var(--font-geist-mono), monospace;
  font-variant-numeric: tabular-nums;
  font-weight: 600;
}

.app-shell {
  display: flex;
  flex-direction: column;
  height: 100dvh;
  max-width: 430px;
  margin: 0 auto;
  width: 100%;
  overflow: hidden;
  background: var(--color-bg);
  border-left: var(--border-width) solid var(--border-color);
  border-right: var(--border-width) solid var(--border-color);
  box-shadow: 20px 0 40px rgba(0, 0, 0, 0.05);
}

.memphis-card {
  background: var(--color-surface);
  border: var(--border-width) solid var(--border-color);
  border-radius: var(--border-radius);
  box-shadow: var(--shadow-offset);
}

.memphis-press {
  transition: transform 100ms ease, box-shadow 100ms ease, background-color 100ms ease;
}

.memphis-press:active {
  transform: translate(4px, 4px);
  box-shadow: var(--shadow-active);
}

.memphis-soft-press {
  transition: transform 100ms ease, box-shadow 100ms ease, background-color 100ms ease;
}

.memphis-soft-press:active {
  transform: translate(2px, 2px);
  box-shadow: var(--shadow-active);
}

@keyframes fade-in-up {
  from { opacity: 0; transform: translateY(8px); }
  to { opacity: 1; transform: translateY(0); }
}

@keyframes loading-dots {
  0%, 20%, 50%, 80%, 100% { opacity: 0.4; }
  40% { opacity: 1; }
}

@keyframes success-pop {
  0% { transform: scale(0.95); opacity: 0; }
  60% { transform: scale(1.02); }
  100% { transform: scale(1); opacity: 1; }
}

@keyframes shimmer {
  0% { background-position: -1000px 0; }
  100% { background-position: 1000px 0; }
}

@keyframes slide-up {
  from { transform: translateY(100%); opacity: 0; }
  to { transform: translateY(0); opacity: 1; }
}

.animate-success-pop { animation: success-pop 400ms ease-out; }
.animate-slide-up { animation: slide-up 300ms cubic-bezier(0.32, 0.72, 0, 1); }

button:focus-visible,
input:focus-visible,
a:focus-visible {
  outline: 3px solid var(--color-accent);
  outline-offset: 3px;
}

::-webkit-scrollbar {
  width: 6px;
  height: 6px;
}

::-webkit-scrollbar-track {
  background: transparent;
}

::-webkit-scrollbar-thumb {
  background: var(--border-color);
  border-radius: 999px;
}

@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
    scroll-behavior: auto !important;
  }
}
```

- [ ] **Step 2: Ensure old `src/app/globals.css` is not imported**

Run:
```bash
grep -R "app/globals.css\|./globals.css" -n src/app src/components src/lib || true
```
Expected: no import of `src/app/globals.css`; layout imports `../styles/globals.css`.

---

### Task 4: Load Poppins in Layout

**Files:**
- Modify: `src/app/layout.tsx`

- [ ] **Step 1: Add Poppins import and variable**

Update font imports and layout class to include Poppins:

```tsx
import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono, Poppins } from "next/font/google";
import "../styles/globals.css";
import { BottomNav } from "@/components/layout/BottomNav";
import { Providers } from "@/providers";

const geistSans = Geist({ variable: "--font-geist-sans", subsets: ["latin"] });
const geistMono = Geist_Mono({ variable: "--font-geist-mono", subsets: ["latin"] });
const poppins = Poppins({
  variable: "--font-poppins",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "CeloPay Agent",
  description: "AI-powered payment assistant for MiniPay.",
  icons: { icon: "/favicon.ico" },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  themeColor: "#e8879f",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`h-full ${geistSans.variable} ${geistMono.variable} ${poppins.variable} antialiased`}>
      <body className="h-full bg-[var(--color-bg)] text-[var(--color-text-primary)]">
        <Providers>
          <div className="app-shell">
            <main className="flex min-h-0 flex-1 flex-col">{children}</main>
            <BottomNav />
          </div>
        </Providers>
      </body>
    </html>
  );
}
```

- [ ] **Step 2: Run type/lint check for font import**

Run:
```bash
pnpm lint
```
Expected: no lint errors related to layout/font imports.

---

### Task 5: Refactor Memphis UI Primitives

**Files:**
- Modify: `src/components/ui/Button.tsx`
- Modify: `src/components/ui/Badge.tsx`

- [ ] **Step 1: Replace button variants**

Use Memphis borders/shadows:

```tsx
import React from "react";
import { cva, type VariantProps } from "class-variance-authority";

const buttonVariants = cva(
  "inline-flex items-center justify-center rounded-[var(--border-radius)] border-[3px] border-[var(--border-color)] font-semibold uppercase tracking-[0.02em] shadow-[var(--shadow-offset)] transition-all duration-100 active:translate-x-1 active:translate-y-1 active:shadow-[var(--shadow-active)] focus-visible:outline-none disabled:pointer-events-none disabled:opacity-60",
  {
    variants: {
      variant: {
        primary: "bg-[var(--color-secondary)] text-[var(--color-surface)]",
        ghost: "bg-[var(--color-surface)] text-[var(--color-text-primary)]",
        outline: "bg-[var(--color-surface)] text-[var(--color-text-primary)]",
        danger: "bg-[var(--color-primary)] text-[var(--color-surface)]",
      },
      size: {
        sm: "h-8 px-3 text-xs",
        md: "h-10 px-4 text-sm",
        lg: "h-12 px-5 text-sm",
        xl: "h-14 px-8 text-base",
      },
      fullWidth: { true: "w-full" },
      iconOnly: { true: "p-0" },
    },
    compoundVariants: [
      { iconOnly: true, size: "sm", class: "h-8 w-8" },
      { iconOnly: true, size: "md", class: "h-10 w-10" },
      { iconOnly: true, size: "lg", class: "h-12 w-12" },
    ],
    defaultVariants: { variant: "primary", size: "md" },
  }
);

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement>, VariantProps<typeof buttonVariants> {
  loading?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, fullWidth, iconOnly, loading, children, disabled, ...props }, ref) => (
    <button
      className={buttonVariants({ variant, size, fullWidth, iconOnly, className })}
      disabled={disabled || loading}
      ref={ref}
      {...props}
    >
      {loading ? <span className="h-4 w-4 rounded-full border-2 border-current border-t-transparent animate-spin" /> : children}
    </button>
  )
);
Button.displayName = "Button";

export { Button, buttonVariants };
```

- [ ] **Step 2: Replace badge variants**

```tsx
import React from "react";
import { cva, type VariantProps } from "class-variance-authority";

const badgeVariants = cva(
  "inline-flex h-6 items-center justify-center rounded-[var(--border-radius)] border-2 border-[var(--border-color)] px-2.5 text-[11px] font-bold uppercase tracking-[0.04em] shadow-[2px_2px_0_var(--border-color)]",
  {
    variants: {
      variant: {
        primary: "bg-[var(--color-primary)] text-[var(--color-surface)]",
        success: "bg-[var(--color-secondary)] text-[var(--color-surface)]",
        warning: "bg-[var(--color-accent)] text-[var(--border-color)]",
        danger: "bg-[var(--color-primary)] text-[var(--color-surface)]",
        neutral: "bg-[var(--color-surface)] text-[var(--border-color)]",
      },
    },
    defaultVariants: { variant: "primary" },
  }
);

export interface BadgeProps extends React.HTMLAttributes<HTMLDivElement>, VariantProps<typeof badgeVariants> {}

const Badge = React.forwardRef<HTMLDivElement, BadgeProps>(({ className, variant, children, ...props }, ref) => (
  <div ref={ref} className={badgeVariants({ variant, className })} {...props}>
    {children}
  </div>
));
Badge.displayName = "Badge";

export { Badge, badgeVariants };
```

- [ ] **Step 3: Run lint**

Run:
```bash
pnpm lint
```
Expected: no errors in `Button.tsx` or `Badge.tsx`.

---

### Task 6: Refactor Header and Bottom Nav

**Files:**
- Modify: `src/components/layout/PageHeader.tsx`
- Modify: `src/components/layout/BottomNav.tsx`

- [ ] **Step 1: Replace PageHeader**

Keep wallet connect logic. Use this structure:

```tsx
"use client";

import { AlertTriangle, LogOut, Wallet } from "lucide-react";
import { useWallet } from "@/lib/wallet";

interface PageHeaderProps {
  title: string;
  actionLabel?: string;
}

export function PageHeader({ title, actionLabel }: PageHeaderProps) {
  const {
    isConnected,
    isCorrectChain,
    isConnecting,
    isSwitching,
    shortAddress,
    connect,
    disconnect,
    switchToCorrectChain,
  } = useWallet();

  return (
    <header className="sticky top-0 z-30 flex h-16 flex-shrink-0 items-center justify-between border-b-[3px] border-[var(--border-color)] bg-[var(--color-surface)] px-4">
      <h1 className="text-lg font-bold uppercase tracking-[0.04em] text-[var(--color-text-primary)]">{title}</h1>

      <div className="flex items-center gap-2">
        {isConnected && !isCorrectChain && (
          <button
            onClick={switchToCorrectChain}
            disabled={isSwitching}
            className="memphis-soft-press flex items-center gap-1.5 rounded-[var(--border-radius)] border-[3px] border-[var(--border-color)] bg-[var(--color-accent)] px-3 py-1.5 text-xs font-bold uppercase text-[var(--border-color)] shadow-[2px_2px_0_var(--border-color)]"
          >
            <AlertTriangle className="h-3.5 w-3.5" />
            {isSwitching ? "Switching" : "Celo"}
          </button>
        )}

        {!isConnected && (
          <button
            onClick={connect}
            disabled={isConnecting}
            className="memphis-soft-press flex items-center gap-2 rounded-[var(--border-radius)] border-[3px] border-[var(--border-color)] bg-[var(--color-accent)] px-3 py-1.5 text-xs font-bold uppercase text-[var(--border-color)] shadow-[2px_2px_0_var(--border-color)]"
          >
            <Wallet className="h-4 w-4" />
            {isConnecting ? "Connecting" : "Connect"}
          </button>
        )}

        {isConnected && isCorrectChain && (
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-2 rounded-[var(--border-radius)] border-[3px] border-[var(--border-color)] bg-[var(--color-accent)] px-3 py-1.5 text-xs font-bold uppercase text-[var(--border-color)] shadow-[2px_2px_0_var(--border-color)]">
              <span className="h-2.5 w-2.5 rounded-full bg-[var(--border-color)]" />
              <span className="mono">{actionLabel ?? shortAddress}</span>
            </div>
            <button
              onClick={() => disconnect()}
              className="memphis-soft-press rounded-[var(--border-radius)] border-2 border-[var(--border-color)] bg-[var(--color-surface)] p-1.5 shadow-[2px_2px_0_var(--border-color)]"
              title="Disconnect"
            >
              <LogOut className="h-4 w-4" />
            </button>
          </div>
        )}
      </div>
    </header>
  );
}
```

- [ ] **Step 2: Replace BottomNav**

Use real links and active Memphis style:

```tsx
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { CalendarDays, Clock3, MessageCircle, Users } from "lucide-react";

const navItems = [
  { href: "/", label: "Chat", icon: MessageCircle },
  { href: "/history", label: "History", icon: Clock3 },
  { href: "/groups", label: "Groups", icon: Users },
  { href: "/schedules", label: "Plans", icon: CalendarDays },
];

export function BottomNav() {
  const pathname = usePathname();

  return (
    <nav className="z-40 flex h-20 flex-shrink-0 items-center justify-around border-t-[3px] border-[var(--border-color)] bg-[var(--color-surface)] px-4 pb-2">
      {navItems.map(({ href, label, icon: Icon }) => {
        const isActive = pathname === href;
        return (
          <Link
            key={href}
            href={href}
            className={`flex min-h-11 min-w-11 flex-col items-center justify-center gap-1 text-[11px] font-bold uppercase transition-transform duration-150 ${
              isActive ? "-translate-y-1 text-[var(--color-primary)]" : "text-[var(--color-text-tertiary)]"
            }`}
          >
            <Icon className="h-6 w-6" fill={isActive ? "currentColor" : "none"} strokeWidth={2.5} />
            <span>{label}</span>
          </Link>
        );
      })}
    </nav>
  );
}
```

- [ ] **Step 3: Run lint**

Run:
```bash
pnpm lint
```
Expected: no layout component errors.

---

### Task 7: Refactor Chat Components

**Files:**
- Modify: `src/components/chat/BalanceCard.tsx`
- Modify: `src/components/chat/QuickChips.tsx`
- Modify: `src/components/chat/MessageBubble.tsx`
- Modify: `src/components/chat/TxConfirmCard.tsx`
- Modify: `src/components/chat/TxSuccessCard.tsx`
- Modify: `src/components/chat/CommandInput.tsx`
- Modify: `src/components/chat/ChatThread.tsx`

- [ ] **Step 1: Update BalanceCard visual classes only**

Keep hooks and balance logic. Replace returned JSX styling with:

```tsx
if (!isConnected || !address) {
  return (
    <div className="flex-shrink-0 border-b-[3px] border-[var(--border-color)] bg-[var(--color-surface)] px-4 py-5 text-center">
      <p className="text-sm font-semibold uppercase tracking-[0.08em] text-[var(--color-text-secondary)]">Connect wallet to view balances</p>
    </div>
  );
}

return (
  <div className="flex-shrink-0 border-b-[3px] border-[var(--border-color)] bg-[var(--color-surface)] px-4 py-5 text-center">
    <p className="text-sm font-semibold uppercase tracking-[0.08em] text-[var(--color-text-secondary)]">Total Balance</p>
    <p className="mono mt-1 text-4xl font-bold text-[var(--color-primary)] [text-shadow:2px_2px_0_var(--border-color)]">
      {fmt(nativeBal?.value)} CELO
    </p>
    <div className="mt-4 flex gap-3 overflow-x-auto pb-1">
      {balances.map(({ symbol, emoji, value }) => (
        <div key={symbol} className="memphis-card flex flex-shrink-0 items-center gap-2 px-3 py-2 text-sm">
          <span>{emoji}</span>
          <span className="mono text-[var(--border-color)]">{fmt(value)}</span>
          <span className="text-xs font-bold uppercase text-[var(--color-text-secondary)]">{symbol}</span>
        </div>
      ))}
    </div>
    <button onClick={copyAddress} className="mx-auto mt-3 flex items-center gap-1.5 rounded-[8px] border-2 border-[var(--border-color)] bg-[var(--color-accent)] px-2 py-1 text-xs font-bold uppercase shadow-[2px_2px_0_var(--border-color)]">
      <code className="mono">{shortAddress}</code>
      {copied ? <Check className="h-3 w-3" /> : <Copy className="h-3 w-3" />}
    </button>
  </div>
);
```

- [ ] **Step 2: Update QuickChips**

Set chips to Send, Receive, Swap, Check balance and use Memphis classes:

```tsx
const chips = [
  { label: "Send payment", display: "Send", icon: Send },
  { label: "Receive", display: "Receive", icon: Split },
  { label: "Swap", display: "Swap", icon: RotateCw },
  { label: "Check balance", display: "Balance", icon: Eye },
];
```

Button class:
```tsx
className={`memphis-press flex flex-shrink-0 items-center gap-2 whitespace-nowrap rounded-[var(--border-radius)] border-[3px] border-[var(--border-color)] px-4 py-2 text-sm font-semibold shadow-[var(--shadow-offset)] ${colorClass}`}
```

Use color classes by index:
```tsx
const colors = [
  "bg-[var(--color-primary)] text-[var(--color-surface)]",
  "bg-[var(--color-secondary)] text-[var(--color-surface)]",
  "bg-[var(--color-accent)] text-[var(--border-color)]",
  "bg-[var(--color-surface)] text-[var(--border-color)]",
];
```

- [ ] **Step 3: Update MessageBubble**

Use wrapper max-width 85%, bordered bubbles, offset shadows. Loading bubble keeps three dots with `loading-dots` animation.

- [ ] **Step 4: Update TxConfirmCard**

Render:
- card title/action
- rows from `details`
- cancel button
- confirm button
- dashed row dividers
- preserve `onCancel`, `onApprove`, `isLoading`

- [ ] **Step 5: Update CommandInput**

Make fixed-looking bottom input inside normal chat layout:
- wrapper border top 3px
- input box height 54px
- send button yellow square
- preserve `onSubmit`, Enter key behavior, disabled state

- [ ] **Step 6: Update TxSuccessCard**

Use Memphis card, green/teal success accent, explorer link.

- [ ] **Step 7: Keep ChatThread behavior**

Only adjust copy if desired. Do not remove:
- `parseIntent(text)`
- `executeAction(action, ...)`
- `writeContractAsync`
- `sendTransactionAsync`
- `waitForTransactionReceipt`

- [ ] **Step 8: Run lint**

Run:
```bash
pnpm lint
```
Expected: no chat component errors.

---

### Task 8: Build Static History Page

**Files:**
- Modify: `src/app/history/page.tsx`

- [ ] **Step 1: Replace placeholder with static Memphis shell**

Use:
- `PageHeader title="History" actionLabel="June 2026"`
- 3 stat cards
- Today/Yesterday grouped list
- lucide icons: `ArrowUp`, `ArrowDown`, `PenLine`

- [ ] **Step 2: Verify route compiles**

Run:
```bash
pnpm lint
```
Expected: no errors in `src/app/history/page.tsx`.

---

### Task 9: Build Static Groups Page

**Files:**
- Modify: `src/app/groups/page.tsx`

- [ ] **Step 1: Replace placeholder with static Memphis shell**

Use:
- `PageHeader title="Groups" actionLabel="New +"`
- tabs Active, Done, Void
- two group cards: Trip to Bali, Office Lunch
- progress bars at 85% and 33%

- [ ] **Step 2: Verify route compiles**

Run:
```bash
pnpm lint
```
Expected: no errors in `src/app/groups/page.tsx`.

---

### Task 10: Build Static Schedules Page

**Files:**
- Modify: `src/app/schedules/page.tsx`

- [ ] **Step 1: Replace placeholder with static Memphis shell**

Use:
- `PageHeader title="Schedules" actionLabel="New +"`
- two schedule cards: Weekly Rent, DCA Ethereum
- badges, next-run labels, execute buttons

- [ ] **Step 2: Verify route compiles**

Run:
```bash
pnpm lint
```
Expected: no errors in `src/app/schedules/page.tsx`.

---

### Task 11: Final Verification

**Files:**
- Verify: whole repo except contracts untouched

- [ ] **Step 1: Confirm no smart contract edits**

Run:
```bash
git status --short -- contracts
```
Expected: no modified files under `contracts/**`.

- [ ] **Step 2: Run lint**

Run:
```bash
pnpm lint
```
Expected: pass.

- [ ] **Step 3: Run build**

Run:
```bash
pnpm build
```
Expected: pass.

- [ ] **Step 4: Check changed files**

Run:
```bash
git status --short
```
Expected: changes limited to `.gitignore`, `docs/superpowers/**`, and `src/**` frontend files. No `contracts/**` changes.

- [ ] **Step 5: Commit only if user approves commit**

Suggested commit messages:

```bash
git add .gitignore src/styles/globals.css src/app/layout.tsx src/app/page.tsx src/app/history/page.tsx src/app/groups/page.tsx src/app/schedules/page.tsx src/components/layout src/components/chat src/components/ui docs/superpowers

git commit -m "feat(app): add memphis frontend shell" -m "Co-Authored-By: Claude Opus 4.8 <noreply@anthropic.com>"
```

Do not push to `origin main`.
