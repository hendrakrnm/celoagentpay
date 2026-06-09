# CeloPay Agent Smart Contracts

Production-ready smart contracts for AI-powered payments on Celo blockchain.

## Structure

```
contracts/
├── src/                          # Smart contract source
│   ├── CeloPayAgent.sol         # Single & batch payments
│   ├── GroupPayment.sol         # Collaborative split bills
│   └── PaymentScheduler.sol     # Recurring payments
├── test/                         # Test suite (44 tests)
│   ├── CeloPayAgent.t.sol
│   ├── GroupPayment.t.sol
│   ├── PaymentScheduler.t.sol
│   └── mocks/
│       └── ERC20Mock.sol
├── script/
│   └── Deploy.s.sol             # Deployment script
├── lib/                          # Dependencies
│   ├── forge-std/
│   └── openzeppelin-contracts/
├── foundry.toml                 # Foundry configuration
├── remappings.txt               # Import remappings
├── .env.example                 # Environment template
└── README.md                     # This file
```

## Setup

### 1. Install Dependencies

```bash
cd contracts

# Install Foundry (if not already installed)
curl -L https://foundry.paradigm.xyz | bash
foundryup
```

### 2. Configure Environment

```bash
# Copy environment template
cp .env.example .env

# Edit .env and add:
# PRIVATE_KEY=0x...
# CELOSCAN_API_KEY=...
```

## Usage

### Build

```bash
forge build
```

### Test

```bash
# Run all tests
forge test

# Run with verbosity
forge test -vvv

# Run specific contract tests
forge test --match-contract CeloPayAgentTest

# Generate gas report
forge test --gas-report
```

### Deploy

#### Alfajores Testnet

```bash
source .env

forge script script/Deploy.s.sol \
  --rpc-url https://alfajores-forno.celo-testnet.org \
  --broadcast \
  --private-key $PRIVATE_KEY
```

#### Celo Mainnet

```bash
source .env

forge script script/Deploy.s.sol \
  --rpc-url https://forno.celo.org \
  --broadcast \
  --verify \
  --etherscan-api-key $CELOSCAN_API_KEY \
  --private-key $PRIVATE_KEY
```

## Contracts

### CeloPayAgent
- Single payment: `sendPayment(to, amount, memo)`
- Batch payment: `batchSend(payments[])`
- Get balance: `getBalance(account)`

### GroupPayment
- Create group: `createGroup(recipient, target, description, deadline)`
- Contribute: `contribute(groupId, amount)`
- Finalize: `finalize(groupId)`
- Cancel: `cancel(groupId)`

### PaymentScheduler
- Create schedule: `createSchedule(recipient, amount, interval, startTime, memo)`
- Execute: `executeSchedule(scheduleId)`
- Cancel: `cancelSchedule(scheduleId)`
- Check if due: `isDue(scheduleId)`

## Testing

All contracts have comprehensive test coverage:

- **CeloPayAgent**: 13 tests
- **GroupPayment**: 15 tests
- **PaymentScheduler**: 16 tests
- **Total**: 44 tests (100% passing)

## Networks

| Network | Chain ID | RPC |
|---------|----------|-----|
| Alfajores Testnet | 44787 | https://alfajores-forno.celo-testnet.org |
| Celo Mainnet | 42220 | https://forno.celo.org |

## Documentation

See `../plan/` for complete documentation:
- `SMART_CONTRACTS.md` — Technical reference
- `BUILD_SUMMARY.md` — What was built
- `EXECUTION_COMPLETE.md` — Completion status

See `../DEPLOYMENT_GUIDE.md` for deployment instructions.

## Security

- ✅ Input validation
- ✅ Access control
- ✅ Event logging
- ✅ Reentrancy protection
- ✅ Overflow/underflow protection (Solidity 0.8.28)

## Gas Optimization

Contracts are optimized for gas efficiency:
- Single payment: ~48k gas
- Batch payment: ~65k per recipient
- Create group: ~182k gas
- Execute schedule: ~40k gas

---

For more information, see the documentation folder.
