import {create} from "zustand";
import axios from "axios";

const BASE_URL = "http://localhost:3000";

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
    }
}));