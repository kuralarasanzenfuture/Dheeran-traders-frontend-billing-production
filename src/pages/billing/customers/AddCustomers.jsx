import React, { useEffect, useState } from "react";
import {
  createCustomer,
  updateCustomer,
} from "../../../services/customer.service";
import "./customer.model.css";
import { toast } from "react-toastify";
export const AddCustomers = ({
  closeModal,
  editData,
  refresh = () => {}, // ✅ DEFAULT SAFE FUNCTION
}) => {

  const [formData, setFormData] = useState({
    first_name: "",
    last_name: "",
    phone: "",
    email: "",
    address: "",
  });

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  /* ================= PREFILL FOR EDIT ================= */
  useEffect(() => {
    if (editData) {
      setFormData({
        first_name: editData.first_name || "",
        last_name: editData.last_name || "",
        phone: editData.phone || "",
        email: editData.email || "",
        address: editData.address || "",
      });
    }
  }, [editData]);

  /* ================= VALIDATION ================= */
 const validate = () => {
  const e = {};

  if (!formData.first_name.trim()) {
    e.first_name = "First name is required";
  }

  if (!/^[6-9]\d{9}$/.test(formData.phone)) {
    e.phone = "Enter valid 10-digit phone number";
  }

  if (
    formData.email &&
    !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)
  ) {
    e.email = "Invalid email address";
  }

  setErrors(e);
  return Object.keys(e).length === 0;
};

  /* ================= HANDLERS ================= */
  const handleChange = (e) => {
    const { name, value } = e.target;

    // Prevent editing billing fields even if hacked
    if (
      ["advance_amount", "pending_amount", "stock", "total"].includes(name)
    ) {
      return;
    }

    setFormData({ ...formData, [name]: value });
    setErrors({ ...errors, [name]: "" });
  };


// const handleSubmit = async (e) => {
//   e.preventDefault();
//   if (loading) return;
//   if (!validate()) return;

//   setLoading(true);

//   try {
//     let res;

//     if (editData) {
//       res = await updateCustomer(editData.id, formData);
//       toast.success("Customer updated successfully");
//     } else {
//       res = await createCustomer(formData);
//       toast.success("Customer added successfully");
//     }

//    const newCustomer = res.data.customer ?? res.data;
// refresh(newCustomer);

//     closeModal();

//   } catch (err) {
//     console.error(err);
//     toast.error(
//       err.response?.data?.message ||
//       err.response?.data?.error ||
//       "Customer creation failed"
//     );
//   } finally {
//     setLoading(false);
//   }
// };

// const handleSubmit = async (e) => {
//   e.preventDefault();
//   if (loading) return;
//   if (!validate()) return;

//   setLoading(true);

//   try {
//     let res;

//     if (editData) {
//       res = await updateCustomer(editData.id, formData);
//       toast.success("Customer updated successfully");
//     } else {
//       res = await createCustomer(formData);
//       toast.success("Customer added successfully");
//     }

//     const newCustomer = res.data.customer ?? res.data;

//     refresh(newCustomer); // ✅ NOW TABLE UPDATES INSTANTLY
//     closeModal();

//   } catch (err) {
//     console.error(err);
//     toast.error(
//       err.response?.data?.message ||
//       err.response?.data?.error ||
//       "Customer creation failed"
//     );
//   } finally {
//     setLoading(false);
//   }
// };

// const handleSubmit = async (e) => {
//   e.preventDefault();
//   if (loading) return;
//   if (!validate()) return;

//   setLoading(true);

//   try {
//     let res;

//     if (editData) {
//       res = await updateCustomer(editData.id, formData);
//       toast.success("Customer updated successfully");
//     } else {
//       res = await createCustomer(formData);
//       toast.success("Customer added successfully");
//     }

//     // ✅ NORMALIZE CUSTOMER OBJECT
//     const newCustomerRaw = res.data.customer ?? res.data;

//     const newCustomer = {
//       ...newCustomerRaw,
//       id: newCustomerRaw.id || newCustomerRaw._id, // 🔥 IMPORTANT
//     };

