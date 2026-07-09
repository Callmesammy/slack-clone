"use client";

import { useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { useTheme } from "next-themes";
import { Hash, Lock, MessageSquare, Plus, Moon, Sun, Laptop } from "lucide-react";
import { useLayoutStore } from "@/hooks/use-layout-store";
import { useWorkspaceStore } from "@/hooks/use-workspace-store";
import {
  CommandDialog,
  CommandInput,
  CommandList,
  CommandEmpty,
  CommandGroup,
  CommandItem,
  CommandSeparator,
} from "@/components/ui/command";

export function CommandPalette() {
  const router = useRouter();
  const params = useParams();
  const { setTheme } = useTheme();

  const { searchOpen, setSearchOpen, toggleSearchOpen, setActiveModal } = useLayoutStore();
  const { channels, dms } = useWorkspaceStore();

  const activeWorkspaceId = params?.workspaceId as string || "default";

  // Bind keyboard listener Ctrl+K or Cmd+K
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        toggleSearchOpen();
      }
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [toggleSearchOpen]);

  const handleNavigate = (path: string) => {
    setSearchOpen(false);
    router.push(path);
  };

  const handleAction = (modalType: "create-channel" | "start-dm") => {
    setSearchOpen(false);
    setActiveModal(modalType);
  };

  return (
    <CommandDialog
      open={searchOpen}
      onOpenChange={setSearchOpen}
      title="Search and Navigation Palette"
      description="Quick jump to channels, DMs, or control system preferences."
    >
      <CommandInput placeholder="Search channels, direct messages, or settings..." />
      <CommandList className="scrollbar-thin scrollbar-thumb-border text-foreground">
        <CommandEmpty className="text-muted-foreground py-6 text-center text-sm">No matches found.</CommandEmpty>
        
        {/* Navigation Channels Group */}
        <CommandGroup heading="Channels" className="text-muted-foreground font-semibold px-2">
          {channels.map((channel) => (
            <CommandItem
              key={channel.id}
              value={channel.name}
              onSelect={() => handleNavigate(`/workspace/${activeWorkspaceId}/channel/${channel.id}`)}
              className="text-foreground hover:bg-muted focus:bg-muted focus:text-foreground cursor-pointer rounded-lg"
            >
              {channel.isPrivate ? (
                <Lock className="mr-2 h-4 w-4 text-muted-foreground/80 shrink-0" />
              ) : (
                <Hash className="mr-2 h-4 w-4 text-muted-foreground/80 shrink-0" />
              )}
              <span className="truncate">{channel.name}</span>
            </CommandItem>
          ))}
        </CommandGroup>
        
        <CommandSeparator className="bg-border/60" />

        {/* Navigation DMs Group */}
        <CommandGroup heading="Direct Messages" className="text-muted-foreground font-semibold px-2">
          {dms.map((dm) => (
            <CommandItem
              key={dm.id}
              value={dm.name}
              onSelect={() => handleNavigate(`/workspace/${activeWorkspaceId}/dm/${dm.id}`)}
              className="text-foreground hover:bg-muted focus:bg-muted focus:text-foreground cursor-pointer rounded-lg"
            >
              <MessageSquare className="mr-2 h-4 w-4 text-muted-foreground/80 shrink-0" />
              <span className="truncate">{dm.name}</span>
            </CommandItem>
          ))}
        </CommandGroup>

        <CommandSeparator className="bg-border/60" />

        {/* Actions Shortcuts Group */}
        <CommandGroup heading="Quick Actions" className="text-muted-foreground font-semibold px-2">
          <CommandItem
            value="create channel"
            onSelect={() => handleAction("create-channel")}
            className="text-foreground hover:bg-muted focus:bg-muted focus:text-foreground cursor-pointer rounded-lg"
          >
            <Plus className="mr-2 h-4 w-4 text-muted-foreground/80 shrink-0" />
            <span>Create a new channel</span>
          </CommandItem>
          <CommandItem
            value="direct message start"
            onSelect={() => handleAction("start-dm")}
            className="text-foreground hover:bg-muted focus:bg-muted focus:text-foreground cursor-pointer rounded-lg"
          >
            <Plus className="mr-2 h-4 w-4 text-muted-foreground/80 shrink-0" />
            <span>Start a direct message conversation</span>
          </CommandItem>
        </CommandGroup>

        <CommandSeparator className="bg-border/60" />

        {/* System Settings Group */}
        <CommandGroup heading="Preferences" className="text-muted-foreground font-semibold px-2">
          <CommandItem
            value="theme light mode"
            onSelect={() => {
              setTheme("light");
              setSearchOpen(false);
            }}
            className="text-foreground hover:bg-muted focus:bg-muted focus:text-foreground cursor-pointer rounded-lg"
          >
            <Sun className="mr-2 h-4 w-4 text-muted-foreground/80 shrink-0" />
            <span>Theme: Light Mode</span>
          </CommandItem>
          <CommandItem
            value="theme dark mode"
            onSelect={() => {
              setTheme("dark");
              setSearchOpen(false);
            }}
            className="text-foreground hover:bg-muted focus:bg-muted focus:text-foreground cursor-pointer rounded-lg"
          >
            <Moon className="mr-2 h-4 w-4 text-muted-foreground/80 shrink-0" />
            <span>Theme: Dark Mode</span>
          </CommandItem>
          <CommandItem
            value="theme system sync"
            onSelect={() => {
              setTheme("system");
              setSearchOpen(false);
            }}
            className="text-foreground hover:bg-muted focus:bg-muted focus:text-foreground cursor-pointer rounded-lg"
          >
            <Laptop className="mr-2 h-4 w-4 text-muted-foreground/80 shrink-0" />
            <span>Theme: Sync with system settings</span>
          </CommandItem>
        </CommandGroup>
      </CommandList>
    </CommandDialog>
  );
}
