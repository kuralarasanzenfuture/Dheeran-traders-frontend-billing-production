import { useEffect, useState, useCallback } from "react";
import { getVendorStocks, deleteVendorStock, deleteVendorStockEntry } from "../../services/vendorStock.service";
import { toast } from "react-toastify";
import { AddStock } from "../../pages/billing/accounts/stocks/AddStock";
import "../../pages/billing/accounts/stocks/stock.model.css";

export const StockMaintanence = ({ search, refreshKey }) => {
  const [stocks, setStocks] = useState([]);
  const [groupedStocks, setGroupedStocks] = useState([]);
  const [viewEntry, setViewEntry] = useState(null);
  const [editEntry, setEditEntry] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const rowsPerPage = 7;
  /* ================= GROUP LOGIC ================= */
  const groupStockEntries = (rows) => {
    const grouped = Object.values(
      rows.reduce((acc, row) => {
        const key = row.entry_id;

        if (!acc[key]) {
          acc[key] = {
            entry_id: row.entry_id,
            vendor_name: row.vendor_name,
            vendor_phone: row.vendor_phone,
            entry_date: row.entry_date,
            entry_time: row.entry_time,
            products: [],
          };
        }

        acc[key].products.push(row);
        return acc;
      }, {}),
    );

    setGroupedStocks(grouped);
  };

  /* ================= LOAD ================= */
  const loadStocks = useCallback(async () => {
    try {
      const data = await getVendorStocks();
      setStocks(data || []);
      groupStockEntries(data || []);
    } catch {
      toast.error("Failed to load stock data");
    }
  }, []);

  /* ================= AUTO RELOAD ================= */
  useEffect(() => {
    loadStocks();
  }, [loadStocks, refreshKey]); // 🔥 KEY FIX

  /* ================= DELETE FULL ENTRY ================= */
  const handleDeleteEntry = async (entry) => {
    if (!window.confirm("Delete this stock entry?")) return;

    try {
      await deleteVendorStockEntry(entry.entry_id);
      toast.success("Stock entry deleted");
      loadStocks();
    } catch {
      toast.error("Delete failed");
    }
  };

  /* ================= DELETE SINGLE PRODUCT ================= */
  const handleDeleteProduct = async (productId) => {
    if (!window.confirm("Delete this product?")) return;

    try {
      await deleteVendorStock(productId);
      toast.success("Product deleted");
      setViewEntry(null);
      loadStocks();
    } catch {
      toast.error("Delete failed");
    }
  };

  /* ================= SEARCH ================= */
  const filteredEntries = groupedStocks.filter((e) => {
    if (!search) return true;
    const q = search.toLowerCase();

    return e.vendor_name?.toLowerCase().includes(q) || e.vendor_phone?.includes(q);
  });

  const totalPages = Math.ceil(filteredEntries.length / rowsPerPage);
       
       const indexOfLastRow = currentPage * rowsPerPage;
       const indexOfFirstRow = indexOfLastRow - rowsPerPage;
       
       const currentRows = filteredEntries.slice(
         indexOfFirstRow,
         indexOfLastRow
       );
       useEffect(() => {
         setCurrentPage(1);
       }, [search]);
       
       const visiblePages = 3; // show only 3 pages
       
       let startPage = Math.max(
         1,
         currentPage - Math.floor(visiblePages / 2)
       );
       
       let endPage = startPage + visiblePages - 1;
       
       if (endPage > totalPages) {
         endPage = totalPages;
         startPage = Math.max(1, endPage - visiblePages + 1);
       }

  return (
    <>
      {/* ================= MAIN TABLE ================= */}
      <div className="common-table-wrapper">
        <table className="common-table table-striped">
          <thead>
            <tr>
              <th className="text-center">#</th>
              <th>Vendor Name</th>
              <th>Vendor Phone</th>
              <th>Date</th>
              <th>Time</th>
              <th className="text-center">Actions</th>
            </tr>
          </thead>

          <tbody>
            {currentRows.length === 0 ? (
              <tr>
                <td colSpan="6" className="text-center">
                  No stock entries found
                </td>
              </tr>
            ) : (
              currentRows.map((e, i) => (
                <tr key={e.entry_id}>
                  <td className="text-center">{i + 1}</td>
                  <td>{e.vendor_name}</td>
                  <td>{e.vendor_phone}</td>
                  <td>{new Date(e.entry_date).toLocaleDateString("en-IN")}</td>
                  <td>{e.entry_time}</td>

                  <td className="text-end">
                    <button className="btn btn-sm btn-secondary me-2" onClick={() => setViewEntry(e)}>
                      <i className="bi bi-file-earmark-text"></i>
                    </button>

                    <button className="btn btn-sm btn-danger" onClick={() => handleDeleteEntry(e)}>
                      <i className="bi bi-trash"></i>
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* ================= VIEW MODAL ================= */}
      {viewEntry && (
        <div className="stock-modal-overlay">
          <div className="stock-modal-box">
            <div className="stock-modal-header">
              <h5>Stock Entry Details</h5>
              <button className="btn btn-close btn-sm" onClick={() => setViewEntry(null)}></button>
            </div>

            <div className="common-table-wrapper">
              <table className="common-table table-striped">
                <thead>
                  <tr>
                    <th>#</th>
                    <th>Product</th>
                    <th>Brand</th>
                    <th>Category</th>
                    <th>Quantity</th>
                    <th>Stock</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {viewEntry.products.map((p, i) => (
                    <tr key={p.id}>
                      <td>{i + 1}</td>
                      <td>{p.product_name}</td>
                      <td>{p.product_brand}</td>
                      <td>{p.product_category}</td>
                      <td>{p.product_quantity}</td>
                      <td>{p.total_stock}</td>
                      <td>
                        <button
                          className="btn btn-sm btn-warning me-2"
                          onClick={() => {
                            setEditEntry(p);
                            setViewEntry(null);
                          }}>
                          <i className="bi bi-pencil"></i>
                        </button>

                        <button className="btn btn-sm btn-danger" onClick={() => handleDeleteProduct(p.id)}>
                          <i className="bi bi-trash"></i>
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    {/* ===== PROFESSIONAL PAGINATION ===== */}
             {totalPages > 1 && (
  <nav aria-label="Page navigation" className="mt-4">
    <ul className="pagination justify-content-center">

      {/* Previous Arrow */}
      <li className={`page-item ${currentPage === 1 ? "disabled" : ""}`}>
        <button
          className="page-link prev"
          onClick={() => setCurrentPage((prev) => prev - 1)}
        >
          <i className="bi bi-arrow-left"></i>
        </button>
      </li>

      {/* Page Numbers (Only 3 Visible) */}
      {Array.from(
        { length: endPage - startPage + 1 },
        (_, index) => startPage + index
      ).map((pageNumber) => (
        <li
          key={pageNumber}
          className={`page-item ${
            currentPage === pageNumber ? "active" : ""
          }`}
        >
          <button
            className="page-link"
            onClick={() => setCurrentPage(pageNumber)}
          >
            {pageNumber}
          </button>
        </li>
      ))}

      {/* Next Arrow */}
      <li
        className={`page-item ${
          currentPage === totalPages ? "disabled" : ""
        }`}
      >
        <button
          className="page-link next"
          onClick={() => setCurrentPage((prev) => prev + 1)}
        >
          <i className="bi bi-arrow-right"></i>
        </button>
      </li>

    </ul>
  </nav>
)}
      {/* ================= EDIT MODAL ================= */}
      {editEntry && (
        <div className="stock-modal-overlay">
          <div className="stock-modal-box">
            <div className="stock-modal-header">
              <h5>Edit Stock</h5>
              <button onClick={() => setEditEntry(null)}>✕</button>
            </div>

            <AddStock
              editData={editEntry}
              onSuccess={() => {
                setEditEntry(null);
                loadStocks(); // ✅ instant refresh
              }}
            />
          </div>
        </div>
      )}
    </>
  );
};
