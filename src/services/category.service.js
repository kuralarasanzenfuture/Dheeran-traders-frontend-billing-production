import api from "./api";

export const getCategories = async () => {
  const res = await api.get("/categories");
  return res.data;
};
/* ================= BRAND + CATEGORY DROPDOWN ================= */

/* ✅ FIXED: matches backend route */
export const getBrandCategoryDropdown = async () => {
  const res = await api.get("/categories/brand-category");
  return res.data;
};
export const createCategory = async (data) => {
  const res = await api.post("/categories", data);
  console.log(res.data);

  return res.data;
 };


export const updateCategory = async (id, data) => {
  const res = await api.put(`/categories/${id}`, data);
  return res.data;
};

export const deleteCategory = async (id) => {
  await api.delete(`/categories/${id}`);
};
