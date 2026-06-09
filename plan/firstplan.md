# CeloPay Agent — Project Specification

> AI-powered payment assistant on Celo. Users send natural language commands,
> the agent parses intent and executes onchain transactions via MiniPay.

---

## 1. What Is This Project?

CeloPay Agent is a MiniApp built for MiniPay (Opera's self-custodial stablecoin
wallet with 14M+ users). It lets users send payment commands in plain text — the
AI agent interprets the command and executes the corresponding blockchain
transaction on Celo Mainnet using cUSD.

**Core value proposition:** No more manually filling wallet addresses and amounts.
Just type what you want to do, approve, done.

**Example interactions:**
- "send 5 cUSD to 0x123...abc for lunch"
- "split 30 cUSD between 0xAAA, 0xBBB, and 0xCCC"
- "pay 0x456 every week 2 cUSD"
- "check my balance"
- "show my recent payments"

---

## 2. Target Users

- MiniPay wallet holders who find manual crypto transfers tedious
- Small communities (friend groups, freelance teams) who split bills regularly
- Anyone already familiar with chat interfaces but new to Web3

---

## 3. Tech Stack

### Frontend
- **Framework:** Next.js 14 (App Router) + TypeScript
- **Wallet:** `viem` + `wagmi` — DO NOT use ethers.js (incompatible with MiniPay)
- **Starter:** Celo Composer (`npx @celo/celo-composer@latest create`)
- **Styling:** Tailwind CSS
- **Deploy:** Vercel

### AI Layer
- **LLM:** Gaia (lightweight, Celo-recommended) or OpenAI GPT-4o-mini as fallback
- **Framework:** Eliza with evm-plugin (optional, for more autonomous behavior)
- **Intent parsing:** LLM receives user message → returns structured JSON

### Blockchain
- **Network:** Celo Mainnet (chainId: 42220) + Celo Alfajores Testnet (chainId: 44787)
- **Token:** cUSD — `0x765DE816845861e75A25fCA122bb6898B8B1282a` (Mainnet)
- **cUSD Testnet:** `0x874069Fa1Eb16D44d622F2e0Ca25eeA172369bC1` (Alfajores)
- **Dev tools:** Hardhat + TypeScript
- **Contract interaction:** viem (PublicClient + WalletClient)

---

## 4. Project Output (What Gets Built)

### 4.1 Smart Contracts (Solidity)
Three contracts deployed on Celo Mainnet:

| Contract | File | Purpose |
|----------|------|---------|
| CeloPayAgent | `contracts/CeloPayAgent.sol` | Core payment execution |
| GroupPayment | `contracts/GroupPayment.sol` | Split bill / patungan |
| PaymentScheduler | `contracts/PaymentScheduler.sol` | Recurring payments |

### 4.2 Frontend MiniApp (Next.js)
Pages and components:

| Path | Description |
|------|-------------|
| `/` | Chat interface — main entry point |
| `/history` | Payment history from onchain events |
| `/groups` | Active group payments (patungan) |
| `/schedules` | Recurring payment schedules |

### 4.3 AI Agent Module
- Intent parser: converts natural language → structured JSON action
- Action router: maps JSON action → contract function call
- Transaction builder: builds calldata from ABI + params

---

## 5. Smart Contracts — Detail

### 5.1 CeloPayAgent.sol
**Purpose:** Core contract for single and batch payments.

```solidity
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract CeloPayAgent is Ownable {
    IERC20 public cUSD;

    event PaymentExecuted(
        address indexed from,
        address indexed to,
        uint256 amount,
        string memo,
        uint256 timestamp
    );

    event BatchPaymentExecuted(
        address indexed from,
        uint256 totalAmount,
        uint256 recipientCount,
        uint256 timestamp
    );

    struct Payment {
        address recipient;
        uint256 amount;
    }

    constructor(address _cUSD) Ownable(msg.sender) {
        cUSD = IERC20(_cUSD);
    }

    /// @notice Send cUSD to a single recipient with a memo
    function sendPayment(
        address to,
        uint256 amount,
        string calldata memo
    ) external {
        require(to != address(0), "Invalid recipient");
        require(amount > 0, "Amount must be > 0");
        require(cUSD.transferFrom(msg.sender, to, amount), "Transfer failed");
        emit PaymentExecuted(msg.sender, to, amount, memo, block.timestamp);
    }

    /// @notice Send cUSD to multiple recipients in one transaction
    function batchSend(Payment[] calldata payments) external {
        require(payments.length > 0, "Empty payments");
        require(payments.length <= 20, "Max 20 recipients");
        
        uint256 total = 0;
        for (uint256 i = 0; i < payments.length; i++) {
            total += payments[i].amount;
        }
        require(
            cUSD.allowance(msg.sender, address(this)) >= total,
            "Insufficient allowance"
        );

        for (uint256 i = 0; i < payments.length; i++) {
            require(
                cUSD.transferFrom(msg.sender, payments[i].recipient, payments[i].amount),
                "Transfer failed"
            );
        }

        emit BatchPaymentExecuted(msg.sender, total, payments.length, block.timestamp);
    }
}
```

