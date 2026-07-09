"use client";

import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useWorkspaceStore } from "@/hooks/use-workspace-store";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Users, Mail, Settings, Copy, Check, ArrowLeft, ShieldAlert, ShieldCheck, UserCheck } from "lucide-react";
import { toast } from "sonner";

interface MemberItem {
  id: string;
  name: string;
  username: string;
  role: "Owner" | "Admin" | "Member";
  avatar: string;
}

const MOCK_MEMBERS: MemberItem[] = [
  { id: "1", name: "Call me Sammy", username: "sammy", role: "Owner", avatar: "preset-1" },
  { id: "2", name: "Alice Wood", username: "alice_w", role: "Admin", avatar: "preset-2" },
  { id: "3", name: "Bob Smith", username: "bob_smith", role: "Member", avatar: "preset-3" },
];

export default function WorkspaceSettingsPage() {
  const params = useParams();
  const router = useRouter();
  const activeWorkspaceId = params?.workspaceId as string || "default";

  const { workspaces, addWorkspace } = useWorkspaceStore();
  const activeWorkspace = workspaces.find((w) => w.id === activeWorkspaceId) || workspaces[0];

  const [workspaceName, setWorkspaceName] = useState(activeWorkspace?.name || "Main HQ");
  const [workspaceDesc, setWorkspaceDesc] = useState("Corporate headquarters chat channel segment.");
  
  const [membersList, setMembersList] = useState<MemberItem[]>(MOCK_MEMBERS);
  const [memberSearch, setMemberSearch] = useState("");
  const [inviteEmail, setInviteEmail] = useState("");
  const [inviteLinkCopied, setInviteLinkCopied] = useState(false);

  const handleCopyInviteLink = () => {
    const link = `${window.location.origin}/join/${activeWorkspaceId}-invite-7a91`;
    navigator.clipboard.writeText(link);
    setInviteLinkCopied(true);
    toast.success("Workspace invitation link copied to clipboard!");
    setTimeout(() => setInviteLinkCopied(false), 2000);
  };

  const handleSendInvite = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inviteEmail.trim()) return;
    toast.success(`Invitation email sent to ${inviteEmail}!`);
    setInviteEmail("");
  };

  const handleUpdateWorkspace = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success("Workspace details updated successfully!");
  };

  const handleChangeRole = (memberId: string, newRole: "Admin" | "Member") => {
    setMembersList((prev) =>
      prev.map((m) => (m.id === memberId ? { ...m, role: newRole } : m))
    );
    toast.success(`Role updated successfully!`);
  };

  const handleRemoveMember = (memberId: string) => {
    setMembersList((prev) => prev.filter((m) => m.id !== memberId));
    toast.success("Teammate removed from workspace.");
  };

  const filteredMembers = membersList.filter(
    (m) =>
      m.name.toLowerCase().includes(memberSearch.toLowerCase()) ||
      m.username.toLowerCase().includes(memberSearch.toLowerCase())
  );

  return (
    <div className="flex-1 flex flex-col h-full bg-slate-900/10 overflow-y-auto select-none p-6 md:p-10 max-w-4xl mx-auto w-full scrollbar-thin">
      {/* Header Back links */}
      <div className="flex items-center gap-3 mb-6">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => router.push(`/workspace/${activeWorkspaceId}`)}
          className="h-8 w-8 text-slate-400 hover:text-white hover:bg-slate-800 cursor-pointer"
        >
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <div>
          <h1 className="text-xl font-bold text-white flex items-center gap-2">
            <Settings className="h-5 w-5 text-primary" />
            <span>Workspace Settings</span>
          </h1>
          <p className="text-xs text-slate-400">Configure parameters for {activeWorkspace?.name}.</p>
        </div>
      </div>

      <div className="border border-slate-800/80 bg-slate-950/20 rounded-xl p-6 shadow-xl backdrop-blur-md">
        <Tabs defaultValue="members" className="w-full">
          <TabsList className="bg-slate-950/60 border border-slate-800/60 p-1 w-full md:w-fit grid grid-cols-3 mb-6">
            <TabsTrigger value="members" className="text-xs font-semibold py-1.5 cursor-pointer">
              Members Directory
            </TabsTrigger>
            <TabsTrigger value="invites" className="text-xs font-semibold py-1.5 cursor-pointer">
              Invitation Portal
            </TabsTrigger>
            <TabsTrigger value="info" className="text-xs font-semibold py-1.5 cursor-pointer">
              Workspace Info
            </TabsTrigger>
          </TabsList>

          {/* Members Directory Tab */}
          <TabsContent value="members" className="space-y-4">
            <div className="flex items-center justify-between gap-4">
              <Input
                placeholder="Search teammates by name or username..."
                value={memberSearch}
                onChange={(e) => setMemberSearch(e.target.value)}
                className="border-slate-800 bg-slate-950/40 text-slate-200 text-xs focus-visible:ring-primary"
              />
              <Button
                onClick={handleCopyInviteLink}
                className="bg-primary hover:bg-primary/95 text-white font-semibold text-xs py-2 shrink-0 cursor-pointer"
              >
                <Users className="mr-1.5 h-3.5 w-3.5" />
                <span>Invite New</span>
              </Button>
            </div>

            <div className="rounded-lg border border-slate-800 bg-slate-950/30 divide-y divide-slate-850 overflow-hidden">
              {filteredMembers.length > 0 ? (
                filteredMembers.map((member) => (
                  <div key={member.id} className="flex items-center justify-between p-3.5 hover:bg-slate-900/10">
                    <div className="flex items-center gap-3 min-w-0">
                      <Avatar className="h-9 w-9 rounded-md bg-slate-800">
                        <AvatarImage src={`https://api.dicebear.com/7.x/bottts/svg?seed=${member.id}`} />
                        <AvatarFallback className="rounded-md font-bold bg-primary text-white">
                          {member.name.charAt(0)}
                        </AvatarFallback>
                      </Avatar>
                      <div className="min-w-0">
                        <div className="flex items-center gap-1.5">
                          <p className="text-sm font-semibold text-white truncate">{member.name}</p>
                          <span className="text-[10px] text-slate-400 font-medium">@{member.username}</span>
                        </div>
                        <p className="text-[10px] text-slate-500 font-medium capitalize flex items-center gap-1">
                          {member.role === "Owner" ? (
                            <ShieldAlert className="h-3 w-3 text-rose-500" />
                          ) : member.role === "Admin" ? (
                            <ShieldCheck className="h-3 w-3 text-amber-500" />
                          ) : (
                            <UserCheck className="h-3 w-3 text-emerald-500" />
                          )}
                          <span>{member.role}</span>
                        </p>
                      </div>
                    </div>

                    {/* Role Dropdown Modifier */}
                    {member.role !== "Owner" && (
                      <DropdownMenu>
                        <DropdownMenuTrigger className="h-8 px-3 rounded bg-transparent hover:bg-slate-800 text-xs font-semibold text-slate-400 hover:text-white transition-colors cursor-pointer select-none">
                          Manage
                        </DropdownMenuTrigger>
                        <DropdownMenuContent className="bg-slate-900 border-slate-800 text-slate-200" align="end">
                          <DropdownMenuItem
                            onClick={() => handleChangeRole(member.id, "Admin")}
                            className="text-xs hover:bg-slate-800 focus:bg-slate-800 focus:text-white cursor-pointer"
                          >
                            Make Admin
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => handleChangeRole(member.id, "Member")}
                            className="text-xs hover:bg-slate-800 focus:bg-slate-800 focus:text-white cursor-pointer"
                          >
                            Make Member
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => handleRemoveMember(member.id)}
                            className="text-xs hover:bg-rose-950/60 hover:text-rose-200 focus:bg-rose-950/60 focus:text-rose-200 text-rose-400 cursor-pointer"
                          >
                            Remove teammate
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    )}
                  </div>
                ))
              ) : (
                <div className="p-8 text-center text-slate-500 text-xs font-semibold">
                  No teammates match your search query.
                </div>
              )}
            </div>
          </TabsContent>

          {/* Invitation Portal Tab */}
          <TabsContent value="invites" className="space-y-6">
            {/* Link Copy Card */}
            <div className="rounded-lg border border-slate-800 bg-slate-950/20 p-5 space-y-3">
              <div>
                <h3 className="text-sm font-semibold text-slate-200">Share Invitation Link</h3>
                <p className="text-xs text-slate-500">Copy this secure link to allow external members to join your workspace automatically.</p>
              </div>
              <div className="flex gap-2">
                <Input
                  readOnly
                  value={`${window.location.origin}/join/${activeWorkspaceId}-invite-7a91`}
                  className="border-slate-800 bg-slate-950/60 text-slate-400 text-xs select-all focus-visible:ring-0"
                />
                <Button
                  onClick={handleCopyInviteLink}
                  className="bg-primary hover:bg-primary/95 text-white font-semibold text-xs shrink-0 cursor-pointer flex items-center justify-center h-10 w-10 p-0"
                >
                  {inviteLinkCopied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                </Button>
              </div>
            </div>

            {/* Email Direct Form */}
            <form onSubmit={handleSendInvite} className="rounded-lg border border-slate-800 bg-slate-950/20 p-5 space-y-4">
              <div>
                <h3 className="text-sm font-semibold text-slate-200">Invite via Email</h3>
                <p className="text-xs text-slate-500">Send an invitation email directly to a teammate.</p>
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="invite-email" className="text-xs font-semibold text-slate-300">Email Address</Label>
                <div className="flex gap-2">
                  <Input
                    id="invite-email"
                    type="email"
                    placeholder="teammate@example.com"
                    value={inviteEmail}
                    onChange={(e) => setInviteEmail(e.target.value)}
                    className="border-slate-800 bg-slate-950/60 text-white text-xs focus-visible:ring-primary"
                  />
                  <Button
                    type="submit"
                    className="bg-primary hover:bg-primary/95 text-white font-semibold text-xs shrink-0 cursor-pointer"
                  >
                    <Mail className="mr-1.5 h-3.5 w-3.5" />
                    <span>Send Invite</span>
                  </Button>
                </div>
              </div>
            </form>
          </TabsContent>

          {/* Workspace Info Tab */}
          <TabsContent value="info">
            <form onSubmit={handleUpdateWorkspace} className="space-y-4">
              {/* Workspace Name */}
              <div className="space-y-1">
                <Label htmlFor="setting-name" className="text-sm font-semibold text-slate-300">
                  Workspace Name
                </Label>
                <Input
                  id="setting-name"
                  value={workspaceName}
                  onChange={(e) => setWorkspaceName(e.target.value)}
                  className="border-slate-800 bg-slate-950/60 text-white text-xs focus-visible:ring-primary"
                />
              </div>

              {/* Workspace Description */}
              <div className="space-y-1">
                <Label htmlFor="setting-desc" className="text-sm font-semibold text-slate-300">
                  Description
                </Label>
                <Textarea
                  id="setting-desc"
                  value={workspaceDesc}
                  onChange={(e) => setWorkspaceDesc(e.target.value)}
                  className="border-slate-800 bg-slate-950/60 text-white text-xs min-h-[80px] max-h-[140px] focus-visible:ring-primary"
                />
              </div>

              <div className="pt-2">
                <Button
                  type="submit"
                  className="bg-primary hover:bg-primary/95 text-white font-semibold text-xs py-2 px-4 cursor-pointer"
                >
                  Save Changes
                </Button>
              </div>
            </form>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
