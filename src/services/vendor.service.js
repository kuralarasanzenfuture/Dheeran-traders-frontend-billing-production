import api from "./api";

/**
 * =========================
 * CREATE VENDOR
 * =========================
 */
export const createVendor = async (data) => {
  const res = await api.post("/vendors", data);
  return res.data;
};

/**
 * =========================
 * GET ALL VENDORS
 * =========================
 */
export const getVendors = async () => {
  const res = await api.get("/vendors");
  return res.data;
};

/**
 * =========================
 * GET VENDOR BY ID
 * =========================
 */
export const getVendorById = async (id) => {
  const res = await api.get(`/vendors/${id}`);
  return res.data;
};

/**
 * =========================
 * UPDATE VENDOR
 * =========================
 */
export const updateVendor = async (id, data) => {
  const res = await api.put(`/vendors/${id}`, data);
  return res.data;
};

/**
 * =========================
 * DELETE VENDOR
 * =========================
 */
export const deleteVendor = async (id) => {
  const res = await api.delete(`/vendors/${id}`);
  return res.data;
};
