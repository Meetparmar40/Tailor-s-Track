import {create} from "zustand";
import axios from "axios";

const BASE_URL = "http://localhost:3000";

const userId = "81a48fba-7155-4e50-8355-897840cde5c2";
// todo : apply valid oauth

export const useOrdersStore = create((set, get) => ({
    orders : [],
    loading : false,
    error : null,
    
    fetchOrders : async (customerId)=>{
        if(!customerId){
            set({error : "Customer Id is needed"});
        }
        set({loading : true});
        
        try {
            let response = await axios.get(`${BASE_URL}/api/getOrders/:${userId}/:${customerId}`);
            set({ orders : response.data.data, error : null})
        } catch (error) {
            if(err.status === 429)  set({error : "rate limit exceeded, try again after some time"});
            else set({error : "something went wrong"});
        } finally {
            set({loading : false});
        }
    },

    fetchAllOrders : async () => {
        set({loading : true});
        
        try {
            let response = await axios.get(`${BASE_URL}/api/getOrders/:${userId}?`);
            set({ orders : response.data.data, error : null})
        } catch (error) {
            if(err.status === 429)  set({error : "rate limit exceeded, try again after some time"});
            else set({error : "something went wrong"});
        } finally {
            set({loading : false});
        }

    }
})); 