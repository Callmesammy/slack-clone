import { create } from "zustand";

export interface StatusState {
  emoji: string;
  text: string;
  expiry: string;
}

interface ProfileState {
  displayName: string;
  title: string;
  pronouns: string;
  timezone: string;
  avatarPreset: string; // preset ID (e.g. "avatar-1")
  status: StatusState | null;
  presence: "online" | "away" | "offline";
  dndEnabled: boolean;
  updateProfile: (details: Partial<Omit<ProfileState, "status" | "presence" | "dndEnabled" | "updateProfile" | "setStatus" | "setPresence" | "setDndEnabled">>) => void;
  setStatus: (status: StatusState | null) => void;
  setPresence: (presence: "online" | "away" | "offline") => void;
  setDndEnabled: (enabled: boolean) => void;
}

export const useProfileStore = create<ProfileState>((set) => ({
  displayName: "Call me Sammy",
  title: "Principal Architect & Lead Engineer",
  pronouns: "he/him",
  timezone: "GMT+1 (London)",
  avatarPreset: "avatar-1",
  status: null,
  presence: "online",
  dndEnabled: false,

  updateProfile: (details) =>
    set((state) => ({
      ...state,
      ...details,
    })),

  setStatus: (status) => set({ status }),

  setPresence: (presence) => set({ presence }),

  setDndEnabled: (dndEnabled) => set({ dndEnabled }),
}));
