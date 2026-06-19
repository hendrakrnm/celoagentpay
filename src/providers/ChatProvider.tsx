"use client";

import { createContext, useContext, useState, ReactNode } from "react";
import { type AgentAction } from "@/lib/agent";

export interface Message {
  id: string;
  type: "user" | "agent" | "agent-loading" | "confirmation" | "success" | "receive";
  content?: string;
  timestamp?: Date;
  action?: AgentAction;
  txHash?: string;
  explorerUrl?: string;
}

interface ChatContextType {
  messages: Message[];
  setMessages: React.Dispatch<React.SetStateAction<Message[]>>;
  isLoading: boolean;
  setIsLoading: (loading: boolean) => void;
}

const ChatContext = createContext<ChatContextType | undefined>(undefined);

export function ChatProvider({ children }: { children: ReactNode }) {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "welcome",
      type: "agent",
      content: "Hi! I'm your CeloPay Agent. Connect your wallet and tell me what you'd like to do.\n\nTry: \"send 5 cUSD to 0x123... for lunch\" or \"check my balance\"",
      timestamp: new Date(),
    },
  ]);
  const [isLoading, setIsLoading] = useState(false);

  return (
    <ChatContext.Provider value={{ messages, setMessages, isLoading, setIsLoading }}>
      {children}
    </ChatContext.Provider>
  );
}

export function useChat() {
  const context = useContext(ChatContext);
  if (!context) {
    throw new Error("useChat must be used within a ChatProvider");
  }
  return context;
}
