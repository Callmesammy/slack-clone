import { create } from "zustand";

interface LayoutState {
  sidebarCollapsed: boolean;
  sidebarOpen: boolean;
  activeModal: "create-channel" | "invite-members" | "workspace-settings" | null;
  setSidebarCollapsed: (collapsed: boolean) => void;
  setSidebarOpen: (open: boolean) => void;
  toggleSidebarCollapsed: () => void;
  toggleSidebarOpen: () => void;
  setActiveModal: (modal: "create-channel" | "invite-members" | "workspace-settings" | null) => void;
}

export const useLayoutStore = create<LayoutState>((set) => ({
  sidebarCollapsed: false,
  sidebarOpen: false,
  activeModal: null,
  setSidebarCollapsed: (collapsed) => set({ sidebarCollapsed: collapsed }),
  setSidebarOpen: (open) => set({ sidebarOpen: open }),
  toggleSidebarCollapsed: () => set((state) => ({ sidebarCollapsed: !state.sidebarCollapsed })),
  toggleSidebarOpen: () => set((state) => ({ sidebarOpen: !state.sidebarOpen })),
  setActiveModal: (modal) => set({ activeModal: modal }),
}));
