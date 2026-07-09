"use client";

import { useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { useLayoutStore } from "@/hooks/use-layout-store";
import { useWorkspaceStore } from "@/hooks/use-workspace-store";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, MessageSquare } from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

// Mock user directory for searching
const MOCK_DIRECTORY = [
  { username: "alice_w", displayName: "Alice Wood", online: true },
  { username: "bob_smith", displayName: "Bob Smith", online: false },
  { username: "charlie_b", displayName: "Charlie Brown", online: true },
  { username: "danielle_k", displayName: "Danielle Kim", online: true },
  { username: "emily_j", displayName: "Emily Johnson", online: false },
];

export function StartDmDialog() {
  const router = useRouter();
  const params = useParams();
  const { activeModal, setActiveModal } = useLayoutStore();
  const { addDm } = useWorkspaceStore();

  const [searchQuery, setSearchQuery] = useState("");
  const isOpen = activeModal === "start-dm";
  const activeWorkspaceId = params?.workspaceId as string || "default";

  const handleClose = () => {
    setSearchQuery("");
    setActiveModal(null);
  };

  const handleSelectUser = (user: typeof MOCK_DIRECTORY[0]) => {
    addDm({
      id: user.username,
      name: user.username,
      online: user.online,
    });

    toast.success(`Conversation with @${user.username} started!`);
    handleClose();
    router.push(`/workspace/${activeWorkspaceId}/dm/${user.username}`);
  };

  const filteredUsers = MOCK_DIRECTORY.filter(
    (user) =>
      user.displayName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.username.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && handleClose()}>
      <DialogContent className="max-w-md p-0 overflow-hidden">
        <DialogHeader className="p-6 pb-0">
          <DialogTitle className="text-xl font-bold">Direct messages</DialogTitle>
          <DialogDescription>
            Start a direct message conversation with someone in your workspace.
          </DialogDescription>
        </DialogHeader>

        {/* Search bar */}
        <div className="px-6 py-4 border-b border-border">
          <div className="relative">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground/60" />
            <Input
              placeholder="Search by name or username"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9 border-border bg-background text-foreground placeholder:text-muted-foreground/60 focus-visible:ring-primary focus-visible:border-primary/50"
            />
          </div>
        </div>

        {/* Users List */}
        <div className="max-h-[300px] overflow-y-auto p-2 space-y-1">
          {filteredUsers.length > 0 ? (
            filteredUsers.map((user) => (
              <button
                key={user.username}
                onClick={() => handleSelectUser(user)}
                className="w-full flex items-center justify-between p-2 rounded-md hover:bg-muted text-left transition-colors group"
              >
                <div className="flex items-center gap-3">
                  <div className="relative">
                    <Avatar className="h-8 w-8 ring-1 ring-border">
                      <AvatarFallback className="bg-muted text-foreground text-xs font-bold uppercase">
                        {user.username.charAt(0)}
                      </AvatarFallback>
                    </Avatar>
                    <span
                      className={cn(
                        "absolute bottom-0 right-0 h-2 w-2 rounded-full border border-background",
                        user.online ? "bg-slack-green" : "bg-muted-foreground/40"
                      )}
                    />
                  </div>
                  <div>
                    <div className="text-sm font-semibold text-foreground group-hover:text-primary transition-colors">
                      {user.displayName}
                    </div>
                    <div className="text-xs text-muted-foreground">@{user.username}</div>
                  </div>
                </div>
                <MessageSquare className="h-4 w-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
              </button>
            ))
          ) : (
            <div className="text-center py-8 text-sm text-muted-foreground">
              No matching users found
            </div>
          )}
        </div>

        <div className="bg-muted/30 p-4 border-t border-border flex justify-end">
          <Button
            variant="ghost"
            onClick={handleClose}
            className="text-muted-foreground hover:bg-muted hover:text-foreground"
          >
            Close
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
