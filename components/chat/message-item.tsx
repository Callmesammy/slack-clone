"use client";

import { useSession } from "next-auth/react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useMessageStore, Message } from "@/hooks/use-message-store";
import { useLayoutStore } from "@/hooks/use-layout-store";
import { Smile, MessageSquare, MoreHorizontal, FileText, CornerUpLeft, Bookmark, Pin, Trash, Edit } from "lucide-react";
import { motion } from "motion/react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { cn } from "@/lib/utils";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { toast } from "sonner";

interface MessageItemProps {
  chatId: string;
  message: Message;
  isConsecutive: boolean;
}

const QUICK_EMOJIS = ["👍", "👀", "🔥", "❤️"];

export function MessageItem({ chatId, message, isConsecutive }: MessageItemProps) {
  const { data: session } = useSession();
  const { toggleReaction, replies, togglePinMessage, toggleSaveMessage, editMessage, deleteMessage } = useMessageStore();
  const { openThread, setActiveModal } = useLayoutStore();

  const [isEditing, setIsEditing] = useState(false);
  const [editBody, setEditBody] = useState(message.body);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [popoverOpen, setPopoverOpen] = useState(false);

  const threadReplies = replies[message.id] || [];

  const currentUser = session?.user?.name || "user";
  const { id, author, body, timestamp, attachments, reactions, isPending } = message;

  const handleToggleReaction = (emoji: string) => {
    toggleReaction(chatId, id, emoji, currentUser);
  };

  const handleSaveEdit = () => {
    if (!editBody.trim()) return;
    editMessage(chatId, id, editBody);
    setIsEditing(false);
    toast.success("Message updated");
  };

  const formatTime = (isoString: string) => {
    try {
      const date = new Date(isoString);
      return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
    } catch {
      return "";
    }
  };

  const formatFullDate = (isoString: string) => {
    try {
      const date = new Date(isoString);
      return date.toLocaleDateString([], { month: "short", day: "numeric" }) + " at " + formatTime(isoString);
    } catch {
      return "";
    }
  };

  const initial = author.name.charAt(0).toUpperCase();

  return (
    <div
      className={cn(
        "group relative flex items-start px-6 transition-colors hover:bg-slate-900/40 select-none",
        isConsecutive ? "py-0.5" : "py-2.5 mt-2",
        message.isPinned && "pt-6 bg-amber-500/5 hover:bg-amber-500/10 border-l-2 border-amber-500/30"
      )}
    >
      {/* Pinned Badge Overlay */}
      {message.isPinned && (
        <div className="absolute top-1.5 left-16 flex items-center gap-1 text-[10px] text-amber-500 font-semibold select-none">
          <Pin className="h-3 w-3 fill-amber-500/20 animate-pulse" />
          <span>Pinned</span>
        </div>
      )}

      {/* Left Column: Avatar or Hover Timestamp */}
      <div className="w-10 shrink-0">
        {isConsecutive ? (
          <div className="flex items-center justify-end pr-3.5 pt-1 select-none">
            <span className="hidden group-hover:block text-[10px] text-slate-500 text-right">
              {formatTime(timestamp).replace(/\s[A-Z]{2}$/, "")}
            </span>
            {message.isSaved && (
              <Bookmark className="h-3 w-3 text-amber-500 fill-amber-500/20 shrink-0 mt-0.5" />
            )}
          </div>
        ) : (
          <button
            onClick={() => setActiveModal("user-profile")}
            className="cursor-pointer focus:outline-hidden hover:opacity-85 transition-opacity animate-in fade-in-0 duration-200"
          >
            <Avatar className="h-9 w-9 rounded-md overflow-hidden ring-1 ring-border">
              {author.avatar && <AvatarImage src={author.avatar} alt={author.name} />}
              <AvatarFallback className="bg-muted text-foreground text-xs font-bold rounded-md">
                {initial}
              </AvatarFallback>
            </Avatar>
          </button>
        )}
      </div>

      {/* Right Column: Message Contents */}
      <div className="flex-1 min-w-0 pl-3">
        {/* Full Header Info */}
        {!isConsecutive && (
          <div className="flex items-baseline gap-2 mb-0.5">
            <span
              onClick={() => setActiveModal("user-profile")}
              className="text-sm font-semibold text-foreground hover:underline cursor-pointer"
            >
              {author.name}
            </span>
            <span className="text-[10px] text-slate-500 select-none" title={formatFullDate(timestamp)}>
              {formatTime(timestamp)}
            </span>
            {message.isSaved && (
              <Bookmark className="h-3 w-3 text-amber-500 fill-amber-500/20 shrink-0" />
            )}
          </div>
        )}

        {/* Message body - supports Markdown styling / Edit Interface */}
        {isEditing ? (
          <div className="mt-1 space-y-2 animate-in slide-in-from-top-1 duration-150">
            <textarea
              value={editBody}
              onChange={(e) => setEditBody(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  handleSaveEdit();
                } else if (e.key === "Escape") {
                  setIsEditing(false);
                }
              }}
              className="w-full min-h-[60px] bg-card border border-border focus:border-primary text-foreground text-sm rounded-md p-2 outline-hidden resize-y scrollbar-thin"
              autoFocus
            />
            <div className="flex items-center gap-1.5 text-[11px]">
              <Button
                size="sm"
                onClick={handleSaveEdit}
                className="h-6 px-2.5 text-xs bg-slack-blue hover:bg-slack-blue/80 text-white font-medium"
              >
                Save
              </Button>
              <Button
                size="sm"
                variant="ghost"
                onClick={() => setIsEditing(false)}
                className="h-6 px-2.5 text-xs text-muted-foreground hover:bg-muted hover:text-foreground"
              >
                Cancel
              </Button>
              <span className="text-slate-500 ml-auto">
                Press <span className="font-semibold">Enter</span> to save, <span className="font-semibold">Esc</span> to cancel
              </span>
            </div>
          </div>
        ) : (
          <div
            className={cn(
              "text-foreground text-sm break-words leading-relaxed select-text prose prose-sm max-w-none inline-block",
              "prose-p:m-0 prose-pre:my-1 prose-pre:p-2 prose-pre:bg-muted/40 prose-pre:border prose-pre:border-border prose-code:text-rose-600 prose-ul:my-0.5 prose-ol:my-0.5",
              isPending && "opacity-50"
            )}
          >
            {body.trim().startsWith("<") && body.trim().endsWith(">") ? (
              <div 
                className="rich-text-content"
                dangerouslySetInnerHTML={{ __html: body }} 
              />
            ) : (
              <ReactMarkdown remarkPlugins={[remarkGfm]}>
                {body}
              </ReactMarkdown>
            )}
            {message.isEdited && (
              <span className="text-[10px] text-slate-500 ml-1.5 select-none" title="Edited message">
                (edited)
              </span>
            )}
          </div>
        )}

        {/* Attachments */}
        {attachments && attachments.length > 0 && (
          <div className="flex flex-col gap-2 mt-2">
            {attachments.map((file, idx) => (
              <div
                key={idx}
                className="flex items-center gap-3 bg-muted/45 p-3 rounded-lg border border-border max-w-sm"
              >
                <div className="h-9 w-9 flex items-center justify-center bg-primary/10 text-primary rounded">
                  <FileText className="h-5 w-5" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-xs font-semibold text-foreground truncate">{file.name}</p>
                  <p className="text-[10px] text-muted-foreground font-medium">{file.size || "Unknown size"}</p>
                </div>
                <button className="text-xs text-primary font-bold hover:underline px-2 py-1">
                  Download
                </button>
              </div>
            ))}
          </div>
        )}

        {/* Reactions pills list */}
        {reactions && reactions.length > 0 && (
          <div className="flex flex-wrap gap-1 mt-1.5 pb-0.5">
            {reactions.map((react, idx) => {
              const hasReacted = react.users.includes(currentUser);
              return (
                <motion.button
                  key={idx}
                  whileTap={{ scale: 0.92 }}
                  initial={{ scale: 0.95, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ type: "spring", stiffness: 450, damping: 15 }}
                  onClick={() => handleToggleReaction(react.emoji)}
                  className={cn(
                    "flex items-center gap-1.5 px-2 py-0.5 rounded-full border text-xs font-semibold cursor-pointer select-none transition-colors",
                    hasReacted
                      ? "bg-primary/15 border-primary/40 text-primary hover:border-primary/60"
                      : "bg-slate-950/40 border-slate-800 text-slate-400 hover:bg-slate-800 hover:text-white"
                  )}
                >
                  <span>{react.emoji}</span>
                  <span className="text-[10px] tabular-nums">{react.count}</span>
                </motion.button>
              );
            })}
          </div>
        )}

        {/* Thread replies preview strip */}
        {threadReplies.length > 0 && (
          <button
            onClick={() => openThread(id)}
            className="flex items-center gap-2 mt-2 px-3 py-1.5 rounded-md border border-slate-800 bg-slate-950/20 text-xs font-semibold text-primary hover:bg-slate-800/80 transition-colors w-fit select-none"
          >
            <MessageSquare className="h-3.5 w-3.5 text-primary" />
            <span>
              {threadReplies.length} {threadReplies.length === 1 ? "reply" : "replies"}
            </span>
            <span className="text-[10px] text-slate-500 font-normal hover:underline ml-1">
              View thread
            </span>
          </button>
        )}
      </div>

      {/* Floating Toolbar on Hover */}
      <div
        className={cn(
          "absolute right-6 top-[-14px] z-10 items-center bg-slate-900 border border-slate-800 rounded-md shadow-lg p-0.5 animate-in fade-in-0 duration-150 scale-95 origin-right",
          (dropdownOpen || popoverOpen) ? "flex" : "hidden group-hover:flex"
        )}
      >
        {/* Quick Reactions */}
        {QUICK_EMOJIS.map((emoji) => (
          <motion.button
            key={emoji}
            whileHover={{ scale: 1.25, y: -2 }}
            whileTap={{ scale: 0.85 }}
            transition={{ type: "spring", stiffness: 450, damping: 15 }}
            onClick={() => handleToggleReaction(emoji)}
            className="flex h-7 w-7 items-center justify-center rounded text-sm hover:bg-slate-800 cursor-pointer transition-colors"
          >
            {emoji}
          </motion.button>
        ))}

        <div className="h-4 w-[1px] bg-slate-800 mx-1" />

        {/* Reaction Popover */}
        <Popover open={popoverOpen} onOpenChange={setPopoverOpen}>
          <PopoverTrigger>
            <Button
              variant="ghost"
              size="icon"
              className="h-7 w-7 text-slate-400 hover:bg-slate-800 hover:text-white cursor-pointer"
            >
              <Smile className="h-4 w-4" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-64 p-3 bg-slate-900 border border-slate-800 text-white" align="end">
            <div className="space-y-3 select-none">
              <div>
                <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1.5">Expressions</p>
                <div className="grid grid-cols-6 gap-1">
                  {["👍", "👎", "❤️", "🔥", "😂", "🎉", "🚀", "👀", "🙌", "💯", "👏", "🤔"].map((emoji) => (
                    <button
                      key={emoji}
                      onClick={() => handleToggleReaction(emoji)}
                      className="flex h-7 w-7 items-center justify-center rounded text-base hover:bg-slate-800 cursor-pointer transition-colors"
                    >
                      {emoji}
                    </button>
                  ))}
                </div>
              </div>
              
              <div>
                <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1.5">Work & Status</p>
                <div className="grid grid-cols-6 gap-1">
                  {["✅", "❌", "⏳", "⚠️", "🌟", "🎈", "💬", "🔒", "🛠️", "🎯", "📅", "💡"].map((emoji) => (
                    <button
                      key={emoji}
                      onClick={() => handleToggleReaction(emoji)}
                      className="flex h-7 w-7 items-center justify-center rounded text-base hover:bg-slate-800 cursor-pointer transition-colors"
                    >
                      {emoji}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </PopoverContent>
        </Popover>

        {/* Thread reply */}
        <Button
          variant="ghost"
          size="icon"
          className="h-7 w-7 text-slate-400 hover:bg-slate-800 hover:text-white"
          onClick={() => openThread(id)}
        >
          <CornerUpLeft className="h-4 w-4" />
        </Button>

        {/* More Options Dropdown */}
        <DropdownMenu open={dropdownOpen} onOpenChange={setDropdownOpen}>
          <DropdownMenuTrigger className="flex h-7 w-7 items-center justify-center rounded text-slate-400 hover:bg-slate-800 hover:text-white cursor-pointer select-none">
            <MoreHorizontal className="h-4 w-4" />
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-48 bg-slate-900 border border-slate-800 text-slate-200">
            <DropdownMenuItem
              onClick={() => toggleSaveMessage(chatId, id)}
              className="cursor-pointer hover:bg-slate-800 focus:bg-slate-800 gap-2 text-xs"
            >
              <Bookmark className={cn("h-3.5 w-3.5", message.isSaved && "text-amber-500 fill-amber-500/20")} />
              <span>{message.isSaved ? "Remove from Saved" : "Save Message"}</span>
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => togglePinMessage(chatId, id)}
              className="cursor-pointer hover:bg-slate-800 focus:bg-slate-800 gap-2 text-xs"
            >
              <Pin className={cn("h-3.5 w-3.5", message.isPinned && "text-amber-500")} />
              <span>{message.isPinned ? "Unpin from Channel" : "Pin to Channel"}</span>
            </DropdownMenuItem>
            <DropdownMenuSeparator className="bg-slate-800" />
            <DropdownMenuItem
              onClick={() => {
                const cleaned = body
                  .replace(/<p>/g, "")
                  .replace(/<\/p>/g, "\n")
                  .replace(/<strong>/g, "**")
                  .replace(/<\/strong>/g, "**")
                  .replace(/<em>/g, "*")
                  .replace(/<\/em>/g, "*")
                  .replace(/<code>/g, "`")
                  .replace(/<\/code>/g, "`")
                  .replace(/<br\s*\/?>/g, "\n")
                  .trim();
                setEditBody(cleaned);
                setIsEditing(true);
              }}
              className="cursor-pointer hover:bg-slate-800 focus:bg-slate-800 gap-2 text-xs"
            >
              <Edit className="h-3.5 w-3.5 text-slate-400" />
              <span>Edit Message</span>
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => {
                deleteMessage(chatId, id);
                toast.success("Message deleted");
              }}
              className="cursor-pointer hover:bg-slate-800 focus:bg-slate-800 text-rose-400 hover:text-rose-300 focus:text-rose-300 gap-2 text-xs"
            >
              <Trash className="h-3.5 w-3.5" />
              <span>Delete Message</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
}