**Functions:**
- `sendPayment(to, amount, memo)` — single transfer, emits `PaymentExecuted`
- `batchSend(payments[])` — multi-transfer, emits `BatchPaymentExecuted`

---

### 5.2 GroupPayment.sol
**Purpose:** Collaborative payments (split bills, group contributions). Multiple
users contribute to a shared pool that gets sent to one recipient.

```solidity
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

contract GroupPayment {
    IERC20 public cUSD;
    uint256 public groupCount;

    enum Status { Open, Completed, Cancelled }

    struct Group {
        address initiator;
        address recipient;
        uint256 targetAmount;
        uint256 collectedAmount;
        string description;
        Status status;
        uint256 createdAt;
        uint256 deadline;
    }

    mapping(uint256 => Group) public groups;
    mapping(uint256 => mapping(address => uint256)) public contributions;
    mapping(uint256 => address[]) public contributors;

    event GroupCreated(
        uint256 indexed groupId,
        address indexed initiator,
        address recipient,
        uint256 targetAmount,
        string description
    );
    event ContributionMade(
        uint256 indexed groupId,
        address indexed contributor,
        uint256 amount
    );
    event GroupCompleted(uint256 indexed groupId, uint256 totalAmount);
    event GroupCancelled(uint256 indexed groupId);
    event RefundIssued(uint256 indexed groupId, address contributor, uint256 amount);

    constructor(address _cUSD) {
        cUSD = IERC20(_cUSD);
    }

    /// @notice Create a new group payment session
    function createGroup(
        address recipient,
        uint256 targetAmount,
        string calldata description,
        uint256 deadlineTimestamp
    ) external returns (uint256) {
        require(recipient != address(0), "Invalid recipient");
        require(targetAmount > 0, "Target must be > 0");
        require(deadlineTimestamp > block.timestamp, "Invalid deadline");

        uint256 groupId = groupCount++;
        groups[groupId] = Group({
            initiator: msg.sender,
            recipient: recipient,
            targetAmount: targetAmount,
            collectedAmount: 0,
            description: description,
            status: Status.Open,
            createdAt: block.timestamp,
            deadline: deadlineTimestamp
        });

        emit GroupCreated(groupId, msg.sender, recipient, targetAmount, description);
        return groupId;
    }

    /// @notice Contribute cUSD to an open group
    function contribute(uint256 groupId, uint256 amount) external {
        Group storage g = groups[groupId];
        require(g.status == Status.Open, "Group not open");
        require(block.timestamp < g.deadline, "Deadline passed");
        require(amount > 0, "Amount must be > 0");

        if (contributions[groupId][msg.sender] == 0) {
            contributors[groupId].push(msg.sender);
        }

        require(cUSD.transferFrom(msg.sender, address(this), amount), "Transfer failed");
        contributions[groupId][msg.sender] += amount;
        g.collectedAmount += amount;

        emit ContributionMade(groupId, msg.sender, amount);

        if (g.collectedAmount >= g.targetAmount) {
            _completeGroup(groupId);
        }
    }

    /// @notice Manually finalize if target is reached
    function finalize(uint256 groupId) external {
        Group storage g = groups[groupId];
        require(g.status == Status.Open, "Group not open");
        require(
            msg.sender == g.initiator || g.collectedAmount >= g.targetAmount,
            "Not initiator or target not reached"
        );
        _completeGroup(groupId);
    }

    /// @notice Cancel group and refund all contributors
    function cancel(uint256 groupId) external {
        Group storage g = groups[groupId];
        require(g.status == Status.Open, "Group not open");
        require(msg.sender == g.initiator, "Not initiator");

        g.status = Status.Cancelled;

        address[] memory contribs = contributors[groupId];
        for (uint256 i = 0; i < contribs.length; i++) {
            uint256 amount = contributions[groupId][contribs[i]];
            if (amount > 0) {
                contributions[groupId][contribs[i]] = 0;
                require(cUSD.transfer(contribs[i], amount), "Refund failed");
                emit RefundIssued(groupId, contribs[i], amount);
            }
        }

        emit GroupCancelled(groupId);
    }

    function _completeGroup(uint256 groupId) internal {
        Group storage g = groups[groupId];
        g.status = Status.Completed;
        require(cUSD.transfer(g.recipient, g.collectedAmount), "Transfer failed");
        emit GroupCompleted(groupId, g.collectedAmount);
    }

    function getContributors(uint256 groupId) external view returns (address[] memory) {
        return contributors[groupId];
    }
}
```

