"use client";

import { ReactNode, useEffect } from "react";
import { WorkspaceSwitcher } from "@/components/layout/workspace-switcher";
import { AppSidebar } from "@/components/layout/app-sidebar";
import { TopNav } from "@/components/layout/top-nav";
import { useLayoutStore } from "@/hooks/use-layout-store";
import { Sheet, SheetContent, SheetTitle } from "@/components/ui/sheet";
import { CreateChannelDialog } from "@/components/channels/create-channel-dialog";
import { StartDmDialog } from "@/components/dm/start-dm-dialog";
import { CommandPalette } from "@/components/search/command-palette";
import { NotificationHandler } from "@/components/providers/notification-handler";
import { useNotificationSimulator } from "@/hooks/use-notification-simulator";
import { PreferencesDialog } from "@/components/settings/preferences-dialog";
import { CreateWorkspaceDialog } from "@/components/workspace/create-workspace-dialog";
import { UserProfileDialog } from "@/components/settings/user-profile-dialog";
import { EditProfileDialog } from "@/components/settings/edit-profile-dialog";
import { CustomStatusDialog } from "@/components/settings/custom-status-dialog";

import { useState } from "react";
import { useParams } from "next/navigation";

// Sidebar Skeleton Component
function SidebarSkeleton() {
  return (
    <div className="w-60 h-full bg-[#375534] text-[#E3EED4]/85 border-r border-[#375534]/10 p-4 space-y-6 flex flex-col select-none animate-pulse">
      {/* Workspace Header Skeleton */}
      <div className="flex h-12 items-center justify-between pb-4 border-b border-white/10 shrink-0">
        <div className="h-4 w-24 bg-white/20 rounded-md" />
        <div className="h-6 w-6 bg-white/10 rounded-md" />
      </div>

      {/* Navigation List Skeleton */}
      <div className="flex-1 space-y-6">
        {/* Saved Items */}
        <div className="h-8 w-full bg-white/10 rounded-md" />

        {/* Channels Group */}
        <div className="space-y-3">
          <div className="h-3 w-16 bg-white/20 rounded-md" />
          <div className="space-y-2">
            <div className="h-6 w-full bg-white/10 rounded-md" />
            <div className="h-6 w-3/4 bg-white/10 rounded-md" />
            <div className="h-6 w-5/6 bg-white/10 rounded-md" />
          </div>
        </div>

        {/* DMs Group */}
        <div className="space-y-3">
          <div className="h-3 w-28 bg-white/20 rounded-md" />
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <div className="h-5 w-5 bg-white/25 rounded-md" />
              <div className="h-5 flex-1 bg-white/10 rounded-md" />
            </div>
            <div className="flex items-center gap-2">
              <div className="h-5 w-5 bg-white/25 rounded-md" />
              <div className="h-5 w-2/3 bg-white/10 rounded-md" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// Chat Window Skeleton Component
function ChatWindowSkeleton() {
  return (
    <div className="flex flex-1 flex-col h-full bg-background overflow-hidden animate-pulse select-none">
      {/* Header bar Skeleton */}
      <header className="flex h-12 items-center justify-between border-b border-border px-6 shrink-0 bg-card">
        <div className="flex flex-col gap-1.5 w-1/3">
          <div className="h-4 w-32 bg-[#0F2A1D]/15 rounded-md" />
          <div className="h-2.5 w-48 bg-[#0F2A1D]/10 rounded-md" />
        </div>
        <div className="flex items-center gap-2">
          <div className="h-7 w-7 bg-[#0F2A1D]/10 rounded-md" />
          <div className="h-7 w-16 bg-[#0F2A1D]/10 rounded-md" />
        </div>
      </header>

      {/* Message Feed Skeleton */}
      <div className="flex-1 p-6 space-y-6 overflow-hidden">
        {[1, 2, 3].map((i) => (
          <div key={i} className="flex items-start gap-3">
            <div className="h-9 w-9 bg-[#0F2A1D]/10 rounded-md shrink-0" />
            <div className="flex-1 space-y-2">
              <div className="flex items-baseline gap-2">
                <div className="h-3 w-24 bg-[#0F2A1D]/15 rounded-md" />
                <div className="h-2 w-12 bg-[#0F2A1D]/10 rounded-md" />
              </div>
              <div className="space-y-1.5">
                <div className="h-3.5 w-5/6 bg-[#0F2A1D]/10 rounded-md" />
                <div className="h-3.5 w-2/3 bg-[#0F2A1D]/10 rounded-md" />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Input box Skeleton */}
      <div className="mx-6 mb-6 h-28 bg-[#d0dfbc] border border-border/85 rounded-xl shrink-0" />
    </div>
  );
}

export default function WorkspaceLayout({
  children,
}: {
  children: ReactNode;
}) {
  const params = useParams();
  const workspaceId = params?.workspaceId as string;
  const [isLoading, setIsLoading] = useState(false);

  const { 
    sidebarOpen, 
    setSidebarOpen, 
    threadOpen, 
    closeThread, 
    pinnedOpen, 
    setPinnedOpen, 
    detailsOpen, 
    setDetailsOpen 
  } = useLayoutStore();
  
  useNotificationSimulator();

  // Simulated Loading state when workspaceId shifts
  useEffect(() => {
    if (!workspaceId) return;
    setIsLoading(true);
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 600);
    return () => clearTimeout(timer);
  }, [workspaceId]);

  // Global Keyboard Shortcuts (Escape to close panels, Alt+I to focus input)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Escape closes open panels
      if (e.key === "Escape") {
        if (threadOpen) {
          closeThread();
        } else if (pinnedOpen) {
          setPinnedOpen(false);
        } else if (detailsOpen) {
          setDetailsOpen(false);
        }
      }

      // Alt+I or Option+I focuses message input editor
      if (e.key === "i" && e.altKey) {
        e.preventDefault();
        const editorEl = document.querySelector(".ProseMirror") as HTMLElement;
        if (editorEl) {
          editorEl.focus();
        }
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [threadOpen, closeThread, pinnedOpen, setPinnedOpen, detailsOpen, setDetailsOpen]);

  return (
    <div className="flex h-screen w-full flex-col overflow-hidden bg-background text-foreground font-sans">
      {/* Top Navigation */}
      <TopNav />

      {/* Main Workspace Container */}
      <div className="flex flex-1 w-full overflow-hidden">
        {/* Desktop Switcher & Sidebar */}
        <div className="hidden md:flex h-full shrink-0">
          <WorkspaceSwitcher />
          {isLoading ? <SidebarSkeleton /> : <AppSidebar />}
        </div>

        {/* Mobile Switcher & Sidebar Drawer */}
        <Sheet open={sidebarOpen} onOpenChange={setSidebarOpen}>
          <SheetContent side="left" className="p-0 w-[312px] bg-[#375534] border-r border-[#375534]/10">
            <SheetTitle className="sr-only">Workspace Navigation</SheetTitle>
            <div className="flex h-full w-full">
              <WorkspaceSwitcher />
              <div className="flex-1">
                {isLoading ? <SidebarSkeleton /> : <AppSidebar />}
              </div>
            </div>
          </SheetContent>
        </Sheet>

        {/* Content View Container */}
        <main className="flex flex-1 flex-col overflow-hidden bg-card text-card-foreground">
          {isLoading ? <ChatWindowSkeleton /> : children}
        </main>
      </div>

      {/* Global Action Modals */}
      <CreateChannelDialog />
      <StartDmDialog />
      <CommandPalette />
      <NotificationHandler />
      <PreferencesDialog />
      <CreateWorkspaceDialog />
      <UserProfileDialog />
      <EditProfileDialog />
      <CustomStatusDialog />
    </div>
  );
}
