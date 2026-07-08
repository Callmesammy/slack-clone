"use client";

import { useState } from "react";
import Link from "next/link";
import { useParams, usePathname } from "next/navigation";
import { Hash, Lock, MessageSquare, ChevronDown, ChevronRight, Plus, Circle, Sparkles } from "lucide-react";
import { useLayoutStore } from "@/hooks/use-layout-store";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

// Mock sidebar lists for frontend phase
const MOCK_CHANNELS = [
  { id: "general", name: "general", isPrivate: false, unread: false },
  { id: "random", name: "random", isPrivate: false, unread: false },
  { id: "announcements", name: "announcements", isPrivate: true, unread: true },
];

const MOCK_DMS = [
  { id: "ai-bot", name: "AI Assistant", isAi: true, online: true, unread: false },
  { id: "alice", name: "alice_w", online: true, unread: true },
  { id: "bob", name: "bob_smith", online: false, unread: false },
];

export function AppSidebar() {
  const params = useParams();
  const pathname = usePathname();
  const { sidebarCollapsed, toggleSidebarCollapsed } = useLayoutStore();

  const [channelsExpanded, setChannelsExpanded] = useState(true);
  const [dmsExpanded, setDmsExpanded] = useState(true);

  const activeWorkspaceId = params?.workspaceId as string || "default";
  const activeChannelId = params?.channelId as string;
  const activeDmId = params?.conversationId as string;

  return (
    <aside
      className={cn(
        "flex h-full flex-col bg-sidebar text-sidebar-foreground border-r border-sidebar-border transition-all duration-300 select-none",
        sidebarCollapsed ? "w-0 overflow-hidden md:w-12" : "w-60"
      )}
    >
      {/* Header section (Workspace Name) */}
      <div className="flex h-12 items-center justify-between px-4 border-b border-sidebar-border/30">
        {!sidebarCollapsed ? (
          <>
            <span className="font-bold text-base text-white truncate">Main HQ</span>
            <Button
              variant="ghost"
              size="icon"
              className="h-7 w-7 text-sidebar-foreground hover:bg-sidebar-accent hover:text-white"
              onClick={() => toast.info("Workspace menu dropdown in Phase 10.")}
            >
              <ChevronDown className="h-4 w-4" />
            </Button>
          </>
        ) : (
          <div className="mx-auto flex h-8 w-8 items-center justify-center rounded-lg bg-sidebar-accent font-bold text-white text-sm">
            M
          </div>
        )}
      </div>

      {/* Navigation List (Scrollable) */}
      <div className="flex-1 overflow-y-auto px-2 py-4 space-y-4 scrollbar-thin scrollbar-thumb-sidebar-border">
        {/* If sidebar is collapsed, we show minimized icon triggers */}
        {sidebarCollapsed ? (
          <div className="flex flex-col items-center gap-4">
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 text-sidebar-foreground hover:bg-sidebar-accent hover:text-white"
              onClick={toggleSidebarCollapsed}
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        ) : (
          <>
            {/* Collapse/Expand Toggle arrow */}
            <div className="flex items-center justify-between mb-4">
              <Button
                variant="ghost"
                size="sm"
                className="h-6 px-1.5 text-xs text-sidebar-foreground/70 hover:bg-sidebar-accent hover:text-white justify-start gap-1"
                onClick={toggleSidebarCollapsed}
              >
                <ChevronRight className="h-3 w-3 rotate-180" />
                Collapse Side Nav
              </Button>
            </div>

            {/* Channels Section */}
            <div className="space-y-1">
              <div className="group flex items-center justify-between px-2 text-xs font-semibold text-sidebar-foreground/60 hover:text-sidebar-foreground">
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
                  className="opacity-0 group-hover:opacity-100 p-0.5 hover:bg-sidebar-accent rounded hover:text-white transition-all"
                  onClick={() => toast.info("Create channel form in Phase 4.")}
                >
                  <Plus className="h-3.5 w-3.5" />
                </button>
              </div>

              {channelsExpanded && (
                <div className="space-y-[2px]">
                  {MOCK_CHANNELS.map((channel) => {
                    const isActive = activeChannelId === channel.id;
                    return (
                      <Link
                        key={channel.id}
                        href={`/workspace/${activeWorkspaceId}/channel/${channel.id}`}
                        className={cn(
                          "flex items-center gap-2 px-3 py-1.5 rounded-md text-sm font-medium transition-colors",
                          isActive
                            ? "bg-sidebar-accent text-white"
                            : "hover:bg-sidebar-accent/50 text-sidebar-foreground/80 hover:text-white",
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
                          <span className="ml-auto h-2 w-2 rounded-full bg-slack-green" />
                        )}
                      </Link>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Direct Messages Section */}
            <div className="space-y-1">
              <div className="group flex items-center justify-between px-2 text-xs font-semibold text-sidebar-foreground/60 hover:text-sidebar-foreground">
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
                  className="opacity-0 group-hover:opacity-100 p-0.5 hover:bg-sidebar-accent rounded hover:text-white transition-all"
                  onClick={() => toast.info("Start DM conversation in Phase 4.")}
                >
                  <Plus className="h-3.5 w-3.5" />
                </button>
              </div>

              {dmsExpanded && (
                <div className="space-y-[2px]">
                  {MOCK_DMS.map((dm) => {
                    const isActive = activeDmId === dm.id;
                    return (
                      <Link
                        key={dm.id}
                        href={`/workspace/${activeWorkspaceId}/dm/${dm.id}`}
                        className={cn(
                          "flex items-center gap-2 px-3 py-1.5 rounded-md text-sm font-medium transition-colors",
                          isActive
                            ? "bg-sidebar-accent text-white"
                            : "hover:bg-sidebar-accent/50 text-sidebar-foreground/80 hover:text-white",
                          dm.unread && !isActive && "text-white font-bold"
                        )}
                      >
                        {dm.isAi ? (
                          <div className="flex h-4 w-4 items-center justify-center rounded-sm bg-gradient-to-tr from-violet-500 to-indigo-500 text-white shadow-sm shrink-0">
                            <Sparkles className="h-2.5 w-2.5" />
                          </div>
                        ) : (
                          <div className="relative shrink-0">
                            <div className="h-4 w-4 rounded bg-slate-700 flex items-center justify-center text-[10px] font-bold text-white uppercase">
                              {dm.name.charAt(0)}
                            </div>
                            <span
                              className={cn(
                                "absolute bottom-[-2px] right-[-2px] h-2 w-2 rounded-full border border-sidebar shrink-0",
                                dm.online ? "bg-slack-green" : "bg-sidebar-foreground/30"
                              )}
                            />
                          </div>
                        )}
                        <span className="truncate">{dm.name}</span>
                        {dm.unread && !isActive && (
                          <span className="ml-auto h-2 w-2 rounded-full bg-slack-green animate-pulse" />
                        )}
                      </Link>
                    );
                  })}
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </aside>
  );
}
