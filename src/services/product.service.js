import api from "./api"; // axios instance

/* ================= GET ALL PRODUCTS ================= */
export const getProducts = async () => {
  try {
    const res = await api.get("/products");
    
    return res.data;
  } catch (error) {
    console.error("Get Products Error:", error.response?.data || error.message);
    throw error;
  }
};

/* ================= CREATE PRODUCT ================= */
export const createProduct = async (data) => {
  try {
    const res = await api.post("/products", data);
    return res.data;
  } catch (error) {
    console.error("Create Product Error:", error.response?.data || error.message);
    throw error;
  }
};

/* ================= GET PRODUCT BY ID ================= */
export const getProductById = async (id) => {
  try {
    const res = await api.get(`/products/${id}`);
    return res.data;
  } catch (error) {
    console.error("Get Product By ID Error:", error.response?.data || error.message);
    throw error;
  }
};

/* ================= UPDATE PRODUCT ================= */
export const updateProduct = async (id, data) => {
  try {
    const res = await api.put(`/products/${id}`, data);
    return res.data;
  } catch (error) {
    console.error("Update Product Error:", error.response?.data || error.message);
    throw error;
  }
};

/* ================= DELETE PRODUCT ================= */
export const deleteProduct = async (id) => {
  try {
    const res = await api.delete(`/products/${id}`);
    return res.data;
  } catch (error) {
    console.error("Delete Product Error:", error.response?.data || error.message);
    throw error;
  }
  
};
// export const updateProductStock = (id, stock) =>
//   api.patch(`/products/update-stock/${id}`, { stock });


export const updateProductStock = (id, data) => {
  return api.patch(`/products/update-stock/${id}`, data);
};