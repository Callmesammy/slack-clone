import { ChatWindow } from "@/components/chat/chat-window";

export default async function ChannelPage({
  params,
}: {
  params: Promise<{ workspaceId: string; channelId: string }>;
}) {
  const { channelId } = await params;

  return <ChatWindow chatId={channelId} type="channel" />;
}
