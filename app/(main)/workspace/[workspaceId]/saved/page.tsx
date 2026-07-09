"use client";

import { use } from "react";
import Link from "next/link";
import { Bookmark, ArrowLeft, Hash, Lock, AtSign, Sparkles, ExternalLink, Trash2 } from "lucide-react";
import { useMessageStore, Message } from "@/hooks/use-message-store";
import { useWorkspaceStore } from "@/hooks/use-workspace-store";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { toast } from "sonner";

interface SavedPageProps {
  params: Promise<{ workspaceId: string }>;
}

export default function SavedPage({ params }: SavedPageProps) {
  const { workspaceId } = use(params);
  const { messages, replies, toggleSaveMessage } = useMessageStore();
  const { channels, dms } = useWorkspaceStore();

  // Find all saved messages
  const savedItems: Array<{ chatId: string; message: Message }> = [];

  // Get saved messages from channels/DMs
  Object.entries(messages).forEach(([chatId, msgList]) => {
    msgList.forEach((msg) => {
      if (msg.isSaved) {
        savedItems.push({ chatId, message: msg });
      }
    });
  });

  // Get saved replies
  Object.entries(replies).forEach(([parentId, replyList]) => {
    replyList.forEach((reply) => {
      if (reply.isSaved) {
        let chatId = "general";
        for (const [cid, msgList] of Object.entries(messages)) {
          if (msgList.some((m) => m.id === parentId)) {
            chatId = cid;
            break;
          }
        }
        savedItems.push({ chatId, message: reply });
      }
    });
  });

  // Sort saved items by timestamp (newest first)
  savedItems.sort(
    (a, b) => new Date(b.message.timestamp).getTime() - new Date(a.message.timestamp).getTime()
  );

  const getChatDetails = (chatId: string) => {
    const channel = channels.find((c) => c.id === chatId);
    if (channel) {
      return {
        name: channel.name,
        isPrivate: channel.isPrivate,
        type: "channel" as const,
      };
    }
    const dm = dms.find((d) => d.id === chatId);
    if (dm) {
      return {
        name: dm.name,
        isAi: dm.isAi,
        type: "dm" as const,
      };
    }
    return {
      name: chatId,
      type: "channel" as const,
    };
  };

  const formatTime = (isoString: string) => {
    try {
      const date = new Date(isoString);
      return date.toLocaleString([], { month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" });
    } catch {
      return "";
    }
  };

  return (
    <div className="flex flex-col h-full w-full bg-background overflow-hidden select-none">
      {/* Header bar */}
      <header className="flex h-12 items-center justify-between border-b border-border px-6 shrink-0 bg-card">
        <div className="flex items-center gap-3">
          <Link href={`/workspace/${workspaceId}`}>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 text-[#0F2A1D]/80 hover:bg-[#0F2A1D]/10 hover:text-[#0F2A1D]"
            >
              <ArrowLeft className="h-4 w-4" />
            </Button>
          </Link>
          <div className="flex items-center gap-1.5">
            <Bookmark className="h-4.5 w-4.5 text-amber-600 fill-amber-500/20 shrink-0" />
            <h2 className="text-sm font-bold text-[#0F2A1D]">Saved Items</h2>
          </div>
        </div>
        <div className="text-xs text-[#0F2A1D]/75 font-semibold px-2 py-0.5 bg-[#0F2A1D]/10 border border-[#b8c8a2]/50 rounded-md">
          {savedItems.length} {savedItems.length === 1 ? "item" : "items"} saved
        </div>
      </header>

      {/* Main Scroller */}
      <div className="flex-1 overflow-y-auto p-6 space-y-4 scrollbar-thin scrollbar-thumb-border">
        {savedItems.length > 0 ? (
          <div className="max-w-3xl mx-auto space-y-4">
            {savedItems.map(({ chatId, message }) => {
              const chat = getChatDetails(chatId);
              const linkPath = chat.type === "channel"
                ? `/workspace/${workspaceId}/channel/${chatId}`
                : `/workspace/${workspaceId}/dm/${chatId}`;

              return (
                <div
                  key={message.id}
                  className="flex flex-col bg-[#0F2A1D]/5 border border-border/80 hover:border-border rounded-xl overflow-hidden transition-all duration-200"
                >
                  {/* Origin Header bar */}
                  <div className="flex items-center justify-between bg-muted/40 px-4 py-2 border-b border-border/50 text-[11px] font-semibold text-muted-foreground">
                    <div className="flex items-center gap-1">
                      {chat.type === "channel" ? (
                        chat.isPrivate ? (
                          <Lock className="h-3.5 w-3.5 text-muted-foreground/80" />
                        ) : (
                          <Hash className="h-3.5 w-3.5 text-muted-foreground/80" />
                        )
                      ) : chat.isAi ? (
                        <div className="flex h-3.5 w-3.5 items-center justify-center rounded-sm bg-gradient-to-tr from-violet-500 to-indigo-500 text-white text-[8px] shrink-0">
                          <Sparkles className="h-2 w-2" />
                        </div>
                      ) : (
                        <AtSign className="h-3.5 w-3.5 text-muted-foreground/80" />
                      )}
                      <span className="text-foreground font-bold hover:underline cursor-pointer">
                        <Link href={linkPath}>#{chat.name}</Link>
                      </span>
                    </div>

                    <div className="flex items-center gap-1.5">
                      <Link href={linkPath}>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-6 px-2 text-[10px] text-primary hover:bg-muted font-bold gap-1"
                        >
                          <ExternalLink className="h-2.5 w-2.5" />
                          Jump to chat
                        </Button>
                      </Link>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => {
                          toggleSaveMessage(chatId, message.id);
                          toast.success("Removed from Saved Items");
                        }}
                        className="h-6 w-6 text-muted-foreground hover:text-rose-600 hover:bg-muted"
                        title="Unsave message"
                      >
                        <Trash2 className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>

                  {/* Card Message Body */}
                  <div className="flex items-start p-4 gap-3">
                    <Avatar className="h-9 w-9 rounded-md overflow-hidden ring-1 ring-border">
                      {message.author.avatar && (
                        <AvatarImage src={message.author.avatar} alt={message.author.name} />
                      )}
                      <AvatarFallback className="bg-muted text-foreground text-xs font-bold rounded-md">
                        {message.author.name.charAt(0).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-baseline gap-2 mb-0.5">
                        <span className="text-sm font-semibold text-foreground">
                          {message.author.name}
                        </span>
                        <span className="text-[10px] text-muted-foreground font-medium">
                          {formatTime(message.timestamp)}
                        </span>
                        {message.isEdited && (
                          <span className="text-[9px] text-muted-foreground/60 font-medium">(edited)</span>
                        )}
                      </div>

                      <div className="text-foreground text-sm break-words leading-relaxed select-text prose prose-sm max-w-none prose-p:m-0 prose-pre:bg-background prose-pre:border prose-pre:border-border prose-code:text-rose-600">
                        {message.body.trim().startsWith("<") && message.body.trim().endsWith(">") ? (
                          <div 
                            className="rich-text-content"
                            dangerouslySetInnerHTML={{ __html: message.body }} 
                          />
                        ) : (
                          <ReactMarkdown remarkPlugins={[remarkGfm]}>
                            {message.body}
                          </ReactMarkdown>
                        )}
                      </div>

                      {/* Attachments */}
                      {message.attachments && message.attachments.length > 0 && (
                        <div className="flex flex-wrap gap-2 mt-2">
                          {message.attachments.map((file, idx) => (
                            <div
                              key={idx}
                              className="flex items-center gap-2 bg-muted/40 p-2 rounded border border-border text-xs"
                            >
                              <span className="text-muted-foreground truncate max-w-[140px]">
                                {file.name}
                              </span>
                              <span className="text-[10px] text-muted-foreground/60 font-semibold">
                                {file.size}
                              </span>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="flex h-[80%] flex-col items-center justify-center text-center p-8">
            <div className="h-16 w-16 bg-muted border border-border rounded-full flex items-center justify-center mb-4">
              <Bookmark className="h-7.5 w-7.5 text-muted-foreground/60 rotate-12" />
            </div>
            <h3 className="text-base font-bold text-[#0F2A1D]/80">No saved items</h3>
            <p className="text-xs text-muted-foreground max-w-sm mt-1 leading-relaxed">
              Mark messages and replies as saved to compile them in this workspace dashboard. Hover over a message, click the options menu, and click <span className="font-semibold text-muted-foreground/80">Save Message</span>.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
