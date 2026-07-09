"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { Plus, Compass, Settings } from "lucide-react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

import { useWorkspaceStore } from "@/hooks/use-workspace-store";
import { useLayoutStore } from "@/hooks/use-layout-store";

export function WorkspaceSwitcher() {
  const params = useParams();
  const activeId = params?.workspaceId as string || "default";
  const { workspaces } = useWorkspaceStore();
  const { setActiveModal } = useLayoutStore();

  return (
    <TooltipProvider>
      <div className="flex h-full w-[72px] flex-col items-center gap-4 bg-[#0F2A1D] py-4 text-white border-r border-white/10 select-none">
        {/* Workspace List */}
        <div className="flex flex-1 flex-col items-center gap-3 w-full">
          {workspaces.map((workspace) => {
            const isActive = workspace.id === activeId;
            return (
              <div key={workspace.id} className="group relative flex items-center justify-center w-full">
                {/* Selector indicator pill */}
                <div
                  className={cn(
                    "absolute left-0 w-1 rounded-r-full bg-white transition-all duration-300",
                    isActive ? "h-8" : "h-0 group-hover:h-4"
                  )}
                />
                
                <Tooltip>
                  <TooltipTrigger
                    render={
                      <Link
                        href={`/workspace/${workspace.id}`}
                        className={cn(
                          "relative flex h-12 w-12 items-center justify-center rounded-[24px] bg-slate-800 font-semibold text-lg transition-all duration-300 hover:rounded-xl bg-gradient-to-tr",
                          isActive 
                            ? "rounded-xl text-white shadow-lg shadow-primary/20 scale-100" 
                            : "text-slate-400 hover:text-white hover:scale-105",
                          workspace.color
                        )}
                      />
                    }
                  >
                    {workspace.initial}
                  </TooltipTrigger>
                  <TooltipContent side="right" sideOffset={12} className="bg-slate-900 border-slate-800 text-slate-100 font-medium">
                    {workspace.name}
                  </TooltipContent>
                </Tooltip>
              </div>
            );
          })}

          <div className="h-[1px] w-8 bg-slate-800 my-1" />

          {/* Add Workspace Button */}
          <div className="group relative flex items-center justify-center w-full">
            <div className="absolute left-0 w-1 rounded-r-full bg-white h-0 group-hover:h-4 transition-all duration-300" />
            <Tooltip>
              <TooltipTrigger
                render={
                  <button
                    className="flex h-12 w-12 items-center justify-center rounded-[24px] bg-[#0F2A1D]/50 border border-dashed border-white/20 text-[#E3EED4]/80 transition-all duration-300 hover:rounded-xl hover:bg-[#375534] hover:border-white/40 hover:text-white hover:scale-105 cursor-pointer"
                    onClick={() => setActiveModal("create-workspace")}
                  />
                }
              >
                <Plus className="h-5 w-5" />
              </TooltipTrigger>
              <TooltipContent side="right" sideOffset={12} className="bg-slate-900 border-slate-800 text-slate-100 font-medium">
                Add Workspace
              </TooltipContent>
            </Tooltip>
          </div>
        </div>

        {/* Global/Footer items in switcher */}
        <div className="flex flex-col gap-3 items-center w-full">
          <Tooltip>
            <TooltipTrigger
              render={
                <Link
                  href="#"
                  className="flex h-12 w-12 items-center justify-center rounded-[24px] bg-[#0F2A1D]/50 border border-white/15 text-[#E3EED4]/80 transition-all duration-300 hover:rounded-xl hover:bg-[#375534] hover:text-white hover:scale-105"
                />
              }
            >
              <Compass className="h-5 w-5" />
            </TooltipTrigger>
            <TooltipContent side="right" sideOffset={12} className="bg-slate-900 border-slate-800 text-slate-100 font-medium">
              Explore Channels
            </TooltipContent>
          </Tooltip>
        </div>
      </div>
    </TooltipProvider>
  );
}
