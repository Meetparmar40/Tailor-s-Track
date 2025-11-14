import { create } from "zustand";
import axios from "axios";

const BASE_URL = `http://${window.location.hostname}:3000`;
const userId = "81a48fba-7155-4e50-8355-897840cde5c2";

export const useMeasurementsStore = create((set, get) => ({
    measurements: [],
    allMeasurements: [], // Global measurements for all customers
    loading: false,
    error: null,

    fetchAllMeasurements: async ({ limit = 1000 } = {}) => {
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

    fetchMeasurementsOfCustomer: async (customerId) => {
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

    addMeasurement: async (customerId, measurementData) => {
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
    

    updateMeasurement: async (customerId, measurementId, measurementData) => {
        try {
            const url = `${BASE_URL}/api/updateMeasurement/${userId}/${customerId}/${measurementId}`;
            const response = await axios.put(url, measurementData);
            const updatedMeasurement = response.data.data;
            const updatedMeasurements = get().measurements.map(m => 
                m.id === measurementId ? updatedMeasurement : m
            );
            const updatedAllMeasurements = get().allMeasurements.map(m => 
                m.id === measurementId ? updatedMeasurement : m
            );
            set({ 
                measurements: updatedMeasurements,
                allMeasurements: updatedAllMeasurements
            });
            return { success: true, data: updatedMeasurement };
        } catch (error) {
            const status = error?.response?.status;
            let errorMessage = "Failed to update measurement";
            if (status === 429) errorMessage = "Rate limit exceeded, try again after some time";
            else if (error?.response?.data?.message) errorMessage = error.response.data.message;
            
            set({ error: errorMessage });
            return { success: false, error: errorMessage };
        }
    },

    deleteMeasurement: async (customerId, measurementId) => {
        if (!customerId || !measurementId) {
            set({ error: "Customer ID and Measurement ID are required" });
            return { success: false, error: "Customer ID and Measurement ID are required" };
        }

        try {
            const url = `${BASE_URL}/api/deleteMeasurement/${userId}/${customerId}/${measurementId}`;
            const response = await axios.delete(url);
            
            set(state => ({
                measurements: state.measurements.filter(measurement => measurement.id !== measurementId),
                allMeasurements: state.allMeasurements.filter(measurement => measurement.id !== measurementId),
                error: null
            }));
            
            return { success: true, data: response.data };
        } catch (error) {
            const status = error?.response?.status;
            let errorMessage = "Failed to delete measurement";
            
            if (status === 429) {
                errorMessage = "Rate limit exceeded, try again after some time";
            } else if (status === 404) {
                errorMessage = "Measurement not found";
            } else if (error?.response?.data?.message) {
                errorMessage = error.response.data.message;
            }
            
            set({ error: errorMessage });
            return { success: false, error: errorMessage };
        }
    },

    clearMeasurements: () => {
        set({ measurements: [], error: null });
    }
}));