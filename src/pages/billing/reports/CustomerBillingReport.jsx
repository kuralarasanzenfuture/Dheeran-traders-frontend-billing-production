    import React, { useEffect, useState, useMemo } from "react";
    import { useNavigate } from "react-router-dom";
    import * as XLSX from "xlsx";
    import { saveAs } from "file-saver";
    import { getAllCustomerBillings ,deleteCustomerBilling  } from "../../../services/customerBilling.service";
    import api from "../../../services/api";
   import { createPortal } from "react-dom";
   import { toast } from "react-toastify";
 
    export const CustomerBillingReport = () => {
      const navigate = useNavigate();

      const [rows, setRows] = useState([]);
      const [loading, setLoading] = useState(true);

      const [search, setSearch] = useState("");
      const [fromDate, setFromDate] = useState("");
      const [toDate, setToDate] = useState("");
      const [openRowId, setOpenRowId] = useState(null);
      
   
      const [activeDeleteId, setActiveDeleteId] = useState(null);
      const [password, setPassword] = useState("");
      const [deleteBoxPosition, setDeleteBoxPosition] = useState(null);
      const [unlockedDeleteId, setUnlockedDeleteId] = useState(null);
      const [deleteError, setDeleteError] = useState("");
      const loggedInUser = JSON.parse(localStorage.getItem("user"));
      const isAdmin = loggedInUser?.role === "admin";
      const [currentPage, setCurrentPage] = useState(1);
      const rowsPerPage = 7;
      
      /* ================= FETCH ================= */
      useEffect(() => {
        const fetchBilling = async () => {
          try {
            const data = await getAllCustomerBillings();
            setRows(Array.isArray(data) ? data : []);
          } catch (err) {
            console.error("Failed to fetch billing data", err);
            setRows([]);
          } finally {
            setLoading(false);
          }
        };
        fetchBilling();
      }, []);
  
 const confirmDelete = async (billingId) => {
  try {
    if (!password) {
      setDeleteError("Admin password required");
      return;
    }

    await deleteCustomerBilling(billingId, password);

    setRows(prev => prev.filter(r => r.id !== billingId));
    toast.success("Bill deleted successfully")
  } catch (err) {
    
    setDeleteError(
      err.response?.data?.message || "Wrong admin password"
    );
     toast.error("Wrong admin password")
  } finally {
    setPassword("");
    setActiveDeleteId(null);
    setUnlockedDeleteId(null);
  }
};

      /* ================= FILTER ================= */
      // const filteredRows = rows.filter((r) => {
      //   const k = search.toLowerCase();

      //   const matchesSearch =
      //     !search ||
      //     r.invoice_number?.toLowerCase().includes(k) ||
      //     r.customer_name?.toLowerCase().includes(k) ||
      //     r.phone_number?.includes(k) ||
      //     r.staff_name?.toLowerCase().includes(k);

      //   const invoiceTime = new Date(r.created_at).getTime();
      //   const fromTime = fromDate ? new Date(fromDate + "T00:00:00").getTime() : null;
      //   const toTime = toDate ? new Date(toDate + "T23:59:59").getTime() : null;

      //   const matchesDate =
      //     (!fromTime || invoiceTime >= fromTime) &&
      //     (!toTime || invoiceTime <= toTime);

      //   return matchesSearch && matchesDate;
      // });
const filteredRows = useMemo(() => {
  const k = (search || "").trim().toLowerCase();

  return rows.filter((r) => {
    const matchesSearch =
      !k ||
      (r.invoice_number || "").toLowerCase().includes(k) ||
      (r.customer_name || "").toLowerCase().includes(k) ||
      (r.phone_number || "").includes(k) ||
      (r.staff_name || "").toLowerCase().includes(k);

    const invoiceTime = new Date(r.created_at).getTime();
    const fromTime = fromDate
      ? new Date(fromDate + "T00:00:00").getTime()
      : null;
    const toTime = toDate
      ? new Date(toDate + "T23:59:59").getTime()
      : null;

    const matchesDate =
      (!fromTime || invoiceTime >= fromTime) &&
      (!toTime || invoiceTime <= toTime);

    return matchesSearch && matchesDate;
  });
}, [rows, search, fromDate, toDate]);

      /* ================= EXCEL EXPORT ================= */
    const exportExcel = () => {
      if (!filteredRows.length) return;

      const maxProducts = Math.max(
        ...filteredRows.map((r) => r.products?.length || 0)
      );

      const data = filteredRows.map((r) => {
        const row = {
          Invoice: r.invoice_number,
          Date: new Date(r.created_at).toLocaleString("en-IN"),
          Customer: r.customer_name,
          Phone: r.phone_number,
          Staff: r.staff_name,
          "Grand Total": r.grand_total,
          Pending: r.balance_due,
        };

        for (let i = 0; i < maxProducts; i++) {
          const p = r.products?.[i];

          // 🔹 SINGLE CELL: product master details
          row[`Product ${i + 1}`] = p
            ? `${p.product_name} | ${p.product_brand} | ${p.product_category} | Default Qty: ${p.product_qunatity ?? "-"}`
            : "";

          // 🔹 SEPARATE COLUMNS
          row[`Product ${i + 1} Buy Qty`] = p ? p.quantity : "";
          row[`Product ${i + 1} Rate`] = p ? p.rate : "";
        }

        return row;
      });

      const ws = XLSX.utils.json_to_sheet(data);
      const wb = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, "Customer Billing Report");

      const buffer = XLSX.write(wb, { bookType: "xlsx", type: "array" });
      saveAs(
        new Blob([buffer], {
          type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        }),
        "customer-billing-report.xlsx"
      );
    };
    useEffect(() => {
  const closePopup = () => {
    setActiveDeleteId(null);
    setDeleteBoxPosition(null);
  };

  window.addEventListener("scroll", closePopup, true);
  window.addEventListener("resize", closePopup);

  return () => {
    window.removeEventListener("scroll", closePopup, true);
    window.removeEventListener("resize", closePopup);
  };
}, []);

  const totalPages = Math.ceil(filteredRows.length / rowsPerPage);
   
   const indexOfLastRow = currentPage * rowsPerPage;
   const indexOfFirstRow = indexOfLastRow - rowsPerPage;
   
   const currentRows = filteredRows.slice(
     indexOfFirstRow,
     indexOfLastRow
   );
   useEffect(() => {
     setCurrentPage(1);
   }, [search, fromDate, toDate]);
   
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
   
      if (loading) return <p>Loading billing reports...</p>;

      return (
        <div className="row justify-content-center">
          <div className="col-lg-12">

            {/* ===== DATE FILTER ===== */}
            <div className="d-flex align-items-center justify-content-md-end gap-2 mb-3 filter-calender flex-wrap">
              <div className="d-flex align-items-center gap-2">
                <label>
                  From <span className="d-none d-md-inline-block">Date</span> :
                </label>
                <input
                  type="date"
                  className="form-control"
                  value={fromDate}
                  onChange={(e) => setFromDate(e.target.value)}
                />
              </div>

              <div className="d-flex align-items-center gap-2">
                <label>
                  To <span className="d-none d-md-inline-block">Date</span> :
                </label>
                <input
                  type="date"
                  className="form-control"
                  value={toDate}
                  onChange={(e) => setToDate(e.target.value)}
                />
              </div>
            </div>

            {/* ===== SEARCH + ACTION BUTTONS ===== */}
            <div className="d-md-flex align-items-center justify-content-between">

              <div className="search-box">
             <input
                type="text"
                name="report-search"
                autoComplete="off"
                autoCorrect="off"
                autoCapitalize="off"
                spellCheck="false"
                className="search-input"
                placeholder="Search..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                onClick={(e) => e.stopPropagation()}
              />
                <i className="bi bi-search search-icon"></i>
              </div>

              <div className="d-flex gap-2 flex-wrap justify-content-md-end mt-3 mt-md-0">
                <button className="excel-btn" onClick={exportExcel}>
                  <i className="fi fi-tr-file-excel"></i> Export Excel
                </button>     
              </div>
            </div>

            {/* ===== TABLE ===== */}
            <div className="common-table-wrapper mt-4">
              <table className="common-table table-striped">
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Invoice</th>
                    <th>Date</th>
                    <th>Customer</th>
                    <th>Phone</th>
                    <th>Staff</th>
                    <th>Total</th>
                    <th className="text-end">Actions</th>
                  </tr>
                </thead>

         <tbody>
  {currentRows.map((r) => (
    <React.Fragment key={r.id}>
      {/* MAIN DATA ROW */}
      <tr>
        <td>{r.id}</td>
        <td>{r.invoice_number}</td>
        <td>
          <div>{new Date(r.created_at).toLocaleDateString("en-IN")}</div>
          <small className="text-muted">
            {new Date(r.created_at).toLocaleTimeString("en-IN")}
          </small>
        </td>
        <td>{r.customer_name}</td>
        <td>{r.phone_number}</td>
        <td>{r.staff_name}</td>
        <td>₹ {Number(r.grand_total).toFixed(2)}</td>

        {/* ACTIONS */}
        <td className="text-end">
          <div className="btn-group gap-1">
            <button
              className="btn btn-sm btn-secondary"
              onClick={() =>
                setOpenRowId(openRowId === r.id ? null : r.id)
              }
            >
              <i className="bi bi-file-earmark-text" />
            </button>

            <button
              className="btn btn-sm btn-dark"
              onClick={() => navigate(`/invoice/print/${r.id}`)}
            >
              <i className="bi bi-printer" />
            </button>
  {isAdmin &&(
            <button
              className="btn btn-sm btn-danger"
              onClick={() => {
                setActiveDeleteId(r.id);
                setUnlockedDeleteId(null);
                setPassword("");
                setDeleteError("");
              }}
            >
              <i className="bi bi-trash" />
            </button>
  )}
          </div>
        </td>
      </tr>

      {/* 🔐 DELETE PASSWORD ROW (VALID HTML) */}
      {activeDeleteId === r.id && (
        <tr>
          <td colSpan="8">
            <div
              className="mx-auto mt-2 p-2 border rounded bg-white text-center"
              style={{ width: "180px" }}
            >
              {/* STEP 1 */}
              {unlockedDeleteId !== r.id && (
                <>
                  <div className="small text-muted mb-1">
                    Admin Password
                  </div>

                 <input
                    type="password"
                    name="admin-delete-password-xyz"   // 🔴 random & unique name
                    autoComplete="off"
                    autoCorrect="off"
                    autoCapitalize="off"
                    spellCheck="false"
                    data-lpignore="true"               // 🔴 LastPass
                    data-form-type="other"             // 🔴 Chrome hint
                    className="form-control form-control-sm mb-2"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />


                  {deleteError && (
                    <div className="text-danger small mb-1">
                      {deleteError}
                    </div>
                  )}

                  <button
                    className="btn btn-sm btn-dark w-100"
                    disabled={!password}
                    onClick={() => setUnlockedDeleteId(r.id)}
                  >
                    🔓 Unlock
                  </button>
                </>
              )}

              {/* STEP 2 */}
              {unlockedDeleteId === r.id && (
                <>
                  <div className="text-danger fw-semibold mb-2">
                    Confirm delete?
                  </div>
                  <button
                    className="btn btn-sm btn-danger w-100"
                    onClick={() => confirmDelete(r.id)}
                  >
                    🗑 Confirm Delete
                  </button>
                </>
              )}
            </div>
          </td>
        </tr>
        )}
        {/* ===== EXPANDED VIEW ===== */} 
        {openRowId === r.id && ( <tr> <td colSpan="8"> <div className="detail-card"> <table className="table table-sm table-bordered mb-0"> <thead className="table-light"> <tr> 
          
<th className="text-center">#</th> 
<th className="text-center">Product</th> 
<th className="text-center">Qty</th>
<th className="text-center">Rate</th>
<th className="text-center">Disc %</th>
<th className="text-center">Disc ₹</th>
<th className="text-center">Final Rate</th>
<th className="text-center">Total</th></tr> </thead> 
<tbody> {r.products?.length > 0 ? ( r.products.map((p, i) => ( <tr key={i}> <td className="text-center">{i + 1}</td> <td className="text-center">{p.product_name}</td> <td className="text-center">{p.quantity}</td>

<td className="text-center">
  ₹ {Number(p.rate).toFixed(2)}
</td>

<td className="text-center text-primary">
  {p.discount_percent ? `${p.discount_percent}%` : "—"}
</td>

<td className="text-center text-danger">
  {p.discount_amount
    ? `₹ ${Number(p.discount_amount).toFixed(2)}`
    : "—"}
</td>

<td className="text-center fw-semibold">
  ₹ {Number(p.final_rate || p.rate).toFixed(2)}
</td>

<td className="text-center fw-bold">
  ₹ {(p.quantity * (p.final_rate || p.rate)).toFixed(2)}
</td> </tr> )) ) : ( <tr> <td colSpan="5" className="text-center"> No products found </td> </tr> )} </tbody> </table> </div> </td> </tr> )}
    </React.Fragment>
  ))}
</tbody>
              </table>
            </div>

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
 
        </div>
        
      );
    };
