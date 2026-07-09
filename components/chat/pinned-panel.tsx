"use client";

import { X, Pin } from "lucide-react";
import { motion } from "motion/react";
import { useLayoutStore } from "@/hooks/use-layout-store";
import { useMessageStore } from "@/hooks/use-message-store";
import { Button } from "@/components/ui/button";
import { MessageItem } from "./message-item";

interface PinnedPanelProps {
  chatId: string;
}

export function PinnedPanel({ chatId }: PinnedPanelProps) {
  const { setPinnedOpen } = useLayoutStore();
  const { messages, replies } = useMessageStore();

  const chatMessages = messages[chatId] || [];
  const pinnedMessages = chatMessages.filter((m) => m.isPinned);

  // Collect pinned replies associated with these messages
  const pinnedReplies: any[] = [];
  chatMessages.forEach((msg) => {
    const msgReplies = replies[msg.id] || [];
    msgReplies.forEach((reply) => {
      if (reply.isPinned) {
        pinnedReplies.push(reply);
      }
    });
  });

  const allPinned = [...pinnedMessages, ...pinnedReplies].sort(
    (a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()
  );

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
          <Pin className="h-4 w-4 text-amber-600 fill-amber-500/20" />
          <span className="text-sm font-bold text-[#0F2A1D]">Pinned Messages</span>
        </div>
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8 text-[#0F2A1D]/80 hover:bg-[#0F2A1D]/10 hover:text-[#0F2A1D]"
          onClick={() => setPinnedOpen(false)}
        >
          <X className="h-4 w-4" />
        </Button>
      </div>

      {/* Scroll area */}
      <div className="flex-1 overflow-y-auto w-full py-4 space-y-4 scrollbar-thin scrollbar-thumb-border">
        {allPinned.length > 0 ? (
          <div className="space-y-4">
            {allPinned.map((msg) => (
              <div key={msg.id} className="border-b border-border/60 pb-4 last:border-0">
                <MessageItem chatId={chatId} message={msg} isConsecutive={false} />
              </div>
            ))}
          </div>
        ) : (
          <div className="flex h-full flex-col items-center justify-center p-8 text-center text-[#0F2A1D]/60">
            <Pin className="h-10 w-10 text-[#0F2A1D]/40 mb-3 rotate-45" />
            <h3 className="text-sm font-semibold text-[#0F2A1D]/80">No pinned messages</h3>
            <p className="text-xs text-[#0F2A1D]/60 max-w-xs mt-1 leading-relaxed">
              Keep important messages handy. Hover over any message, click the options menu, and select <span className="font-semibold text-[#0F2A1D]/80">Pin to Channel</span>.
            </p>
          </div>
        )}
      </div>
    </motion.div>
  );
}
