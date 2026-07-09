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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { useState } from "react";

const customStatusSchema = z.object({
  text: z.string().max(40, "Status must be less than 40 characters").optional(),
});

type CustomStatusValues = z.infer<typeof customStatusSchema>;

const EMOJI_PRESETS = ["💻", "🏠", "🤒", "🌴", "💬", "🔍", "🚀", "☕"];

export function CustomStatusDialog() {
  const { activeModal, setActiveModal } = useLayoutStore();
  const { status, setStatus } = useProfileStore();

  const [selectedEmoji, setSelectedEmoji] = useState(status?.emoji || "💬");
  const [expiry, setExpiry] = useState(status?.expiry || "donotclear");

  const isOpen = activeModal === "custom-status";

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<CustomStatusValues>({
    resolver: zodResolver(customStatusSchema),
    values: {
      text: status?.text || "",
    },
  });

  const handleClose = () => {
    setActiveModal(null);
  };

  const handleClearStatus = () => {
    setStatus(null);
    toast.success("Status cleared!");
    setActiveModal("user-profile");
  };

  const onSubmit = async (values: CustomStatusValues) => {
    try {
      const text = values.text || "";
      if (!text.trim()) {
        setStatus(null);
      } else {
        setStatus({
          emoji: selectedEmoji,
          text: text.trim(),
          expiry,
        });
      }

      toast.success("Status updated!");
      setActiveModal("user-profile");
    } catch {
      toast.error("Failed to update status. Try again.");
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && handleClose()}>
      <DialogContent className="max-w-sm select-none border-border">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold text-foreground">Set a Status</DialogTitle>
          <DialogDescription className="text-muted-foreground">
            Let teammates know if you are in meetings, commuting, or out sick.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 py-2">
          {/* Status Text with Leading Emoji selector */}
          <div className="space-y-1">
            <Label htmlFor="status-text" className="text-sm font-semibold text-foreground">
              What's happening?
            </Label>
            <div className="flex gap-2">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg border border-border bg-muted text-lg leading-none shrink-0 select-none">
                {selectedEmoji}
              </div>
              <Input
                id="status-text"
                placeholder="What's your status?"
                className="flex-1 border-border bg-background text-foreground focus-visible:ring-primary focus-visible:border-primary/50"
                {...register("text")}
              />
            </div>
            {errors.text && <p className="text-xs text-rose-500 mt-0.5">{errors.text.message}</p>}
          </div>

          {/* Quick Emoji Presets Grid */}
          <div className="space-y-1.5">
            <Label className="text-xs font-semibold text-muted-foreground">Quick suggestions</Label>
            <div className="flex gap-1.5 flex-wrap">
              {EMOJI_PRESETS.map((emoji) => (
                <button
                  key={emoji}
                  type="button"
                  onClick={() => {
                    setSelectedEmoji(emoji);
                    // Autofill suggestions texts to make it premium!
                    if (emoji === "💻") setValue("text", "In a meeting");
                    if (emoji === "🏠") setValue("text", "Working from home");
                    if (emoji === "🤒") setValue("text", "Out sick");
                    if (emoji === "🌴") setValue("text", "On vacation");
                    if (emoji === "☕") setValue("text", "Coffee break");
                  }}
                  className={cn(
                    "flex h-8 w-8 items-center justify-center rounded-md border text-base hover:bg-muted cursor-pointer transition-colors",
                    emoji === selectedEmoji ? "border-primary bg-primary/15" : "border-border bg-muted/30"
                  )}
                >
                  {emoji}
                </button>
              ))}
            </div>
          </div>

          {/* Expiry Selector */}
          <div className="space-y-1">
            <Label className="text-sm font-semibold text-foreground">Clear after</Label>
            <Select value={expiry} onValueChange={(val) => setExpiry(val || "donotclear")}>
              <SelectTrigger className="border-border bg-background text-foreground focus-visible:ring-primary focus-visible:border-primary/50">
                <SelectValue placeholder="Don't clear" />
              </SelectTrigger>
              <SelectContent className="border-border bg-popover text-popover-foreground">
                <SelectItem value="donotclear">Don't clear</SelectItem>
                <SelectItem value="30mins">30 minutes</SelectItem>
                <SelectItem value="1hour">1 hour</SelectItem>
                <SelectItem value="today">Today</SelectItem>
                <SelectItem value="thisweek">This week</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <DialogFooter className="pt-2 gap-2 sm:gap-0">
            {status && (
              <Button
                type="button"
                variant="outline"
                onClick={handleClearStatus}
                className="border-rose-200 bg-rose-50 hover:bg-rose-100 text-rose-600 hover:text-rose-700 mr-auto font-semibold"
              >
                Clear Status
              </Button>
            )}
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
              Save Status
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
