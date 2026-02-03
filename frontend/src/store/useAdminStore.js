import { create } from "zustand";
import axios from "axios";
import BASE_URL from "@/lib/api";

const API_URL = `${BASE_URL}/api`;

export const useAdminStore = create((set, get) => ({
  admins: [],
  owner: null,
  workspaces: {
    ownWorkspace: null,
    sharedWorkspaces: []
  },
  currentWorkspace: null, // null means using own workspace
  loading: false,
  error: null,

  // Fetch all admins for the current user's workspace
  fetchAdmins: async (userId) => {
    set({ loading: true, error: null });
    try {
      const response = await axios.get(`${API_URL}/getAdmins/${userId}`);
      if (response.data.success) {
        set({
          admins: response.data.data.admins,
          owner: response.data.data.owner,
          loading: false
        });
      }
    } catch (error) {
      console.error("Error fetching admins:", error);
      set({ error: error.message, loading: false });
    }
  },

  // Fetch workspaces the user has access to
  fetchWorkspaces: async (userId) => {
    set({ loading: true, error: null });
    try {
      const response = await axios.get(`${API_URL}/getUserWorkspaces/${userId}`);
      if (response.data.success) {
        set({
          workspaces: response.data.data,
          loading: false
        });
      }
    } catch (error) {
      console.error("Error fetching workspaces:", error);
      set({ error: error.message, loading: false });
    }
  },

  // Add a new admin by email
  addAdmin: async (userId, email, role = 'admin') => {
    set({ loading: true, error: null });
    try {
      const response = await axios.post(`${API_URL}/addAdmin/${userId}`, { email, role });
      if (response.data.success) {
        // Refetch admins to get updated list
        await get().fetchAdmins(userId);
        return { success: true, message: response.data.message };
      }
      return { success: false, message: response.data.message };
    } catch (error) {
      const message = error.response?.data?.message || error.message;
      set({ error: message, loading: false });
      return { success: false, message };
    }
  },

  // Update an admin's role or status
  updateAdmin: async (userId, adminId, updates) => {
    set({ loading: true, error: null });
    try {
      const response = await axios.put(`${API_URL}/updateAdmin/${userId}/${adminId}`, updates);
      if (response.data.success) {
        await get().fetchAdmins(userId);
        return { success: true, message: response.data.message };
      }
      return { success: false, message: response.data.message };
    } catch (error) {
      const message = error.response?.data?.message || error.message;
      set({ error: message, loading: false });
      return { success: false, message };
    }
  },

  // Remove an admin
  removeAdmin: async (userId, adminId) => {
    set({ loading: true, error: null });
    try {
      const response = await axios.delete(`${API_URL}/removeAdmin/${userId}/${adminId}`);
      if (response.data.success) {
        await get().fetchAdmins(userId);
        return { success: true, message: response.data.message };
      }
      return { success: false, message: response.data.message };
    } catch (error) {
      const message = error.response?.data?.message || error.message;
      set({ error: message, loading: false });
      return { success: false, message };
    }
  },

  // Switch to a different workspace
  switchWorkspace: async (userId, targetUserId) => {
    set({ loading: true, error: null });
    try {
      const response = await axios.post(`${API_URL}/switchWorkspace/${userId}/${targetUserId}`);
      if (response.data.success) {
        const workspaceData = response.data.data;
        set({
          currentWorkspace: workspaceData.isOwnWorkspace ? null : workspaceData,
          loading: false
        });
        // Store in localStorage for persistence
        if (workspaceData.isOwnWorkspace) {
          localStorage.removeItem('currentWorkspace');
        } else {
          localStorage.setItem('currentWorkspace', JSON.stringify(workspaceData));
        }
        return { success: true, message: response.data.message };
      }
      return { success: false, message: response.data.message };
    } catch (error) {
      const message = error.response?.data?.message || error.message;
      set({ error: message, loading: false });
      return { success: false, message };
    }
  },

  // Get the effective user ID (for API calls - use workspace owner if in shared workspace)
  getEffectiveUserId: (actualUserId) => {
    const { currentWorkspace } = get();
    return currentWorkspace?.workspaceOwnerId || actualUserId;
  },

  // Initialize workspace from localStorage
  initWorkspace: () => {
    const stored = localStorage.getItem('currentWorkspace');
    if (stored) {
      try {
        set({ currentWorkspace: JSON.parse(stored) });
      } catch (e) {
        localStorage.removeItem('currentWorkspace');
      }
    }
  },

  // Clear current workspace (back to own)
  clearWorkspace: () => {
    localStorage.removeItem('currentWorkspace');
    set({ currentWorkspace: null });
  },

  clearError: () => set({ error: null })
}));
