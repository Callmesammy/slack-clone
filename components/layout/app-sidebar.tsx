"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useParams, usePathname } from "next/navigation";
import { Hash, Lock, MessageSquare, ChevronDown, ChevronRight, Plus, Sparkles, Bookmark } from "lucide-react";
import { useLayoutStore } from "@/hooks/use-layout-store";
import { useWorkspaceStore } from "@/hooks/use-workspace-store";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { motion } from "motion/react";

const getUserAvatarColor = (name: string) => {
  const gradients = [
    "from-indigo-500 to-purple-500",
    "from-pink-500 to-rose-500",
    "from-orange-500 to-amber-500",
    "from-emerald-500 to-teal-500",
    "from-blue-500 to-sky-500",
    "from-violet-500 to-fuchsia-500",
  ];
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  }
  const index = Math.abs(hash) % gradients.length;
  return gradients[index];
};

export function AppSidebar() {
  const params = useParams();
  const pathname = usePathname();
  const { sidebarCollapsed, toggleSidebarCollapsed, setActiveModal } = useLayoutStore();
  const { channels, dms, markChannelRead, markDmRead } = useWorkspaceStore();

  const [channelsExpanded, setChannelsExpanded] = useState(true);
  const [dmsExpanded, setDmsExpanded] = useState(true);

  const activeWorkspaceId = params?.workspaceId as string || "default";
  const activeChannelId = params?.channelId as string;
  const activeDmId = params?.conversationId as string;

  // Automatically mark channels and DMs as read when active
  useEffect(() => {
    if (activeChannelId) {
      markChannelRead(activeChannelId);
    }
  }, [activeChannelId, markChannelRead]);

  useEffect(() => {
    if (activeDmId) {
      markDmRead(activeDmId);
    }
  }, [activeDmId, markDmRead]);

  return (
    <aside
      className={cn(
        "flex h-full flex-col bg-[#375534] text-[#E3EED4]/85 border-r border-[#375534]/10 transition-all duration-300 select-none",
        sidebarCollapsed ? "w-0 overflow-hidden md:w-12" : "w-60"
      )}
    >
      {/* Header section (Workspace Name) */}
      <div className="flex h-12 items-center justify-between px-4 border-b border-white/10 shrink-0">
        {!sidebarCollapsed ? (
          <>
            <span className="font-bold text-base text-white truncate">Main HQ</span>
            <Button
              variant="ghost"
              size="icon"
              className="h-7 w-7 text-[#E3EED4] hover:bg-white/10 hover:text-white"
              onClick={() => toast.info("Workspace menu dropdown in Phase 10.")}
            >
              <ChevronDown className="h-4 w-4" />
            </Button>
          </>
        ) : (
          <div className="mx-auto flex h-8 w-8 items-center justify-center rounded-lg bg-white/10 font-bold text-white text-sm">
            M
          </div>
        )}
      </div>

      {/* Navigation List (Scrollable) */}
      <div className="flex-1 overflow-y-auto px-2 py-4 space-y-4 scrollbar-thin scrollbar-thumb-white/10">
        {/* If sidebar is collapsed, we show minimized icon triggers */}
        {sidebarCollapsed ? (
          <div className="flex flex-col items-center gap-4">
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 text-[#E3EED4] hover:bg-white/10 hover:text-white"
              onClick={toggleSidebarCollapsed}
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
            <Link
              href={`/workspace/${activeWorkspaceId}/saved`}
              className={cn(
                "flex h-8 w-8 items-center justify-center rounded-md hover:bg-white/10 transition-colors",
                pathname.endsWith("/saved") && "bg-white/10 text-white"
              )}
              title="Saved Items"
            >
              <Bookmark className="h-4 w-4 text-amber-500 fill-amber-500/10" />
            </Link>
          </div>
        ) : (
          <>
            {/* Collapse/Expand Toggle arrow */}
            <div className="flex items-center justify-between mb-2">
              <Button
                variant="ghost"
                size="sm"
                className="h-6 px-1.5 text-xs text-[#E3EED4]/80 hover:bg-white/10 hover:text-white justify-start gap-1"
                onClick={toggleSidebarCollapsed}
              >
                <ChevronRight className="h-3 w-3 rotate-180" />
                Collapse Side Nav
              </Button>
            </div>

            {/* Saved Items Link */}
            <div className="mb-4">
              <Link
                href={`/workspace/${activeWorkspaceId}/saved`}
                className={cn(
                  "flex items-center gap-2 px-3 py-1.5 rounded-md text-sm font-semibold transition-colors",
                  pathname.endsWith("/saved")
                    ? "bg-[#0F2A1D] text-white font-bold"
                    : "hover:bg-white/10 text-[#E3EED4]/85 hover:text-white"
                )}
              >
                <Bookmark className="h-4 w-4 shrink-0 text-amber-500 fill-amber-500/10" />
                <span>Saved Items</span>
              </Link>
            </div>

            {/* Channels Section */}
            <div className="space-y-1">
              <div className="group flex items-center justify-between px-2 text-xs font-semibold text-[#E3EED4]/70 hover:text-white">
                <button
                  className="flex items-center gap-1 py-1"
                  onClick={() => setChannelsExpanded(!channelsExpanded)}
                >
                  {channelsExpanded ? (
                    <ChevronDown className="h-3 w-3" />
                  ) : (
                    <ChevronRight className="h-3 w-3" />
                  )}
                  <span>CHANNELS</span>
                </button>
                <button
                  className="opacity-0 group-hover:opacity-100 p-0.5 hover:bg-white/10 rounded hover:text-white transition-all animate-in fade-in-0 duration-200"
                  onClick={() => setActiveModal("create-channel")}
                >
                  <Plus className="h-3.5 w-3.5" />
                </button>
              </div>

              {channelsExpanded && (
                <div className="space-y-[2px]">
                  {channels.length > 0 ? (
                    channels.map((channel) => {
                      const isActive = activeChannelId === channel.id;
                      return (
                        <Link
                          key={channel.id}
                          href={`/workspace/${activeWorkspaceId}/channel/${channel.id}`}
                          className={cn(
                            "flex items-center gap-2 px-3 py-1.5 rounded-md text-sm font-medium transition-colors",
                            isActive
                              ? "bg-[#0F2A1D] text-white font-bold"
                              : "hover:bg-white/10 text-[#E3EED4]/85 hover:text-white",
                            channel.unread && !isActive && "text-white font-bold"
                          )}
                        >
                          {channel.isPrivate ? (
                            <Lock className="h-3.5 w-3.5 shrink-0" />
                          ) : (
                            <Hash className="h-3.5 w-3.5 shrink-0" />
                          )}
                          <span className="truncate">{channel.name}</span>
                          {channel.unread && !isActive && (
                            <motion.span
                              initial={{ scale: 0.6, opacity: 0 }}
                              animate={{ scale: 1, opacity: 1 }}
                              transition={{ type: "spring", stiffness: 500, damping: 15 }}
                              className="ml-auto flex h-4 min-w-4 items-center justify-center rounded-full bg-rose-500 px-1 text-[9px] font-bold text-white leading-none shadow-sm shrink-0"
                            >
                              1
                            </motion.span>
                          )}
                        </Link>
                      );
                    })
                  ) : (
                    <p className="text-[10px] text-[#E3EED4]/60 px-3 py-1.5 italic animate-in fade-in-0 duration-200">
                      No channels. Click + to create.
                    </p>
                  )}
                </div>
              )}
            </div>

            {/* Direct Messages Section */}
            <div className="space-y-1">
              <div className="group flex items-center justify-between px-2 text-xs font-semibold text-[#E3EED4]/70 hover:text-white">
                <button
                  className="flex items-center gap-1 py-1"
                  onClick={() => setDmsExpanded(!dmsExpanded)}
                >
                  {dmsExpanded ? (
                    <ChevronDown className="h-3 w-3" />
                  ) : (
                    <ChevronRight className="h-3 w-3" />
                  )}
                  <span>DIRECT MESSAGES</span>
                </button>
                <button
                  className="opacity-0 group-hover:opacity-100 p-0.5 hover:bg-white/10 rounded hover:text-white transition-all animate-in fade-in-0 duration-200"
                  onClick={() => setActiveModal("start-dm")}
                >
                  <Plus className="h-3.5 w-3.5" />
                </button>
              </div>

              {dmsExpanded && (
                <div className="space-y-[2px]">
                  {dms.length > 0 ? (
                    dms.map((dm) => {
                      const isActive = activeDmId === dm.id;
                      return (
                        <Link
                          key={dm.id}
                          href={`/workspace/${activeWorkspaceId}/dm/${dm.id}`}
                          className={cn(
                            "flex items-center gap-2 px-3 py-1.5 rounded-md text-sm font-medium transition-colors",
                            isActive
                              ? "bg-[#0F2A1D] text-white font-bold"
                              : "hover:bg-white/10 text-[#E3EED4]/85 hover:text-white",
                            dm.unread && !isActive && "text-white font-bold"
                          )}
                        >
                          {dm.isAi ? (
                            <div className="flex h-5 w-5 items-center justify-center rounded-md bg-gradient-to-tr from-violet-500 to-indigo-500 text-white shadow-md shrink-0">
                              <Sparkles className="h-3 w-3" />
                            </div>
                          ) : (
                            <div className="relative shrink-0">
                              <div className={cn(
                                "h-5 w-5 rounded-md flex items-center justify-center text-[10px] font-bold text-white uppercase shadow-sm bg-gradient-to-tr",
                                getUserAvatarColor(dm.name)
                              )}>
                                {dm.name.charAt(0)}
                              </div>
                              <span
                                className={cn(
                                  "absolute bottom-[-2px] right-[-2px] h-2.5 w-2.5 rounded-full border-2 border-[#375534] shrink-0",
                                  dm.online ? "bg-slack-green" : "bg-[#E3EED4]/40"
                                )}
                              />
                            </div>
                          )}
                          <span className="truncate">{dm.name}</span>
                          {dm.unread && !isActive && (
                            <motion.span
                              initial={{ scale: 0.6, opacity: 0 }}
                              animate={{ scale: 1, opacity: 1 }}
                              transition={{ type: "spring", stiffness: 500, damping: 15 }}
                              className="ml-auto flex h-4 min-w-4 items-center justify-center rounded-full bg-rose-500 px-1 text-[9px] font-bold text-white leading-none shadow-sm shrink-0"
                            >
                              1
                            </motion.span>
                          )}
                        </Link>
                      );
                    })
                  ) : (
                    <p className="text-[10px] text-[#E3EED4]/60 px-3 py-1.5 italic animate-in fade-in-0 duration-200">
                      No direct messages yet.
                    </p>
                  )}
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </aside>
  );
}
