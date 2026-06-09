"use client";

import { PageHeader } from "@/components/layout/PageHeader";
import { ChatThread } from "@/components/chat";

// Mock user data - will be replaced with wagmi/viem integration
const mockBalance = 24.5;
const mockAddress = "0x742d35Cc6634C0532925a3b844Bc9e7595f3f8a";

export default function ChatPage() {
  return (
    <>
      <PageHeader title="AgentPay" />
      <ChatThread balance={mockBalance} address={mockAddress} />
    </>
  );
}
