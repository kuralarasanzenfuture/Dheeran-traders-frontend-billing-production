import api from "./api";

export const getQuantity = async () => {
  const res = await api.get("/quantities");
  return res.data;
};

export const createQuantity = async (data) => {
  const res = await api.post("/quantities", data);
  return res.data;
};

export const updateQuantity = async (id, data) => {
  const res = await api.put(`/quantities/${id}`, data);
  return res.data;
};

export const deleteQuantity = async (id) => {
  await api.delete(`/quantities/${id}`);
};
    