import { create } from "zustand";

interface NotificationState {
  desktopEnabled: boolean;
  soundEnabled: boolean;
  bannerEnabled: boolean;
  requestPermission: () => Promise<boolean>;
  toggleSetting: (key: "desktopEnabled" | "soundEnabled" | "bannerEnabled") => void;
}

export const useNotificationStore = create<NotificationState>((set, get) => ({
  desktopEnabled: false,
  soundEnabled: true,
  bannerEnabled: true,

  requestPermission: async () => {
    if (typeof window === "undefined" || !("Notification" in window)) {
      return false;
    }

    try {
      const permission = await Notification.requestPermission();
      const granted = permission === "granted";
      set({ desktopEnabled: granted });
      return granted;
    } catch {
      return false;
    }
  },

  toggleSetting: (key) => {
    if (key === "desktopEnabled") {
      const current = get().desktopEnabled;
      if (!current) {
        // Trigger request dialog
        get().requestPermission();
        return;
      }
    }
    set((state) => ({ [key]: !state[key] }));
  },
}));
