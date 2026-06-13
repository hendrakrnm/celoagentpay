"use client";

import { PageHeader } from "@/components/layout/PageHeader";
import { ChatThread } from "@/components/chat";

export default function ChatPage() {
  return (
    <div className="flex flex-col flex-1 min-h-0">
      <PageHeader title="AgentPay" />
      <ChatThread />
    </div>
  );
}
