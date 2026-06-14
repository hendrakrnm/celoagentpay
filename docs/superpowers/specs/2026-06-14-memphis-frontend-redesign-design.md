# Memphis Frontend Redesign Design

Date: 2026-06-14
Branch: `feat/memphis-redesign-2026-06-14`

## Goal

Redesign the existing CeloPay Agent frontend into a Memphis-style mobile wallet shell based on the supplied HTML reference. Keep the current wallet connection and chat transaction flow working. Add visual shells for History, Groups, and Schedules with mock content only.

## Constraints

- Do not edit `contracts/**`.
- Do not push to `origin main`.
- Work on `feat/memphis-redesign-2026-06-14`.
- Keep wallet connect, network status, chat parsing, confirmation, and transaction execution behavior.
- Do not add real onchain data fetching for History, Groups, or Schedules in this pass.
- Update `.gitignore` to exclude dangerous, generated, and local tooling files.

## Visual Direction

Use the supplied Memphis style:

- Poppins typography.
- Cream dotted background.
- Pastel pink, teal, yellow palette.
- Dark navy text and borders.
- 3px borders and chunky offset shadows.
- Rounded 12px cards/buttons.
- Uppercase bold headers and badges.
- Press states that move elements into their shadow.
- Fixed-width mobile shell capped at 430px.

Primary tokens:

```css
--color-primary: #e8879f;
--color-secondary: #4db8a8;
--color-accent: #f5d76e;
--color-bg: #faf8f5;
--color-surface: #fffef7;
--color-text-primary: #1a1a2e;
--color-text-secondary: #4a4a68;
--color-text-tertiary: #7a7a92;
--border-color: #1a1a2e;
--border-width: 3px;
--border-radius: 12px;
--shadow-offset: 4px 4px 0px var(--border-color);
```

## Files and Ownership

Expected frontend files:

- `src/styles/globals.css`
- `src/app/layout.tsx`
- `src/app/page.tsx`
- `src/app/history/page.tsx`
- `src/app/groups/page.tsx`
- `src/app/schedules/page.tsx`
- `src/components/layout/BottomNav.tsx`
- `src/components/layout/PageHeader.tsx`
- `src/components/chat/*`
- `src/components/ui/*` only as needed

Expected non-frontend file:

- `.gitignore`

Forbidden files:

- `contracts/**`

## Page Design

### Chat (`/`)

- Header shows wallet/app title and wallet/network action.
- Preserve connect wallet button and connected state.
- Balance card uses existing wallet hooks and token balances.
- Quick chips use Memphis chip styling.
- Message bubbles use bordered cards with offset shadows.
- Transaction confirmation uses a Memphis `tx-card` with dashed row dividers and clear confirm/cancel actions.
- Command input stays fixed above bottom nav and keeps submit behavior.

### History (`/history`)

- Static visual shell matching supplied mock.
- Stats row with incoming, outgoing, and saved/tx metrics.
- Grouped transaction list with Memphis cards and icons.
- No real event fetching yet.

### Groups (`/groups`)

- Static tabs: Active, Done, Void.
- Static group cards with member count, badge, progress stats, and progress bar.
- New button is visual only.

### Schedules (`/schedules`)

- Static schedule cards with title, badge, payment details, next run badge, and execute button.
- Execute button is visual only.

## Navigation

Use existing Next.js routes and `usePathname()` for active state. Do not use client-side manual page switching from the reference HTML. Keep four tabs:

- Chat
- History
- Groups
- Plans or Schedules

## Gitignore Cleanup

Update `.gitignore` to ignore:

- `node_modules/`, `.next/`, `out/`, `build/`, `dist/`
- `.env`, `.env.*`, but keep `!.env.example`
- logs and TypeScript build info
- Foundry generated artifacts: `contracts/cache/`, `contracts/out/`, `contracts/broadcast/`, root `cache/`, `out/`, `broadcast/`
- local tooling/plugin dirs: `.claude/`, `.agents/`, `.gemini/`, `.kiro/`, `.impeccable/`
- IDE/OS files

If these files are already tracked, remove them from the git index only after confirming they are generated/local. Do not delete physical local files unless explicitly asked.

## Testing and Verification

After implementation:

- Run `pnpm lint`.
- Run `pnpm build`.
- If possible, run the app and visually verify mobile width behavior.
- Confirm wallet connect button remains accessible.
- Confirm chat input still adds messages and calls the agent route.
- Confirm no `contracts/**` files changed.

## Out of Scope

- Real history event fetching.
- Real group/schedule list fetching.
- Smart contract edits.
- Contract deployment changes.
- Backend/database work.
- Pushing to `origin main`.
