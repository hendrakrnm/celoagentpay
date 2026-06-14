"use client";

import { PageHeader } from "@/components/layout/PageHeader";
import { ChatThread } from "@/components/chat";

export default function ChatPage() {
  return (
    <div className="flex min-h-0 flex-1 flex-col">
      <PageHeader title="CeloPay" />
      <ChatThread />
    </div>
  );
}
