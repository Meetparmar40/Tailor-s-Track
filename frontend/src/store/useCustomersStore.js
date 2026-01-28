import { create } from "zustand";
import axios from "axios";

const BASE_URL = import.meta.env.MODE === "development" 
  ? `http://${window.location.hostname}:3000` 
  : '';

export const useCustomersStore = create((set, get) => ({
    customers: [],
    loading: false,
    error: null,
    hasMore: true,
    isLoadingMore: false,
    lastDate: null,
    currentCustomer: null,

    fetchCustomers: async (userId, { limit = 10, lastDate } = {}) => {
        if (!userId) {
            set({ error: "User not authenticated" });
            return;
        }
        set({ loading: true });

        try {
            const params = new URLSearchParams();
            if (limit) params.append("limit", limit);
            if (lastDate) params.append("lastDate", lastDate);

            const url = `${BASE_URL}/api/getAllCustomers/${userId}` + (params.toString() ? `?${params.toString()}` : "");

            const response = await axios.get(url);
            const { data, hasMore, lastDate: nextCursor } = response.data;
            set({ customers: data, error: null, hasMore, lastDate: nextCursor });

        } catch (err) {
            if (err?.response?.status === 429) set({ error: "rate limit exceeded, try again after some time" });
            else set({ error: "something went wrong" });

        } finally {
            set({ loading: false });
        }
    },

    fetchMoreCustomers: async (userId, { limit = 10 } = {}) => {
        if (!userId) return;
        const { hasMore, lastDate, isLoadingMore } = get();
        if (!hasMore || isLoadingMore) return;
        set({ isLoadingMore: true });
        try {
            const params = new URLSearchParams();
            if (limit) params.append("limit", limit);
            if (lastDate) params.append("lastDate", lastDate);
            const url = `${BASE_URL}/api/getAllCustomers/${userId}` + (params.toString() ? `?${params.toString()}` : "");
            const response = await axios.get(url);
            const { data, hasMore: more, lastDate: nextCursor } = response.data;
            set({
                customers: [...get().customers, ...data],
                error: null, hasMore: more,
                lastDate: nextCursor,
            });
        } catch (err) {
            if (err?.response?.status === 429) set({ error: "rate limit exceeded, try again after some time" });
            else set({ error: "something went wrong" });
        } finally {
            set({ loading: false, isLoadingMore: false });
        }
    },

    fetchCustomer: async (userId, customerId) => {
        if (!userId) {
            set({ error: "User not authenticated" });
            return { success: false, error: "User not authenticated" };
        }
        if (!customerId) {
            set({ error: "Customer Id is needed" });
            return { success: false, error: "Customer Id is needed" };
        }
        set({ loading: true });

        try {
            const url = `${BASE_URL}/api/getCustomer/${userId}/${customerId}`;
            const response = await axios.get(url);
            const customerData = response.data.data;
            set({ error: null, currentCustomer: customerData });
            return { success: true, data: customerData };
        } catch (error) {
            const status = error?.response?.status;
            if (status === 429) set({ error: "rate limit exceeded, try again after some time" });
            else set({ error: "something went wrong" });
            return { success: false, error: "Failed to fetch customer" };
        } finally {
            set({ loading: false });
        }
    },

    updateCustomer: async (userId, customerId, customerData) => {
        if (!userId) {
            set({ error: "User not authenticated" });
            return { success: false, error: "User not authenticated" };
        }
        if (!customerId) {
            set({ error: "Customer ID is required" });
            return { success: false, error: "Customer ID is required" };
        }

        set({ loading: true, error: null });

        try {
            const url = `${BASE_URL}/api/updateCustomer/${userId}/${customerId}`;
            const response = await axios.put(url, customerData);

            const updatedCustomer = response.data.data;

            // Update customers list
            set({
                customers: get().customers.map(c => 
                    c.id === customerId ? updatedCustomer : c
                ),
                currentCustomer: updatedCustomer
            });

            return { success: true, data: updatedCustomer };
        } catch (error) {
            const status = error?.response?.status;
            if (status === 429) set({ error: "rate limit exceeded, try again after some time" });
            else set({ error: "something went wrong" });
            return { success: false, error: "Failed to update customer" };
        } finally {
            set({ loading: false });
        }
    },

    deleteCustomer: async (userId, customerId) => {
        if (!userId) {
            return { success: false, error: "User not authenticated" };
        }
        if (!customerId) {
            return { success: false, error: "Customer ID is required" };
        }

        try {
            const url = `${BASE_URL}/api/deleteCustomer/${userId}/${customerId}`;
            await axios.delete(url);

            set({
                customers: get().customers.filter(c => c.id !== customerId),
                currentCustomer: null
            });

            return { success: true };
        } catch (error) {
            const status = error?.response?.status;
            if (status === 429) return { success: false, error: "rate limit exceeded" };
            return { success: false, error: "Failed to delete customer" };
        }
    },

    // Alias for backwards compatibility
    addCustomer: async (userId, customerData) => {
        if (!userId) {
            return { success: false, error: "User not authenticated" };
        }

        try {
            const url = `${BASE_URL}/api/createCustomer/${userId}`;
            const response = await axios.post(url, customerData);
            const newCustomer = response.data.data;
            set({ customers: [newCustomer, ...get().customers] });
            return { success: true, data: newCustomer };
        } catch (error) {
            const status = error?.response?.status;
            if (status === 429) return { success: false, error: "rate limit exceeded" };
            return { success: false, error: "Failed to create customer" };
        }
    },

    clearCurrentCustomer: () => set({ currentCustomer: null }),
    clearError: () => set({ error: null }),
}));