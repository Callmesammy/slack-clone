import { ChatWindow } from "@/components/chat/chat-window";

export default async function DmPage({
  params,
}: {
  params: Promise<{ workspaceId: string; conversationId: string }>;
}) {
  const { conversationId } = await params;

  return <ChatWindow chatId={conversationId} type="dm" />;
}
