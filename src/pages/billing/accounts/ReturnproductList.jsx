import { useEffect, useState } from "react";
import { ReturnproductslistTable } from "../../../components/tables/ReturnproductslistTable";
import { AddReturnProduct } from "./AddReturnProduct";
import { useParams } from "react-router-dom";
import { getAllReturns,getReturnWithInvoice ,updateCustomerReturn,getReturnById} from "../../../services/productretrun.service"; // ✅ correct API
import "./add-payment-model.css";

export const ReturnproductList = () => {
  const { invoiceId } = useParams(); // ✅ get invoice ID from URL
  const [returns, setReturns] = useState([]); // ✅ use returns
  const [search, setSearch] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [editData, setEditData] = useState(null);

  /* ================= FETCH RETURNS ================= */
 const fetchReturns = async () => {
  setLoading(true);
  try {
    const res = await getAllReturns(); // ✅ correct API

    console.log("Fetched Returns:", res); // DEBUG

    const list = Array.isArray(res?.data) ? res.data : [];

    setReturns(list);

  } catch (err) {
    console.error("Fetch returns error:", err);
  } finally {
    setLoading(false);
  }
};

useEffect(() => {
  if (invoiceId) {
    setShowModal(true); // ✅ open modal automatically
  }
}, [invoiceId]);
useEffect(() => {
  if (invoiceId) {
    fetchReturnsByInvoice(invoiceId);
  } else {
    fetchReturns(); // fallback
  }
}, [invoiceId]);

const fetchReturnsByInvoice = async (invoiceId) => {
  setLoading(true);
  try {
    const res = await getReturnWithInvoice(invoiceId);

    console.log("Returns by invoice:", res);

    const list = Array.isArray(res?.data) ? res.data : [];

    setReturns(list);
  } catch (err) {
    console.error(err);
  } finally {
    setLoading(false);
  }
};

const updateReturn = async (id, data) => {
  try {
    const res = await updateCustomerReturn(id, data); // ✅ correct API
    handleRefresh(res);
  } catch (err) {
    console.error("Update return error:", err);
  }
};  
//console.log("Returns Data:", returns); // DEBUG
  /* ================= REFRESH HANDLER ================= */
const handleRefresh = (payload) => {
  // DELETE
  if (typeof payload === "number") {
    setReturns((prev) => prev.filter((r) => r.id !== payload));
    return;
  }

  // ✅ unwrap API response safely
  const newItem = payload?.data || payload;

  // ❗ guard condition
  if (!newItem || !newItem.id) {
    console.warn("Invalid payload:", payload);
    fetchReturns(); // fallback reload
    return;
  }

  // ADD / EDIT
  setReturns((prev) => {
    const exists = prev.find((r) => r?.id === newItem.id);

    if (exists) {
      return prev.map((r) =>
        r.id === newItem.id ? newItem : r
      );
    }

    return [newItem, ...prev];
  });
};

  return (
    <>
      <div className="product_detail">
        <div className="mb-4 d-flex justify-content-end gap-3">
          <input
            className="search-input"
            placeholder="Search return..."
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
            Add Return Product +
          </button>
        </div>

        <ReturnproductslistTable
  data={returns}
  search={search}
  loading={loading}
 onEdit={async (item) => {
  try {
    const res = await getReturnById(item.id);

    console.log("EDIT FULL DATA:", res);

  const data = res?.data?.data || res?.data;
setEditData(data);
    setShowModal(true);

  } catch (err) {
    console.error("Edit fetch error:", err);
  }
}}
  refresh={handleRefresh}
/>
      </div>

      {showModal && (
        <div className="custom-modal-overlay">
          <div className="custom-modal">
            <div className="modal-header customer-modal-header">
              <h5>
                {editData
                  ? "Edit Return Product"
                  : "Add Return Product"}
              </h5>

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
              <AddReturnProduct
                editData={editData}
                invoiceId={invoiceId} // ✅ pass invoice ID for context
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