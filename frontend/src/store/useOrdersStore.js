import {create} from "zustand";
import axios from "axios";

const BASE_URL = "http://localhost:3000";

const userId = "81a48fba-7155-4e50-8355-897840cde5c2";
// todo : apply valid oauth

export const useOrdersStore = create((set, get) => ({
    orders: [],
    loading: false,
    error: null,
    hasMore: true,
    isLoadingMore: false,
    lastDate: null,

    fetchOrders: async ({ limit = 10, lastDate, tag } = {}) => {
        set({ loading: true });

        try {
            const params = new URLSearchParams();
            if (limit) params.append("limit", limit);
            if (lastDate) params.append("lastDate", lastDate);
            if (tag !== undefined && tag !== null) params.append("tag", tag);

            const url = `${BASE_URL}/api/getAllOrders/${userId}` + (params.toString() ? `?${params.toString()}` : "");
            const response = await axios.get(url);
            const { data, hasMore, lastDate: nextCursor } = response.data;
            set({ orders: data, error: null, hasMore, lastDate: nextCursor });
        } catch (error) {
            const status = error?.response?.status;
            if (status === 429) set({ error: "rate limit exceeded, try again after some time" });
            else set({ error: "something went wrong" });
        } finally {
            set({ loading: false });
        }
    },

    fetchMoreOrders: async ({ limit = 10, tag } = {}) => {
        const { hasMore, lastDate, isLoadingMore } = get();
        if (!hasMore || isLoadingMore) return;
        set({ isLoadingMore: true });

        try {
            const params = new URLSearchParams();
            if (limit) params.append("limit", limit);
            if (lastDate) params.append("lastDate", lastDate);
            if (tag !== undefined && tag !== null) params.append("tag", tag);

            const url = `${BASE_URL}/api/getAllOrders/${userId}` + (params.toString() ? `?${params.toString()}` : "");
            const response = await axios.get(url);
            const { data, hasMore: more, lastDate: nextCursor } = response.data;

            set({
                orders: [...get().orders, ...data],
                error: null,
                hasMore: more,
                lastDate: nextCursor,
            });
        } catch (error) {
            const status = error?.response?.status;
            if (status === 429) set({ error: "rate limit exceeded, try again after some time" });
            else set({ error: "something went wrong" });
        } finally {
            set({ isLoadingMore: false });
        }
    },

    // Get all orders of a specific customer2
    fetchOrdersOfCustomer: async (customerId) => {
        if (!customerId) {
            set({ error: "Customer Id is needed" });
            return;
        }
        set({ loading: true });

        try {
            const url = `${BASE_URL}/api/getOrders/${userId}/${customerId}`;
            const response = await axios.get(url);
            set({ orders: response.data.data, error: null });
        } catch (error) {
            const status = error?.response?.status;
            if (status === 429) set({ error: "rate limit exceeded, try again after some time" });
            else set({ error: "something went wrong" });
        } finally {
            set({ loading: false });
        }
    },
}));