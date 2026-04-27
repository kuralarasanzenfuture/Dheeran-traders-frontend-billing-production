import api from "./api";


export const createCustomerReturn = async (data) =>{
     try{
         const res = await api.post("/returns", data);
            return res.data;
     }catch(error){
            console.error("Create Customer Return Error:", error.response?.data || error.message);
            throw error;
     }
}

export const getAllReturns = async () =>{
     try{
         const res = await api.get("/returns");
            return res.data;
     }catch(error){
            console.error("Get All Returns Error:", error.response?.data || error.message);
            throw error;
     }
}

export const getReturnWithInvoice = async (invoiceId) =>{
     try{
         const res = await api.get(`/returns/invoice/${invoiceId}`);
            return res.data;
     }catch(error){
            console.error("Get Return With Invoice Error:", error.response?.data || error.message);
            throw error;
     }
}
export const getReturnByBillingId = async (billingId) =>{
       try{
              const res = await api.get(`/returns/billing/${billingId}`);
                       return res.data;
       }catch(error){
              console.error("Get Return By Billing Id Error:", error.response?.data || error.message);
              throw error;
       }      
}

export const getReturnById = async (id) =>{
     try{
         const res = await api.get(`/returns/${id}`);
            return res.data;
     }catch(error){
            console.error("Get Return By Id Error:", error.response?.data || error.message);
            throw error;
     }
}      

export const deleteCustomerReturn = async (id) =>{
     try{
         const res = await api.delete(`/returns/${id}`);
            return res.data;
     }catch(error){
            console.error("Delete Customer Return Error:", error.response?.data || error.message);
            throw error;
     }
}


export const updateCustomerReturn = async (id, data) =>{
       try{
              const res = await api.put(`/returns/${id}`, data);
                       return res.data;
       }catch(error){
              console.error("Update Customer Return Error:", error.response?.data || error.message);
              throw error;
       }      
}