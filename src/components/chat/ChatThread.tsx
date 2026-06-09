"use client";

import { useRef, useEffect, useState } from "react";
import { BalanceCard } from "./BalanceCard";
import { MessageBubble } from "./MessageBubble";
import { QuickChips } from "./QuickChips";
import { CommandInput } from "./CommandInput";
import { TxConfirmCard } from "./TxConfirmCard";
import { TxSuccessCard } from "./TxSuccessCard";

interface Message {
  id: string;
  type: "user" | "agent" | "agent-loading" | "confirmation" | "success";
  content?: string;
  timestamp?: Date;
  action?: string;
  details?: Record<string, string | number | undefined>;
  txHash?: string;
  explorerUrl?: string;
}

interface ChatThreadProps {
  balance: number;
  address: string;
}

export function ChatThread({ balance, address }: ChatThreadProps) {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      type: "agent",
      content: "Hi! I'm your CeloPay Agent. I can help you send payments, split bills, and manage recurring transfers. What would you like to do?",
      timestamp: new Date(),
    },
  ]);

  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async (message: string) => {
    // Add user message
    const userMessage: Message = {
      id: Date.now().toString(),
      type: "user",
      content: message,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setIsLoading(true);

    // Simulate agent processing
    setTimeout(() => {
      // Add loading state
      const loadingMessage: Message = {
        id: Date.now().toString() + "-loading",
        type: "agent-loading",
        content: "",
      };

      setMessages((prev) => [...prev, loadingMessage]);

      // Simulate response after 1.5s
      setTimeout(() => {
        setMessages((prev) => prev.filter((m) => m.id !== loadingMessage.id));

        // Simulate different responses based on keywords
        if (message.toLowerCase().includes("send")) {
          // Show confirmation card
          const confirmMessage: Message = {
            id: Date.now().toString(),
            type: "confirmation",
            action: "Send Payment",
            details: {
              to: "0x742d35Cc6634C0532925a3b844Bc9e7595f3f8a",
              amount: 5,
              fee: "~0.001",
              memo: "lunch money",
            },
          };
          setMessages((prev) => [...prev, confirmMessage]);
        } else if (message.toLowerCase().includes("balance")) {
          // Show balance info
          const agentMessage: Message = {
            id: Date.now().toString(),
            type: "agent",
            content: `You have ${balance.toFixed(2)} cUSD available. This is your current balance on Celo Mainnet.`,
            timestamp: new Date(),
          };
          setMessages((prev) => [...prev, agentMessage]);
        } else {
          // Generic response
          const agentMessage: Message = {
            id: Date.now().toString(),
            type: "agent",
            content: "I can help with that! Please be more specific about what you'd like to do (e.g., 'send 5 cUSD to...' or 'split 30 between...').",
            timestamp: new Date(),
          };
          setMessages((prev) => [...prev, agentMessage]);
        }

        setIsLoading(false);
      }, 1500);
    }, 500);
  };

  const handleConfirm = (details: Record<string, string | number | undefined>) => {
    // Replace confirmation card with success card
    setMessages((prev) =>
      prev.map((m) =>
        m.type === "confirmation"
          ? {
              ...m,
              type: "success",
              action: "Sent successfully",
              txHash: "0x8f3a...2c91",
              explorerUrl: "https://celoscan.io/tx/0x8f3a...2c91",
            }
          : m
      )
    );
  };

  return (
    <div className="flex flex-col flex-1 bg-[var(--color-bg)]">
      <BalanceCard balance={balance} address={address} />

      {/* Message Thread */}
      <div className="flex-1 overflow-y-auto pb-6 pt-2">
        {messages.map((message) => {
          switch (message.type) {
            case "confirmation":
              return (
                <TxConfirmCard
                  key={message.id}
                  action={message.action || "Confirm"}
                  details={message.details || {}}
                  onCancel={() => {
                    setMessages((prev) =>
                      prev.filter((m) => m.id !== message.id)
                    );
                  }}
                  onApprove={() => handleConfirm(message.details || {})}
                />
              );

            case "success":
              return (
                <TxSuccessCard
                  key={message.id}
                  title={message.action || "Success"}
                  details={`${message.details?.amount || ""} cUSD to ${String(message.details?.to || "").slice(0, 6)}...`}
                  txHash={message.txHash}
                  explorerUrl={message.explorerUrl}
                />
              );

            case "agent-loading":
              return (
                <MessageBubble
                  key={message.id}
                  type="agent-loading"
                  content=""
                />
              );

            default:
              return (
                <MessageBubble
                  key={message.id}
                  type={message.type as "user" | "agent"}
                  content={message.content || ""}
                  timestamp={message.timestamp}
                />
              );
          }
        })}
        <div ref={messagesEndRef} />
      </div>

      {/* Quick Action Chips */}
      <QuickChips onSelect={handleSendMessage} />

      {/* Command Input */}
      <CommandInput onSubmit={handleSendMessage} isLoading={isLoading} />
    </div>
  );
}
