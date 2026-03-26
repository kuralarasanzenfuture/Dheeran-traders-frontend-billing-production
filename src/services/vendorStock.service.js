import api from "./api";

/* CREATE */
export const createVendorStock = async (data) => {
  const res = await api.post("/vendor-stocks", data);
  return res.data;
};

/* GET ALL */
export const getVendorStocks = async () => {
  const res = await api.get("/vendor-stocks");
  return res.data;
};

/* DELETE */
export const deleteVendorStock = async (id) => {
  const res = await api.delete(`/vendor-stocks/${id}`);
  return res.data;
};

export const deleteVendorStockEntry = async (entryId) => {
  const res = await api.delete(`/vendor-stocks/entry/${entryId}`);
  return res.data;
};


/* ✅ UPDATE (THIS WAS MISSING) */
export const updateVendorStock = async (id, data) => {
  const res = await api.put(`/vendor-stocks/${id}`, data);
  return res.data;
};
