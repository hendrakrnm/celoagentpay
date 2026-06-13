import { parseEther } from "viem";
import { CONTRACT_ADDRESSES, CUSD_ADDRESS } from "./celo";

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

export const CUSD_APPROVE_ABI = [
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

// Returns the tx hash of the final (main) contract call
export async function executeAction(
  action: import("./agent").AgentAction,
  writeContractAsync: WriteContractFn
): Promise<`0x${string}`> {
  const cusd = CUSD_ADDRESS;
  const agent = CONTRACT_ADDRESSES.celoPayAgent;
  const group = CONTRACT_ADDRESSES.groupPayment;
  const scheduler = CONTRACT_ADDRESSES.paymentScheduler;

  if (!cusd) throw new Error("cUSD address not configured");

  if (action.action === "sendPayment") {
    if (!agent) throw new Error("CeloPayAgent address not configured");
    const amountWei = parseEther(String(action.params.amount));

    await writeContractAsync({
      address: cusd,
      abi: CUSD_APPROVE_ABI,
      functionName: "approve",
      args: [agent, amountWei],
    });

    return writeContractAsync({
      address: agent,
      abi: CELO_PAY_AGENT_ABI,
      functionName: "sendPayment",
      args: [action.params.to as `0x${string}`, amountWei, action.params.memo],
    });
  }

  if (action.action === "batchSend") {
    if (!agent) throw new Error("CeloPayAgent address not configured");
    const total = action.params.payments.reduce((s, p) => s + p.amount, 0);
    const totalWei = parseEther(String(total));

    await writeContractAsync({
      address: cusd,
      abi: CUSD_APPROVE_ABI,
      functionName: "approve",
      args: [agent, totalWei],
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

  if (action.action === "createGroup") {
    if (!group) throw new Error("GroupPayment address not configured");
    const targetWei = parseEther(String(action.params.targetAmount));
    const deadline = BigInt(Math.floor(Date.now() / 1000) + action.params.deadlineHours * 3600);

    return writeContractAsync({
      address: group,
      abi: GROUP_PAYMENT_ABI,
      functionName: "createGroup",
      args: [action.params.recipient as `0x${string}`, targetWei, action.params.description, deadline],
    });
  }

  if (action.action === "contribute") {
    if (!group) throw new Error("GroupPayment address not configured");
    const amountWei = parseEther(String(action.params.amount));

    await writeContractAsync({
      address: cusd,
      abi: CUSD_APPROVE_ABI,
      functionName: "approve",
      args: [group, amountWei],
    });

    return writeContractAsync({
      address: group,
      abi: GROUP_PAYMENT_ABI,
      functionName: "contribute",
      args: [BigInt(action.params.groupId), amountWei],
    });
  }

  if (action.action === "createSchedule") {
    if (!scheduler) throw new Error("PaymentScheduler address not configured");
    const amountWei = parseEther(String(action.params.amount));
    const intervalSec = BigInt(action.params.intervalDays * 86400);
    const startNow = BigInt(Math.floor(Date.now() / 1000));

    // Approve a large allowance for recurring payments (1 year worth)
    const maxAllowance = amountWei * BigInt(365);

    await writeContractAsync({
      address: cusd,
      abi: CUSD_APPROVE_ABI,
      functionName: "approve",
      args: [scheduler, maxAllowance],
    });

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
