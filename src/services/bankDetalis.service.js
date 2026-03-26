// src/services/settings/bankDetails.service.js
import api from "./api";

/* ===============================
   BANK DETAILS SERVICES
================================ */

/** CREATE */
export const createBankDetails = (formData) => {
  return api.post("/company-bank", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
};

export const updateBankDetails = (id, formData) => {
  return api.put(`/company-bank/${id}`, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
};


/** GET BY ID (EDIT) */
export const getBankDetailsById = (id) => {
  return api.get(`/company-bank/${id}`);
};

/** UPDATE */
// export const updateBankDetails = (id, formData) => {
//   return api.put(`/company-bank/${id}`, formData, {
 
//   });
// };

/** LIST */
export const getAllBankDetails = () => {
  return api.get("/company-bank");
};

/** DELETE */
export const deleteBankDetails = (id) => {
  return api.delete(`/company-bank/${id}`);
};