**Functions:**
- `createGroup(recipient, targetAmount, description, deadline)` → returns `groupId`
- `contribute(groupId, amount)` — each contributor calls this
- `finalize(groupId)` — initiator closes early if target reached
- `cancel(groupId)` — initiator cancels, everyone gets refunded

---

### 5.3 PaymentScheduler.sol
**Purpose:** Recurring payments. User sets a schedule, agent (or anyone) can
trigger execution when the interval has passed.

```solidity
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

contract PaymentScheduler {
    IERC20 public cUSD;
    uint256 public scheduleCount;

    struct Schedule {
        address owner;
        address recipient;
        uint256 amount;
        uint256 interval;    // seconds between payments
        uint256 nextExec;    // next valid execution timestamp
        uint256 execCount;   // how many times executed
        bool active;
        string memo;
    }

    mapping(uint256 => Schedule) public schedules;
    mapping(address => uint256[]) public userSchedules;

    event ScheduleCreated(
        uint256 indexed scheduleId,
        address indexed owner,
        address recipient,
        uint256 amount,
        uint256 interval
    );
    event ScheduleExecuted(
        uint256 indexed scheduleId,
        address indexed executor,
        uint256 execCount
    );
    event ScheduleCancelled(uint256 indexed scheduleId);

    constructor(address _cUSD) {
        cUSD = IERC20(_cUSD);
    }

    /// @notice Create a recurring payment schedule
    function createSchedule(
        address recipient,
        uint256 amount,
        uint256 intervalSeconds,
        uint256 startTimestamp,
        string calldata memo
    ) external returns (uint256) {
        require(recipient != address(0), "Invalid recipient");
        require(amount > 0, "Amount must be > 0");
        require(intervalSeconds >= 3600, "Min interval 1 hour");

        uint256 scheduleId = scheduleCount++;
        schedules[scheduleId] = Schedule({
            owner: msg.sender,
            recipient: recipient,
            amount: amount,
            interval: intervalSeconds,
            nextExec: startTimestamp > block.timestamp ? startTimestamp : block.timestamp,
            execCount: 0,
            active: true,
            memo: memo
        });

        userSchedules[msg.sender].push(scheduleId);

        emit ScheduleCreated(scheduleId, msg.sender, recipient, amount, intervalSeconds);
        return scheduleId;
    }

    /// @notice Execute a due schedule — callable by anyone (agent, keeper, user)
    function executeSchedule(uint256 scheduleId) external {
        Schedule storage s = schedules[scheduleId];
        require(s.active, "Schedule not active");
        require(block.timestamp >= s.nextExec, "Not yet due");

        s.nextExec = block.timestamp + s.interval;
        s.execCount++;

        require(
            cUSD.transferFrom(s.owner, s.recipient, s.amount),
            "Transfer failed — check allowance"
        );

        emit ScheduleExecuted(scheduleId, msg.sender, s.execCount);
    }

    /// @notice Cancel a schedule
    function cancelSchedule(uint256 scheduleId) external {
        Schedule storage s = schedules[scheduleId];
        require(s.owner == msg.sender, "Not owner");
        require(s.active, "Already inactive");

        s.active = false;
        emit ScheduleCancelled(scheduleId);
    }

    function getUserSchedules(address user) external view returns (uint256[] memory) {
        return userSchedules[user];
    }

    function isDue(uint256 scheduleId) external view returns (bool) {
        Schedule storage s = schedules[scheduleId];
        return s.active && block.timestamp >= s.nextExec;
    }
}
```

