"use client";

import { useSession, signOut } from "next-auth/react";
import { useTheme } from "next-themes";
import { Menu, Search, Bell, LogOut, Settings, Sun, Moon, Monitor, User } from "lucide-react";
import { useLayoutStore } from "@/hooks/use-layout-store";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { toast } from "sonner";

export function TopNav() {
  const { data: session } = useSession();
  const { theme, setTheme } = useTheme();
  const { toggleSidebarOpen } = useLayoutStore();

  const user = session?.user;
  const displayName = user?.name || "User";
  const email = user?.email || "";
  const avatarUrl = user?.image || "";
  const initial = displayName.charAt(0).toUpperCase();

  const handleSignOut = () => {
    toast.success("Signing out...");
    signOut({ callbackUrl: "/sign-in" });
  };

  return (
    <header className="flex h-10 w-full items-center justify-between bg-primary px-4 text-white border-b border-primary/20 select-none">
      {/* Left: Mobile hamburger trigger */}
      <div className="flex items-center gap-2 md:hidden">
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8 text-white hover:bg-white/10"
          onClick={toggleSidebarOpen}
        >
          <Menu className="h-4 w-4" />
        </Button>
      </div>

      <div className="hidden md:flex flex-1" />

      {/* Center: Search switcher trigger */}
      <div className="flex flex-1 max-w-[400px] justify-center">
        <button
          className="flex h-6 w-full items-center justify-between rounded bg-white/10 px-3 text-xs text-slate-200 transition-colors hover:bg-white/15 border border-white/5"
          onClick={() => toast.info("Search search/switcher is in mock phase. Try Cmd+K (Phase 8).")}
        >
          <span className="flex items-center gap-1.5 font-medium">
            <Search className="h-3 w-3" />
            Search Main HQ
          </span>
          <kbd className="pointer-events-none hidden h-4 select-none items-center gap-1 rounded bg-white/20 px-1 font-mono text-[9px] font-bold text-white sm:flex">
            <span>⌘</span>K
          </kbd>
        </button>
      </div>

      {/* Right: Notifications & Profile */}
      <div className="flex flex-1 items-center justify-end gap-2">
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8 rounded-full text-white hover:bg-white/10 relative"
          onClick={() => toast.info("Notifications will be wired in Phase 9.")}
        >
          <Bell className="h-4 w-4" />
          <span className="absolute top-1 right-1 h-1.5 w-1.5 rounded-full bg-rose-500" />
        </Button>

        {/* User Dropdown */}
        <DropdownMenu>
          <DropdownMenuTrigger>
            <Button variant="ghost" className="relative h-7 w-7 rounded-full p-0 overflow-hidden ring-1 ring-white/20 ring-offset-1 ring-offset-primary">
              <Avatar className="h-full w-full">
                <AvatarImage src={avatarUrl} alt={displayName} />
                <AvatarFallback className="bg-primary/20 text-white text-xs font-bold">
                  {initial}
                </AvatarFallback>
              </Avatar>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-56 bg-slate-900 border-slate-800 text-slate-200" align="end">
            <DropdownMenuLabel className="font-normal">
              <div className="flex flex-col space-y-1">
                <p className="text-sm font-semibold text-white">{displayName}</p>
                <p className="text-xs text-slate-400 truncate">{email}</p>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator className="bg-slate-800" />
            <DropdownMenuItem className="hover:bg-slate-800 focus:bg-slate-800 focus:text-white cursor-pointer" onClick={() => toast.info("Profile settings modal in Phase 10.")}>
              <User className="mr-2 h-4 w-4" />
              <span>My Profile</span>
            </DropdownMenuItem>
            <DropdownMenuItem className="hover:bg-slate-800 focus:bg-slate-800 focus:text-white cursor-pointer" onClick={() => toast.info("Workspace settings in Phase 10.")}>
              <Settings className="mr-2 h-4 w-4" />
              <span>Workspace Settings</span>
            </DropdownMenuItem>
            <DropdownMenuSeparator className="bg-slate-800" />
            
            {/* Theme Toggle Submenu */}
            <DropdownMenuLabel className="text-xs text-slate-400 font-medium py-1">Theme</DropdownMenuLabel>
            <div className="flex items-center gap-1 p-1 bg-slate-950/60 rounded-md mx-2 mb-2">
              <button
                className={`flex-1 flex items-center justify-center p-1 rounded-sm text-xs transition-colors ${theme === "light" ? "bg-slate-800 text-white" : "text-slate-400 hover:text-slate-200"}`}
                onClick={() => setTheme("light")}
              >
                <Sun className="h-3.5 w-3.5" />
              </button>
              <button
                className={`flex-1 flex items-center justify-center p-1 rounded-sm text-xs transition-colors ${theme === "dark" ? "bg-slate-800 text-white" : "text-slate-400 hover:text-slate-200"}`}
                onClick={() => setTheme("dark")}
              >
                <Moon className="h-3.5 w-3.5" />
              </button>
              <button
                className={`flex-1 flex items-center justify-center p-1 rounded-sm text-xs transition-colors ${theme === "system" ? "bg-slate-800 text-white" : "text-slate-400 hover:text-slate-200"}`}
                onClick={() => setTheme("system")}
              >
                <Monitor className="h-3.5 w-3.5" />
              </button>
            </div>
            
            <DropdownMenuSeparator className="bg-slate-800" />
            <DropdownMenuItem className="hover:bg-rose-950/50 hover:text-rose-200 focus:bg-rose-950/50 focus:text-rose-200 text-rose-400 cursor-pointer" onClick={handleSignOut}>
              <LogOut className="mr-2 h-4 w-4" />
              <span>Log out</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
