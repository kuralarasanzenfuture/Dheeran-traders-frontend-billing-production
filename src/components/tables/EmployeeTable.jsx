import React, { useState ,useEffect} from "react";
import { useNavigate } from "react-router-dom";

export const EmployeeTable = ({ data = [], onEdit, onDelete }) => {

  const [openRow, setOpenRow] = useState(null);
  const navigate = useNavigate();
  const [currentPage, setCurrentPage] = useState(1);
  const rowsPerPage = 8;
  const toggleRow = (id) => {
    setOpenRow(openRow === id ? null : id);
  };
  // ===== PAGINATION LOGIC =====
   const totalPages = Math.ceil(data.length / rowsPerPage);
 
   const indexOfLastRow = currentPage * rowsPerPage;
   const indexOfFirstRow = indexOfLastRow - rowsPerPage;
 
   const currentRows = data.slice(indexOfFirstRow, indexOfLastRow);
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
    <div className="common-table-wrapper">
      <table className="common-table table-striped">
        <thead>
          <tr>
            <th>Employee ID</th>
            <th>Name</th>
            <th>Email</th>
            <th>Phone</th>
            <th>Date Of Birth</th>
            <th>Gender</th>
            <th>Aadhar No</th>
            <th className="text-end">Actions</th>
          </tr>
        </thead>

        <tbody>
  {currentRows.length === 0 ? (
    <tr>
      <td colSpan="8" className="text-center py-3">
        No employees found
      </td>
    </tr>
  ) : (
    currentRows.map((emp) => (
      <React.Fragment key={emp.id}>
        {/* MAIN ROW */}
        <tr>
          <td>{emp.employee_code}</td>
          <td>{emp.employee_name}</td>
          <td>{emp.email || "-"}</td>
          <td>{emp.phone || "-"}</td>
          <td>
            {emp.date_of_birth
              ? new Date(emp.date_of_birth).toLocaleDateString("en-IN")
              : "-"}
          </td>
          <td>{emp.gender || "-"}</td>
          <td>{emp.aadhar_number || "-"}</td>
          <td className="text-end">
            <div className="d-inline-flex align-items-center gap-3">
              <button
                className="btn btn-secondary"
                onClick={() => toggleRow(emp.id)}
                title="View details"
              >
                <i className="bi bi-file-earmark-text"></i>
              </button>

              <button
                className="btn btn-warning"
                onClick={() => onEdit(emp)}
                title="Edit employee"
              >
                <i className="bi bi-pencil"></i>
              </button>

              <button
                className="btn btn-danger"
                onClick={() => onDelete(emp.id)}
                title="Delete employee"
              >
                <i className="bi bi-trash"></i>
              </button>
            </div>
          </td>
        </tr>

        {/* EXPANDED ROW */}
        {openRow === emp.id && (
          <tr className="employee-expand-row">
            <td colSpan="8">
              <div className="employee-expand-box">
                <div className="d-flex gap-2"><strong>Address:</strong> <small className="text-break">{emp.address || "-"}</small></div>
                <div className="d-flex gap-2"><strong>PAN:</strong> <small className="text-break">{emp.pan_number || "-"}</small></div>
                <div className="d-flex gap-2"><strong>Bank:</strong> <small className="text-break">{emp.bank_name || "-"}</small></div>
                <div className="d-flex gap-2"><strong>Account Number:</strong> <small className="text-break">{emp.bank_account_number || "-"}</small></div>
                <div className="d-flex gap-2"><strong>IFSC:</strong> <small className="text-break">{emp.ifsc_code || "-"}</small></div>
                <div className="d-flex gap-2">
                  <strong>Emergency Contact:</strong><small className="text-break">
                    {" "}
                  {emp.emergency_contact_name || "-"} (
                  {emp.emergency_contact_phone || "-"})
                  </small>
                </div>
                <div className="d-flex gap-2">
                  <strong>Relation:</strong>{" "}
                  <small className="text-break">{emp.emergency_contact_relation || "-"}</small>
                </div>
              
               <div className="d-flex align-items-center gap-2 mt-2">
                <strong className="mb-0">Status:</strong>

                <span
                  className={`badge rounded-pill px-3 py-2 fw-semibold ${
                    emp.status?.toLowerCase() === "active"
                      ? "bg-success-subtle text-success border border-success-subtle"
                      : "bg-danger-subtle text-danger border border-danger-subtle"
                  }`}
                >
                  {emp.status
                    ? emp.status.charAt(0).toUpperCase() + emp.status.slice(1)
                    : "-"}
                </span>
              </div>
              </div>  
            </td>
          </tr>
        )}
      </React.Fragment>
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
