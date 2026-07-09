import { create } from "zustand";

export interface Channel {
  id: string;
  name: string;
  isPrivate: boolean;
  description?: string;
  unread: boolean;
}

export interface Dm {
  id: string;
  name: string;
  online: boolean;
  unread: boolean;
  isAi?: boolean;
}

export interface WorkspaceItem {
  id: string;
  name: string;
  initial: string;
  color: string;
}

interface WorkspaceState {
  workspaces: WorkspaceItem[];
  channels: Channel[];
  dms: Dm[];
  addWorkspace: (workspace: WorkspaceItem) => void;
  addChannel: (channel: Omit<Channel, "unread">) => void;
  addDm: (dm: Omit<Dm, "unread">) => void;
  markChannelRead: (id: string) => void;
  markDmRead: (id: string) => void;
  markChannelUnread: (id: string) => void;
  markDmUnread: (id: string) => void;
  updateChannelDetails: (id: string, name: string, description?: string) => void;
}

export const useWorkspaceStore = create<WorkspaceState>((set) => ({
  workspaces: [
    { id: "default", name: "Main HQ", initial: "M", color: "from-primary to-slack-blue" },
    { id: "marketing", name: "Marketing Campaign", initial: "M", color: "from-orange-500 to-rose-500" },
    { id: "engineering", name: "Engineering Team", initial: "E", color: "from-emerald-500 to-teal-500" },
  ],
  channels: [
    { id: "general", name: "general", isPrivate: false, description: "Company-wide announcements and work-based chat", unread: false },
    { id: "random", name: "random", isPrivate: false, description: "Non-work talk and jokes", unread: false },
    { id: "announcements", name: "announcements", isPrivate: true, description: "Official broadcast messages", unread: true },
  ],
  dms: [
    { id: "ai-bot", name: "AI Assistant", online: true, unread: false, isAi: true },
    { id: "alice", name: "alice_w", online: true, unread: true },
    { id: "bob", name: "bob_smith", online: false, unread: false },
  ],
  addWorkspace: (workspace) =>
    set((state) => ({
      workspaces: [...state.workspaces, workspace],
    })),
  addChannel: (channel) =>
    set((state) => ({
      channels: [...state.channels, { ...channel, unread: false }],
    })),
  addDm: (dm) =>
    set((state) => {
      if (state.dms.some((d) => d.id === dm.id)) return {};
      return {
        dms: [...state.dms, { ...dm, unread: false }],
      };
    }),
  markChannelRead: (id) =>
    set((state) => ({
      channels: state.channels.map((c) => (c.id === id ? { ...c, unread: false } : c)),
    })),
  markDmRead: (id) =>
    set((state) => ({
      dms: state.dms.map((d) => (d.id === id ? { ...d, unread: false } : d)),
    })),
  markChannelUnread: (id) =>
    set((state) => ({
      channels: state.channels.map((c) => (c.id === id ? { ...c, unread: true } : c)),
    })),
  markDmUnread: (id) =>
    set((state) => ({
      dms: state.dms.map((d) => (d.id === id ? { ...d, unread: true } : d)),
    })),
  updateChannelDetails: (id, name, description) =>
    set((state) => ({
      channels: state.channels.map((c) =>
        c.id === id ? { ...c, name, description } : c
      ),
    })),
}));
