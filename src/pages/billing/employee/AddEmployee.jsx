import React, { useState, useEffect } from "react";
import {
  createEmployee,
  updateEmployee,
} from "../../../services/employee.service";
import { toast } from "react-toastify";

export const AddEmployee = ({ editData, onSuccess }) => {


  
  

  const [formData, setFormData] = useState({
    employee_name: "",
    email: "",
    phone: "",
    date_of_birth: "",
    gender: "",
    address: "",
    aadhar_number: "",
    pan_number: "",
    bank_name: "",
    bank_account_number: "",
    ifsc_code: "",
    emergency_contact_name: "",
    emergency_contact_phone: "",
    emergency_contact_relation: "",
    status: "active",
  });

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  useEffect(() => {
  if (editData) {
    setFormData({
      employee_name: editData.employee_name ?? "",
      email: editData.email ?? "",
      phone: editData.phone ?? "",
      date_of_birth: editData.date_of_birth
        ? editData.date_of_birth.slice(0, 10)
        : "",
      gender: editData.gender ?? "",
      address: editData.address ?? "",
      aadhar_number: editData.aadhar_number ?? "",
      pan_number: editData.pan_number ?? "",
      bank_name: editData.bank_name ?? "",
      bank_account_number: editData.bank_account_number ?? "",
      ifsc_code: editData.ifsc_code ?? "",
      emergency_contact_name: editData.emergency_contact_name ?? "",
      emergency_contact_phone: editData.emergency_contact_phone ?? "",
      emergency_contact_relation: editData.emergency_contact_relation ?? "",
      status: editData.status ?? "active",
    });
  }
}, [editData]);


  
  /* ================= VALIDATION RULES ================= */
  const validators = {
  employee_name: (v) =>
    /^[A-Za-z\s]+$/.test(v.trim()) || "Employee name must contain only letters",

  email: (v) =>
    !v || /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v) || "Invalid email format",

  phone: (v) =>
    !v || /^\d{10}$/.test(v) || "Phone must be 10 digits",

  aadhar_number: (v) =>
    !v || /^\d{12}$/.test(v) || "Aadhaar must be 12 digits",

  pan_number: (v) =>
    !v || /^[A-Z]{5}[0-9]{4}[A-Z]$/.test(v) || "PAN format: ABCDE1234F",

  ifsc_code: (v) =>
    !v || /^[A-Z]{4}0[A-Z0-9]{6}$/.test(v) || "Invalid IFSC code",

  bank_account_number: (v) =>
    !v || /^\d{9,18}$/.test(v) || "Account number must be 9–18 digits",

  emergency_contact_name: (v) =>
    !v || /^[A-Za-z\s]+$/.test(v) || "Name must contain only letters",

  emergency_contact_relation: (v) =>
    !v || /^[A-Za-z\s]+$/.test(v) || "Relation must contain only letters",

  emergency_contact_phone: (v) =>
    !v || /^\d{10}$/.test(v) || "Emergency phone must be 10 digits",
};


  /* ================= LIVE FIELD VALIDATION ================= */
  const validateField = (name, value) => {
    if (!validators[name]) return;

    const result = validators[name](value);
    setErrors((prev) => ({
      ...prev,
      [name]: result === true ? "" : result,
    }));
  };

  /* ================= HANDLE CHANGE ================= */
  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    validateField(name, value);
  };

  /* ================= FORM VALIDATION ================= */
  const validateForm = () => {
    let newErrors = {};

    Object.keys(validators).forEach((key) => {
      const result = validators[key](formData[key] || "");
      if (result !== true) newErrors[key] = result;
    });

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
/* ================= SUBMIT ================= */
const handleSubmit = async (e) => {
  e.preventDefault();

  if (!validateForm()) {
    toast.error("Please fix the highlighted errors");
    return;
  }

  try {
    setLoading(true);

    // ✅ BUILD PAYLOAD
    const payload = {
      employee_name: formData.employee_name || null,
      email: formData.email || null,
      phone: formData.phone || null,
      date_of_birth: formData.date_of_birth || null,
      gender: formData.gender || null,
      address: formData.address || null,
      aadhar_number: formData.aadhar_number || null,
      pan_number: formData.pan_number || null,
      bank_name: formData.bank_name || null,
      bank_account_number: formData.bank_account_number || null,
      ifsc_code: formData.ifsc_code || null,
      emergency_contact_name: formData.emergency_contact_name || null,
      emergency_contact_phone: formData.emergency_contact_phone || null,
      emergency_contact_relation: formData.emergency_contact_relation || null,
      status: formData.status || "active",
    };

    // ✅ ADD vs EDIT
    if (editData?.id) {
      await updateEmployee(editData.id, payload);
      toast.success("Employee updated successfully");
    } else {
      await createEmployee(payload);
      toast.success("Employee added successfully");
    }

    onSuccess && onSuccess();
  } catch (error) {
    toast.error(
      error.response?.data?.message || "Operation failed"
    );
  } finally {
    setLoading(false);
  }
};



const inputClass = (name) =>
  `form-control ${errors[name] ? "is-invalid" : ""}`;

  return (
    <div className="row gy-3">
      <div className="col-lg-12">
        <div className="modal_form">
          {/* <div className="form_title">
         <h5 className="title">
            {editData ? "Edit Employee" : "Add Employee"}
          </h5>

          </div> */}

          <div className="form_content">
            <form className="row gy-3" onSubmit={handleSubmit}>
              {/* Employee Name */}
              <div className="col-md-4">
                <label className="form-label">Employee Name *</label>
                <input
                  name="employee_name"
                  value={formData.employee_name}
                  onChange={(e) =>
                    handleChange({
                      target: {
                        name: "employee_name",
                        value: e.target.value.replace(/[^A-Za-z\s]/g, ""),
                      },
                    })
                  }
                  className={inputClass("employee_name")}
                />

                <div className="invalid-feedback">
                  {errors.employee_name}
                </div>
              </div>

              {/* Email */}
              <div className="col-md-4">
                <label className="form-label">Email</label>
                <input
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className={inputClass("email")}
                />
                <div className="invalid-feedback">{errors.email}</div>
              </div>

              {/* Phone */}
              <div className="col-md-4">
                <label className="form-label">Phone</label>
                <input
                  name="phone"
                  maxLength={10}
                  value={formData.phone}
                  onChange={(e) =>
                    handleChange({
                      target: {
                        name: "phone",
                        value: e.target.value.replace(/\D/g, ""),
                      },
                    })
                  }
                  className={inputClass("phone")}
                />
                <div className="invalid-feedback">{errors.phone}</div>
              </div>

              {/* DOB */}
              <div className="col-md-4">
                <label className="form-label">Date of Birth</label>
                <input
                  type="date"
                  className="form-control"
                  name="date_of_birth"
                  value={formData.date_of_birth}
                  onChange={handleChange}
                />
              </div>

              {/* Gender */}
              <div className="col-md-4">
                <label className="form-label d-block">Gender</label>
                {["male", "female"].map((g) => (
                  <div className="form-check form-check-inline" key={g}>
                    <input
                      type="radio"
                      className="form-check-input"
                      name="gender"
                      value={g}
                      checked={formData.gender === g}
                      onChange={handleChange}
                    />
                    <label className="form-check-label text-capitalize">
                      {g}
                    </label>
                  </div>
                ))}
              </div>

              {/* Status */}
              <div className="col-md-4">
                <label className="form-label">Status</label>
                <select
                  className="form-select"
                  name="status"
                  value={formData.status}
                  onChange={handleChange}
                >
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                </select>
              </div>

              {/* Address */}
              <div className="col-md-12">
                <label className="form-label">Address</label>
                <textarea
                  className="form-control"
                  rows="2"
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                />
              </div>

              {/* Aadhaar */}
              <div className="col-md-4">
                <label className="form-label">Aadhaar Number</label>
                <input
                  maxLength={12}
                  value={formData.aadhar_number}
                  onChange={(e) =>
                    handleChange({
                      target: {
                        name: "aadhar_number",
                        value: e.target.value.replace(/\D/g, ""),
                      },
                    })
                  }
                  className={inputClass("aadhar_number")}
                />
                <div className="invalid-feedback">
                  {errors.aadhar_number}
                </div>
              </div>

              {/* PAN */}
              <div className="col-md-4">
                <label className="form-label">PAN Number</label>
                <input
                  maxLength={10}
                  value={formData.pan_number}
                  onChange={(e) =>
                    handleChange({
                      target: {
                        name: "pan_number",
                        value: e.target.value.toUpperCase(),
                      },
                    })
                  }
                  className={inputClass("pan_number")}
                />
                <div className="invalid-feedback">
                  {errors.pan_number}
                </div>
              </div>

              {/* ================= BANK DETAILS ================= */}
              <div className="col-12 mt-4 p-3 border rounded bg-light">
                <h6 className="fw-semibold mb-3">Bank Details</h6>
                <div className="row gy-3">
                  <div className="col-md-4">
                    <label className="form-label">Bank Name</label>
                    <input
                      name="bank_name"
                      value={formData.bank_name}
                      onChange={handleChange}
                      className="form-control"
                    />
                  </div>

                  <div className="col-md-4">
                    <label className="form-label">Account Number</label>
                    <input
                      name="bank_account_number"
                      value={formData.bank_account_number}
                      maxLength={18}
                      onChange={(e) =>
                        handleChange({
                          target: {
                            name: "bank_account_number",
                            value: e.target.value.replace(/\D/g, ""),
                          },
                        })
                      }
                      className={inputClass("bank_account_number")}
                    />
                      <div className="invalid-feedback">
                        {errors.bank_account_number}
                      </div>

                  </div>

                  <div className="col-md-4">
                    <label className="form-label">IFSC Code</label>
                    <input
                      value={formData.ifsc_code}
                      onChange={(e) =>
                        handleChange({
                          target: {
                            name: "ifsc_code",
                            value: e.target.value.toUpperCase(),
                          },
                        })
                      }
                      className={inputClass("ifsc_code")}
                    />
                    <div className="invalid-feedback">
                      {errors.ifsc_code}
                    </div>
                  </div>
                </div>
              </div>

              {/* ================= EMERGENCY CONTACT ================= */}
              <div className="col-12 mt-4 p-3 border rounded bg-light">
                <h6 className="fw-semibold mb-3">
                  Emergency Contact Details
                </h6>
                <div className="row gy-3">
                  <div className="col-md-4">
                    <label className="form-label">Contact Name</label>
                    <input
                        name="emergency_contact_name"
                        value={formData.emergency_contact_name}
                        onChange={(e) =>
                          handleChange({
                            target: {
                              name: "emergency_contact_name",
                              value: e.target.value.replace(/[^A-Za-z\s]/g, ""),
                            },
                          })
                        }
                        className="form-control"
                      />

                  </div>

                  <div className="col-md-4">
                    <label className="form-label">Contact Phone</label>
                    <input
                      maxLength={10}
                      value={formData.emergency_contact_phone}
                      onChange={(e) =>
                        handleChange({
                          target: {
                            name: "emergency_contact_phone",
                            value: e.target.value.replace(/\D/g, ""),
                          },
                        })
                      }
                      className={inputClass(
                        "emergency_contact_phone"
                      )}
                    />
                    <div className="invalid-feedback">
                      {errors.emergency_contact_phone}
                    </div>
                  </div>

                  <div className="col-md-4">
                    <label className="form-label">Relation</label>
                    <input
                      name="emergency_contact_relation"
                      value={formData.emergency_contact_relation}
                      onChange={(e) =>
                        handleChange({
                          target: {
                            name: "emergency_contact_relation",
                            value: e.target.value.replace(/[^A-Za-z\s]/g, ""),
                          },
                        })
                      }
                      className="form-control"
                    />

                  </div>
                </div>
              </div>

              {/* SUBMIT */}
              <div className="col-12 text-end mt-3">
                <button
                  type="submit"
                  className="btn main-btn"
                  disabled={loading}
                >
                  {loading
                    ? "Saving..."
                    : editData
                    ? "Update Employee"
                    : "Add Employee"}
                </button>

              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};
