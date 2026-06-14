"use client";

import { useRef, useEffect, useState } from "react";
import { useWriteContract, useSendTransaction } from "wagmi";
import { useWallet } from "@/lib/wallet";
import { BalanceCard } from "./BalanceCard";
import { MessageBubble } from "./MessageBubble";
import { QuickChips } from "./QuickChips";
import { CommandInput } from "./CommandInput";
import { TxConfirmCard } from "./TxConfirmCard";
import { TxSuccessCard } from "./TxSuccessCard";
import { parseIntent, type AgentAction } from "@/lib/agent";
import { executeAction, EXPLORER_BASE, type ExecuteOptions } from "@/lib/contracts";

interface Message {
  id: string;
  type: "user" | "agent" | "agent-loading" | "confirmation" | "success";
  content?: string;
  timestamp?: Date;
  action?: AgentAction;
  txHash?: string;
  explorerUrl?: string;
}

function buildConfirmDetails(action: AgentAction): Record<string, string | number | undefined> {
  if (action.action === "sendPayment") {
    const token = action.params.token ?? "cUSD";
    return {
      To: action.params.to,
      Amount: `${action.params.amount} ${token}`,
      Memo: action.params.memo,
      Token: token,
    };
  }
  if (action.action === "batchSend") {
    const token = action.params.token ?? "cUSD";
    const recipients = action.params.payments
      .map((p) => `${p.to.slice(0, 6)}…${p.to.slice(-4)}: ${p.amount} ${token}`)
      .join(", ");
    return { Recipients: recipients, Token: token };
  }
  if (action.action === "createGroup") {
    const token = action.params.token ?? "cUSD";
    return {
      Recipient: action.params.recipient,
      Target: `${action.params.targetAmount} ${token}`,
      Description: action.params.description,
      Deadline: `${action.params.deadlineHours}h`,
    };
  }
  if (action.action === "contribute") {
    const token = action.params.token ?? "cUSD";
    return { "Group ID": action.params.groupId, Amount: `${action.params.amount} ${token}` };
  }
  if (action.action === "createSchedule") {
    const token = action.params.token ?? "cUSD";
    return {
      To: action.params.recipient,
      Amount: `${action.params.amount} ${token}`,
      Interval: `Every ${action.params.intervalDays} day(s)`,
      Memo: action.params.memo,
    };
  }
  return {};
}

function actionLabel(action: AgentAction): string {
  const labels: Record<string, string> = {
    sendPayment: "Send Payment",
    batchSend: "Split Payment",
    createGroup: "Create Group",
    contribute: "Contribute to Group",
    createSchedule: "Schedule Payment",
    getBalance: "Check Balance",
    getHistory: "Payment History",
  };
  return labels[action.action] ?? action.action;
}

