import { MenuState } from "@/app/types/menu";
import { create } from "zustand";

export const useMenu = create<MenuState>((set) => ({
  isOpen: false,
  toggleMenu: () => set((state) => ({ isOpen: !state.isOpen })),
  openMenu: () => set({ isOpen: true }),
  closeMenu: () => set({ isOpen: false }),
<<<<<<< docs/projectOrganization
=======
}));

export const useAdminMenu = create<MenuState>((set) => ({
  isOpen: false,
  toggleMenu: () => set((state) => ({ isOpen: !state.isOpen })),
  openMenu: () => set({ isOpen: true }),
  closeMenu: () => set({ isOpen: false }),
>>>>>>> local
}));