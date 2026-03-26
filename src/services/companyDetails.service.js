import api from "./api";

// GET latest company details
export const getCompanyDetails = async () => {
  const res = await api.get("/company-details");
  return res.data;
};

// CREATE company details
export const createCompanyDetails = async (data) => {
  const res = await api.post("/company-details", data);
  return res.data;
};

// UPDATE company details
export const updateCompanyDetails = async (id, data) => {
  const res = await api.put(`/company-details/${id}`, data);
  return res.data;
};

// DELETE company details
export const deleteCompanyDetails = async (id) => {
  const res = await api.delete(`/company-details/${id}`);
  return res.data;
};