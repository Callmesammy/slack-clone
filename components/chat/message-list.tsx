"use client";

import { useRef, useEffect } from "react";
import { useVirtualizer } from "@tanstack/react-virtual";
import { Message } from "@/hooks/use-message-store";
import { MessageItem } from "./message-item";
import { Sparkles, MessageSquare } from "lucide-react";

interface MessageListProps {
  chatId: string;
  messages: Message[];
  onSendPrompt?: (text: string) => void;
}

interface DateRow {
  type: "date";
  label: string;
  id: string;
}

interface MessageRow {
  type: "message";
  message: Message;
  isConsecutive: boolean;
  id: string;
}

interface WelcomeRow {
  type: "welcome";
  id: string;
}

type RowItem = DateRow | MessageRow | WelcomeRow;

export function MessageList({ chatId, messages, onSendPrompt }: MessageListProps) {
  const parentRef = useRef<HTMLDivElement>(null);

  // Flatten messages and insert date separators
  const getFriendlyDate = (isoString: string) => {
    try {
      const msgDate = new Date(isoString);
      const today = new Date();
      const yesterday = new Date();
      yesterday.setDate(today.getDate() - 1);

      if (msgDate.toDateString() === today.toDateString()) {
        return "Today";
      }
      if (msgDate.toDateString() === yesterday.toDateString()) {
        return "Yesterday";
      }
      return msgDate.toLocaleDateString([], {
        weekday: "long",
        month: "long",
        day: "numeric",
      });
    } catch {
      return "Earlier";
    }
  };

  const isSameDay = (t1: string, t2: string) => {
    try {
      const d1 = new Date(t1);
      const d2 = new Date(t2);
      return d1.toDateString() === d2.toDateString();
    } catch {
      return false;
    }
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

  const handleSendPrompt = (text: string) => {
    if (onSendPrompt) {
      onSendPrompt(text);
    }
  };

  const flatRows: RowItem[] = [];

  // Add Slackbot welcome block at the very top of the AI bot chat
  if (chatId === "ai-bot") {
    flatRows.push({
      type: "welcome",
      id: "welcome-ai",
    });
  }

  messages.forEach((msg, idx) => {
    const prevMsg = idx > 0 ? messages[idx - 1] : null;
    
    // Add date separator if it's the first message or date changed
    if (!prevMsg || !isSameDay(prevMsg.timestamp, msg.timestamp)) {
      const dateLabel = getFriendlyDate(msg.timestamp);
      flatRows.push({
        type: "date",
        label: dateLabel,
        id: `date-${msg.timestamp}-${idx}`,
      });
    }

    // Determine consecutive collapse
    let isConsecutive = false;
    if (
      prevMsg &&
      isSameDay(prevMsg.timestamp, msg.timestamp) &&
      prevMsg.author.username === msg.author.username &&
      getMinutesDifference(prevMsg.timestamp, msg.timestamp) < 3
    ) {
      isConsecutive = true;
    }

    flatRows.push({
      type: "message",
      message: msg,
      isConsecutive,
      id: msg.id,
    });
  });

  // Setup virtualization hooks
  const virtualizer = useVirtualizer({
    count: flatRows.length,
    getScrollElement: () => parentRef.current,
    estimateSize: (index) => {
      const row = flatRows[index];
      if (row.type === "welcome") return 260;
      return row.type === "date" ? 40 : 65;
    },
    overscan: 10,
  });

  // Auto scroll to bottom on new messages
  useEffect(() => {
    if (parentRef.current) {
      parentRef.current.scrollTop = parentRef.current.scrollHeight;
    }
  }, [messages.length]);

  if (messages.length === 0 && chatId !== "ai-bot") {
    return (
      <div className="flex flex-col flex-1 items-center justify-center text-center p-8 h-full select-none animate-in fade-in-0 duration-300">
        <div className="h-14 w-14 bg-[#0F2A1D]/5 border border-border/80 rounded-full flex items-center justify-center mb-4">
          <MessageSquare className="h-6 w-6 text-[#0F2A1D]/60" />
        </div>
        <h3 className="text-sm font-bold text-[#0F2A1D]/85">This is the start of your message thread</h3>
        <p className="text-xs text-muted-foreground max-w-xs mt-1.5 leading-relaxed">
          Send a message to begin discussing projects, documents, or team ideas.
        </p>
      </div>
    );
  }

  return (
    <div
      ref={parentRef}
      className="flex-1 overflow-y-auto w-full scrollbar-thin scrollbar-thumb-border"
    >
      <div
        className="w-full relative"
        style={{
          height: `${virtualizer.getTotalSize()}px`,
        }}
      >
        {virtualizer.getVirtualItems().map((virtualItem) => {
          const row = flatRows[virtualItem.index];
          return (
            <div
              key={row.id}
              ref={virtualizer.measureElement}
              data-index={virtualItem.index}
              className="absolute left-0 top-0 w-full"
              style={{
                transform: `translateY(${virtualItem.start}px)`,
              }}
            >
              {row.type === "welcome" ? (
                <div className="px-6 py-8 flex flex-col items-center text-center max-w-lg mx-auto select-none border-b border-border/40 pb-6 mb-4 animate-in fade-in-0 duration-300">
                  <div className="h-16 w-16 rounded-xl bg-gradient-to-tr from-violet-500 to-indigo-500 text-white flex items-center justify-center shadow-md mb-4">
                    <Sparkles className="h-8 w-8 animate-pulse" />
                  </div>
                  <h3 className="text-xl font-bold text-foreground">Hi, I'm Slackbot!</h3>
                  <p className="text-sm text-muted-foreground mt-2 max-w-md leading-relaxed">
                    Think of me as your personal AI assistant. I'm all set up with context from your docs and channels, and ready to jump in with you.
                  </p>
                  
                  {/* Suggestion prompt cards */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 w-full mt-6">
                    <button
                      onClick={() => handleSendPrompt("What happened in Slack this week?")}
                      className="group flex items-center justify-between p-3.5 bg-card border border-border/80 hover:border-primary/40 rounded-xl hover:shadow-xs transition-all text-left cursor-pointer text-xs font-semibold text-foreground"
                    >
                      <span className="truncate pr-2">What happened in Slack this week?</span>
                      <span className="h-5 w-5 rounded-full bg-muted flex items-center justify-center text-muted-foreground group-hover:bg-primary group-hover:text-white transition-colors shrink-0">→</span>
                    </button>
                    <button
                      onClick={() => handleSendPrompt("What needs my attention today?")}
                      className="group flex items-center justify-between p-3.5 bg-card border border-border/80 hover:border-primary/40 rounded-xl hover:shadow-xs transition-all text-left cursor-pointer text-xs font-semibold text-foreground"
                    >
                      <span className="truncate pr-2">What needs my attention today?</span>
                      <span className="h-5 w-5 rounded-full bg-muted flex items-center justify-center text-muted-foreground group-hover:bg-primary group-hover:text-white transition-colors shrink-0">→</span>
                    </button>
                  </div>
                </div>
              ) : row.type === "date" ? (
                /* Date Separator UI */
                <div className="flex items-center my-4 px-6 select-none">
                  <div className="flex-1 h-[1px] bg-border/60" />
                  <span className="mx-4 text-xs font-bold text-muted-foreground bg-background border border-border/80 rounded-full px-3 py-1">
                    {row.label}
                  </span>
                  <div className="flex-1 h-[1px] bg-border/60" />
                </div>
              ) : (
                /* Message Item UI */
                <MessageItem
                  chatId={chatId}
                  message={row.message}
                  isConsecutive={row.isConsecutive}
                />
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
