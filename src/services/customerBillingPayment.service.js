import api from "./api";

/* ➕ ADD PAYMENT */
export const addCustomerPayment = (data) => {
  return api.post("/customer-payments", data);
};

/* 📜 PAYMENT HISTORY */
export const getPaymentsByBillingId = (billing_id) => {
  return api.get(`/customer-payments/${billing_id}`);
};

/* 📊 INVOICE + PAID + BALANCE */
export const getInvoiceWithPayments = (billing_id) => {
  return api.get(`/customer-payments/invoice/${billing_id}`);
};
export const getAllPayments = async () => {
  const res = await api.get("/customer-payments");
  return res.data;
};

export const updateCustomerPayment = async (id, data) => {
  try {
    return await api.put(`/customer-payments/${id}`, data);
  } catch (error) {
    console.error("Error updating customer payment:", error);
    throw error;
  }
};

export const deleteCustomerPayment = async (id) => {
  try {
    return await api.delete(`/customer-payments/${id}`);
  } catch (error) {
    console.error("Error deleting customer payment:", error);
    throw error;
  }
};