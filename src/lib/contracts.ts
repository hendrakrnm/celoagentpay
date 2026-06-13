import { parseEther } from "viem";
import { CONTRACT_ADDRESSES } from "./celo";
import { getToken } from "./tokens";

export const CELO_PAY_AGENT_ABI = [
  {
    name: "sendPayment",
    type: "function",
    stateMutability: "nonpayable",
    inputs: [
      { name: "to", type: "address" },
      { name: "amount", type: "uint256" },
      { name: "memo", type: "string" },
    ],
    outputs: [],
  },
  {
    name: "batchSend",
    type: "function",
    stateMutability: "nonpayable",
    inputs: [
      {
        name: "payments",
        type: "tuple[]",
        components: [
          { name: "recipient", type: "address" },
          { name: "amount", type: "uint256" },
        ],
      },
    ],
    outputs: [],
  },
] as const;

export const GROUP_PAYMENT_ABI = [
  {
    name: "createGroup",
    type: "function",
    stateMutability: "nonpayable",
    inputs: [
      { name: "recipient", type: "address" },
      { name: "targetAmount", type: "uint256" },
      { name: "description", type: "string" },
      { name: "deadlineTimestamp", type: "uint256" },
    ],
    outputs: [{ name: "", type: "uint256" }],
  },
  {
    name: "contribute",
    type: "function",
    stateMutability: "nonpayable",
    inputs: [
      { name: "groupId", type: "uint256" },
      { name: "amount", type: "uint256" },
    ],
    outputs: [],
  },
] as const;

export const PAYMENT_SCHEDULER_ABI = [
  {
    name: "createSchedule",
    type: "function",
    stateMutability: "nonpayable",
    inputs: [
      { name: "recipient", type: "address" },
      { name: "amount", type: "uint256" },
      { name: "intervalSeconds", type: "uint256" },
      { name: "startTimestamp", type: "uint256" },
      { name: "memo", type: "string" },
    ],
    outputs: [{ name: "", type: "uint256" }],
  },
] as const;

export const ERC20_ABI = [
  {
    name: "transfer",
    type: "function",
    stateMutability: "nonpayable",
    inputs: [
      { name: "to", type: "address" },
      { name: "amount", type: "uint256" },
    ],
    outputs: [{ name: "", type: "bool" }],
  },
  {
    name: "approve",
    type: "function",
    stateMutability: "nonpayable",
    inputs: [
      { name: "spender", type: "address" },
      { name: "amount", type: "uint256" },
    ],
    outputs: [{ name: "", type: "bool" }],
  },
] as const;

export const EXPLORER_BASE = "https://celo-sepolia.blockscout.com";

type WriteContractFn = (params: {
  address: `0x${string}`;
  abi: readonly object[];
  functionName: string;
  args: unknown[];
}) => Promise<`0x${string}`>;

type SendTransactionFn = (params: {
  to: `0x${string}`;
  value: bigint;
}) => Promise<`0x${string}`>;

export interface ExecuteOptions {
  writeContractAsync: WriteContractFn;
  sendTransactionAsync: SendTransactionFn;
}

