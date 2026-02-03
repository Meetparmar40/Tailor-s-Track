import { create } from "zustand";
import axios from "axios";
import API_URL from "@/lib/api";
import { notify } from "@/hooks/use-toast";

const BASE_URL = API_URL;

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
            notify.error("User not authenticated");
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
            if (err?.response?.status === 429) {
                set({ error: "rate limit exceeded, try again after some time" });
                notify.warning("Rate limit exceeded. Please try again later.");
            } else {
                set({ error: "something went wrong" });
                notify.error("Failed to load customers");
            }
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
            if (err?.response?.status === 429) {
                set({ error: "rate limit exceeded, try again after some time" });
                notify.warning("Rate limit exceeded. Please try again later.");
            } else {
                set({ error: "something went wrong" });
                notify.error("Failed to load more customers");
            }
        } finally {
            set({ loading: false, isLoadingMore: false });
        }
    },

    fetchCustomer: async (userId, customerId) => {
        if (!userId) {
            set({ error: "User not authenticated" });
            notify.error("User not authenticated");
            return { success: false, error: "User not authenticated" };
        }
        if (!customerId) {
            set({ error: "Customer Id is needed" });
            notify.error("Customer ID is required");
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
            if (status === 429) {
                set({ error: "rate limit exceeded, try again after some time" });
                notify.warning("Rate limit exceeded. Please try again later.");
            } else {
                set({ error: "something went wrong" });
                notify.error("Failed to load customer details");
            }
            return { success: false, error: "Failed to fetch customer" };
        } finally {
            set({ loading: false });
        }
    },

    updateCustomer: async (userId, customerId, customerData) => {
        if (!userId) {
            set({ error: "User not authenticated" });
            notify.error("User not authenticated");
            return { success: false, error: "User not authenticated" };
        }
        if (!customerId) {
            set({ error: "Customer ID is required" });
            notify.error("Customer ID is required");
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

            notify.success("Customer updated successfully");
            return { success: true, data: updatedCustomer };
        } catch (error) {
            const status = error?.response?.status;
            if (status === 429) {
                set({ error: "rate limit exceeded, try again after some time" });
                notify.warning("Rate limit exceeded. Please try again later.");
            } else if (status === 400) {
                set({ error: "Invalid customer data" });
                notify.error("Invalid customer data. Please check your inputs.");
            } else {
                set({ error: "something went wrong" });
                notify.error("Failed to update customer");
            }
            return { success: false, error: "Failed to update customer" };
        } finally {
            set({ loading: false });
        }
    },

    deleteCustomer: async (userId, customerId) => {
        if (!userId) {
            notify.error("User not authenticated");
            return { success: false, error: "User not authenticated" };
        }
        if (!customerId) {
            notify.error("Customer ID is required");
            return { success: false, error: "Customer ID is required" };
        }

        try {
            const url = `${BASE_URL}/api/deleteCustomer/${userId}/${customerId}`;
            await axios.delete(url);

            set({
                customers: get().customers.filter(c => c.id !== customerId),
                currentCustomer: null
            });

            notify.success("Customer deleted successfully");
            return { success: true };
        } catch (error) {
            const status = error?.response?.status;
            if (status === 429) {
                notify.warning("Rate limit exceeded. Please try again later.");
                return { success: false, error: "rate limit exceeded" };
            }
            notify.error("Failed to delete customer");
            return { success: false, error: "Failed to delete customer" };
        }
    },

    // Alias for backwards compatibility
    addCustomer: async (userId, customerData) => {
        if (!userId) {
            notify.error("User not authenticated");
            return { success: false, error: "User not authenticated" };
        }

        // Validate required fields
        if (!customerData.name?.trim()) {
            notify.warning("Please enter a customer name");
            return { success: false, error: "Name is required" };
        }

        try {
            const url = `${BASE_URL}/api/createCustomer/${userId}`;
            const response = await axios.post(url, customerData);
            const newCustomer = response.data.data;
            set({ customers: [newCustomer, ...get().customers] });
            notify.success("Customer created successfully");
            return { success: true, data: newCustomer };
        } catch (error) {
            const status = error?.response?.status;
            if (status === 429) {
                notify.warning("Rate limit exceeded. Please try again later.");
                return { success: false, error: "rate limit exceeded" };
            }
            if (status === 400) {
                notify.error("Invalid customer data. Please check your inputs.");
                return { success: false, error: "Invalid data" };
            }
            notify.error("Failed to create customer");
            return { success: false, error: "Failed to create customer" };
        }
    },

    clearCurrentCustomer: () => set({ currentCustomer: null }),
    clearError: () => set({ error: null }),
}));