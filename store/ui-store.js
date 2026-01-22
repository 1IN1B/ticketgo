import { create } from "zustand";

export const useUIStore = create((set) => ({
  // Mobile menu state
  isMobileMenuOpen: false,

  // Modal state
  isModalOpen: false,
  modalContent: null,

  // Actions
  toggleMobileMenu: () =>
    set((state) => ({ isMobileMenuOpen: !state.isMobileMenuOpen })),
  closeMobileMenu: () => set({ isMobileMenuOpen: false }),
  openModal: (content) => set({ isModalOpen: true, modalContent: content }),
  closeModal: () => set({ isModalOpen: false, modalContent: null }),
}));
