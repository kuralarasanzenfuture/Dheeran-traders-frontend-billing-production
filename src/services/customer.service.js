import api from "./api";

/**
 * CREATE CUSTOMER
 */
export const createCustomer = async (data) => {
  const res = await api.post("/customers", data);
  return res;
};

/**
 * GET ALL CUSTOMERS
 */
export const getCustomers = async () => {
  const res = await api.get("/customers");
  return res.data;
};

/**
 * GET CUSTOMER BY ID
 */
export const getCustomerById = async (id) => {
  const res = await api.get(`/customers/${id}`);
  return res.data;
};

/**
 * UPDATE CUSTOMER
 */
export const updateCustomer = async (id, data) => {
  const res = await api.put(`/customers/${id}`, data);
  return res.data;
};

/**
 * DELETE CUSTOMER
 */
export const deleteCustomer = async (id) => {
  const res = await api.delete(`/customers/${id}`);
  return res.data;
};
