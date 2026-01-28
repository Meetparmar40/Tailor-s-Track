import { create } from "zustand";
import axios from "axios";

const BASE_URL = import.meta.env.MODE === "development" 
  ? `http://${window.location.hostname}:3000` 
  : '';

export const useOrdersStore = create((set, get) => ({
    orders: [],
    loading: false,
    error: null,
    hasMore: true,
    isLoadingMore: false,
    lastDate: null,
    currentOrder: null,

    fetchOrders: async (userId, { limit = 10, lastDate, tag } = {}) => {
        if (!userId) {
            set({ error: "User not authenticated" });
            return;
        }
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

    fetchMoreOrders: async (userId, { limit = 10, tag } = {}) => {
        if (!userId) return;
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

    fetchOrdersOfCustomer: async (userId, customerId) => {
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
            const url = `${BASE_URL}/api/getOrders/${userId}/${customerId}`;
            const response = await axios.get(url);
            const ordersData = response.data.data;
            set({ error: null });
            return { success: true, data: ordersData };
        } catch (error) {
            const status = error?.response?.status;
            if (status === 429) set({ error: "rate limit exceeded, try again after some time" });
            else set({ error: "something went wrong" });
            return { success: false, error: "Failed to fetch orders" };
        } finally {
            set({ loading: false });
        }
    },

    fetchOrder: async (userId, orderId) => {
        if (!userId) {
            set({ error: "User not authenticated" });
            return { success: false, error: "User not authenticated" };
        }
        if (!orderId) {
            set({ error: "Order Id is needed" });
            return { success: false, error: "Order Id is needed" };
        }
        set({ loading: true });

        try {
            const url = `${BASE_URL}/api/getOrder/${userId}/${orderId}`;
            const response = await axios.get(url);
            const orderData = response.data.data;
            set({ error: null, currentOrder: orderData });
            return { success: true, data: orderData };
        } catch (error) {
            const status = error?.response?.status;
            if (status === 429) set({ error: "rate limit exceeded, try again after some time" });
            else set({ error: "something went wrong" });
            return { success: false, error: "Failed to fetch order" };
        } finally {
            set({ loading: false });
        }
    },

    createOrder: async (userId, customerId, orderData) => {
        if (!userId) {
            return { success: false, error: "User not authenticated" };
        }
        if (!customerId) {
            return { success: false, error: "Customer Id is needed" };
        }

        try {
            const url = `${BASE_URL}/api/createOrder/${userId}/${customerId}`;
            const response = await axios.post(url, orderData);
            const newOrder = response.data.data;
            set({ orders: [newOrder, ...get().orders] });
            return { success: true, data: newOrder };
        } catch (error) {
            const status = error?.response?.status;
            if (status === 429) return { success: false, error: "rate limit exceeded" };
            return { success: false, error: "Failed to create order" };
        }
    },

    updateOrder: async (userId, orderId, orderData) => {
        if (!userId) {
            return { success: false, error: "User not authenticated" };
        }
        if (!orderId) {
            return { success: false, error: "Order Id is needed" };
        }

        try {
            const url = `${BASE_URL}/api/updateOrder/${userId}/${orderId}`;
            const response = await axios.post(url, orderData);
            const updatedOrder = response.data.data;
            set({
                orders: get().orders.map(o => o.id === orderId ? updatedOrder : o),
                currentOrder: updatedOrder
            });
            return { success: true, data: updatedOrder };
        } catch (error) {
            const status = error?.response?.status;
            if (status === 429) return { success: false, error: "rate limit exceeded" };
            return { success: false, error: "Failed to update order" };
        }
    },

    deleteOrder: async (userId, orderId) => {
        if (!userId) {
            return { success: false, error: "User not authenticated" };
        }
        if (!orderId) {
            return { success: false, error: "Order Id is needed" };
        }

        try {
            const url = `${BASE_URL}/api/deleteOrder/${userId}/${orderId}`;
            await axios.delete(url);
            set({
                orders: get().orders.filter(o => o.id !== orderId),
                currentOrder: null
            });
            return { success: true };
        } catch (error) {
            const status = error?.response?.status;
            if (status === 429) return { success: false, error: "rate limit exceeded" };
            return { success: false, error: "Failed to delete order" };
        }
    },

    // Aliases for backwards compatibility
    addOrder: async (userId, customerId, orderData) => {
        return get().createOrder(userId, customerId, orderData);
    },

    updateOrders: async (userId, orderId, orderData) => {
        return get().updateOrder(userId, orderId, orderData);
    },

    updateOrderTag: async (userId, orderId, tag) => {
        return get().updateOrder(userId, orderId, { tag });
    },

    clearCurrentOrder: () => set({ currentOrder: null }),
    clearError: () => set({ error: null }),
}));