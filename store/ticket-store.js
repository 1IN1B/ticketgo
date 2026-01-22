import { create } from "zustand";

export const useTicketStore = create((set) => ({
  // Filter state
  searchQuery: "",
  statusFilter: "ALL",
  priorityFilter: "ALL",

  // Pagination
  currentPage: 1,
  itemsPerPage: 10,

  // Actions
  setSearchQuery: (query) => set({ searchQuery: query, currentPage: 1 }),
  setStatusFilter: (status) => set({ statusFilter: status, currentPage: 1 }),
  setPriorityFilter: (priority) =>
    set({ priorityFilter: priority, currentPage: 1 }),
  setCurrentPage: (page) => set({ currentPage: page }),
  resetFilters: () =>
    set({
      searchQuery: "",
      statusFilter: "ALL",
      priorityFilter: "ALL",
      currentPage: 1,
    }),
}));
