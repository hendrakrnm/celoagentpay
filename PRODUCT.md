# Product

## Register

product

## Users

MiniPay wallet holders in emerging markets who want to send money with the same ease as sending a WhatsApp message. They're already familiar with chat interfaces but often find crypto transfers tedious and error-prone. Context: mobile-first, low-bandwidth networks, high need for trust and security. Primary jobs: send payments instantly, split bills with friends, set up recurring transfers, check balances.

## Product Purpose

CeloPay Agent is an AI-powered payment assistant that removes friction from blockchain transfers. Users command in natural language ("send 5 cUSD to Alice for lunch", "split 30 between 3 people"), the agent parses intent, and executes on Celo via MiniPay. No manual address entry, no amount fumbling, no approval friction. Success = every payment feels as natural as messaging.

## Brand Personality

**Direct. Trustworthy. Frictionless.**

- **Direct**: no marketing speak, no unnecessary steps, conversational tone that's more banking advisor than chatbot. Clear confirmations before every transaction.
- **Trustworthy**: every transaction is transparent; user always approves before execution. Financial accuracy (2 decimals, no surprises). Looks like a bank, not a crypto casino.
- **Frictionless**: mobile-optimized, fast feedback, minimal taps to complete a payment. Designed for 2G, not just 5G.

## Anti-references

- ChatGPT chat UI (overly conversational, emoji-heavy)
- MetaMask wallet (complex, crypto-native, assumes expertise)
- Rainbow gradient crypto dashboards (decorative, not trustworthy)
- Generic shadcn demos (bland, template-obvious)
- All-caps urgent copy (too pushy for financial products)
- Emoji in UI (use Lucide icons only)

## Design Principles

1. **Clarity over cleverness** — every label, button, and confirmation is unambiguous. Users must understand what will happen before they approve.
2. **Speed + safety** — confirmations are fast (one tap to approve), but never auto-execute. User controls all funds.
3. **Mobile-first always** — designed for 360px width, low data, 2G latency. Desktop is a bonus, not the baseline.
4. **Command bar not chatbot** — mimic a payment CLI, not a conversational AI. Minimal back-and-forth.
5. **Earn through accuracy** — every decimal, every address, every timestamp is pixel-perfect. No rounding errors, no surprises.

## Accessibility & Inclusion

- WCAG 2.1 AA minimum
- Touch targets ≥44×44px (MiniPay requirement)
- No hover-only interactions (mobile-first, no cursor)
- Respects `prefers-reduced-motion` for all animations
- Readable text contrast (≥4.5:1 for body text)
- All amounts formatted consistently to 2 decimals
- Addresses abbreviated to truncated format (0x742d...3f8a) for scannability