//     refresh(newCustomer);
//     closeModal();

//   } catch (err) {
//     console.error(err);
//     toast.error(
//       err.response?.data?.message ||
//       err.response?.data?.error ||
//       "Customer creation failed"
//     );
//   } finally {
//     setLoading(false);
//   }
// };

const handleSubmit = async (e) => {
  e.preventDefault();
  if (loading) return;
  if (!validate()) return;

  setLoading(true);

  try {
    let res;

    if (editData) {
      await updateCustomer(editData.id, formData);

      // ✅ USE LOCAL DATA FOR UPDATE
      const updatedCustomer = {
        ...editData,
        ...formData,
        id: editData.id || editData._id,
      };

      refresh(updatedCustomer);
      toast.success("Customer updated successfully");
      closeModal();
      return; // 🔥 STOP HERE
    }

    // ================= CREATE CUSTOMER =================
    res = await createCustomer(formData);

    const data = res?.data;
    const newCustomerRaw = data?.customer || data;

    if (!newCustomerRaw) {
      throw new Error("Invalid API response");
    }

    const newCustomer = {
      ...newCustomerRaw,
      id: newCustomerRaw.id || newCustomerRaw._id,
    };

    refresh(newCustomer);
    toast.success("Customer added successfully");
    closeModal();

  } catch (err) {
    console.error("Customer save error:", err);
    toast.error(
      err.response?.data?.message ||
      err.message ||
      "Customer save failed"
    );
  } finally {
    setLoading(false);
  }
};

  return (
    <form onSubmit={handleSubmit} className="customer-modal-form">
      <div className="row gy-3">

        {/* ===== Editable Fields ===== */}
        <div className="col-md-4">
          <label>First Name *</label>
          <input
            name="first_name"
            value={formData.first_name}
            onChange={handleChange}
            className={`form-control ${errors.first_name && "is-invalid"}`}
          />
          <div className="invalid-feedback">{errors.first_name}</div>
        </div>

        <div className="col-md-4">
         <label>Last Name</label>

          <input
            name="last_name"
            value={formData.last_name}
            onChange={handleChange}
            className={`form-control ${errors.last_name && "is-invalid"}`}
          />
          <div className="invalid-feedback">{errors.last_name}</div>
        </div>

        <div className="col-md-4">
          <label>Phone *</label>
          <input
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            maxLength="10"
            className={`form-control ${errors.phone && "is-invalid"}`}
          />
          <div className="invalid-feedback">{errors.phone}</div>
        </div>

        <div className="col-md-4">
          <label>Email</label>
          <input
            name="email"
            value={formData.email}
            onChange={handleChange}
            className={`form-control ${errors.email && "is-invalid"}`}
          />
          <div className="invalid-feedback">{errors.email}</div>
        </div>

        <div className="col-md-8">
          <label>Address</label>
          <textarea
            name="address"
            rows="2"
            value={formData.address}
            onChange={handleChange}
            className="form-control"
          />
        </div>

        {/* ===== Billing Fields (READ ONLY) ===== */}
        {editData && (
          <>
            {/* <div className="col-md-3">
              <label>Advance Amount</label>
              <input
                value={`₹ ${editData.advance_amount || 0}`}
                disabled
                className="form-control"
              />
            </div> */}

            <div className="col-md-3">
              <label>Pending Amount</label>
              <input
                value={`₹ ${editData.pending_amount || 0}`}
                disabled
                className="form-control"
              />
            </div>

            {/* <div className="col-md-3">
              <label>Buy Stock</label>
              <input
                value={editData.stock || 0}
                disabled
                className="form-control"
              />
            </div> */}

            <div className="col-md-3">
              <label>Total</label>
              <input
                value={`₹ ${editData.total || 0}`}
                disabled
                className="form-control"
              />
            </div>
          </>
        )}

        <div className="col-12 text-end mt-3">
          <button className="btn main-btn" disabled={loading}>
            {loading
              ? "Saving..."
              : editData
              ? "Update Customer"
              : "Add Customer"}
          </button>
        </div>

      </div>
    </form>
  );
};
