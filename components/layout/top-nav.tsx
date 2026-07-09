"use client";

import { useSession, signOut } from "next-auth/react";
import { useTheme } from "next-themes";
import { Menu, Search, Bell, LogOut, Settings, Sun, Moon, Monitor, User, Smile } from "lucide-react";
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
  DropdownMenuGroup,
} from "@/components/ui/dropdown-menu";
import { useParams, useRouter } from "next/navigation";
import { useProfileStore } from "@/hooks/use-profile-store";
import { Switch } from "@/components/ui/switch";
import { toast } from "sonner";

export function TopNav() {
  const { data: session } = useSession();
  const { theme, setTheme } = useTheme();
  const { toggleSidebarOpen, setSearchOpen, setActiveModal } = useLayoutStore();
  const params = useParams();
  const router = useRouter();

  const activeWorkspaceId = params?.workspaceId as string || "default";
  const { displayName: storeDisplayName, avatarPreset, status, dndEnabled, setDndEnabled } = useProfileStore();

  const user = session?.user;
  const email = user?.email || "sammy@workplace.com";

  const handleSignOut = () => {
    toast.success("Signing out...");
    signOut({ callbackUrl: "/sign-in" });
  };

  return (
    <header className="flex h-10 w-full items-center justify-between bg-[#0F2A1D] px-4 text-white border-b border-white/10 select-none">
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
          className="flex h-6 w-full items-center justify-between rounded bg-white/15 px-3 text-xs text-white/80 transition-colors hover:bg-white/20 border-none cursor-pointer"
          onClick={() => setSearchOpen(true)}
        >
          <span className="flex items-center gap-1.5 font-medium">
            <Search className="h-3 w-3" />
            Search Main HQ
          </span>
          <span className="text-[10px] text-white/45 font-semibold bg-white/10 px-1.5 py-0.5 rounded">
            Ctrl+K
          </span>
        </button>
      </div>

      {/* Right side items */}
      <div className="flex flex-1 items-center justify-end gap-3">
        {/* Help bell */}
        <Button
          variant="ghost"
          size="icon"
          className="h-7 w-7 text-white hover:bg-white/10 cursor-pointer"
          onClick={() => toast.info("Help Center is in mock phase.")}
        >
          <Bell className="h-4 w-4" />
        </Button>

        {/* User profile avatar dropdown */}
        <DropdownMenu>
          <DropdownMenuTrigger className="relative h-7 w-7 rounded-md overflow-hidden hover:opacity-90 transition-opacity focus:outline-hidden ring-1 ring-white/20 ring-offset-1 ring-offset-primary cursor-pointer select-none">
            <Avatar className="h-full w-full rounded-md bg-slate-800">
              <AvatarImage src={`https://api.dicebear.com/7.x/bottts/svg?seed=${avatarPreset}`} alt={storeDisplayName} />
              <AvatarFallback className="bg-primary/20 text-white text-xs font-bold rounded-md">
                {storeDisplayName.charAt(0).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            {status && (
              <span className="absolute bottom-[-1px] right-[-1px] flex h-3.5 w-3.5 items-center justify-center rounded-full bg-slate-900 text-[9px] border border-slate-800 leading-none shadow-sm select-none">
                {status.emoji}
              </span>
            )}
            {dndEnabled && (
              <span className="absolute top-[-1px] right-[-1px] h-2 w-2 rounded-full bg-rose-500 border border-slate-900" />
            )}
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-60 border-border" align="end">
            <DropdownMenuGroup>
              <DropdownMenuLabel className="font-normal">
                <div className="flex flex-col space-y-1">
                  <p className="text-sm font-semibold text-foreground truncate">{storeDisplayName}</p>
                  <p className="text-xs text-muted-foreground truncate">{email}</p>
                </div>
              </DropdownMenuLabel>
            </DropdownMenuGroup>
            <DropdownMenuSeparator />
            
            <DropdownMenuGroup>
              {/* Status Item in Dropdown */}
              <DropdownMenuItem className="cursor-pointer py-1.5 text-xs" onClick={() => setActiveModal("custom-status")}>
                <Smile className="mr-2 h-4 w-4 text-muted-foreground" />
                <span className="truncate">{status ? `${status.emoji} ${status.text}` : "Set a status"}</span>
              </DropdownMenuItem>
              
              {/* DND Toggle Item */}
              <div className="flex items-center justify-between px-2 py-1.5 text-xs hover:bg-muted/65 rounded-sm">
                <span className="flex items-center text-foreground font-semibold">
                  <Bell className="mr-2 h-4 w-4 text-muted-foreground" />
                  <span>Pause notifications</span>
                </span>
                <Switch checked={dndEnabled} onCheckedChange={setDndEnabled} />
              </div>
            </DropdownMenuGroup>

            <DropdownMenuSeparator />

            <DropdownMenuGroup>
              <DropdownMenuItem className="cursor-pointer text-xs" onClick={() => setActiveModal("user-profile")}>
                <User className="mr-2 h-4 w-4" />
                <span>My Profile</span>
              </DropdownMenuItem>
              <DropdownMenuItem className="cursor-pointer text-xs" onClick={() => router.push(`/workspace/${activeWorkspaceId}/settings`)}>
                <Settings className="mr-2 h-4 w-4" />
                <span>Workspace Settings</span>
              </DropdownMenuItem>
              <DropdownMenuItem className="cursor-pointer text-xs" onClick={() => setActiveModal("preferences")}>
                <Settings className="mr-2 h-4 w-4" />
                <span>Preferences</span>
              </DropdownMenuItem>
            </DropdownMenuGroup>

            <DropdownMenuSeparator />
            
            {/* Theme Toggle Submenu */}
            <DropdownMenuGroup>
              <DropdownMenuLabel className="text-xs text-muted-foreground font-medium py-1">Theme</DropdownMenuLabel>
              <div className="flex items-center gap-1 p-1 bg-muted/60 rounded-md mx-2 mb-2">
                <button
                  className={`flex-1 flex items-center justify-center p-1 rounded-sm text-xs transition-colors ${theme === "light" ? "bg-background shadow-xs text-foreground" : "text-muted-foreground hover:text-foreground"}`}
                  onClick={() => setTheme("light")}
                >
                  <Sun className="h-3.5 w-3.5" />
                </button>
                <button
                  className={`flex-1 flex items-center justify-center p-1 rounded-sm text-xs transition-colors ${theme === "dark" ? "bg-background shadow-xs text-foreground" : "text-muted-foreground hover:text-foreground"}`}
                  onClick={() => setTheme("dark")}
                >
                  <Moon className="h-3.5 w-3.5" />
                </button>
                <button
                  className={`flex-1 flex items-center justify-center p-1 rounded-sm text-xs transition-colors ${theme === "system" ? "bg-background shadow-xs text-foreground" : "text-muted-foreground hover:text-foreground"}`}
                  onClick={() => setTheme("system")}
                >
                  <Monitor className="h-3.5 w-3.5" />
                </button>
              </div>
            </DropdownMenuGroup>
            
            <DropdownMenuSeparator />
            <DropdownMenuGroup>
              <DropdownMenuItem className="text-rose-600 hover:text-rose-700 cursor-pointer text-xs" onClick={handleSignOut}>
                <LogOut className="mr-2 h-4 w-4" />
                <span>Log out</span>
              </DropdownMenuItem>
            </DropdownMenuGroup>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
