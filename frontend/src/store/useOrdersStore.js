import { create } from "zustand";
import axios from "axios";

const BASE_URL = `http://${window.location.hostname}:3000`;

const userId = "81a48fba-7155-4e50-8355-897840cde5c2";
// todo : apply valid oauth

export const useOrdersStore = create((set, get) => ({
    orders: [],
    loading: false,
    error: null,
    hasMore: true,
    isLoadingMore: false,
    lastDate: null,
    currentOrder: null,

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

    fetchOrdersOfCustomer: async (customerId) => {
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

    fetchOrder: async (orderId) => {
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

    addOrder: async (customerId, orderData) => {
        set({ loading: true, error: null });
        try {
            const url = `${BASE_URL}/api/createOrder/${userId}/${customerId}`;
            const response = await axios.post(url, orderData);
            const newOrder = response.data.data;
            set(state => ({
                orders: [newOrder, ...state.orders],
                loading: false,
                error: null
            }));
            return { success: true, data: newOrder };
        } catch (error) {
            const status = error?.response?.status;
            let errorMessage = "Failed to create order";
            if (status === 429) errorMessage = "Rate limit exceeded, try again after some time";
            else if (status === 400) errorMessage = "Invalid order data provided";
            else if (status === 404) errorMessage = "Customer not found";
            else if (error?.response?.data?.message) errorMessage = error.response.data.message;
            set({ error: errorMessage, loading: false });
            return { success: false, error: errorMessage };
        } finally {
            set({ loading: false });
        }
    },

    updateOrders: async (orderId, orderData) => {
        if (!orderId) {
            set({ error: "Order ID is required" });
            return { success: false, error: "Order ID is required" };
        }
        set({ loading: true, error: null });
        try {
            const url = `${BASE_URL}/api/updateOrder/${userId}/${orderId}`;
            const response = await axios.post(url, orderData);
            const updatedOrder = response.data.data;
            set(state => ({
                orders: state.orders.map(order => order.id === orderId ? updatedOrder : order),
                loading: false,
                error: null,
                currentOrder: state.currentOrder && state.currentOrder.id === orderId ? updatedOrder : state.currentOrder
            }));
            return { success: true, data: updatedOrder };
        } catch (error) {
            const status = error?.response?.status;
            let errorMessage = "Failed to update order";
            if (status === 429) errorMessage = "Rate limit exceeded, try again after some time";
            else if (status === 400) errorMessage = "Invalid order data provided";
            else if (status === 404) errorMessage = "Order not found";
            else if (error?.response?.data?.message) errorMessage = error.response.data.message;
            set({ error: errorMessage, loading: false });
            return { success: false, error: errorMessage };
        } finally {
            set({ loading: false });
        }
    },

    updateOrderTag: async (orderId, newTag) => {
        try {
            const result = await get().updateOrders(orderId, { tag: newTag });
            return result;
        } catch (error) {
            set({ error: "Failed to update order tag" });
            return { success: false, error: "Failed to update order tag" };
        }
    },

    deleteOrder: async (orderId) => {
        if (!orderId) {
            set({ error: "Order ID is required" });
            return { success: false, error: "Order ID is required" };
        }
        try {
            const url = `${BASE_URL}/api/deleteOrder/${userId}/${orderId}`;
            const response = await axios.delete(url);
            set(state => ({
                orders: state.orders.filter(order => order.id !== orderId),
                error: null,
                currentOrder: state.currentOrder && state.currentOrder.id === orderId ? null : state.currentOrder
            }));
            return { success: true, data: response.data };
        } catch (error) {
            const status = error?.response?.status;
            let errorMessage = "Failed to delete order";
            if (status === 429) errorMessage = "Rate limit exceeded, try again after some time";
            else if (status === 404) errorMessage = "Order not found";
            else if (error?.response?.data?.message) errorMessage = error.response.data.message;
            set({ error: errorMessage });
            return { success: false, error: errorMessage };
        }
    }
}));