import { useState } from "react";
import { StockMaintanence } from "../../../../components/tables/StockMaintanence";
import { AddStock } from "./AddStock";
import "./stock.model.css";

export const StockList = () => {
  const [search, setSearch] = useState("");
  const [showAddModal, setShowAddModal] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0); // ✅ ADD THIS

  return (
    <div className="product_detail">
      {/* HEADER */}
      <div className="mb-4">
        <div className="row gy-3 align-items-center">
          <div className="col-lg-12">
            <div className="d-flex justify-content-end gap-3 align-items-center">
              {/* SEARCH */}
              <div className="search-box">
                <input
                  type="text"
                  className="search-input"
                  placeholder="Search vendor / product / phone"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
                <i className="bi bi-search search-icon"></i>
              </div>

              {/* ADD STOCK */}
              <button
                className="btn main-btn"
                onClick={() => setShowAddModal(true)}
              >
                Add Stock +
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* TABLE */}
      <StockMaintanence
        search={search}
        refreshKey={refreshKey}   
      />

      {/* ADD MODAL */}
      {showAddModal && (
        <div className="stock-modal-overlay">
          <div className="stock-modal-box">
            <div className="stock-modal-header">
              <h5>Add Stock</h5>
              <button
                className="stock-modal-close"
                onClick={() => setShowAddModal(false)}
              >
                ✕
              </button>
            </div>

            <AddStock
              onSuccess={() => {
                setShowAddModal(false);
                setRefreshKey((k) => k + 1); // ✅ TRIGGER REFRESH
              }}
            />
          </div>
        </div>
      )}
    </div>
  );
};
