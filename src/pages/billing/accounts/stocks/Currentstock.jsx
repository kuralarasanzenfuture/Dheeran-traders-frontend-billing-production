import React, { useEffect, useState } from "react";
import {
  getProducts,
  updateProductStock,
} from "../../../../services/product.service";
import { toast } from "react-toastify";

const Currentstock = ({
  refreshKey = 0,
  search = "",
  brand = "",
  category = "",
}) => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  const [stockInputs, setStockInputs] = useState({});
  const [password, setPassword] = useState("");

  const [activeAction, setActiveAction] = useState(null); // {id, type}
  const [unlockedRowId, setUnlockedRowId] = useState(null);
   const loggedInUser = JSON.parse(localStorage.getItem("user"));
  const [searchText, setSearchText] = useState("");

  const isAdmin = loggedInUser?.role === "admin";
   const [currentPage, setCurrentPage] = useState(1);
   const rowsPerPage = 5;
  
  /* ================= LOAD PRODUCTS ================= */
  const fetchProducts = async () => {
    try {
      const data = await getProducts();

      const normalized = (data || []).map((p) => ({
        ...p,
        brand: p.brand ?? p.brand_name ?? "-",
        category: p.category ?? p.category_name ?? "-",
        quantity: p.quantity ?? p.quantity_name ?? "-",
        stock: Number(p.stock ?? 0),
        price: Number(p.price ?? 0),
      }));

      setProducts(normalized);

      const map = {};
      normalized.forEach((p) => {
        map[p.id] = p.stock;
      });
      setStockInputs(map);
    } catch {
      toast.error("Failed to load products");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, [refreshKey]);

  /* ================= CONFIRM ACTION ================= */
  const confirmAction = async (productId, type) => {
    try {
      if (!password) {
        toast.error("Enter admin password");
        return;
      }

      const newStock =
        type === "delete" ? 0 : Number(stockInputs[productId]);

      if (isNaN(newStock)) {
        toast.error("Stock must be a number");
        return;
      }

      await updateProductStock(productId, {
        stock: newStock,
        adminPassword: password,
      });

      toast.success("Stock updated");
      fetchProducts();
    } catch (err) {
      toast.error(err.response?.data?.message || "Operation failed");
    } finally {
      setPassword("");
      setActiveAction(null);
      setUnlockedRowId(null);
    }
  };

  /* ================= FILTER ================= */
  const filteredProducts = products.filter((p) => {
   const q = searchText.toLowerCase();

    const matchSearch =
      p.product_name.toLowerCase().includes(q) ||
      p.product_code.toLowerCase().includes(q) ||
      p.brand.toLowerCase().includes(q);

    const matchBrand = brand ? p.brand === brand : true;
    const matchCategory = category ? p.category === category : true;

    return matchSearch && matchBrand && matchCategory;
  });

const totalPages = Math.ceil(filteredProducts.length / rowsPerPage);

const indexOfLastRow = currentPage * rowsPerPage;
const indexOfFirstRow = indexOfLastRow - rowsPerPage;

const currentRows = filteredProducts.slice(
  indexOfFirstRow,
  indexOfLastRow
);
useEffect(() => {
  setCurrentPage(1);
}, [searchText, brand, category]);
useEffect(() => {
  if (currentPage > totalPages && totalPages > 0) {
    setCurrentPage(totalPages);
  }
}, [totalPages]);

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

  if (loading) {
    return <p className="text-center">Loading products...</p>;
  }

  return (
    
    <div className="common-table-wrapper">
     <div className="search-box mb-3 mt-2 ps-2">
    <input
  type="text"
  className="search-input"
  placeholder="Search..."
  value={searchText}
  onChange={(e) => setSearchText(e.target.value)}
/>

    <i className="bi bi-search search-icon"></i>
  </div>

      <table className="common-table table-striped align-middle">
        <thead>
          <tr>
            <th>Product Code</th>
            <th>Product Name</th>
            <th>Details</th>
            <th className="text-center">Stock</th>
            <th>Selling Price</th>
            {isAdmin && 
            <th className="text-center">Actions</th>
            }
            </tr>
        </thead>

        <tbody>
          {filteredProducts.length === 0 ? (
            <tr>
            <td colSpan={isAdmin ? 6 : 5} className="text-center">
                No products found
              </td>
            </tr>
          ) : (
            currentRows.map((p) => (
              <tr key={p.id}>
                <td>{p.product_code}</td>
                <td>{p.product_name}</td>

                <td>
                  <div className="fw-semibold">{p.brand}</div>
                  <div className="text-muted small">{p.category}</div>
                  <span className="badge bg-secondary">{p.quantity}</span>
                </td>

                <td className="text-center">
                  <input
                    type="number"
                    className="form-control form-control-sm text-center mx-auto"
                    style={{ width: "90px" }}
                    value={stockInputs[p.id] ?? 0}
                    disabled={unlockedRowId !== p.id}
                   onChange={(e) => {
                              let value = e.target.value;

                              // allow only numbers and one decimal
                              if (/^\d*\.?\d{0,2}$/.test(value)) {
                                setStockInputs((prev) => ({
                                  ...prev,
                                  [p.id]: value,
                                }));
                              }
                            }}

                            onKeyDown={(e) => {
                            if (["e", "E", "+", "-"].includes(e.key)) {
                              e.preventDefault();
                            }
                          }}
                      onWheel={(e) => e.target.blur()} 
                  />
                </td>

                <td>{p.price.toFixed(2)}</td>
              {isAdmin &&(
                <td className="text-center" style={{ minWidth: "200px" }}>
               
                  <div className="d-flex justify-content-center gap-2 mb-1">
                 
                    <button
                      className="btn btn-sm btn-warning"
                      onClick={() =>
                        setActiveAction({ id: p.id, type: "edit" })
                      }
                    >
                     <i className="bi bi-pencil" />
                    </button>

                    <button
                      className="btn btn-sm btn-danger"
                      onClick={() =>
                        setActiveAction({ id: p.id, type: "delete" })
                      }
                    >
                     <i className="bi bi-trash" />  
                    </button>
                
                  </div>
                
                  {activeAction?.id === p.id && unlockedRowId !== p.id && (
                    <div
                      className="mx-auto mt-2 p-2 border rounded shadow-sm bg-white"
                      style={{ width: "160px", textAlign: "center" }}
                    >
                      <div className="small text-muted mb-1">
                        Admin Password
                      </div>

                      <input
                        type="password"
                        className="form-control form-control-sm mb-2"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        autoComplete="new-password"
                      />

                      <button
                        className="btn btn-sm btn-dark w-100"
                        onClick={() => setUnlockedRowId(p.id)}
                      >
                        🔓 Unlock
                      </button>
                    </div>
                  )}

                  {unlockedRowId === p.id && (
                    <div
                      className="mx-auto mt-2 p-2 border rounded bg-light text-center"
                      style={{ width: "160px" }}
                    >
                      <button
                        className="btn btn-sm btn-success w-100"
                        onClick={() =>
                          confirmAction(p.id, activeAction.type)
                        }
                      >
                        ✅ Confirm
                      </button>
                    </div>
                  )}
                </td>
                )}
              </tr>
            ))
          )}
        </tbody>
      </table>
      {/* ===== PAGINATION ===== */}
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
    </div>
  );
};

export default Currentstock;

