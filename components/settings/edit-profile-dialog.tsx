"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useLayoutStore } from "@/hooks/use-layout-store";
import { useProfileStore } from "@/hooks/use-profile-store";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { useState } from "react";

const editProfileSchema = z.object({
  displayName: z
    .string()
    .min(3, "Display name must be at least 3 characters")
    .max(25, "Display name must be less than 25 characters"),
  title: z.string().max(40, "Title must be under 40 characters").optional(),
  pronouns: z.string().max(15, "Pronouns must be under 15 characters").optional(),
  timezone: z.string().max(25, "Timezone must be under 25 characters").optional(),
});

type EditProfileValues = z.infer<typeof editProfileSchema>;

const AVATAR_PRESETS = [
  "avatar-1",
  "avatar-2",
  "avatar-3",
  "avatar-4",
  "avatar-5",
];

export function EditProfileDialog() {
  const { activeModal, setActiveModal } = useLayoutStore();
  const { displayName, title, pronouns, timezone, avatarPreset, updateProfile } = useProfileStore();
  const [selectedAvatar, setSelectedAvatar] = useState(avatarPreset);

  const isOpen = activeModal === "edit-profile";

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<EditProfileValues>({
    resolver: zodResolver(editProfileSchema),
    values: {
      displayName,
      title: title || "",
      pronouns: pronouns || "",
      timezone: timezone || "",
    },
  });

  const handleClose = () => {
    setActiveModal(null);
  };

  const onSubmit = async (values: EditProfileValues) => {
    try {
      updateProfile({
        displayName: values.displayName,
        title: values.title || "",
        pronouns: values.pronouns || "",
        timezone: values.timezone || "",
        avatarPreset: selectedAvatar,
      });

      toast.success("Profile updated successfully!");
      setActiveModal("user-profile"); // navigate back to profile summary card
    } catch {
      toast.error("Failed to update profile. Try again.");
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && handleClose()}>
      <DialogContent className="max-w-md select-none border-border">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold text-foreground">Edit Profile</DialogTitle>
          <DialogDescription className="text-muted-foreground">
            Edit your display name, role title, and select a bot avatar preset.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 py-2">
          {/* Avatar Presets Grid */}
          <div className="space-y-2">
            <Label className="text-sm font-semibold text-foreground">Select Avatar Preset</Label>
            <div className="flex gap-3 items-center">
              {AVATAR_PRESETS.map((preset) => {
                const isSelected = preset === selectedAvatar;
                return (
                  <button
                    key={preset}
                    type="button"
                    onClick={() => setSelectedAvatar(preset)}
                    className={cn(
                      "rounded-lg overflow-hidden border-2 cursor-pointer transition-all hover:scale-105",
                      isSelected ? "border-primary ring-2 ring-primary/40" : "border-border/80"
                    )}
                  >
                    <Avatar className="h-10 w-10 rounded-none bg-muted">
                      <AvatarImage src={`https://api.dicebear.com/7.x/bottts/svg?seed=${preset}`} />
                    </Avatar>
                  </button>
                );
              })}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            {/* Display Name */}
            <div className="space-y-1">
              <Label htmlFor="edit-name" className="text-sm font-semibold text-foreground">
                Display Name
              </Label>
              <Input
                id="edit-name"
                className="border-border bg-background text-foreground focus-visible:ring-primary focus-visible:border-primary/50"
                {...register("displayName")}
              />
              {errors.displayName && <p className="text-xs text-rose-500 mt-0.5">{errors.displayName.message}</p>}
            </div>

            {/* Title / Role */}
            <div className="space-y-1">
              <Label htmlFor="edit-title" className="text-sm font-semibold text-foreground">
                What I do (Title)
              </Label>
              <Input
                id="edit-title"
                placeholder="e.g. Lead Architect"
                className="border-border bg-background text-foreground focus-visible:ring-primary focus-visible:border-primary/50"
                {...register("title")}
              />
              {errors.title && <p className="text-xs text-rose-500 mt-0.5">{errors.title.message}</p>}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            {/* Pronouns */}
            <div className="space-y-1">
              <Label htmlFor="edit-pronouns" className="text-sm font-semibold text-foreground">
                Pronouns
              </Label>
              <Input
                id="edit-pronouns"
                placeholder="e.g. he/him, she/her"
                className="border-border bg-background text-foreground focus-visible:ring-primary focus-visible:border-primary/50"
                {...register("pronouns")}
              />
              {errors.pronouns && <p className="text-xs text-rose-500 mt-0.5">{errors.pronouns.message}</p>}
            </div>

            {/* Timezone */}
            <div className="space-y-1">
              <Label htmlFor="edit-timezone" className="text-sm font-semibold text-foreground">
                Timezone
              </Label>
              <Input
                id="edit-timezone"
                className="border-border bg-background text-foreground focus-visible:ring-primary focus-visible:border-primary/50"
                {...register("timezone")}
              />
              {errors.timezone && <p className="text-xs text-rose-500 mt-0.5">{errors.timezone.message}</p>}
            </div>
          </div>

          <DialogFooter className="pt-2">
            <Button
              type="button"
              variant="ghost"
              onClick={() => setActiveModal("user-profile")}
              className="text-muted-foreground hover:bg-muted hover:text-foreground"
            >
              Back
            </Button>
            <Button
              type="submit"
              disabled={isSubmitting}
              className="bg-primary hover:bg-primary/95 text-white font-semibold"
            >
              {isSubmitting ? "Saving..." : "Save Changes"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
