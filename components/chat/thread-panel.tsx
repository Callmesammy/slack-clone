"use client";

import { useRef, useEffect } from "react";
import { useSession } from "next-auth/react";
import { X, MessageSquare } from "lucide-react";
import { motion } from "motion/react";
import { useLayoutStore } from "@/hooks/use-layout-store";
import { useMessageStore, Message } from "@/hooks/use-message-store";
import { Button } from "@/components/ui/button";
import { MessageItem } from "./message-item";
import { MessageInput } from "./message-input";

interface ThreadPanelProps {
  chatId: string;
}

export function ThreadPanel({ chatId }: ThreadPanelProps) {
  const { data: session } = useSession();
  const { activeParentMessageId, closeThread } = useLayoutStore();
  const { messages, replies, sendReply } = useMessageStore();
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const currentUser = session?.user;
  const authorName = currentUser?.name || "User";
  const authorEmail = currentUser?.email || "user@example.com";
  const authorUsername = authorEmail.split("@")[0];
  const authorAvatar = currentUser?.image || "";

  // Find parent message in chat messages logs
  const chatMessages = messages[chatId] || [];
  const parentMessage = chatMessages.find((m) => m.id === activeParentMessageId);

  const threadReplies = activeParentMessageId ? replies[activeParentMessageId] || [] : [];

  // Scroll to bottom on new reply
  useEffect(() => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollTop = scrollContainerRef.current.scrollHeight;
    }
  }, [threadReplies.length]);

  if (!parentMessage) {
    return null;
  }

  const handleSendReply = (text: string, attachments?: any[]) => {
    if (!activeParentMessageId) return;
    sendReply(
      activeParentMessageId,
      {
        username: authorUsername,
        name: authorName,
        avatar: authorAvatar,
      },
      text,
      attachments
    );
  };

  const getMinutesDifference = (t1: string, t2: string) => {
    try {
      const d1 = new Date(t1);
      const d2 = new Date(t2);
      return Math.abs(d1.getTime() - d2.getTime()) / (1000 * 60);
    } catch {
      return 999;
    }
  };

  return (
    <motion.div
      initial={{ x: "100%", opacity: 0.8 }}
      animate={{ x: 0, opacity: 1 }}
      exit={{ x: "100%", opacity: 0.8 }}
      transition={{ type: "spring", stiffness: 380, damping: 35 }}
      className="w-full md:w-[380px] h-full border-l border-border bg-background flex flex-col overflow-hidden shrink-0 select-none"
    >
      {/* Header */}
      <div className="flex h-12 items-center justify-between px-4 border-b border-border bg-card shrink-0">
        <div className="flex items-center gap-2">
          <MessageSquare className="h-4 w-4 text-[#0F2A1D]" />
          <span className="text-sm font-bold text-[#0F2A1D]">Thread</span>
        </div>
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8 text-[#0F2A1D]/80 hover:bg-[#0F2A1D]/10 hover:text-[#0F2A1D]"
          onClick={closeThread}
        >
          <X className="h-4 w-4" />
        </Button>
      </div>

      {/* Scroll area */}
      <div
        ref={scrollContainerRef}
        className="flex-1 overflow-y-auto w-full py-4 space-y-4 scrollbar-thin scrollbar-thumb-border"
      >
        {/* Parent message focus */}
        <div className="border-b border-border/60 pb-4">
          <MessageItem chatId={chatId} message={parentMessage} isConsecutive={false} />
        </div>

        {/* Separator / Reply count */}
        <div className="flex items-center px-6">
          <span className="text-[11px] font-bold text-[#0F2A1D]/75 uppercase tracking-wider">
            {threadReplies.length} {threadReplies.length === 1 ? "reply" : "replies"}
          </span>
          <div className="flex-1 h-[1px] bg-border/60 ml-3" />
        </div>

        {/* Replies List */}
        <div className="space-y-1">
          {threadReplies.map((reply, idx) => {
            const prevReply = idx > 0 ? threadReplies[idx - 1] : null;
            let isConsecutive = false;

            if (
              prevReply &&
              prevReply.author.username === reply.author.username &&
              getMinutesDifference(prevReply.timestamp, reply.timestamp) < 3
            ) {
              isConsecutive = true;
            }

            return (
              <MessageItem
                key={reply.id}
                chatId={chatId}
                message={reply}
                isConsecutive={isConsecutive}
              />
            );
          })}
        </div>
      </div>

      {/* Thread reply input */}
      <div className="p-2 border-t border-border bg-muted/10">
        <MessageInput placeholder="Reply..." onSend={handleSendReply} />
      </div>
    </motion.div>
  );
}