// Returns tx hash of the final (main) call
export async function executeAction(
  action: import("./agent").AgentAction,
  opts: ExecuteOptions
): Promise<`0x${string}`> {
  const { writeContractAsync, sendTransactionAsync } = opts;

  if (action.action === "sendPayment") {
    const token = getToken(action.params.token ?? "cUSD");
    const amountWei = parseEther(String(action.params.amount));
    const to = action.params.to as `0x${string}`;

    if (token.isNative) {
      // CELO native transfer — no approve, just send value
      return sendTransactionAsync({ to, value: amountWei });
    }

    // ERC20: direct transfer() — no approve needed (user calls from their wallet)
    return writeContractAsync({
      address: token.address!,
      abi: ERC20_ABI,
      functionName: "transfer",
      args: [to, amountWei],
    });
  }

  if (action.action === "batchSend") {
    const token = getToken(action.params.token ?? "cUSD");
    const agent = CONTRACT_ADDRESSES.celoPayAgent;

    if (token.isNative) {
      // For CELO batch, send sequentially (simple approach)
      let lastHash: `0x${string}` = "0x" as `0x${string}`;
      for (const p of action.params.payments) {
        lastHash = await sendTransactionAsync({
          to: p.to as `0x${string}`,
          value: parseEther(String(p.amount)),
        });
      }
      return lastHash;
    }

    if (agent) {
      // ERC20 batch via CeloPayAgent (approve + batchSend)
      const total = action.params.payments.reduce((s, p) => s + p.amount, 0);
      await writeContractAsync({
        address: token.address!,
        abi: ERC20_ABI,
        functionName: "approve",
        args: [agent, parseEther(String(total))],
      });
      const payments = action.params.payments.map((p) => ({
        recipient: p.to as `0x${string}`,
        amount: parseEther(String(p.amount)),
      }));
      return writeContractAsync({
        address: agent,
        abi: CELO_PAY_AGENT_ABI,
        functionName: "batchSend",
        args: [payments],
      });
    }

    // Fallback: sequential direct transfers
    let lastHash: `0x${string}` = "0x" as `0x${string}`;
    for (const p of action.params.payments) {
      lastHash = await writeContractAsync({
        address: token.address!,
        abi: ERC20_ABI,
        functionName: "transfer",
        args: [p.to as `0x${string}`, parseEther(String(p.amount))],
      });
    }
    return lastHash;
  }

  if (action.action === "createGroup") {
    const group = CONTRACT_ADDRESSES.groupPayment;
    if (!group) throw new Error("GroupPayment address not configured");
    const token = getToken(action.params.token ?? "cUSD");
    const targetWei = parseEther(String(action.params.targetAmount));
    const deadline = BigInt(
      Math.floor(Date.now() / 1000) + action.params.deadlineHours * 3600
    );
    // GroupPayment contract is cUSD-only; warn if different token selected
    if (!token.isNative && token.address !== null) {
      // Still use the contract — it uses transferFrom on whatever token the initiator chose
    }
    return writeContractAsync({
      address: group,
      abi: GROUP_PAYMENT_ABI,
      functionName: "createGroup",
      args: [
        action.params.recipient as `0x${string}`,
        targetWei,
        action.params.description,
        deadline,
      ],
    });
  }

  if (action.action === "contribute") {
    const group = CONTRACT_ADDRESSES.groupPayment;
    if (!group) throw new Error("GroupPayment address not configured");
    const token = getToken(action.params.token ?? "cUSD");
    const amountWei = parseEther(String(action.params.amount));

    if (!token.isNative) {
      await writeContractAsync({
        address: token.address!,
        abi: ERC20_ABI,
        functionName: "approve",
        args: [group, amountWei],
      });
    }

    return writeContractAsync({
      address: group,
      abi: GROUP_PAYMENT_ABI,
      functionName: "contribute",
      args: [BigInt(action.params.groupId), amountWei],
    });
  }

  if (action.action === "createSchedule") {
    const scheduler = CONTRACT_ADDRESSES.paymentScheduler;
    if (!scheduler) throw new Error("PaymentScheduler address not configured");
    const token = getToken(action.params.token ?? "cUSD");
    const amountWei = parseEther(String(action.params.amount));
    const intervalSec = BigInt(action.params.intervalDays * 86400);
    const startNow = BigInt(Math.floor(Date.now() / 1000));

    if (!token.isNative) {
      // Approve 1 year worth of payments
      await writeContractAsync({
        address: token.address!,
        abi: ERC20_ABI,
        functionName: "approve",
        args: [scheduler, amountWei * BigInt(365)],
      });
    }

    return writeContractAsync({
      address: scheduler,
      abi: PAYMENT_SCHEDULER_ABI,
      functionName: "createSchedule",
      args: [
        action.params.recipient as `0x${string}`,
        amountWei,
        intervalSec,
        startNow,
        action.params.memo,
      ],
    });
  }

  throw new Error(`Action "${action.action}" does not require a transaction`);
}
