
import { toast } from "react-toastify";
import { deleteCustomer } from "../../services/customer.service";
import React, { useState, useEffect } from "react";
export const CustomerTable = ({
  customers = [],
  search = "",
  loading = false,
  showActions = true,
  onEdit,
  refresh = () => {},
}) => {
  const filteredCustomers = customers.filter(c => {
    if (!search) return true;
    const k = search.toLowerCase();
    return (
      `${c.first_name} ${c.last_name}`.toLowerCase().includes(k) ||
      c.phone?.includes(k) ||
      c.email?.toLowerCase().includes(k)
    );
  });
  const [currentPage, setCurrentPage] = useState(1);
    const rowsPerPage = 8;

 const handleDelete = async (id) => {
  if (!window.confirm("Delete this customer?")) return;

  try {
    await deleteCustomer(id);

    // ✅ tell parent to remove item from state
    refresh(id);

    toast.success("Customer deleted successfully");
  } catch (err) {
    toast.error("Delete failed");
  }
};
 // ===== PAGINATION LOGIC =====
   const totalPages = Math.ceil(filteredCustomers.length / rowsPerPage);
 
   const indexOfLastRow = currentPage * rowsPerPage;
   const indexOfFirstRow = indexOfLastRow - rowsPerPage;
 
   const currentRows = filteredCustomers.slice(indexOfFirstRow, indexOfLastRow);
   useEffect(() => {
     setCurrentPage(1);
   }, []);
 
   const visiblePages = 3; // show only 3 pages
 
   let startPage = Math.max(1, currentPage - Math.floor(visiblePages / 2));
 
   let endPage = startPage + visiblePages - 1;
 
   if (endPage > totalPages) {
     endPage = totalPages;
     startPage = Math.max(1, endPage - visiblePages + 1);
   }
 
  return (
    <div className="common-table-wrapper mt-2">
      {loading && <div className="text-center">Loading...</div>}

      <table className="common-table table-striped">
        <thead>
          <tr>
            <th>ID</th>
            <th>Name</th>
            <th>Phone</th>
            <th>Email</th>
            <th>Total</th>
            <th>Pending</th>
            {showActions && <th className="text-end">Actions</th>}
          </tr>
        </thead>

        <tbody>
          {currentRows.length === 0 ? (
            <tr>
              <td colSpan="7" className="text-center">No customers</td>
            </tr>
          ) : (
            currentRows.map(c => (
              <tr key={c.id}>
                <td>{c.id}</td>
                <td>{c.first_name} {c.last_name}</td>
                <td>{c.phone}</td>
                <td>{c.email || "—"}</td>
                <td>₹ {c.total || 0}</td>
                <td className="text-danger fw-bold">₹ {c.pending_amount || 0}</td>

              {showActions && (
  <td className="text-end">
    
    <button
      className="btn btn-sm btn-warning me-2"
      onClick={() => onEdit?.(c)}
    >
      <i className="bi bi-pencil" />
    </button>

    <button
      className="btn btn-sm btn-danger"
      onClick={() => handleDelete(c.id)}
    >
      <i className="bi bi-trash" />
    </button>
  </td>
)}

              </tr>
            ))
          )}
        </tbody>
      </table>
              {/* ===== PROFESSIONAL PAGINATION ===== */}
      {totalPages > 1 && (
        <nav aria-label="Page navigation" className="mt-4">
          <ul className="pagination justify-content-center">
            {/* Previous Arrow */}
            <li className={`page-item ${currentPage === 1 ? "disabled" : ""}`}>
              <button className="page-link prev" onClick={() => setCurrentPage((prev) => prev - 1)}>
                <i className="bi bi-arrow-left"></i>
              </button>
            </li>

            {/* Page Numbers (Only 3 Visible) */}
            {Array.from({ length: endPage - startPage + 1 }, (_, index) => startPage + index).map((pageNumber) => (
              <li key={pageNumber} className={`page-item ${currentPage === pageNumber ? "active" : ""}`}>
                <button className="page-link" onClick={() => setCurrentPage(pageNumber)}>
                  {pageNumber}
                </button>
              </li>
            ))}

            {/* Next Arrow */}
            <li className={`page-item ${currentPage === totalPages ? "disabled" : ""}`}>
              <button className="page-link next" onClick={() => setCurrentPage((prev) => prev + 1)}>
                <i className="bi bi-arrow-right"></i>
              </button>
            </li>
          </ul>
        </nav>
      )}
    </div>
  );
};
