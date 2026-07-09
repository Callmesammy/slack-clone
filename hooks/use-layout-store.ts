import { create } from "zustand";

interface LayoutState {
  sidebarCollapsed: boolean;
  sidebarOpen: boolean;
  activeModal: "create-channel" | "start-dm" | "create-workspace" | "preferences" | "edit-profile" | "custom-status" | "user-profile" | "invite-members" | "workspace-settings" | null;
  threadOpen: boolean;
  activeParentMessageId: string | null;
  pinnedOpen: boolean;
  detailsOpen: boolean;
  searchOpen: boolean;
  setSidebarCollapsed: (collapsed: boolean) => void;
  setSidebarOpen: (open: boolean) => void;
  toggleSidebarCollapsed: () => void;
  toggleSidebarOpen: () => void;
  setActiveModal: (modal: "create-channel" | "start-dm" | "create-workspace" | "preferences" | "edit-profile" | "custom-status" | "user-profile" | "invite-members" | "workspace-settings" | null) => void;
  openThread: (messageId: string) => void;
  closeThread: () => void;
  setPinnedOpen: (open: boolean) => void;
  setDetailsOpen: (open: boolean) => void;
  setSearchOpen: (open: boolean) => void;
  toggleSearchOpen: () => void;
}

export const useLayoutStore = create<LayoutState>((set) => ({
  sidebarCollapsed: false,
  sidebarOpen: false,
  activeModal: null,
  threadOpen: false,
  activeParentMessageId: null,
  pinnedOpen: false,
  detailsOpen: false,
  searchOpen: false,
  setSidebarCollapsed: (collapsed) => set({ sidebarCollapsed: collapsed }),
  setSidebarOpen: (open) => set({ sidebarOpen: open }),
  toggleSidebarCollapsed: () => set((state) => ({ sidebarCollapsed: !state.sidebarCollapsed })),
  toggleSidebarOpen: () => set((state) => ({ sidebarOpen: !state.sidebarOpen })),
  setActiveModal: (modal) => set({ activeModal: modal }),
  openThread: (messageId) => set({ threadOpen: true, activeParentMessageId: messageId, pinnedOpen: false, detailsOpen: false }),
  closeThread: () => set({ threadOpen: false, activeParentMessageId: null }),
  setPinnedOpen: (open) => set((state) => ({ pinnedOpen: open, threadOpen: open ? false : state.threadOpen, detailsOpen: open ? false : state.detailsOpen })),
  setDetailsOpen: (open) => set((state) => ({ detailsOpen: open, threadOpen: open ? false : state.threadOpen, pinnedOpen: open ? false : state.pinnedOpen })),
  setSearchOpen: (open) => set({ searchOpen: open }),
  toggleSearchOpen: () => set((state) => ({ searchOpen: !state.searchOpen })),
}));
