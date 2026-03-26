import { toast } from "react-toastify";
import { deleteVendor } from "../../services/vendor.service";
import React, { useState, useEffect } from "react";
export const VendorTable = ({
  vendors = [],
  search = "",
  loading = false,
  onEdit,
   refresh,
}) => {
const [currentPage, setCurrentPage] = useState(1);
    const rowsPerPage = 8;

  const filteredVendors = vendors.filter(v => {
    if (!search) return true;
    const k = search.toLowerCase();

    return (
      `${v.first_name} ${v.last_name}`.toLowerCase().includes(k) ||
      v.phone?.includes(k) ||
      v.email?.toLowerCase().includes(k) ||
      v.bank_name?.toLowerCase().includes(k)
    );
  });

  const handleDelete = async (id) => {
  if (!window.confirm("Delete this vendor?")) return;

  try {
    await deleteVendor(id);

    // ✅ REMOVE FROM UI IMMEDIATELY
    refresh("delete");

    toast.success("Vendor deleted successfully");
  } catch {
    toast.error("Failed to delete vendor");
  }
};
 // ===== PAGINATION LOGIC =====
   const totalPages = Math.ceil(filteredVendors.length / rowsPerPage);
 
   const indexOfLastRow = currentPage * rowsPerPage;
   const indexOfFirstRow = indexOfLastRow - rowsPerPage;
 
   const currentRows = filteredVendors.slice(indexOfFirstRow, indexOfLastRow);
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

  if (loading) return <p>Loading vendors...</p>;

  return (
    <div className="common-table-wrapper mt-4">
      <table className="common-table table-striped">
        <thead>
          <tr>
            <th>ID</th>
            <th>Vendor Name</th>
            <th>Email</th>
            <th>Phone</th>
            <th>Bank</th>
            <th>Branch</th>
            <th className="text-end">Actions</th>
          </tr>
        </thead>

        <tbody>
          {currentRows.length === 0 ? (
            <tr>
              <td colSpan="7" className="text-center">
                No vendors found
              </td>
            </tr>
          ) : (
            currentRows.map(v => (
              <tr key={v.id}>
                <td>{v.id}</td>
                <td>{v.first_name} {v.last_name}</td>
                <td>{v.email || "—"}</td>
                <td>{v.phone}</td>
                <td>{v.bank_name || "—"}</td>
                <td>{v.bank_branch_name || "—"}</td>

                <td className="text-end">
                  <button
                    className="btn btn-sm btn-warning me-2"
                    onClick={() => onEdit(v)}
                  >
                    <i className="bi bi-pencil" />
                  </button>

                  <button
                    className="btn btn-sm btn-danger"
                    onClick={() => handleDelete(v.id)}
                  >
                    <i className="bi bi-trash" />
                  </button>
                </td>
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