export function ChatThread() {
  const { address, isConnected, isReady, publicClient, switchToCorrectChain } = useWallet();
  const { writeContractAsync } = useWriteContract();
  const { sendTransactionAsync } = useSendTransaction();

  const [messages, setMessages] = useState<Message[]>([
    {
      id: "welcome",
      type: "agent",
      content: "Hi! I'm your CeloPay Agent. Connect your wallet and tell me what you'd like to do.\n\nTry: \"send 5 cUSD to 0x123... for lunch\" or \"check my balance\"",
      timestamp: new Date(),
    },
  ]);

  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const addMessage = (msg: Omit<Message, "id">) => {
    setMessages((prev) => [...prev, { id: Date.now().toString() + Math.random(), ...msg }]);
  };

  const handleSendMessage = async (text: string) => {
    if (!isConnected) {
      addMessage({ type: "agent", content: "Please connect your wallet first.", timestamp: new Date() });
      return;
    }
    if (!isReady) {
      addMessage({ type: "agent", content: "You're on the wrong network. Please switch to Celo.", timestamp: new Date() });
      switchToCorrectChain();
      return;
    }

    addMessage({ type: "user", content: text, timestamp: new Date() });
    setIsLoading(true);

    const loadingId = Date.now().toString() + "-loading";
    setMessages((prev) => [...prev, { id: loadingId, type: "agent-loading", content: "" }]);

    try {
      const result = await parseIntent(text);

      setMessages((prev) => prev.filter((m) => m.id !== loadingId));

      if (result.action === "clarify") {
        addMessage({ type: "agent", content: (result as { action: "clarify"; message: string }).message, timestamp: new Date() });

      } else if (result.action === "getBalance") {
        addMessage({
          type: "agent",
          content: `Your balance is shown at the top of the screen. The cUSD address is:\n${address}`,
          timestamp: new Date(),
        });

      } else if (result.action === "getHistory") {
        addMessage({
          type: "agent",
          content: "Transaction history is available in the History tab below.",
          timestamp: new Date(),
        });

      } else {
        // Show confirmation card for all write actions
        addMessage({ type: "confirmation", action: result });
      }
    } catch (err) {
      setMessages((prev) => prev.filter((m) => m.id !== loadingId));
      addMessage({
        type: "agent",
        content: "Something went wrong. Please try again.",
        timestamp: new Date(),
      });
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleApprove = async (messageId: string, action: AgentAction) => {
    // Mark as pending immediately so user sees feedback
    setMessages((prev) =>
      prev.map((m) =>
        m.id === messageId ? { ...m, type: "success" as const, txHash: "pending" } : m
      )
    );

    try {
      addMessage({
        type: "agent",
        content: "Approving cUSD spend... (check your wallet)",
        timestamp: new Date(),
      });

      const executeOptions: ExecuteOptions = {
        writeContractAsync: writeContractAsync as unknown as ExecuteOptions["writeContractAsync"],
        sendTransactionAsync: sendTransactionAsync as unknown as ExecuteOptions["sendTransactionAsync"],
      };

      const hash = await executeAction(action, executeOptions);

      addMessage({
        type: "agent",
        content: "Transaction submitted! Waiting for confirmation...",
        timestamp: new Date(),
      });

      // Wait for the tx to be mined
      if (publicClient) {
        await publicClient.waitForTransactionReceipt({ hash });
      }

      const explorerUrl = `${EXPLORER_BASE}/tx/${hash}`;

      setMessages((prev) =>
        prev.map((m) =>
          m.id === messageId ? { ...m, txHash: hash, explorerUrl } : m
        )
      );

      addMessage({
        type: "agent",
        content: `Transaction confirmed! View on explorer:\n${explorerUrl}`,
        timestamp: new Date(),
      });
    } catch (err: unknown) {
      // Revert card back to confirmation state on error
      setMessages((prev) =>
        prev.map((m) =>
          m.id === messageId ? { ...m, type: "confirmation" as const, txHash: undefined } : m
        )
      );

      const msg = err instanceof Error ? err.message : "Transaction failed";
      const isRejected = msg.toLowerCase().includes("rejected") || msg.toLowerCase().includes("denied");

      addMessage({
        type: "agent",
        content: isRejected
          ? "Transaction cancelled. Try again when ready."
          : `Transaction failed: ${msg}`,
        timestamp: new Date(),
      });
    }
  };

  return (
    <div className="page">
      <BalanceCard />
      <QuickChips onSelect={handleSendMessage} />

      <div className="page-scroll">
        <div className="chat-thread">
        {messages.map((message) => {
          if (message.type === "confirmation" && message.action) {
            const action = message.action;
            if (action.action === "clarify" || action.action === "getBalance" || action.action === "getHistory") {
              return null;
            }
            return (
              <TxConfirmCard
                key={message.id}
                action={actionLabel(action)}
                details={buildConfirmDetails(action)}
                onCancel={() =>
                  setMessages((prev) => prev.filter((m) => m.id !== message.id))
                }
                onApprove={() => handleApprove(message.id, action)}
              />
            );
          }

          if (message.type === "success") {
            return (
              <TxSuccessCard
                key={message.id}
                title="Transaction Submitted"
                details="Waiting for confirmation on Celo"
                txHash={message.txHash}
                explorerUrl={message.explorerUrl}
              />
            );
          }

          if (message.type === "agent-loading" || message.type === "user" || message.type === "agent") {
            return (
              <MessageBubble
                key={message.id}
                type={message.type as "user" | "agent" | "agent-loading"}
                content={message.content || ""}
                timestamp={message.timestamp}
              />
            );
          }

          return null;
        })}
          <div ref={messagesEndRef} />
        </div>
      </div>

      <CommandInput onSubmit={handleSendMessage} isLoading={isLoading} />
    </div>
  );
}