**Functions:**
- `createSchedule(recipient, amount, interval, startTimestamp, memo)` → returns `scheduleId`
- `executeSchedule(scheduleId)` — callable by anyone when due (agent polls this)
- `cancelSchedule(scheduleId)` — owner only
- `isDue(scheduleId)` — view function, agent uses this to check before executing

---

## 6. AI Intent Parser

### Input → Output Contract

The LLM receives a system prompt + user message and returns a JSON object.

**System prompt:**
You are a payment assistant. Parse the user's message and return ONLY a JSON
object with no extra text. Supported actions: sendPayment, batchSend,
createGroup, contribute, createSchedule, getBalance, getHistory.
JSON schema:
{
"action": string,
"params": {
// sendPayment
"to": "0x...",
"amount": number,        // in cUSD, NOT wei
"memo": string,
// batchSend
"payments": [{ "to": "0x...", "amount": number }],

// createGroup
"recipient": "0x...",
"targetAmount": number,
"description": string,
"deadlineHours": number,

// contribute
"groupId": number,
"amount": number,

// createSchedule
"recipient": "0x...",
"amount": number,
"intervalDays": number,
"memo": string
},
"confidence": number       // 0.0 to 1.0
}
If unclear, return: { "action": "clarify", "message": "..." }

### Amount Conversion
Always convert cUSD to wei before contract call:
```typescript
const amountWei = parseUnits(amount.toString(), 18) // viem
```

### Action → Contract Function Map

| action | contract | function |
|--------|----------|----------|
| `sendPayment` | CeloPayAgent | `sendPayment(to, amount, memo)` |
| `batchSend` | CeloPayAgent | `batchSend(payments[])` |
| `createGroup` | GroupPayment | `createGroup(recipient, target, desc, deadline)` |
| `contribute` | GroupPayment | `contribute(groupId, amount)` |
| `createSchedule` | PaymentScheduler | `createSchedule(recipient, amount, interval, start, memo)` |
| `executeSchedule` | PaymentScheduler | `executeSchedule(scheduleId)` |

---

## 7. Project File Structure
celopay-agent/
├── contracts/
│   ├── CeloPayAgent.sol
│   ├── GroupPayment.sol
│   └── PaymentScheduler.sol
├── test/
│   ├── CeloPayAgent.test.ts
│   ├── GroupPayment.test.ts
│   └── PaymentScheduler.test.ts
├── scripts/
│   ├── deploy.ts             # deploy all contracts
│   └── verify.ts             # verify on Celoscan
├── src/
│   ├── app/
│   │   ├── page.tsx          # chat interface (main)
│   │   ├── history/page.tsx
│   │   ├── groups/page.tsx
│   │   └── schedules/page.tsx
│   ├── components/
│   │   ├── ChatInterface.tsx
│   │   ├── MessageBubble.tsx
│   │   ├── TxConfirmModal.tsx
│   │   ├── PaymentCard.tsx
│   │   └── GroupCard.tsx
│   ├── lib/
│   │   ├── agent.ts          # LLM call + intent parsing
│   │   ├── contracts.ts      # viem contract instances
│   │   ├── celo.ts           # chain config, client setup
│   │   └── utils.ts          # amount formatting, address shortening
│   ├── hooks/
│   │   ├── useAgent.ts       # agent state + message handling
│   │   ├── usePayment.ts     # contract write hooks
│   │   └── useHistory.ts     # fetch onchain events
│   └── api/
│       └── agent/route.ts    # Next.js API route for LLM call
├── hardhat.config.ts
├── .env.local
└── deployments.json          # deployed contract addresses

---

## 8. Environment Variables

