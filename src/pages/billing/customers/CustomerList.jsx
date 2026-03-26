
import { useEffect, useState } from "react";
import { CustomerTable } from "../../../components/tables/CustomerTable";
import { AddCustomers } from "./AddCustomers";
import { getCustomers } from "../../../services/customer.service";
import "./customer.model.css";

export const CustomerList = () => {
  const [customers, setCustomers] = useState([]);
  const [search, setSearch] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(false);

const [editData, setEditData] = useState(null);

  /* ✅ FETCH ONCE (ON PAGE LOAD / REFRESH) */
  const fetchCustomers = async () => {
    setLoading(true);
    try {
      const data = await getCustomers();
      const normalized = Array.isArray(data)
        ? data.map(c => ({ ...c, id: c.id || c._id }))
        : [];
      setCustomers(normalized);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCustomers();
  }, []);

  /* ✅ INSTANT UI UPDATE (ADD / EDIT) */
const handleRefresh = (payload) => {
  // ✅ DELETE CASE
  if (typeof payload === "number") {
    setCustomers(prev =>
      prev.filter(c => c.id !== payload)
    );
    return;
  }

  // ✅ ADD / EDIT CASE
  setCustomers(prev => {
    const exists = prev.find(c => c.id === payload.id);
    if (exists) {
      return prev.map(c =>
        c.id === payload.id ? payload : c
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
            placeholder="Search customer..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />

          <button className="btn main-btn" onClick={() => setShowModal(true)}>
            Add Customer +
          </button>
        </div>

        <CustomerTable
          customers={customers}
          search={search}
          loading={loading}
           onEdit={(customer) => {
            setEditData(customer);
            setShowModal(true);
            }}
             refresh={handleRefresh}
          
        />
      </div>

     {showModal && (
  <div className="custom-modal-overlay">
    <div className="custom-modal">
      <div className="modal-header customer-modal-header">
        <h5>{editData ? "Edit Customer" : "Add Customer"}</h5>

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
        <AddCustomers
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
