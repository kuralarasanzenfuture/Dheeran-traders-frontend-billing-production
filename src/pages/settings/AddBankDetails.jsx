import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { createBankDetails, getBankDetailsById, updateBankDetails } from "../../services/bankDetalis.service";

export const AddBankDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    account_name: "",
    bank_name: "",
    account_number: "",
    branch: "",
    ifsc_code: "",
    status: "active",
    is_primary: false,
    qr_image: null,
  });

  /* ================= EDIT MODE ================= */
  useEffect(() => {
    if (!id) return;

    const fetchBank = async () => {
      try {
        const res = await getBankDetailsById(id);
        const data = res?.data;
        
        setFormData({
          account_name: data?.account_name || "",
          bank_name: data?.bank_name || "",
          account_number: data?.account_number || "",
          branch: data?.branch || "",
          ifsc_code: data?.ifsc_code || "",
          status: data?.status === 1 ? "active" : "inactive",
          is_primary: data?.is_primary === 1 || data?.is_primary === true ? true : false,
          qr_image: null, // file must be re-selected
        });
      } catch (error) {
        console.error("Failed to fetch bank details", error);
        alert("Failed to load bank details");
      }
    };

    fetchBank();
  }, [id]);

  /* ================= HANDLERS ================= */
  const handleChange = (e) => {
  const { name, value, type, checked } = e.target;

  setFormData((prev) => ({
    ...prev,
    [name]: type === "checkbox" ? checked : value,
  }));
};

  const handleFileChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      qr_image: e.target.files[0],
    
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // const ifscRegex = /^[A-Z]{4}0[A-Z0-9]{6}$/;

    // if (!ifscRegex.test(formData.ifsc_code)) {
    //   alert("Invalid IFSC Code format (Example: SBIN0001234)");
    //   return;
    // }

    // 🔥 FRONTEND VALIDATION FIRST
    if (!id && !formData.qr_image) {
      alert("QR code image is required");
      return;
    }

    try {
      const data = new FormData();

  Object.entries(formData).forEach(([key, value]) => {
  if (key !== "qr_image") {
    if (key === "is_primary") {
      data.append(key, value ? 1 : 0);
      console.log("Appending is_primary:", value ? 1 : 0);
    } else if (key === "status") {
      data.append(key, value); // ✅ string
    } else {
      data.append(key, value);
    }
  }
});

      if (formData.qr_image) {
        data.append("qr_code_image", formData.qr_image);
      }

      if (id) {
        await updateBankDetails(id, data);
        alert("Bank updated successfully");
      } else {
        await createBankDetails(data);
        alert("Bank added successfully");
      }

      navigate("/settings/bank-details");
    } catch (error) {
      console.error("Submit error:", error);

      // 🔥 Better error message from backend
      const message = error?.response?.data?.message || "Something went wrong";

      alert(message);
    }
  };

  /* ================= UI ================= */
  return (
    <div className="row gy-4 justify-content-center">
      <div className="col-lg-12">
        <div className="form_element">
          <div className="form_title">
            <h5 className="title">{id ? "Edit Bank Details" : "Add Bank Details"}</h5>
          </div>

          <div className="form_content">
            <form className="row gy-3" onSubmit={handleSubmit}>
              {/* QR CODE */}
              <div className="col-md-4">
                <label className="form-label">QR Code</label>
                <input
                  type="file"
                  className="form-control"
                  accept="image/*"
                  onChange={handleFileChange}
                  required={!id} // 🔥 required only when adding
                />
              </div>

              {/* TEXT FIELDS */}
              {[
                ["Account Name", "account_name"],
                ["Bank Name", "bank_name"],
                ["Account Number", "account_number"],
                ["Branch", "branch"],
                ["IFSC Code", "ifsc_code"],
              ].map(([label, name]) => (
                <div className="col-md-4" key={name}>
                  <label className="form-label">{label}</label>
                  <input
                    className="form-control"
                    name={name}
                    value={formData[name]}
                    onChange={(e) => {
                      let value = e.target.value;

                      // ✅ IFSC SPECIAL RULE
                      if (name === "ifsc_code") {
                        value = value.toUpperCase(); // auto uppercase
                        if (value.length > 11) return; // stop more than 11
                      }

                      // ✅ Account number only digits (extra safety)
                      if (name === "account_number") {
                        value = value.replace(/\D/g, ""); // removes non-numbers
                      }

                      // ✅ BANK NAME uppercase
                      if (name === "bank_name") {
                        value = value.toUpperCase();
                      }

                      setFormData((prev) => ({ ...prev, [name]: value }));
                    }}
                    maxLength={name === "ifsc_code" ? 11 : undefined}
                    required
                  />
                </div>
              ))}

              {/* STATUS */}
              <div className="col-md-4">
                <label className="form-label">Status</label>
                <select className="form-select" name="status" value={formData.status} onChange={handleChange}>
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                </select>
              </div>
                 <div className="col-md-8 text-end d-flex align-items-end">
                      <label>
                        <input
                          type="checkbox"
                          className="color-danger"
                          name="is_primary"
                          checked={formData.is_primary}
                          onChange={handleChange}
                        />{" "}
                        Set as Primary
                      </label>
                    </div>
              {/* SUBMIT */}
              <div className="col-md-12 text-end">
                <button type="submit" className="btn main-btn">
                  {id ? "Update Bank" : "Add Bank"}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};
