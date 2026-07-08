"use client";

import { ReactNode } from "react";
import { WorkspaceSwitcher } from "@/components/layout/workspace-switcher";
import { AppSidebar } from "@/components/layout/app-sidebar";
import { TopNav } from "@/components/layout/top-nav";
import { useLayoutStore } from "@/hooks/use-layout-store";
import { Sheet, SheetContent, SheetTitle } from "@/components/ui/sheet";

export default function WorkspaceLayout({
  children,
}: {
  children: ReactNode;
}) {
  const { sidebarOpen, setSidebarOpen } = useLayoutStore();

  return (
    <div className="flex h-screen w-full flex-col overflow-hidden bg-background text-foreground font-sans">
      {/* Top Navigation */}
      <TopNav />

      {/* Main Workspace Container */}
      <div className="flex flex-1 w-full overflow-hidden">
        {/* Desktop Switcher & Sidebar */}
        <div className="hidden md:flex h-full shrink-0">
          <WorkspaceSwitcher />
          <AppSidebar />
        </div>

        {/* Mobile Switcher & Sidebar Drawer */}
        <Sheet open={sidebarOpen} onOpenChange={setSidebarOpen}>
          <SheetContent side="left" className="p-0 w-[312px] bg-slate-950 border-r border-slate-900">
            <SheetTitle className="sr-only">Workspace Navigation</SheetTitle>
            <div className="flex h-full w-full">
              <WorkspaceSwitcher />
              <div className="flex-1">
                <AppSidebar />
              </div>
            </div>
          </SheetContent>
        </Sheet>

        {/* Content View Container */}
        <main className="flex flex-1 flex-col overflow-hidden bg-card text-card-foreground">
          {children}
        </main>
      </div>
    </div>
  );
}
