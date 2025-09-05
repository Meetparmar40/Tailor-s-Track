import { create } from "zustand";
import axios from "axios";

const BASE_URL = "http://localhost:3000";
const userId = "81a48fba-7155-4e50-8355-897840cde5c2";

export const useMeasurementsStore = create((set, get) => ({
    measurements: [],
    loading: false,
    error: null,

    fetchMeasurementsOfCustomer: async (customerId) => {
        if (!customerId) {
            set({ error: "Customer Id is needed" });
            return;
        }
        set({ loading: true });

        try {
            const url = `${BASE_URL}/api/getMeasurements/${userId}/${customerId}`;
            const response = await axios.get(url);
            set({ measurements: response.data.data, error: null });
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
            set({ measurements: [...get().measurements, response.data.data] });
            return response.data;
        } catch (error) {
            const status = error?.response?.status;
            if (status === 429) set({ error: "rate limit exceeded, try again after some time" });
            else set({ error: "something went wrong" });
            throw error;
        }
    },

    updateMeasurement: async (customerId, measurementId, measurementData) => {
        try {
            const url = `${BASE_URL}/api/updateMeasurement/${userId}/${customerId}/${measurementId}`;
            const response = await axios.put(url, measurementData);
            const updatedMeasurements = get().measurements.map(m => 
                m.id === measurementId ? response.data.data : m
            );
            set({ measurements: updatedMeasurements });
            return response.data;
        } catch (error) {
            const status = error?.response?.status;
            if (status === 429) set({ error: "rate limit exceeded, try again after some time" });
            else set({ error: "something went wrong" });
            throw error;
        }
    },

    clearMeasurements: () => {
        set({ measurements: [], error: null });
    }
}));