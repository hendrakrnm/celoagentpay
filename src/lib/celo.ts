import { celo, celoSepolia } from "wagmi/chains";

export const IS_TESTNET = process.env.NEXT_PUBLIC_NETWORK !== "mainnet";

export const activeChain = IS_TESTNET ? celoSepolia : celo;

export const CUSD_ADDRESS = (
  IS_TESTNET
    ? process.env.NEXT_PUBLIC_CUSD_TESTNET
    : process.env.NEXT_PUBLIC_CUSD_MAINNET
) as `0x${string}`;

export const CONTRACT_ADDRESSES = {
  celoPayAgent: process.env.NEXT_PUBLIC_CELOPAY_AGENT as `0x${string}` | undefined,
  groupPayment: process.env.NEXT_PUBLIC_GROUP_PAYMENT as `0x${string}` | undefined,
  paymentScheduler: process.env.NEXT_PUBLIC_PAYMENT_SCHEDULER as `0x${string}` | undefined,
};

export const CUSD_ABI = [
  {
    name: "balanceOf",
    type: "function",
    stateMutability: "view",
    inputs: [{ name: "account", type: "address" }],
    outputs: [{ name: "", type: "uint256" }],
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
  {
    name: "allowance",
    type: "function",
    stateMutability: "view",
    inputs: [
      { name: "owner", type: "address" },
      { name: "spender", type: "address" },
    ],
    outputs: [{ name: "", type: "uint256" }],
  },
] as const;

export function shortAddress(addr: string): string {
  return `${addr.slice(0, 6)}...${addr.slice(-4)}`;
}

export function formatCUSD(wei: bigint): string {
  return (Number(wei) / 1e18).toFixed(2);
}
