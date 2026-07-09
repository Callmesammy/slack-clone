"use client";

import { useLayoutStore } from "@/hooks/use-layout-store";
import { useProfileStore } from "@/hooks/use-profile-store";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Mail, Clock, Shield, Smile, PencilLine, Sparkles } from "lucide-react";

export function UserProfileDialog() {
  const { activeModal, setActiveModal } = useLayoutStore();
  const { displayName, title, pronouns, timezone, avatarPreset, status, presence } = useProfileStore();

  const isOpen = activeModal === "user-profile";

  const handleClose = () => {
    setActiveModal(null);
  };

  const handleEditProfile = () => {
    setActiveModal("edit-profile");
  };

  const handleSetStatus = () => {
    setActiveModal("custom-status");
  };

  const initial = displayName.charAt(0).toUpperCase();

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && handleClose()}>
      <DialogContent className="border-slate-800 bg-slate-900 text-white max-w-sm select-none p-0 overflow-hidden">
        {/* Banner color blocks */}
        <div className="h-24 w-full bg-gradient-to-tr from-primary to-violet-600 relative">
          <Badge className="absolute right-4 top-4 bg-slate-950/80 border-slate-800 text-[10px] text-white">
            Owner
          </Badge>
        </div>

        <div className="px-6 pb-6 pt-12 relative space-y-4">
          {/* Floating Avatar */}
          <div className="absolute top-[-40px] left-6 border-4 border-slate-900 rounded-xl bg-slate-800 overflow-hidden shadow-xl">
            <Avatar className="h-20 w-20 rounded-lg">
              <AvatarImage src={`https://api.dicebear.com/7.x/bottts/svg?seed=${avatarPreset}`} />
              <AvatarFallback className="rounded-lg text-xl font-bold bg-primary text-white">
                {initial}
              </AvatarFallback>
            </Avatar>
          </div>

          {/* User Details */}
          <div>
            <div className="flex items-baseline gap-2">
              <h2 className="text-xl font-bold text-white leading-tight">{displayName}</h2>
              <span className="text-xs text-slate-400 font-medium">({pronouns})</span>
            </div>
            <p className="text-xs text-slate-400 font-medium mt-0.5">{title}</p>
          </div>

          {/* Status Indicator Bar */}
          <div className="flex items-center justify-between rounded-lg border border-slate-800 bg-slate-950/40 px-3.5 py-2">
            {status ? (
              <div className="flex items-center gap-2 text-xs font-semibold text-slate-200 truncate">
                <span className="text-base leading-none">{status.emoji}</span>
                <span className="truncate">{status.text}</span>
              </div>
            ) : (
              <div className="flex items-center gap-2 text-xs font-semibold text-slate-500">
                <Smile className="h-4 w-4 text-slate-600" />
                <span>No active status set</span>
              </div>
            )}
            <Button
              variant="ghost"
              size="sm"
              onClick={handleSetStatus}
              className="h-7 text-[10px] font-bold text-primary hover:bg-slate-800 hover:text-white cursor-pointer px-2"
            >
              Update
            </Button>
          </div>

          <hr className="border-slate-800" />

          {/* Meta Information Cards */}
          <div className="space-y-3.5 text-xs text-slate-300">
            {/* Presence status */}
            <div className="flex items-center gap-3">
              <span className={`h-2.5 w-2.5 rounded-full ${presence === "online" ? "bg-slack-green" : presence === "away" ? "bg-amber-500" : "bg-slate-600"}`} />
              <span className="capitalize font-semibold text-slate-200">
                Active presence: {presence}
              </span>
            </div>

            {/* Email */}
            <div className="flex items-center gap-3 text-slate-300">
              <Mail className="h-4 w-4 text-slate-500 shrink-0" />
              <span>sammy@workplace.com</span>
            </div>

            {/* Timezone */}
            <div className="flex items-center gap-3 text-slate-300">
              <Clock className="h-4 w-4 text-slate-500 shrink-0" />
              <span>Local time: {timezone}</span>
            </div>
          </div>

          <hr className="border-slate-800" />

          {/* Dialog Action Footers */}
          <div className="flex items-center gap-2 pt-2">
            <Button
              type="button"
              variant="outline"
              onClick={handleClose}
              className="flex-1 border-slate-800 text-slate-300 hover:bg-slate-800 hover:text-white font-semibold text-xs py-2"
            >
              Close
            </Button>
            <Button
              type="button"
              onClick={handleEditProfile}
              className="flex-1 bg-primary hover:bg-primary/95 text-white font-semibold text-xs py-2 flex items-center justify-center gap-1.5"
            >
              <PencilLine className="h-3.5 w-3.5" />
              <span>Edit Profile</span>
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
