import type { Metadata } from "next";
import { ChatWindow } from "@/components/chat/ChatWindow";

export const metadata: Metadata = {
  title: "Chat",
  description:
    "Talk through your World Cup 2026 predictions with the ShadowPundit companion.",
};

export default function ChatPage() {
  return (
    <main className="app-surface">
      <ChatWindow />
    </main>
  );
}
