import { useEffect, useState } from "react";
import { VendorTable } from "../../../components/tables/VendorTable";
import { AddVendors } from "./AddVendors";
import { getVendors } from "../../../services/vendor.service";
import "./vendor.model.css";

export const VendorList = () => {
  const [vendors, setVendors] = useState([]);
  const [search, setSearch] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [editData, setEditData] = useState(null);
  const [loading, setLoading] = useState(false);

  /* ✅ FETCH ONCE */
  const fetchVendors = async () => {
    setLoading(true);
    try {
      const data = await getVendors();
      const normalized = Array.isArray(data)
        ? data.map(v => ({ ...v, id: v.id || v._id }))
        : [];
      setVendors(normalized);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchVendors();
  }, []);

 const handleRefresh = async (payload) => {
  // ✅ DELETE → always re-fetch from backend
  if (payload === "delete") {
    await fetchVendors();
    return;
  }

  // ✅ ADD / EDIT → local update is fine
  setVendors(prev => {
    const exists = prev.find(v => v.id === payload.id);

    if (exists) {
      return prev.map(v =>
        v.id === payload.id ? payload : v
      );
    }

    return [payload, ...prev];
  });
};



  return (
    <>
      <div className="product_detail">
        <div className="mb-4 d-flex justify-content-end gap-3">

          <input
            className="search-input"
            placeholder="Search vendor..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />

          <button
            className="btn main-btn"
            onClick={() => {
              setEditData(null);
              setShowModal(true);
            }}
          >
            Add Vendor +
          </button>
        </div>

        <VendorTable
  vendors={vendors}
  search={search}
  loading={loading}
  onEdit={(vendor) => {
    setEditData(vendor);
    setShowModal(true);
  }}
  refresh={handleRefresh}   // ✅ VERY IMPORTANT
/>

      </div>

      {/* MODAL */}
      {showModal && (
        <div className="custom-modal-overlay">
          <div className="custom-modal">
            <div className="modal-header customer-modal-header">
              <h5>{editData ? "Edit Vendor" : "Add Vendor"}</h5>
              <button
                className="modal-close-btn"
                onClick={() => {
                  setShowModal(false);
                  setEditData(null);
                }}
              >
                ✕
              </button>
            </div>

            <div className="modal-body">
              <AddVendors
                editData={editData}
                closeModal={() => {
                  setShowModal(false);
                  setEditData(null);
                }}
                refresh={handleRefresh}
              />
            </div>
          </div>
        </div>
      )}
    </>
  );
};
