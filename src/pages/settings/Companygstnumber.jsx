    import React, { useState, useEffect } from "react";
    import {
    createGST,
    getAllGST,
    updateGST,
    deleteGST,
    } from "../../services/companygstnumber";
    import { toast } from "react-toastify";
    import { Pencil, Trash2 } from "lucide-react";

    const Companygstnumber = () => {
    const [showModal, setShowModal] = useState(false);
    const [isEdit, setIsEdit] = useState(false);
    const [editId, setEditId] = useState(null);

    const [gstList, setGstList] = useState([]);
    const [formData, setFormData] = useState({
    gst_number: "",
    status: "active",   // ✅ use this
    is_default: false,
    });
    const gstRegex = /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/;
    /* ================= FETCH GST ================= */
    const fetchGST = async () => {
        try {
        const res = await getAllGST();
        setGstList(res);

        } catch {
        toast.error("Failed to fetch GST data");
        }
    };

    useEffect(() => {
        fetchGST();
    }, []);
    console.log(gstList, "GST List")
    /* ================= FORM CHANGE ================= */
    const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    let newValue;

    if (name === "gst_number") {
        newValue = value.toUpperCase();
    } else if (type === "checkbox") {
        newValue = checked;
    } else if (name === "status") {
        newValue = value; // keep "active" / "inactive"
    } else {
        newValue = value;
    }

    setFormData({
        ...formData,
        [name]: newValue,
    });
    };
    /* ================= ADD ================= */
    const openAddModal = () => {
        setIsEdit(false);
        setEditId(null);
        setFormData({
    gst_number: "",
    status: "active",
    is_default: false,
    });
        setShowModal(true);
    };

    /* ================= EDIT ================= */
    const openEditModal = (gst) => {
        setIsEdit(true);
        setEditId(gst.id);
    setFormData({
    gst_number: gst.gst_number,
    status: gst.is_active ? "active" : "inactive", // ✅ correct mapping
    is_default: gst.is_default || false,
    });
        setShowModal(true);
    };

    /* ================= SUBMIT ================= */
    const handleSubmit = async (e) => {
    e.preventDefault();

    const gst = formData.gst_number.toUpperCase();

    // ✅ GST VALIDATION
    //const gstRegex = /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/;

    if (!gstRegex.test(gst)) {
        toast.error("Invalid GST Number");
        return;
    }
    if (gst.length !== 15) {
    toast.error("GST must be 15 characters");
    return;
    }

    try {
        const payload = {
        ...formData,
        gst_number: gst,
        is_active: formData.status === "active" ? 1 : 0, // ✅ conversion // save uppercase
        };
console.log("PAYLOAD:", payload);   
        if (isEdit) {
        await updateGST(editId, payload);
        toast.success("GST updated");
        } else {
        await createGST(payload);
        toast.success("GST created");
        }

        setShowModal(false);
        fetchGST();
    } catch (err) {
        toast.error(err.response?.data?.message || "Operation failed");
    }
    };  
    console.log("STATUS:", formData.status);

    /* ================= DELETE ================= */
    const handleDelete = async (id) => {
        if (!window.confirm("Delete this GST?")) return;

        try {
        await deleteGST(id);
        toast.success("GST deleted");
        fetchGST();
        } catch {
        toast.error("Delete failed");
        }
    };
    //const gstRegex = /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/;
    return (
        <div className="container mt-1">
        <div className="d-flex justify-content-between mb-3">
            <h4>Company GST Number</h4>
            <button className="btn main-btn" onClick={openAddModal}>
            + Add Company GST Number
            </button>
        </div>

        {/* ================= TABLE ================= */}
        <table className="common-table table-striped">
            <thead>
            <tr>
                <th>#</th>
                <th>GST Number</th>
                <th>Status</th>
                <th>Default</th>
                <th>Actions</th>
            </tr>
            </thead>

            <tbody>
            {gstList?.length === 0 ? (
                <tr>
                <td colSpan="5" className="text-center">
                    No GST Found
                </td>
                </tr>
            ) : (
                gstList ?.map((g, i) => (
                <tr key={g.id}>
                    <td>{i + 1}</td>
                    <td>{g.gst_number}</td>
                    <td>{g.is_active ? "Active" : "Inactive"}</td>
                    <td>{g.is_default ? "Selected" : "Not Selected"}</td>

                    <td className="d-flex gap-3">
                    <div className="btn btn-sm btn-warning">
                        <Pencil
                        size={18}
                        onClick={() => openEditModal(g)}
                        />
                    </div>

                    <div className="btn btn-sm btn-danger">
                        <Trash2
                        size={18}
                        className="text-light"
                        onClick={() => handleDelete(g.id)}
                        />
                        
                    </div>
                    </td>
                </tr>
                ))
            )}
            </tbody>
        </table>

        {/* ================= MODAL ================= */}
        {showModal && (
            <>
            <div className="modal fade show d-block mt-5">
                <div className="modal-dialog">
                <div className="modal-content">
                    <div className="modal-header">
                    <h5>{isEdit ? "Edit GST" : "Create GST"}</h5>
                    <button
                        className="btn-close"
                        onClick={() => setShowModal(false)}
                    />
                    </div>

                    <div className="modal-body">
                    <form onSubmit={handleSubmit}>
                <div className="mb-3">
    <label>GST Number</label>

    <input
        name="gst_number"
        className={`form-control ${
        formData.gst_number &&
        !gstRegex.test(formData.gst_number)
            ? "is-invalid"
            : ""
        }`}
        value={formData.gst_number}
        onChange={handleChange}
        placeholder="Enter GST Number"
        maxLength={15}
    />

    {formData.gst_number &&
        formData.gst_number.length === 15 &&
        !gstRegex.test(formData.gst_number) && (
        <div className="invalid-feedback">
            Invalid GST Number format(should be 15 characters, e.g. 22AAAAA0000A1Z5)
        </div>
        )}
    </div>

                        <div className="mb-3">
                        <label>Status</label>
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

                        <div className="mb-3">
                        <label>
                            <input
                            type="checkbox"
                            name="is_default"
                            checked={formData.is_default}
                            onChange={handleChange}
                            />{" "}
                            Set as Default
                        </label>
                        </div>

                        <button type="submit" className="btn main-btn w-100">
                        {isEdit ? "Update GST" : "Create GST"}
                        </button>
                    </form>
                    </div>
                </div>
                </div>
            </div>

            <div className="modal-backdrop fade show"></div>
            </>
        )}
        </div>
    );
    };

    export default Companygstnumber;