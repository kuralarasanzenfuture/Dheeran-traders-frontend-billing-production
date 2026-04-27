import api from "./api";


export const createGST = async (gstData) =>{
     try{
         const response = await api.post("/company-gst", gstData);
            return response.data;
     }catch(error){
         console.error("Create GST Error:", error.response?.data || error.message);
         throw error;
     }
}


export const getAllGST = async () =>{
    try{
        const response = await api.get("/company-gst");
        return response.data;
    }catch(error){
        console.error("Get All GST Error:", error.response?.data || error.message);
        throw error;
    }
}

export const updateGST = async (id, gstData) =>{
    try{
        const response = await api.put(`/company-gst/${id}`, gstData);
        return response.data;
    }catch(error){
        console.error("Update GST Error:", error.response?.data || error.message);
        throw error;    
    }
}

export const deleteGST = async (id) =>{
    try{
        const response = await api.delete(`/company-gst/${id}`);
        return response.data;
    }catch(error){
        console.error("Delete GST Error:", error.response?.data || error.message);
        throw error;
    }
}


export const setDefaultGST = async (id) => {
    try {
      const response = await api.post(`/company-gst/set-default/${id}`);
        return response.data;
    } catch (error) {
      console.error("Set Default GST Error:", error.response?.data || error.message);
      throw error;
    }
  };