import api from "./api";

/**
 * ➕ CREATE CUSTOMER BILLING (INVOICE)
 */
export const createCustomerBilling = async (data) => {
  try {
    const res = await api.post("/customer-billing", data);
    return res.data;
  } catch (error) {
    console.error(
      "Create Customer Billing Error:",
      error.response?.data || error.message
    );
    throw error;
  }
};

/**
 * 📄 GET ALL CUSTOMER BILLINGS
 */
export const getAllCustomerBillings = async () => {
  try {
    const res = await api.get("/customer-billing");
    return res.data;
  } catch (error) {
    console.error(
      "Get Customer Billings Error:",
      error.response?.data || error.message
    );
    throw error;
  }
};

/**
 * 🔍 GET SINGLE CUSTOMER BILLING BY ID
 */
export const getCustomerBillingById = async (id) => {
  try {
    const res = await api.get(`/customer-billing/${id}`);
    // console.log(res.data);
    
    return res.data;
  } catch (error) {
    console.error(
      "Get Customer Billing By ID Error:",
      error.response?.data || error.message
    );
    throw error;
  }
};
export const getBrandWiseReport = async () => {
  const res = await api.get("/customer-billing/brands");

  // 🔒 Force array
  return Array.isArray(res.data) ? res.data : [];
};
/* GET ONLY PENDING */
export const getPendingBills = async () => {
  const res = await api.get("/customer-billing/pending");
  return res.data;
};
  
// export const getProductWiseReport = async (fromDate, toDate) => {
//   const res = await api.get("/customer-billing/products", {
//     params: { fromDate, toDate }
//   });
//   return res.data;
// };
export const getProductWiseReport = async () => {
  const res = await api.get("/customer-billing/products");
  return Array.isArray(res.data) ? res.data : [];
};

export const getProductWiseReportByDate = async (from, to) => {
  const res = await api.get(`/customer-billing/products-by-date`, {
    params: { fromDate: from, toDate: to },
  });
  return Array.isArray(res.data) ? res.data : [];
};

export const updateCustomerBilling = (id, data, adminPassword) => {
  return api.put(`/customer-billing/${id}`, {
    ...data,
    adminPassword,
  });
};
export const deleteCustomerBilling = (id, adminPassword) => {
  return api.delete(`/customer-billing/${id}`, {
    data: {
      adminPassword,   // 👈 MUST match backend
    },
  });
};

