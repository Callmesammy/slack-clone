"use client";

import { useSession } from "next-auth/react";
import { Hash, Lock, Users, Sparkles, MessageSquare, AtSign, Pin } from "lucide-react";
import { useMessageStore } from "@/hooks/use-message-store";
import { useWorkspaceStore } from "@/hooks/use-workspace-store";
import { useLayoutStore } from "@/hooks/use-layout-store";
import { MessageList } from "./message-list";
import { MessageInput } from "./message-input";
import { DragDropZone } from "./drag-drop-zone";
import { ThreadPanel } from "./thread-panel";
import { PinnedPanel } from "./pinned-panel";
import { DetailsPanel } from "./details-panel";
import { AnimatePresence } from "motion/react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

interface ChatWindowProps {
  chatId: string;
  type: "channel" | "dm";
}

export function ChatWindow({ chatId, type }: ChatWindowProps) {
  const { data: session } = useSession();
  const { messages, sendMessage } = useMessageStore();
  const { channels, dms } = useWorkspaceStore();
  const { threadOpen, pinnedOpen, detailsOpen, setPinnedOpen, setDetailsOpen } = useLayoutStore();

  const currentUser = session?.user;
  const authorName = currentUser?.name || "User";
  const authorEmail = currentUser?.email || "user@example.com";
  const authorUsername = authorEmail.split("@")[0];
  const authorAvatar = currentUser?.image || "";

  // Get active chat details from store
  const activeChannel = type === "channel" ? channels.find((c) => c.id === chatId) : null;
  const activeDm = type === "dm" ? dms.find((d) => d.id === chatId) : null;

  const chatMessages = messages[chatId] || [];

  const handleSendMessage = (text: string, attachments?: any[]) => {
    sendMessage(
      chatId,
      {
        username: authorUsername,
        name: authorName,
        avatar: authorAvatar,
      },
      text,
      attachments
    );
  };

  const handleFileDropped = (files: FileList) => {
    if (files.length > 0) {
      const file = files[0];
      const sizeMb = (file.size / (1024 * 1024)).toFixed(1);
      const isImg = file.type.startsWith("image/");
      
      const attachment = {
        name: file.name,
        url: "#",
        type: isImg ? ("image" as const) : ("file" as const),
        size: `${sizeMb} MB`,
      };

      sendMessage(
        chatId,
        {
          username: authorUsername,
          name: authorName,
          avatar: authorAvatar,
        },
        `Shared file: **${file.name}**`,
        [attachment]
      );
      
      toast.success(`Dropped and shared: ${file.name}`);
    }
  };

  const headingText = activeChannel ? activeChannel.name : activeDm ? activeDm.name : chatId;
  const isPrivateChannel = activeChannel?.isPrivate;

  return (
    <div className="flex flex-1 w-full h-full overflow-hidden">
      {/* Left Chat Area */}
      <div className="flex flex-1 flex-col h-full bg-background overflow-hidden select-none">
        {/* Header bar */}
        <header className="flex h-12 items-center justify-between border-b border-border px-6 shrink-0 bg-card">
          <div className="flex flex-col min-w-0">
            <div className="flex items-center gap-1.5">
              {type === "channel" ? (
                isPrivateChannel ? (
                  <Lock className="h-4 w-4 text-[#0F2A1D]/80 shrink-0" />
                ) : (
                  <Hash className="h-4.5 w-4.5 text-[#0F2A1D]/80 shrink-0" />
                )
              ) : activeDm?.isAi ? (
                <div className="flex h-4 w-4 items-center justify-center rounded-sm bg-gradient-to-tr from-violet-500 to-indigo-500 text-white shadow-sm shrink-0">
                  <Sparkles className="h-2.5 w-2.5" />
                </div>
              ) : (
                <AtSign className="h-4 w-4 text-[#0F2A1D]/80 shrink-0" />
              )}
              <h2 className="text-sm font-bold text-[#0F2A1D] truncate">{headingText}</h2>
            </div>
            
            {/* Subheading status */}
            <span className="text-[10px] text-[#0F2A1D]/70 truncate mt-0.5 max-w-sm hidden sm:inline">
              {type === "channel"
                ? activeChannel?.description || "No description set for this channel."
                : activeDm?.isAi
                ? "Always active • Response latency ~0.4s"
                : "Direct message thread"}
            </span>
          </div>

          {/* Right header buttons */}
          <div className="flex items-center gap-2">
            {/* Pinned Messages Trigger */}
            <button
              onClick={() => setPinnedOpen(!pinnedOpen)}
              className={cn(
                "flex h-7 w-7 items-center justify-center rounded text-[#0F2A1D]/80 hover:text-[#0F2A1D] transition-colors border",
                pinnedOpen
                  ? "bg-[#0F2A1D]/15 border-[#b8c8a2] text-amber-600 hover:text-amber-700 shadow-inner"
                  : "bg-[#0F2A1D]/5 hover:bg-[#0F2A1D]/10 border-[#b8c8a2]/65"
              )}
              title="Pinned Messages"
            >
              <Pin className={cn("h-4 w-4", pinnedOpen && "fill-amber-500/20 animate-pulse")} />
            </button>

            {/* Details Panel Trigger */}
            <button
              onClick={() => setDetailsOpen(!detailsOpen)}
              className={cn(
                "flex items-center gap-1.5 text-[11px] font-semibold text-[#0F2A1D]/80 hover:text-[#0F2A1D] transition-colors border px-2.5 py-1 rounded",
                detailsOpen
                  ? "bg-[#0F2A1D]/15 border-[#b8c8a2] text-[#0F2A1D] shadow-inner"
                  : "bg-[#0F2A1D]/5 hover:bg-[#0F2A1D]/10 border-[#b8c8a2]/65"
              )}
              title="Details & Members"
            >
              <Users className="h-3.5 w-3.5" />
              {type === "channel" ? <span className="text-[10px] bg-[#0F2A1D]/10 px-1 rounded-sm text-[#0F2A1D]/80 ml-0.5">3</span> : null}
            </button>
          </div>
        </header>

        {/* Main chat log scroller with Drag Drop Zone overlay */}
        <DragDropZone onFileDropped={handleFileDropped}>
          {chatMessages.length > 0 ? (
            <MessageList chatId={chatId} messages={chatMessages} onSendPrompt={handleSendMessage} />
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center p-8 text-center text-slate-500">
              <MessageSquare className="h-10 w-10 text-slate-600 mb-3" />
              <h3 className="text-sm font-semibold text-slate-400">Empty chat logs</h3>
              <p className="text-xs text-slate-500 max-w-xs mt-1">
                Send a rich text message or drop a file to start the conversation!
              </p>
            </div>
          )}
        </DragDropZone>

        {/* Rich Text Editor Input */}
        <MessageInput
          placeholder={
            type === "channel" ? `Message #${headingText}` : `Message @${headingText}`
          }
          onSend={handleSendMessage}
        />
      </div>

      {/* Right Side Panels */}
      <AnimatePresence mode="wait">
        {threadOpen && <ThreadPanel key="thread" chatId={chatId} />}
        {pinnedOpen && <PinnedPanel key="pinned" chatId={chatId} />}
        {detailsOpen && <DetailsPanel key="details" chatId={chatId} />}
      </AnimatePresence>
    </div>
  );
}
