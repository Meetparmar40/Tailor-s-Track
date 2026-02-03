import { create } from "zustand";
import axios from "axios";
import API_URL from "@/lib/api";
import { notify } from "@/hooks/use-toast";

const BASE_URL = API_URL;

export const useMeasurementsStore = create((set, get) => ({
    measurements: [],
    allMeasurements: [],
    loading: false,
    error: null,

    fetchAllMeasurements: async (userId, { limit = 1000 } = {}) => {
        if (!userId) {
            set({ error: "User not authenticated" });
            notify.error("User not authenticated");
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
            if (status === 429) {
                set({ error: "rate limit exceeded, try again after some time" });
                notify.warning("Rate limit exceeded. Please try again later.");
            } else {
                set({ error: "something went wrong" });
                notify.error("Failed to load measurements");
            }
        } finally {
            set({ loading: false });
        }
    },

    fetchMeasurementsOfCustomer: async (userId, customerId) => {
        if (!userId) {
            set({ error: "User not authenticated" });
            notify.error("User not authenticated");
            return;
        }
        if (!customerId) {
            set({ error: "Customer Id is needed" });
            notify.error("Customer ID is required");
            return;
        }
        set({ loading: true });

        try {
            const url = `${BASE_URL}/api/getMeasurements/${userId}/${customerId}`;
            const response = await axios.get(url);
            set({ measurements: response.data.data || [], error: null });
        } catch (error) {
            const status = error?.response?.status;
            if (status === 429) {
                set({ error: "rate limit exceeded, try again after some time" });
                notify.warning("Rate limit exceeded. Please try again later.");
            } else {
                set({ error: "something went wrong" });
                notify.error("Failed to load customer measurements");
            }
        } finally {
            set({ loading: false });
        }
    },

    addMeasurement: async (userId, customerId, measurementData) => {
        if (!userId) {
            notify.error("User not authenticated");
            return { success: false, error: "User not authenticated" };
        }
        if (!customerId) {
            notify.error("Customer ID is required");
            return { success: false, error: "Customer Id is needed" };
        }

        // Validate measurement data
        if (!measurementData.name?.trim()) {
            notify.warning("Please enter a measurement name");
            return { success: false, error: "Name is required" };
        }

        try {
            const url = `${BASE_URL}/api/addMeasurement/${userId}/${customerId}`;
            const response = await axios.post(url, measurementData);
            const newMeasurement = response.data.data;
            set({ 
                measurements: [...get().measurements, newMeasurement],
                allMeasurements: [...get().allMeasurements, newMeasurement]
            });
            notify.success("Measurement added successfully");
            return { success: true, data: newMeasurement };
        } catch (error) {
            const status = error?.response?.status;
            if (status === 429) {
                notify.warning("Rate limit exceeded. Please try again later.");
                return { success: false, error: "Rate limit exceeded" };
            }
            if (status === 400) {
                const errorMessage = error?.response?.data?.message || "Invalid measurement data";
                notify.error(errorMessage);
                return { success: false, error: errorMessage };
            }
            notify.error("Failed to add measurement");
            return { success: false, error: "Failed to add measurement" };
        }
    },

    updateMeasurement: async (userId, customerId, measurementId, measurementData) => {
        if (!userId) {
            notify.error("User not authenticated");
            return { success: false, error: "User not authenticated" };
        }
        if (!measurementId) {
            notify.error("Measurement ID is required");
            return { success: false, error: "Measurement Id is needed" };
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
            notify.success("Measurement updated successfully");
            return { success: true, data: updatedMeasurement };
        } catch (error) {
            const status = error?.response?.status;
            if (status === 429) {
                notify.warning("Rate limit exceeded. Please try again later.");
                return { success: false, error: "rate limit exceeded" };
            }
            if (status === 400) {
                notify.error("Invalid measurement data. Please check your inputs.");
                return { success: false, error: "Invalid data" };
            }
            notify.error("Failed to update measurement");
            return { success: false, error: "Failed to update measurement" };
        }
    },

    deleteMeasurement: async (userId, customerId, measurementId) => {
        if (!userId) {
            notify.error("User not authenticated");
            return { success: false, error: "User not authenticated" };
        }
        if (!measurementId) {
            notify.error("Measurement ID is required");
            return { success: false, error: "Measurement Id is needed" };
        }

        try {
            const url = `${BASE_URL}/api/deleteMeasurement/${userId}/${customerId}/${measurementId}`;
            await axios.delete(url);
            set({
                measurements: get().measurements.filter(m => m.id !== measurementId),
                allMeasurements: get().allMeasurements.filter(m => m.id !== measurementId)
            });
            notify.success("Measurement deleted successfully");
            return { success: true };
        } catch (error) {
            const status = error?.response?.status;
            if (status === 429) {
                notify.warning("Rate limit exceeded. Please try again later.");
                return { success: false, error: "rate limit exceeded" };
            }
            notify.error("Failed to delete measurement");
            return { success: false, error: "Failed to delete measurement" };
        }
    },

    clearMeasurements: () => set({ measurements: [] }),
    clearError: () => set({ error: null }),
}));