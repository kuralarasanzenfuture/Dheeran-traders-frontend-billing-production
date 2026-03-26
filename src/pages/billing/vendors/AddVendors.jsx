
import {
  createVendor,
  updateVendor,
} from "../../../services/vendor.service";
import { toast } from "react-toastify";
import "./vendor.model.css";
import React, { useEffect, useState } from "react";


export const AddVendors = ({ closeModal, refresh, editData }) => {
  const isEditMode = Boolean(editData?.id);

  const [formData, setFormData] = useState({
    first_name: editData?.first_name || "",
    last_name: editData?.last_name || "",
    phone: editData?.phone || "",
    email: editData?.email || "",
    address: editData?.address || "",
    bank_name: editData?.bank_name || "",
    bank_account_number: editData?.bank_account_number || "",
    bank_ifsc_code: editData?.bank_ifsc_code || "",
    bank_branch_name: editData?.bank_branch_name || "",
  });
useEffect(() => {
  if (editData) {
    setFormData({
      first_name: editData.first_name || "",
      last_name: editData.last_name || "",
      phone: editData.phone || "",
      email: editData.email || "",
      address: editData.address || "",
      bank_name: editData.bank_name || "",
      bank_account_number: editData.bank_account_number || "",
      bank_ifsc_code: editData.bank_ifsc_code || "",
      bank_branch_name: editData.bank_branch_name || "",
    });
  } else {
    // reset for ADD
    setFormData({
      first_name: "",
      last_name: "",
      phone: "",
      email: "",
      address: "",
      bank_name: "",
      bank_account_number: "",
      bank_ifsc_code: "",
      bank_branch_name: "",
    });
  }
}, [editData]);

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  /* ================= VALIDATION ================= */
  const validate = () => {
    const e = {};

    if (!formData.first_name.trim())
      e.first_name = "First name is required";

    // if (!formData.last_name.trim())
    //   e.last_name = "Last name is required";

    if (!/^[0-9]{10,15}$/.test(formData.phone))
      e.phone = "Mobile number must be 10–15 digits";

    if (formData.email && !/^\S+@\S+\.\S+$/.test(formData.email))
      e.email = "Invalid email address";

    if (
      formData.bank_account_number &&
      !/^[0-9]{6,30}$/.test(formData.bank_account_number)
    )
      e.bank_account_number = "Account number must be 6–30 digits";

    if (
      formData.bank_ifsc_code &&
      !/^[A-Z]{4}0[A-Z0-9]{6}$/.test(formData.bank_ifsc_code)
    )
      e.bank_ifsc_code = "Invalid IFSC code (ex: SBIN0001234)";

    setErrors(e);
    return Object.keys(e).length === 0;
  };

  /* ================= HANDLE CHANGE ================= */
  const handleChange = (e) => {
    const { name, value } = e.target;

    // numeric only
    if (["phone", "bank_account_number"].includes(name)) {
      if (!/^\d*$/.test(value)) return;
    }

    if (name === "bank_ifsc_code") {
      setFormData({ ...formData, [name]: value.toUpperCase() });
      setErrors({ ...errors, [name]: "" });
      return;
    }

    setFormData({ ...formData, [name]: value });
    setErrors({ ...errors, [name]: "" });
  };

  /* ================= SUBMIT ================= */
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validate()) {
      toast.error("Please fix the highlighted errors");
      return;
    }

    try {
      setLoading(true);

     let res;

if (isEditMode) {
  await updateVendor(editData.id, {
    ...formData,
  
  });

  refresh({
    ...editData,
    ...formData,
    
    id: editData.id,
  });

  toast.success("Vendor updated successfully");
}
 else {
  await createVendor(formData);

  await refresh("delete"); // reuse fetch logic

  toast.success("Vendor added successfully");
}

closeModal();


    } catch (err) {
      toast.error(err.response?.data?.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="vendor-form">
      <div className="row g-3">

        {/* ===== BASIC DETAILS ===== */}
        <div className="col-md-4">
          <label>First Name *</label>
          <input
            name="first_name"
            className={`form-control ${errors.first_name ? "is-invalid" : ""}`}
            value={formData.first_name}
            onChange={handleChange}
          />
          <div className="invalid-feedback">{errors.first_name}</div>
        </div>

        <div className="col-md-4">
          <label>Last Name </label>
          <input
            name="last_name"
            className={`form-control ${errors.last_name ? "is-invalid" : ""}`}
            value={formData.last_name}
            onChange={handleChange}
          />
          <div className="invalid-feedback">{errors.last_name}</div>
        </div>

        <div className="col-md-4">
          <label>Mobile Number *</label>
          <input
            name="phone"
            maxLength="15"
            className={`form-control ${errors.phone ? "is-invalid" : ""}`}
            value={formData.phone}
            onChange={handleChange}
            disabled={false} // 🔒 prevent phone change in edit
          />
          <div className="invalid-feedback">{errors.phone}</div>
        </div>

        <div className="col-md-4">
          <label>Email</label>
          <input
            name="email"
            className={`form-control ${errors.email ? "is-invalid" : ""}`}
            value={formData.email}
            onChange={handleChange}
          />
          <div className="invalid-feedback">{errors.email}</div>
        </div>

        <div className="col-md-8">
          <label>Address</label>
          <textarea
            name="address"
            rows="2"
            className="form-control"
            value={formData.address}
            onChange={handleChange}
          />
        </div>

        {/* ===== BANK DETAILS ===== */}
        <div className="col-md-4">
          <label>Bank Name</label>
          <input
            name="bank_name"
            className="form-control"
            value={formData.bank_name}
            onChange={handleChange}
          />
        </div>

        <div className="col-md-4">
          <label>Account Number</label>
          <input
            name="bank_account_number"
            className={`form-control ${
              errors.bank_account_number ? "is-invalid" : ""
            }`}
            value={formData.bank_account_number}
            onChange={handleChange}
          />
          <div className="invalid-feedback">
            {errors.bank_account_number}
          </div>
        </div>

        <div className="col-md-4">
          <label>IFSC Code</label>
          <input
            name="bank_ifsc_code"
            maxLength="11"
            className={`form-control ${
              errors.bank_ifsc_code ? "is-invalid" : ""
            }`}
            value={formData.bank_ifsc_code}
            onChange={handleChange}
          />
          <div className="invalid-feedback">{errors.bank_ifsc_code}</div>
        </div>

        <div className="col-md-6">
          <label>Bank Branch Name</label>
          <input
            name="bank_branch_name"
            className="form-control"
            value={formData.bank_branch_name}
            onChange={handleChange}
          />
        </div>

        {/* ===== ACTION ===== */}
        <div className="col-12 text-end mt-3">
          <button className="btn main-btn" disabled={loading}>
            {loading
              ? "Saving..."
              : isEditMode
              ? "Update Vendor"
              : "Add Vendor"}
          </button>
        </div>

      </div>
    </form>
  );
};
