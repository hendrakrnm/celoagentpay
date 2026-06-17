"use client";

import {
  useAccount,
  useConnect,
  useDisconnect,
  usePublicClient,
  useWalletClient,
  useSwitchChain,
} from "wagmi";
import { wagmiConfig } from "./wagmi";

const TARGET_CHAIN_ID = Number(process.env.NEXT_PUBLIC_CHAIN_ID ?? 11142220);

// Detect MiniPay: injected as window.ethereum with isMiniPay flag
function detectMiniPay(): boolean {
  if (typeof window === "undefined") return false;
  return !!(window as Window & { ethereum?: { isMiniPay?: boolean } }).ethereum
    ?.isMiniPay;
}

export function useWallet() {
  const { address, isConnected, chainId, status } = useAccount();
  const { connect, connectors, isPending: isConnecting } = useConnect();
  const { disconnect } = useDisconnect();
  const { switchChain, isPending: isSwitching } = useSwitchChain();
  const publicClient = usePublicClient();
  const { data: walletClient } = useWalletClient();

  const isCorrectChain = chainId === TARGET_CHAIN_ID;
  const isMiniPay = detectMiniPay();

  // Auto-connect MiniPay on load (MiniPay auto-injects, just needs connect)
  const connectWallet = () => {
    const injected = connectors.find((c) => c.id === "injected");
    if (injected) {
      if (typeof window !== "undefined" && !(window as any).ethereum) {
        alert(
          "No Web3 wallet detected. If you are on desktop, please install MetaMask or another wallet extension. If you are on mobile, please open this app inside Opera Mini (MiniPay) or a Celo-compatible wallet browser."
        );
        return;
      }
      connect(
        { connector: injected },
        {
          onError(err) {
            console.error("Connection error:", err);
            alert(`Failed to connect: ${err.message}`);
          },
        }
      );
    } else {
      alert("Injected wallet connector not found.");
    }
  };

  const switchToCorrectChain = () => {
    const chain = wagmiConfig.chains.find((c) => c.id === TARGET_CHAIN_ID);
    if (chain) switchChain({ chainId: TARGET_CHAIN_ID });
  };

  return {
    // State
    address,
    isConnected,
    chainId,
    isCorrectChain,
    isMiniPay,
    isConnecting,
    isSwitching,
    isReady: isConnected && isCorrectChain,

    // Clients (viem)
    publicClient,
    walletClient,

    // Actions
    connect: connectWallet,
    disconnect,
    switchToCorrectChain,

    // Derived
    shortAddress: address
      ? `${address.slice(0, 6)}...${address.slice(-4)}`
      : null,
    status,
  };
}
