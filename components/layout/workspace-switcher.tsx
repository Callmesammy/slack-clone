"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { Plus, Compass, Settings } from "lucide-react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

// Mock workspaces data for frontend-only phase
const MOCK_WORKSPACES = [
  { id: "default", name: "Main HQ", initial: "M", color: "from-primary to-slack-blue" },
  { id: "marketing", name: "Marketing Campaign", initial: "M", color: "from-orange-500 to-rose-500" },
  { id: "engineering", name: "Engineering Team", initial: "E", color: "from-emerald-500 to-teal-500" },
];

export function WorkspaceSwitcher() {
  const params = useParams();
  const activeId = params?.workspaceId as string || "default";

  return (
    <TooltipProvider>
      <div className="flex h-full w-[72px] flex-col items-center gap-4 bg-slate-950 py-4 text-white border-r border-slate-900 select-none">
        {/* Workspace List */}
        <div className="flex flex-1 flex-col items-center gap-3 w-full">
          {MOCK_WORKSPACES.map((workspace) => {
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
                  <TooltipTrigger>
                    <Link
                      href={`/workspace/${workspace.id}`}
                      className={cn(
                        "relative flex h-12 w-12 items-center justify-center rounded-[24px] bg-slate-800 font-semibold text-lg transition-all duration-300 hover:rounded-xl bg-gradient-to-tr",
                        isActive 
                          ? "rounded-xl text-white shadow-lg shadow-primary/20 scale-100" 
                          : "text-slate-400 hover:text-white hover:scale-105",
                        workspace.color
                      )}
                    >
                      {workspace.initial}
                    </Link>
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
              <TooltipTrigger>
                <button
                  className="flex h-12 w-12 items-center justify-center rounded-[24px] bg-slate-900 border border-dashed border-slate-700 text-slate-400 transition-all duration-300 hover:rounded-xl hover:bg-slate-800 hover:border-slate-500 hover:text-white hover:scale-105"
                  onClick={() => toast.info("Creating workspaces is not implemented yet.")}
                >
                  <Plus className="h-5 w-5" />
                </button>
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
            <TooltipTrigger>
              <Link
                href="#"
                className="flex h-12 w-12 items-center justify-center rounded-[24px] bg-slate-900 border border-slate-800 text-slate-400 transition-all duration-300 hover:rounded-xl hover:bg-slate-800 hover:text-white hover:scale-105"
              >
                <Compass className="h-5 w-5" />
              </Link>
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
