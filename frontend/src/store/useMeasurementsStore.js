import { create } from "zustand";
import axios from "axios";

const BASE_URL = import.meta.env.MODE === "development" 
  ? `http://${window.location.hostname}:3000` 
  : '';

export const useMeasurementsStore = create((set, get) => ({
    measurements: [],
    allMeasurements: [],
    loading: false,
    error: null,

    fetchAllMeasurements: async (userId, { limit = 1000 } = {}) => {
        if (!userId) {
            set({ error: "User not authenticated" });
            return;
        }
        set({ loading: true });

        try {
            const params = new URLSearchParams();
            if (limit) params.append("limit", limit);

            const url = `${BASE_URL}/api/getAllMeasurements/${userId}` + (params.toString() ? `?${params.toString()}` : "");
            const response = await axios.get(url);
            set({ allMeasurements: response.data.data || [], error: null });
        } catch (error) {
            const status = error?.response?.status;
            if (status === 429) set({ error: "rate limit exceeded, try again after some time" });
            else set({ error: "something went wrong" });
        } finally {
            set({ loading: false });
        }
    },

    fetchMeasurementsOfCustomer: async (userId, customerId) => {
        if (!userId) {
            set({ error: "User not authenticated" });
            return;
        }
        if (!customerId) {
            set({ error: "Customer Id is needed" });
            return;
        }
        set({ loading: true });

        try {
            const url = `${BASE_URL}/api/getMeasurements/${userId}/${customerId}`;
            const response = await axios.get(url);
            set({ measurements: response.data.data || [], error: null });
        } catch (error) {
            const status = error?.response?.status;
            if (status === 429) set({ error: "rate limit exceeded, try again after some time" });
            else set({ error: "something went wrong" });
        } finally {
            set({ loading: false });
        }
    },

    addMeasurement: async (userId, customerId, measurementData) => {
        if (!userId) {
            return { success: false, error: "User not authenticated" };
        }
        try {
            const url = `${BASE_URL}/api/addMeasurement/${userId}/${customerId}`;
            const response = await axios.post(url, measurementData);
            const newMeasurement = response.data.data;
            set({ 
                measurements: [...get().measurements, newMeasurement],
                allMeasurements: [...get().allMeasurements, newMeasurement]
            });
            return { success: true, data: newMeasurement };
        } catch (error) {
            const status = error?.response?.status;
            let errorMessage = "Failed to add measurement";
            if (status === 429) errorMessage = "Rate limit exceeded, try again after some time";
            else if (error?.response?.data?.message) errorMessage = error.response.data.message;
            
            set({ error: errorMessage });
            return { success: false, error: errorMessage };
        }
    },

    updateMeasurement: async (userId, customerId, measurementId, measurementData) => {
        if (!userId) {
            return { success: false, error: "User not authenticated" };
        }
        try {
            const url = `${BASE_URL}/api/updateMeasurement/${userId}/${customerId}/${measurementId}`;
            const response = await axios.put(url, measurementData);
            const updatedMeasurement = response.data.data;
            set({
                measurements: get().measurements.map(m => 
                    m.id === measurementId ? updatedMeasurement : m
                ),
                allMeasurements: get().allMeasurements.map(m => 
                    m.id === measurementId ? updatedMeasurement : m
                )
            });
            return { success: true, data: updatedMeasurement };
        } catch (error) {
            const status = error?.response?.status;
            if (status === 429) return { success: false, error: "rate limit exceeded" };
            return { success: false, error: "Failed to update measurement" };
        }
    },

    deleteMeasurement: async (userId, customerId, measurementId) => {
        if (!userId) {
            return { success: false, error: "User not authenticated" };
        }
        try {
            const url = `${BASE_URL}/api/deleteMeasurement/${userId}/${customerId}/${measurementId}`;
            await axios.delete(url);
            set({
                measurements: get().measurements.filter(m => m.id !== measurementId),
                allMeasurements: get().allMeasurements.filter(m => m.id !== measurementId)
            });
            return { success: true };
        } catch (error) {
            const status = error?.response?.status;
            if (status === 429) return { success: false, error: "rate limit exceeded" };
            return { success: false, error: "Failed to delete measurement" };
        }
    },

    clearMeasurements: () => set({ measurements: [] }),
    clearError: () => set({ error: null }),
}));