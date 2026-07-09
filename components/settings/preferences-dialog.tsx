"use client";

import { useLayoutStore } from "@/hooks/use-layout-store";
import { useNotificationStore } from "@/hooks/use-notification-store";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Bell, Volume2, Monitor } from "lucide-react";
import { toast } from "sonner";

export function PreferencesDialog() {
  const { activeModal, setActiveModal } = useLayoutStore();
  const { desktopEnabled, soundEnabled, bannerEnabled, toggleSetting, requestPermission } = useNotificationStore();

  const isOpen = activeModal === "preferences";

  const handleClose = () => {
    setActiveModal(null);
  };

  const handleToggleDesktop = async () => {
    if (!desktopEnabled) {
      const granted = await requestPermission();
      if (granted) {
        toast.success("Desktop push notifications enabled successfully!");
      } else {
        toast.error("Browser blocked notifications permission.");
      }
    } else {
      toggleSetting("desktopEnabled");
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && handleClose()}>
      <DialogContent className="max-w-md select-none">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold">Preferences</DialogTitle>
          <DialogDescription>
            Manage your workspace sound alerts, banners, and desktop notifications.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          {/* Banner Notifications Switch */}
          <div className="flex items-center justify-between rounded-lg border border-border bg-muted/40 p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-primary/10 rounded-lg text-primary">
                <Bell className="h-4 w-4" />
              </div>
              <div className="space-y-0.5">
                <Label className="text-sm font-semibold">Show notification banners</Label>
                <p className="text-xs text-muted-foreground">Display popup alerts on the bottom right.</p>
              </div>
            </div>
            <Switch
              checked={bannerEnabled}
              onCheckedChange={() => toggleSetting("bannerEnabled")}
            />
          </div>

          {/* Sound Notification Switch */}
          <div className="flex items-center justify-between rounded-lg border border-border bg-muted/40 p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-primary/10 rounded-lg text-primary">
                <Volume2 className="h-4 w-4" />
              </div>
              <div className="space-y-0.5">
                <Label className="text-sm font-semibold">Play alert sounds</Label>
                <p className="text-xs text-muted-foreground">Play a ping sound when background messages arrive.</p>
              </div>
            </div>
            <Switch
              checked={soundEnabled}
              onCheckedChange={() => toggleSetting("soundEnabled")}
            />
          </div>

          {/* Desktop Push Switch */}
          <div className="flex items-center justify-between rounded-lg border border-border bg-muted/40 p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-primary/10 rounded-lg text-primary">
                <Monitor className="h-4 w-4" />
              </div>
              <div className="space-y-0.5">
                <Label className="text-sm font-semibold">Desktop push notifications</Label>
                <p className="text-xs text-muted-foreground">Receive native browser alerts outside the browser.</p>
              </div>
            </div>
            <Switch
              checked={desktopEnabled}
              onCheckedChange={handleToggleDesktop}
            />
          </div>
        </div>

        <DialogFooter>
          <Button
            type="button"
            onClick={handleClose}
            className="bg-primary hover:bg-primary/95 text-primary-foreground font-semibold"
          >
            Save preferences
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
