import {create} from "zustand";
import axios from "axios";

const BASE_URL = `http://${window.location.hostname}:3000`;

const userId = "81a48fba-7155-4e50-8355-897840cde5c2";
// todo : apply oauth

export const useCustomersStore = create((set, get)=>({
    customers : [],
    loading : false,    
    error : null,
    hasMore : true,
    isLoadingMore : false,
    lastDate : null,
    
    fetchCustomers : async ({ limit = 10, lastDate } = {}) => {
        set({loading : true});
 
        try{
            const params = new URLSearchParams();
            if (limit) params.append("limit", limit);
            if (lastDate) params.append("lastDate", lastDate);

            const url = `${BASE_URL}/api/getAllCustomers/${userId}` + (params.toString() ? `?${params.toString()}` : "");

            const response = await axios.get(url);
            const { data, hasMore, lastDate: nextCursor } = response.data;
            set({ customers: data, error: null, hasMore, lastDate: nextCursor });

        } catch(err){
            if(err?.status === 429)  set({error : "rate limit exceeded, try again after some time"});
            else set({error : "something went wrong"});
            
        } finally {
            set({loading:false});
        }
    },

    fetchMoreCustomers : async ({ limit = 10 } = {}) => {
        const { hasMore, lastDate, isLoadingMore } = get();
        if (!hasMore || isLoadingMore) return;
        set({isLoadingMore : true});
        try{
            const params = new URLSearchParams();
            if (limit) params.append("limit", limit);
            if (lastDate) params.append("lastDate", lastDate);
            const url = `${BASE_URL}/api/getAllCustomers/${userId}` + (params.toString() ? `?${params.toString()}` : "");
            const response = await axios.get(url);
            const { data, hasMore: more, lastDate: nextCursor } = response.data;
            set({ customers: [...get().customers, ...data],
                error: null, hasMore: more, 
                lastDate: nextCursor,
            });
        } catch(err){
            if(err?.status === 429)  set({error : "rate limit exceeded, try again after some time"});
            else set({error : "something went wrong"});
        } finally {
            set({loading:false, isLoadingMore : false});
        }
    },

    updateCustomer: async (customerId, customerData) => {
        if (!customerId) {
            set({ error: "Customer ID is required" });
            return { success: false, error: "Customer ID is required" };
        }

        set({ loading: true, error: null });

        try {
            const url = `${BASE_URL}/api/updateCustomer/${userId}/${customerId}`;
            const response = await axios.put(url, customerData);
            
            const updatedCustomer = response.data.data;
            
            set(state => ({
                customers: state.customers.map(customer => 
                    customer.id === customerId ? { ...customer, ...updatedCustomer } : customer
                ),
                loading: false,
                error: null
            }));
            
            return { success: true, data: updatedCustomer };
        } catch (error) {
            const status = error?.response?.status;
            let errorMessage = "Failed to update customer";
            
            if (status === 429) {
                errorMessage = "Rate limit exceeded, try again after some time";
            } else if (status === 400) {
                errorMessage = "Invalid customer data provided";
            } else if (status === 404) {
                errorMessage = "Customer not found";
            } else if (error?.response?.data?.message) {
                errorMessage = error.response.data.message;
            }
            
            set({ error: errorMessage, loading: false });
            return { success: false, error: errorMessage };
        }
    },

    addCustomer: async (customerData) => {
        set({ loading: true, error: null });

        try {
            const url = `${BASE_URL}/api/createUser/${userId}`;
            const response = await axios.post(url, customerData);
            
            const newCustomer = response.data.data;
            set(state => ({
                customers: [newCustomer, ...state.customers],
                loading: false,
                error: null
            }));
            
            return { success: true, data: newCustomer };
        } catch (error) {
            const status = error?.response?.status;
            let errorMessage = "Failed to create customer";
            
            if (status === 429) {
                errorMessage = "Rate limit exceeded, try again after some time";
            } else if (status === 400) {
                errorMessage = "Invalid customer data provided";
            } else if (error?.response?.data?.message) {
                errorMessage = error.response.data.message;
            }
            
            set({ error: errorMessage, loading: false });
            return { success: false, error: errorMessage };
        }
    },

    deleteCustomer: async (customerId) => {
        if (!customerId) {
            set({ error: "Customer ID is required" });
            return { success: false, error: "Customer ID is required" };
        }

        try {
            const url = `${BASE_URL}/api/deleteCustomer/${userId}/${customerId}`;
            const response = await axios.delete(url);
            
            set(state => ({
                customers: state.customers.filter(customer => customer.id !== customerId),
                error: null
            }));
            
            return { success: true, data: response.data };
        } catch (error) {
            const status = error?.response?.status;
            let errorMessage = "Failed to delete customer";
            
            if (status === 429) {
                errorMessage = "Rate limit exceeded, try again after some time";
            } else if (status === 404) {
                errorMessage = "Customer not found";
            } else if (error?.response?.data?.message) {
                errorMessage = error.response.data.message;
            }
            
            set({ error: errorMessage });
            return { success: false, error: errorMessage };
        }
    }
}));