import { create } from "zustand";

export const useOrgStore = create((set, get) => ({
  currentOrgId: null,
  currentOrgRole: null,
  orgs: [],
  isLoading: false,

  setCurrentOrg: (orgId, orgRole) => set({ currentOrgId: orgId, currentOrgRole: orgRole }),

  fetchOrgs: async () => {
    set({ isLoading: true });
    try {
      const response = await fetch("/api/orgs");
      if (!response.ok) throw new Error("Failed to fetch orgs");
      const data = await response.json();
      set({ orgs: data.orgs, isLoading: false });
    } catch (error) {
      console.error("Failed to fetch orgs:", error);
      set({ isLoading: false });
    }
  },

  switchOrg: async (orgId) => {
    try {
      const response = await fetch("/api/auth/switch-org", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ orgId }),
      });

      if (!response.ok) throw new Error("Failed to switch org");

      const data = await response.json();

      set({
        currentOrgId: parseInt(data.currentOrgId),
        currentOrgRole: data.currentOrgRole,
      });

      return data;
    } catch (error) {
      console.error("Failed to switch org:", error);
      throw error;
    }
  },
}));