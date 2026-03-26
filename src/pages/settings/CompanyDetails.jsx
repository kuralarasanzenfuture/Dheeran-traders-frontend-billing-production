import React, { useEffect, useState } from "react";
import {
  getCompanyDetails,
  createCompanyDetails,
  updateCompanyDetails,
  deleteCompanyDetails,
} from "../../services/companyDetails.service";
import { Pencil, Trash2 } from "lucide-react";

const emptyForm = {
  company_name: "",
  company_quotes: "",
  company_address: "",
  district: "",
  state: "",
  pincode: "",
  phone: "",
  email: "",
  website: "",
  disclaimer: "",
  instruction: "",
};

const CompanyDetails = () => {
  const [list, setList] = useState([]);
  const [form, setForm] = useState(emptyForm);
  const [showModal, setShowModal] = useState(false);
  const [editId, setEditId] = useState(null);

  const fetchData = async () => {
    const data = await getCompanyDetails();
    setList(Array.isArray(data) ? data : [data]);
    console.log(data);
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.company_name.trim()) {
      alert("Company name is required");
      return;
    }

    if (editId) {
      await updateCompanyDetails(editId, form);
    } else {
      await createCompanyDetails(form);
    }

    setForm(emptyForm);
    setEditId(null);
    setShowModal(false);
    fetchData();
  };

  const handleEdit = (data) => {
    setForm({ ...emptyForm, ...data });
    setEditId(data.id);
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this company?")) return;
    await deleteCompanyDetails(id);
    fetchData();
  };

  const handleAdd = () => {
    setForm(emptyForm);
    setEditId(null);
    setShowModal(true);
  };

  return (
    <div className="container mt-4">
      {/* HEADER */}
      <div className="d-flex justify-content-between align-items-center mb-3">
        <button className="btn main-btn" onClick={handleAdd}>
          + Add Address
        </button>
      </div>

      {/* CARD GRID */}
      <div className="row g-4 company-grid">
        {list.map((c) => (
          <div className="col-md-12 col-lg-12" key={c.id}>
            <div className="card shadow-sm h-100 position-relative">
              {/* ICON BUTTONS */}
              <div className="position-absolute top-0 end-0 p-2 d-flex gap-2">
                <button
                  className="btn btn-sm btn-light border text-warning"
                  onClick={() => handleEdit(c)}
                  title="Edit"
                >
                  <Pencil size={16} />
                </button>

                <button
                  className="btn btn-sm btn-light border text-danger"
                  onClick={() => handleDelete(c.id)}
                  title="Delete"
                >
                  <Trash2 size={16} />
                </button>
              </div>
              <div className="card-body">
                <h5 className="card-title text-danger mb-3">{c.company_name || "-"}</h5>

                <div className="d-flex py-3 border-bottom">
                  <div className="fw-semibold common" style={{ width: "160px" , fontSize:"14px" }}>
                    company_quotes :
                  </div>
                  <div className="flex-grow-1">{c.company_quotes || "-"}</div>
                </div>

                <div className="d-flex py-3 border-bottom">
                  <div className="fw-semibold common" style={{ width: "160px" , fontSize:"14px" }}>
                    company_address :
                  </div>
                  <div className="flex-grow-1">{c.company_address || "-"}</div>
                </div>

                <div className="d-flex py-3 border-bottom">
                  <div className="fw-semibold common" style={{ width: "160px" , fontSize:"14px" }}>
                    district :
                  </div>
                  <div className="flex-grow-1">{c.district || "-"}</div>
                </div>

                <div className="d-flex py-3 border-bottom">
                  <div className="fw-semibold common" style={{ width: "160px" , fontSize:"14px" }}>
                    state :
                  </div>
                  <div className="flex-grow-1">{c.state || "-"}</div>
                </div>

                <div className="d-flex py-3 border-bottom">
                  <div className="fw-semibold common" style={{ width: "160px" , fontSize:"14px" }}>
                    pincode :
                  </div>
                  <div className="flex-grow-1">{c.pincode || "-"}</div>
                </div>

                <div className="d-flex py-3 border-bottom">
                  <div className="fw-semibold common" style={{ width: "160px" , fontSize:"14px" }}>
                    phone :
                  </div>
                  <div className="flex-grow-1">{c.phone || "-"}</div>
                </div>

                <div className="d-flex py-3 border-bottom">
                  <div className="fw-semibold common" style={{ width: "160px" , fontSize:"14px" }}>
                    email :
                  </div>
                  <div className="flex-grow-1">{c.email || "-"}</div>
                </div>

                <div className="d-flex py-3 border-bottom">
                  <div className="fw-semibold common" style={{ width: "160px" , fontSize:"14px" }}>
                    website :
                  </div>
                  <div className="flex-grow-1">{c.website || "-"}</div>
                </div>

                <div className="d-flex py-3 border-bottom">
                  <div className="fw-semibold common" style={{ width: "160px" , fontSize:"14px" }}>
                    disclaimer :
                  </div>
                  <div className="flex-grow-1">{c.disclaimer || "-"}</div>
                </div>

                <div className="d-flex py-3">
                  <div className="fw-semibold common" style={{ width: "160px" , fontSize:"14px" }}>
                    instruction :
                  </div>
                  <div className="flex-grow-1">{c.instruction || "-"}</div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* MODAL */}
      {showModal && (
        <div
          className="modal fade show d-block"
          style={{ background: "rgba(0,0,0,0.5)" }}
        >
          <div className="modal-dialog modal-lg modal-dialog-centered">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">
                  {editId ? "Edit Company" : "Add Company"}
                </h5>
                <button
                  className="btn-close"
                  onClick={() => setShowModal(false)}
                />
              </div>

              <form onSubmit={handleSubmit}>
                <div className="modal-body ">
                  <h6 className="common">Basic Info</h6>

                  <div className="row gy-3">
                    <div className="col-md-4">
                    <label className="form-label">Company Name *</label>
                    <input
                      name="company_name"
                      value={form.company_name}
                      onChange={handleChange}
                      className="form-control"
                      required
                    />
                  </div>

                  <div className="col-md-8">
                    <label className="form-label">Company Quotes</label>
                    <input
                      name="company_quotes"
                      value={form.company_quotes}
                      onChange={handleChange}
                      className="form-control"
                    />
                  </div>

                 <div className="col-md-12">
                   <h6 className="common ">Address</h6>
                 </div>

                  <div className="col-md-12">
                    <label className="form-label">Address</label>
                    <textarea
                      name="company_address"
                      value={form.company_address}
                      onChange={handleChange}
                      className="form-control"
                      rows="2"
                    />
                  </div>

                  <div className="col-md-4">
                    <label className="form-label">District</label>
                    <input
                      name="district"
                      value={form.district}
                      onChange={handleChange}
                      className="form-control"
                    />
                  </div>

                  <div className="col-md-4">
                    <label className="form-label">State</label>
                    <input
                      name="state"
                      value={form.state}
                      onChange={handleChange}
                      className="form-control"
                    />
                  </div>

                  <div className="col-md-4">
                    <label className="form-label">Pincode</label>
                    <input
                      name="pincode"
                      value={form.pincode}
                      onChange={handleChange}
                      className="form-control"
                    />
                  </div>

                  <div className="col-md-12">
                    <h6 className="common ">Contact</h6>
                  </div>

                  <div className="col-md-4">
                    <label className="form-label">Phone</label>
                    <input
                      name="phone"
                      value={form.phone}
                      onChange={handleChange}
                      className="form-control"
                    />
                  </div>

                  <div className="col-md-4">
                    <label className="form-label">Email</label>
                    <input
                      name="email"
                      value={form.email}
                      onChange={handleChange}
                      className="form-control"
                    />
                  </div>

                  <div className="col-md-4">
                    <label className="form-label">Website</label>
                    <input
                      name="website"
                      value={form.website}
                      onChange={handleChange}
                      className="form-control"
                    />
                  </div>

                  <div className="col-md-12">
                    <h6 className="common ">Legal</h6>
                  </div>

                  <div className="col-md-12">
                    <label className="form-label">Disclaimer</label>
                    <textarea
                      name="disclaimer"
                      value={form.disclaimer}
                      onChange={handleChange}
                      className="form-control"
                      rows="2"
                    />
                  </div>

                  <div className="col-md-12">
                    <label className="form-label">Instruction</label>
                    <textarea
                      name="instruction"
                      value={form.instruction}
                      onChange={handleChange}
                      className="form-control"
                      rows="2"
                    />
                  </div>
                  </div>
                </div>

                <div className="modal-footer">
                  <button type="submit" className="btn main-btn">
                    {editId ? "Update Company" : "Save Company"}
                  </button>
                  <button
                    type="button"
                    className="btn filter-btn"
                    onClick={() => setShowModal(false)}
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CompanyDetails;