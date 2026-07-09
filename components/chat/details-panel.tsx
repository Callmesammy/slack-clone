"use client";

import { useState } from "react";
import { X, Info, Users, Edit2, Check, AlertCircle, Hash, Lock, Sparkles, AtSign, Shield, ShieldAlert, MoreVertical } from "lucide-react";
import { motion } from "motion/react";
import { useLayoutStore } from "@/hooks/use-layout-store";
import { useWorkspaceStore } from "@/hooks/use-workspace-store";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";

interface DetailsPanelProps {
  chatId: string;
}

export function DetailsPanel({ chatId }: DetailsPanelProps) {
  const { setDetailsOpen } = useLayoutStore();
  const { channels, dms, updateChannelDetails } = useWorkspaceStore();

  const [members, setMembers] = useState([
    { name: "Alice Wood", username: "alice_w", title: "Product Manager", online: true, role: "Admin", avatar: "" },
    { name: "Bob Smith", username: "bob_smith", title: "Software Engineer", online: false, role: "Member", avatar: "" },
    { name: "Call me Sammy", username: "sammy", title: "Principal Architect", online: true, role: "Owner", avatar: "" },
  ]);

  const handleMakeAdmin = (username: string) => {
    setMembers((prev) =>
      prev.map((m) => (m.username === username ? { ...m, role: "Admin" } : m))
    );
    toast.success("User promoted to Admin");
  };

  const handleRemoveAdmin = (username: string) => {
    setMembers((prev) =>
      prev.map((m) => (m.username === username ? { ...m, role: "Member" } : m))
    );
    toast.success("User demoted to Member");
  };

  const isChannel = channels.some((c) => c.id === chatId);
  const channel = isChannel ? channels.find((c) => c.id === chatId) : null;
  const dm = !isChannel ? dms.find((d) => d.id === chatId) : null;

  // Edit State
  const [isEditing, setIsEditing] = useState(false);
  const [editName, setEditName] = useState(channel?.name || "");
  const [editDescription, setEditDescription] = useState(channel?.description || "");

  // Collapsible sections
  const [aboutOpen, setAboutOpen] = useState(true);
  const [membersOpen, setMembersOpen] = useState(true);

  if (!channel && !dm) return null;

  const handleSaveDetails = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editName.trim()) {
      toast.error("Channel name cannot be empty");
      return;
    }
    updateChannelDetails(chatId, editName, editDescription);
    setIsEditing(false);
    toast.success("Channel details updated");
  };

  return (
    <motion.div
      initial={{ x: "100%", opacity: 0.8 }}
      animate={{ x: 0, opacity: 1 }}
      exit={{ x: "100%", opacity: 0.8 }}
      transition={{ type: "spring", stiffness: 380, damping: 35 }}
      className="w-full md:w-[380px] h-full border-l border-border bg-background flex flex-col overflow-hidden shrink-0 select-none text-foreground"
    >
      {/* Header */}
      <div className="flex h-12 items-center justify-between px-4 border-b border-border bg-card shrink-0">
        <div className="flex items-center gap-2">
          <Info className="h-4 w-4 text-[#0F2A1D]" />
          <span className="text-sm font-bold text-[#0F2A1D]">Details</span>
        </div>
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8 text-[#0F2A1D]/80 hover:bg-[#0F2A1D]/10 hover:text-[#0F2A1D]"
          onClick={() => setDetailsOpen(false)}
        >
          <X className="h-4 w-4" />
        </Button>
      </div>

      {/* Main Body Scroller */}
      <div className="flex-1 overflow-y-auto p-4 space-y-6 scrollbar-thin scrollbar-thumb-border">
        {/* Top summary card */}
        <div className="flex flex-col items-center text-center p-4 bg-[#0F2A1D]/5 border border-border/80 rounded-xl">
          {isChannel ? (
            <>
              <div className="h-12 w-12 rounded-lg bg-muted flex items-center justify-center mb-3">
                {channel?.isPrivate ? (
                  <Lock className="h-6 w-6 text-amber-600" />
                ) : (
                  <Hash className="h-6 w-6 text-primary" />
                )}
              </div>
              <h3 className="font-bold text-base text-foreground">#{channel?.name}</h3>
              <p className="text-xs text-muted-foreground mt-1 max-w-[240px] line-clamp-2">
                {channel?.description || "No description set"}
              </p>
            </>
          ) : (
            <>
              {dm?.isAi ? (
                <div className="h-12 w-12 rounded-lg bg-gradient-to-tr from-violet-500 to-indigo-500 text-white flex items-center justify-center shadow-md mb-3">
                  <Sparkles className="h-6 w-6" />
                </div>
              ) : (
                <div className="relative mb-3">
                  <Avatar className="h-12 w-12 rounded-md ring-2 ring-border">
                    <AvatarFallback className="bg-muted text-foreground text-sm font-bold rounded-md uppercase">
                      {dm?.name.charAt(0)}
                    </AvatarFallback>
                  </Avatar>
                  <span
                    className={cn(
                      "absolute bottom-[-2px] right-[-2px] h-3.5 w-3.5 rounded-full border-2 border-background",
                      dm?.online ? "bg-slack-green" : "bg-muted-foreground/40"
                    )}
                  />
                </div>
              )}
              <h3 className="font-bold text-base text-foreground">
                {dm?.isAi ? "AI Assistant" : dm?.name}
              </h3>
              <span className="text-[10px] bg-muted text-muted-foreground font-semibold px-2 py-0.5 rounded-full mt-2">
                {dm?.isAi ? "System Bot" : dm?.online ? "Online" : "Offline"}
              </span>
            </>
          )}
        </div>

        {/* Channel editable metadata block */}
        {isChannel && (
          <div className="border border-border bg-muted/40 rounded-xl p-4 space-y-4">
            <div className="flex items-center justify-between">
              <h4 className="text-xs font-bold text-muted-foreground uppercase tracking-wider">
                About Channel
              </h4>
              {!isEditing && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    setIsEditing(true);
                    setEditName(channel?.name || "");
                    setEditDescription(channel?.description || "");
                  }}
                  className="h-7 px-2 text-[11px] font-semibold text-primary hover:bg-muted"
                >
                  <Edit2 className="h-3 w-3 mr-1" />
                  Edit
                </Button>
              )}
            </div>

            {isEditing ? (
              <form onSubmit={handleSaveDetails} className="space-y-3.5">
                <div className="space-y-1">
                  <label className="text-[11px] font-semibold text-muted-foreground">Name</label>
                  <div className="relative">
                    <span className="absolute left-3 top-2.5 text-muted-foreground/60">#</span>
                    <Input
                      value={editName}
                      onChange={(e) => setEditName(e.target.value.toLowerCase().replace(/\s+/g, "-"))}
                      className="pl-7 bg-background border-border text-foreground text-sm focus-visible:ring-primary/40 focus-visible:border-border"
                      placeholder="channel-name"
                      required
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-[11px] font-semibold text-muted-foreground">Description</label>
                  <Textarea
                    value={editDescription}
                    onChange={(e) => setEditDescription(e.target.value)}
                    className="bg-background border-border text-foreground text-sm min-h-[70px] resize-none focus-visible:ring-primary/40 focus-visible:border-border"
                    placeholder="What is this channel about?"
                  />
                </div>

                <div className="flex items-center gap-1.5 pt-1">
                  <Button
                    type="submit"
                    size="sm"
                    className="h-7 px-3 text-xs bg-primary hover:bg-primary/90 text-primary-foreground font-medium"
                  >
                    <Check className="h-3 w-3 mr-1" />
                    Save
                  </Button>
                  <Button
                    type="button"
                    size="sm"
                    variant="ghost"
                    onClick={() => setIsEditing(false)}
                    className="h-7 px-3 text-xs text-muted-foreground hover:bg-muted hover:text-foreground"
                  >
                    Cancel
                  </Button>
                </div>
              </form>
            ) : (
              <div className="space-y-3 text-sm">
                <div>
                  <span className="text-[11px] font-semibold text-muted-foreground/80 uppercase">Topic</span>
                  <p className="text-xs text-foreground mt-0.5">
                    {channel?.name === "general"
                      ? "Official Announcements & Sync notes"
                      : "General discussions, links, and workspace chat"}
                  </p>
                </div>
                <div>
                  <span className="text-[11px] font-semibold text-muted-foreground/80 uppercase">Description</span>
                  <p className="text-xs text-foreground mt-0.5">
                    {channel?.description || "No description provided."}
                  </p>
                </div>
                <div>
                  <span className="text-[11px] font-semibold text-muted-foreground/80 uppercase">Visibility</span>
                  <div className="flex items-center gap-1 text-xs text-foreground mt-0.5">
                    {channel?.isPrivate ? (
                      <>
                        <Lock className="h-3 w-3 text-amber-600" />
                        <span>Private Workspace Channel</span>
                      </>
                    ) : (
                      <>
                        <Hash className="h-3 w-3 text-primary" />
                        <span>Public Workspace Channel</span>
                      </>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* DM User metadata block */}
        {!isChannel && (
          <div className="border border-border bg-muted/40 rounded-xl p-4 space-y-3 text-sm">
            <h4 className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-1">
              User Information
            </h4>
            <div>
              <span className="text-[11px] font-semibold text-muted-foreground/80 uppercase">Bio / Title</span>
              <p className="text-xs text-foreground mt-0.5">
                {dm?.isAi
                  ? "Next-gen LLM coding agent with workspace directory search tools."
                  : dm?.name === "alice_w"
                  ? "Senior Product Owner & Designer"
                  : "Senior Technical Lead Engineer"}
              </p>
            </div>
            <div>
              <span className="text-[11px] font-semibold text-muted-foreground/80 uppercase">Timezone</span>
              <p className="text-xs text-foreground mt-0.5">GMT+1 (London, UK)</p>
            </div>
            <div>
              <span className="text-[11px] font-semibold text-muted-foreground/80 uppercase">Handle</span>
              <p className="text-xs text-primary font-medium mt-0.5">@{dm?.name}</p>
            </div>
          </div>
        )}

        {/* Members section (collapsible) */}
        {isChannel && (
          <div className="border border-border bg-muted/40 rounded-xl overflow-hidden">
            <button
              onClick={() => setMembersOpen(!membersOpen)}
              className="flex w-full items-center justify-between p-4 text-xs font-bold text-muted-foreground hover:text-foreground transition-colors"
            >
              <div className="flex items-center gap-2">
                <Users className="h-4 w-4" />
                <span className="uppercase tracking-wider">Members (3)</span>
              </div>
              <span className="text-muted-foreground/60 text-[10px]">
                {membersOpen ? "COLLAPSE" : "EXPAND"}
              </span>
            </button>

            {membersOpen && (
              <div className="border-t border-border px-4 py-2 divide-y divide-border/60">
                {members.map((member) => (
                  <div key={member.username} className="flex items-center justify-between py-2.5 gap-2 group/member">
                    <div className="flex items-center gap-2.5 min-w-0 flex-1">
                      <div className="relative shrink-0">
                        <Avatar className="h-7 w-7 rounded-sm ring-1 ring-border">
                          <AvatarFallback className="bg-muted text-foreground text-[10px] font-bold rounded-sm uppercase">
                            {member.name.charAt(0)}
                          </AvatarFallback>
                        </Avatar>
                        <span
                          className={cn(
                            "absolute bottom-[-1px] right-[-1px] h-2.5 w-2.5 rounded-full border border-background",
                            member.online ? "bg-slack-green" : "bg-muted-foreground/40"
                          )}
                        />
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-1.5 flex-wrap">
                          <p className="text-xs font-bold text-foreground truncate">{member.name}</p>
                          {member.role === "Owner" && (
                            <span className="text-[9px] bg-gradient-to-r from-violet-600 to-indigo-600 text-white font-extrabold px-1 rounded-sm shadow-sm leading-none py-0.5 select-none">
                              Owner
                            </span>
                          )}
                          {member.role === "Admin" && (
                            <span className="text-[9px] bg-gradient-to-r from-amber-500 to-orange-500 text-white font-extrabold px-1 rounded-sm shadow-sm leading-none py-0.5 select-none">
                              Admin
                            </span>
                          )}
                        </div>
                        <p className="text-[10px] text-muted-foreground truncate mt-0.5">{member.title}</p>
                      </div>
                    </div>

                    {/* Make Admin/Remove Admin Dropdown for Non-owners */}
                    {member.role !== "Owner" && (
                      <DropdownMenu>
                        <DropdownMenuTrigger className="opacity-0 group-hover/member:opacity-100 flex h-6 w-6 items-center justify-center rounded text-muted-foreground hover:bg-muted hover:text-foreground cursor-pointer transition-all duration-150 select-none border border-transparent hover:border-border">
                          <MoreVertical className="h-3.5 w-3.5" />
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-40 bg-card border border-border text-foreground">
                          {member.role === "Admin" ? (
                            <DropdownMenuItem
                              onClick={() => handleRemoveAdmin(member.username)}
                              className="cursor-pointer hover:bg-muted focus:bg-muted text-xs gap-1.5 text-rose-600 hover:text-rose-500 focus:text-rose-500"
                            >
                              <ShieldAlert className="h-3.5 w-3.5" />
                              <span>Remove Admin</span>
                            </DropdownMenuItem>
                          ) : (
                            <DropdownMenuItem
                              onClick={() => handleMakeAdmin(member.username)}
                              className="cursor-pointer hover:bg-muted focus:bg-muted text-xs gap-1.5 text-foreground"
                            >
                              <Shield className="h-3.5 w-3.5 text-amber-500" />
                              <span>Make Admin</span>
                            </DropdownMenuItem>
                          )}
                        </DropdownMenuContent>
                      </DropdownMenu>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </motion.div>
  );
}