```bash
# .env.local

# Celo RPC
NEXT_PUBLIC_CELO_RPC=https://forno.celo.org
NEXT_PUBLIC_ALFAJORES_RPC=https://alfajores-forno.celo-testnet.org

# cUSD addresses
NEXT_PUBLIC_CUSD_MAINNET=0x765DE816845861e75A25fCA122bb6898B8B1282a
NEXT_PUBLIC_CUSD_TESTNET=0x874069Fa1Eb16D44d622F2e0Ca25eeA172369bC1

# Deployed contract addresses (fill after deploy)
NEXT_PUBLIC_CELOPAY_AGENT=
NEXT_PUBLIC_GROUP_PAYMENT=
NEXT_PUBLIC_PAYMENT_SCHEDULER=

# LLM
OPENAI_API_KEY=               # or use Gaia endpoint
GAIA_API_URL=                 # optional, if using Gaia

# Deployer (server-side only, never expose)
PRIVATE_KEY=
```

---

## 9. Build & Execution Flow

### Step 1 — Setup
```bash
npx @celo/celo-composer@latest create
cd celopay-agent
npm install
npm install viem wagmi @tanstack/react-query
npm install --save-dev hardhat @nomicfoundation/hardhat-toolbox
```

### Step 2 — Smart Contract Development
1. Write all three contracts in `/contracts`
2. Write tests in `/test` — run `npx hardhat test`
3. Deploy to Alfajores testnet: `npx hardhat run scripts/deploy.ts --network alfajores`
4. Test manually with testnet cUSD from faucet: https://faucet.celo.org
5. Deploy to Mainnet: `npx hardhat run scripts/deploy.ts --network celo`
6. Verify contracts on Celoscan
7. Save deployed addresses to `.env.local` and `deployments.json`

### Step 3 — Frontend & Agent
1. Set up viem client with Celo chain config
2. Build `agent.ts` — LLM call returns parsed JSON action
3. Build `contracts.ts` — viem contract instances for all three contracts
4. Build `ChatInterface.tsx` — message list + input box
5. Build `TxConfirmModal.tsx` — shows parsed action, user approves
6. Connect everything in `useAgent.ts` hook:
   - User types → call `/api/agent` → get JSON action
   - Show `TxConfirmModal` with action details
   - User approves → execute contract call via viem
   - Show TX hash + success/error state

### Step 4 — MiniPay Integration
1. Detect MiniPay environment: `window.ethereum.isMiniPay`
2. Request cUSD allowance before contract calls (user must approve spending)
3. Test on MiniPay mobile using ngrok or Vercel preview URL

### Step 5 — Deploy & Go Live
1. Push to GitHub (public repo — required for PoS)
2. Connect to Vercel, set env vars
3. Submit project to Proof of Ship on talent.app

---

## 10. Scoring Strategy for Proof of Ship

PoS scores on: transaction count, unique active users, fees generated, GitHub
activity, and MiniPay-specific code usage.

**Maximize TX count:**
- Every chat command that sends → 1 TX via `sendPayment`
- Group payment with 5 contributors → 5 TX via `contribute`
- Recurring payment executed daily → daily TX via `executeSchedule`
- Agent polls and auto-executes due schedules every hour

**Maximize unique users:**
- Group payment feature naturally brings multiple wallet addresses per session
- Share payment links: `celopayagent.vercel.app/group/[groupId]`
- Anyone can contribute to a group without needing to use the chat

**GitHub activity:**
- Commit every day, even small changes
- Use feature branches + PRs for cleaner contribution graph

**MiniPay booster:**
- Implement MiniPay hook: detect `window.ethereum.isMiniPay`
- Use MiniPay-specific UX (bottom sheet modals, mobile-first layout)

---

## 11. Key Constraints & Warnings

- **Never use ethers.js** — use viem or wagmi exclusively
- Contracts must be **open source** (public GitHub repo)
- Contracts must be **deployed on Celo Mainnet** to be eligible
- User must always **approve cUSD spending** before any contract call
  (`cUSD.approve(contractAddress, amount)`)
- Always test with **Alfajores testnet** before mainnet
- Reward cap for this project: **2,000 USDT** across Season 2

---

## 12. Milestones

| Week | Dates | Goal | Done? |
|------|-------|------|-------|
| W1 | Jun 1–7 | Contracts done, tests passing, deployed to Alfajores | [ ] |
| W2 | Jun 8–14 | Frontend chat UI, agent parser, connected to testnet | [ ] |
| W3 | Jun 15–21 | Mainnet deploy, MiniPay tested, 5+ real users | [ ] |
| Deadline | Jun 22 | GitHub active, TX count growing, registered on PoS | [ ] |
