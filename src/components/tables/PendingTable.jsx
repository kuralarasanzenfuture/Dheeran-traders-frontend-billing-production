import React, { useEffect, useState, useMemo } from "react";
import Modal from "react-modal";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
import "../../pages/billing/accounts/add-payment-model.css";

import { getPendingBills } from "../../services/customerBilling.service";
import {
  getPaymentsByBillingId,
  updateCustomerPayment,
  deleteCustomerPayment
} from "../../services/customerBillingPayment.service";
import { AddPayment } from "../../pages/billing/accounts/AddPayment";
import { toast } from "react-toastify";

Modal.setAppElement("#root");

export const PendingTable = () => {
  const [pendingList, setPendingList] = useState([]);
  const [loading, setLoading] = useState(true);

  const [openRowId, setOpenRowId] = useState(null);
  const [paymentsMap, setPaymentsMap] = useState({});

  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [selectedBillingId, setSelectedBillingId] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const rowsPerPage = 10;
  /* ================= LOAD PENDING ================= */
  const loadPending = async () => {
    setLoading(true);
    const rows = await getPendingBills();
    const normalized = rows.map((r) => ({
      ...r,
      grand_total: Number(r.grand_total),
      advance_paid: Number(r.advance_paid),
      balance_due: Number(r.balance_due),
    }));
    setPendingList(normalized);
    setLoading(false);
  };

  useEffect(() => {
    loadPending();
  }, []);
console.log("Pending List:", pendingList);
  /* ================= VIEW PAYMENTS ================= */
  const toggleView = async (billingId) => {
    if (openRowId === billingId) {
      setOpenRowId(null);
      return;
    }

    if (!paymentsMap[billingId]) {
      const res = await getPaymentsByBillingId(billingId);
      setPaymentsMap((prev) => ({
        ...prev,
        [billingId]: res.data || [],
      }));
    }
    setOpenRowId(billingId);
  };

  /* ================= EXCEL EXPORT ================= */
//   const exportExcel = async () => {
//     if (!filteredList.length) return;

//     let excelRows = [];

//     for (let i = 0; i < filteredList.length; i++) {
//       const row = filteredList[i]; //✅

//       // 🔹 Load payments if not already loaded
//       let payments = paymentsMap[row.id];
//       if (!payments) {
//         const res = await getPaymentsByBillingId(row.id);
//         payments = res.data || [];
//       }

//       // 🔹 If no payments, still export invoice row
//       if (payments.length === 0) {
//         excelRows.push({
//           "Customer Name": row.customer_name,
//           "Mobile Number": row.phone_number,
//           "Total Amount": Number(row.grand_total),
//           "Paid Amount": Number(row.advance_paid),
//           "Pending Amount":Number( row.balance_due),
//           "Payment Date & Time": "-",
//           "Cash Amount": 0,
//           "UPI Amount": 0,
//           "CHEQUE Amount": 0,
//           "Reference No": "-",
//           Remarks: "-",
//         });
//       } 
//      else {
//   // 🔹 Combine all payments into one string
//   const paymentDetails = payments.map((p) => {
//     return `Date: ${new Date(p.created_at).toLocaleString("en-IN")}
// Cash: ${p.cash_amount || 0}
// UPI: ${p.upi_amount || 0}
// Cheque: ${p.cheque_amount || 0}
// Ref: ${p.reference_no || "-"}
// Remarks: ${p.remarks || "-"}`;
//   }).join(" | "); // 👉 separator like product details

//   excelRows.push({
//     "Customer Name": row.customer_name,
//     "Mobile Number": row.phone_number,
//     "Total Amount": Number(row.grand_total),
//     "Paid Amount": Number(row.advance_paid),
//     "Pending Amount": Number(row.balance_due),

//     // ✅ Single column for all payments
//     "Payment Details": paymentDetails || "-",
//   });
// }
//     }

//     // 🔹 Create Excel
//     const worksheet = XLSX.utils.json_to_sheet(excelRows);
//     const workbook = XLSX.utils.book_new();
//     XLSX.utils.book_append_sheet(workbook, worksheet, "Pending Payments Full Report");

//     const buffer = XLSX.write(workbook, {
//       bookType: "xlsx",
//       type: "array",
//     });

//     saveAs(new Blob([buffer], { type: "application/octet-stream" }), "Pending_Payments_Full_Report.xlsx");
//   };

 
const exportExcel = async () => {
  if (!filteredList.length) return;

  const sheetData = [];
  const merges = [];

  const headers = [
    "Invoice Number",
    "Customer Name",
    "Mobile Number",
    "Total Amount",
    "Paid Amount",
    "Pending Amount",
    "Payment Date & Time",
    "Cash Amount",
    "UPI Amount",
    "CHEQUE Amount",
    "Reference No",
    "Remarks",
  ];

  sheetData.push(headers);

  let rowIndex = 1;

  for (let i = 0; i < filteredList.length; i++) {
    const row = filteredList[i];

    let payments = paymentsMap[row.id];
    if (!payments) {
      const res = await getPaymentsByBillingId(row.id);
      payments = res.data || [];
    }

    const startRow = rowIndex;

    // ✅ If no payments
    if (payments.length === 0) {
      sheetData.push([
        row.invoice_number,
        row.customer_name,
        row.phone_number,
        Number(row.grand_total),
        Number(row.total_paid_amount) || 0,
        Number(row.balance_due),
        "-",
        0,
        0,
        0,
        "-",
        "-",
      ]);

      rowIndex++;
    } else {
      // ✅ First payment row (with invoice details)
      payments.forEach((p, index) => {
        sheetData.push([
          index === 0 ? row.invoice_number : "",
          index === 0 ? row.customer_name : "",
          index === 0 ? row.phone_number : "",
          index === 0 ? Number(row.grand_total) : "",
          index === 0 ? Number(row.total_paid_amount) || 0 : "",
          index === 0 ? Number(row.balance_due) : "",

          new Date(p.created_at).toLocaleString("en-IN"),
          Number(p.cash_amount || 0),
          Number(p.upi_amount || 0),
          Number(p.cheque_amount || 0),
          p.reference_no || "-",
          p.remarks || "-",
        ]);

        rowIndex++;
      });

      // ✅ Merge ONLY invoice columns (like product report)
      for (let col = 0; col <= 5; col++) {
        merges.push({
          s: { r: startRow, c: col },
          e: { r: rowIndex - 1, c: col },
        });
      }
    }

    // space row
    sheetData.push([]);
    rowIndex++;
  }

  const ws = XLSX.utils.aoa_to_sheet(sheetData);
  ws["!merges"] = merges;

  // ✅ Column width
  ws["!cols"] = [
    { wch: 18 },
    { wch: 20 },
    { wch: 15 },
    { wch: 14 },
    { wch: 14 },
    { wch: 14 },
    { wch: 22 },
    { wch: 12 },
    { wch: 12 },
    { wch: 14 },
    { wch: 18 },
    { wch: 25 },
  ];

  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, "Pending Payments");

  XLSX.writeFile(wb, "Pending_Payments_Report.xlsx");
};

const filteredList = useMemo(() => {
    const k = (searchTerm || "").trim().toLowerCase();

    return pendingList.filter((row) => {
      /* 🔍 SEARCH */
      const matchesSearch = !k || (row.customer_name || "").toLowerCase().includes(k) || (row.phone_number || "").includes(k);

      /* 📅 DATE + TIME FILTER (using created_at) */
      if (!row.created_at) return matchesSearch;

      const invoiceTime = new Date(row.created_at).getTime();

      const fromTime = fromDate ? new Date(fromDate + "T00:00:00").getTime() : null;

      const toTime = toDate ? new Date(toDate + "T23:59:59").getTime() : null;

      const matchesDate = (!fromTime || invoiceTime >= fromTime) && (!toTime || invoiceTime <= toTime);

      return matchesSearch && matchesDate;
    });
  }, [pendingList, searchTerm, fromDate, toDate]);
  // ===== PAGINATION LOGIC =====
  const totalPages = Math.ceil(filteredList.length / rowsPerPage);

  const indexOfLastRow = currentPage * rowsPerPage;
  const indexOfFirstRow = indexOfLastRow - rowsPerPage;

  const currentRows = filteredList.slice(indexOfFirstRow, indexOfLastRow);
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, fromDate, toDate]);

  const visiblePages = 3; // show only 3 pages

  let startPage = Math.max(1, currentPage - Math.floor(visiblePages / 2));

  let endPage = startPage + visiblePages - 1;

  if (endPage > totalPages) {
    endPage = totalPages;
    startPage = Math.max(1, endPage - visiblePages + 1);
  }

  
const handleEditPayment = async (p) => {
  const newCash = prompt("Enter Cash Amount", p.cash_amount);
  const newUpi = prompt("Enter UPI Amount", p.upi_amount);

  if (newCash === null && newUpi === null) return;

  try {
    await updateCustomerPayment(p.id, {
      cash_amount: Number(newCash) || 0,
      upi_amount: Number(newUpi) || 0,
      cheque_amount: Number(p.cheque_amount || 0),
      reference_no: p.reference_no,
      remarks: p.remarks,
    });

    alert("Updated successfully");

    const res = await getPaymentsByBillingId(p.billing_id);

    setPaymentsMap((prev) => ({
      ...prev,
      [p.billing_id]: res.data || [],
    }));

    await loadPending();

  } catch (err) {
    alert("Update failed");
  }
};
const handleDeletePayment = async (paymentId, billingId) => {
  if (!window.confirm("Are you sure to delete this payment?")) return;

  try {
    await deleteCustomerPayment(paymentId);

    // reload payments
    const res = await getPaymentsByBillingId(billingId);

    setPaymentsMap((prev) => ({
      ...prev,
      [billingId]: res.data || [],
    }));

    await loadPending();
toast.success("Payment deleted successfully");
  } catch (err) {
    alert("Delete failed");
  }
};

  if (loading) {
    return <p className="text-center py-3">Loading pending payments...</p>;
  }

  return (
    <>
      {/* ===== FILTER SECTION ===== */}
      <div className="d-flex align-items-center justify-content-md-between gap-3 mb-4 flex-wrap">
        <div className="search-box ">
          <input
            type="text"
            className="search-input"
            placeholder="Search by Name or Mobile..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <i className="bi bi-search search-icon"></i>
        </div>
        {/* FROM DATE */}
        <div className="d-flex align-items-center gap-2">
          <label className="mb-0 flex-grow" style={{ fontSize: "14px" }}>
            From <span className="d-none d-md-inline">Date</span>:
          </label>
          <input
            type="date"
            className="form-control"
            value={fromDate}
            onChange={(e) => setFromDate(e.target.value)}
            style={{ width: "150px", maxWidth: "100%" }}
          />
        </div>

        {/* TO DATE */}
        <div className="d-flex align-items-center gap-2">
          <label className="mb-0" style={{ fontSize: "14px" }}>
            To <span className="d-none d-md-inline">Date</span>:
          </label>
          <input
            type="date"
            className="form-control"
            value={toDate}
            onChange={(e) => setToDate(e.target.value)}
            style={{ width: "150px", maxWidth: "100%" }}
          />
        </div>

        {/* CLEAR BUTTON */}
        <div>
          <button
            className="btn btn-secondary px-4"
            onClick={() => {
              setSearchTerm("");
              setFromDate("");
              setToDate("");
            }}>
            Clear
          </button>
        </div>
      </div>

      <div className="d-md-flex align-items-center justify-content-between"></div>

      {/* ===== HEADER ===== */}
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h5 className="mb-0 ps-2">Pending Payments</h5>
        <button className="btn excel-btn" onClick={exportExcel}>
          <i class="fi fi-tr-file-excel"></i> Export Excel
        </button>
      </div>  

      {/* ===== TABLE ===== */}
      <div className="common-table-wrapper">
        <table className="common-table table-striped">
          <thead>
            <tr>
              <th>Invoice Number</th>
              <th>Customer Name</th>
              <th className="text-center">Mobile</th>
              <th className="text-center">Total</th>
              <th className="text-center">Paid</th>
              <th className="text-center">Pending</th>
              <th className="text-center ms-5">Action</th>
            </tr>
          </thead>

          <tbody>
            {filteredList.length === 0 ? (
              <tr>
                <td colSpan="6" className="text-center py-3">
                  No pending payments 🎉
                </td>
              </tr>
            ) : (
              //  filteredList.map((row) => (
              currentRows.map((row) => (
                <React.Fragment key={row.id}>
                  <tr>
                    <td className="">{row.invoice_number}</td>
                    <td className="">{row.customer_name}</td>
                    <td className="text-center">{row.phone_number}</td>
                    <td className="text-center">₹{row.grand_total.toFixed(2)}</td>
                    <td className="text-center">₹{Number(row.total_paid_amount).toFixed(2) || "0.00"}</td>
                    <td className="text-center text-danger fw-bold">₹{row.balance_due.toFixed(2)}</td>
                    <td className="text-end">
                      <div className="action-icon-group">
                        <button
                          className="action-icon-btn action-pay"
                          title="Add Payment"
                          onClick={() => {
                            setSelectedBillingId(row.id);
                            setShowPaymentModal(true);
                          }}>
                          <i className="bi bi-credit-card"></i>
                        </button>

                        <button className="action-icon-btn action-view" title="View Payments" onClick={() => toggleView(row.id)}>
                          <i className="bi bi-file-earmark-text"></i>
                        </button>

                                {/* <button
                                  className="btn btn-sm btn-warning "
                                  onClick={() => onEdit?.(c)}
                                >
                                  <i className="bi bi-pencil" />
                                </button>
                                              <button
                                              className="btn btn-sm btn-danger "
                                              onClick={() => onDelete?.(c)}
                                            >
                                              <i className="bi bi-trash" />
                                            </button> */}

                      </div>
                    </td>
                  </tr>

                  {/* ===== PAYMENT HISTORY ===== */}
                  {openRowId === row.id && (
                    <tr className="align-items-center">
                      <td colSpan="6">
                        <table className="table table-bordered mb-0">
                          <thead>
                            <tr>
                              <th>Date & Time</th>
                              <th>Cash</th>
                              <th>UPI</th>
                              <th>Cheque</th>
                              <th>Reference</th>
                              <th>Remarks</th>
                              <th className="text-center">Action</th>
                            </tr>
                          </thead>
                          <tbody>
                            {paymentsMap[row.id]?.map((p) => (
  <tr key={p.id}>
    <td>{new Date(p.created_at).toLocaleString("en-IN")}</td>
    <td>₹{Number(p.cash_amount).toFixed(2)}</td>
    <td>₹{Number(p.upi_amount).toFixed(2)}</td>
    <td>₹{Number(p.cheque_amount || 0).toFixed(2)}</td>
    <td>{p.reference_no || "-"}</td>
    <td>{p.remarks || "-"}</td>

    {/* ✅ ACTION COLUMN */}
    <td className="text-center">
      {/* <button
        className="btn btn-sm btn-warning me-2"
        onClick={() => handleEditPayment(p)}
      >
        <i className="bi bi-pencil"></i>
      </button> */}

      <button
        className="btn btn-sm btn-danger"
        onClick={() => handleDeletePayment(p.id, row.id)}
      >
        <i className="bi bi-trash"></i>
      </button>
    </td>
  </tr>
))}
                          </tbody>
                        </table>
                      </td>
                    </tr>
                  )}
                </React.Fragment>
              ))
            )}
          </tbody>
        </table>
      </div>

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
      {/* ===== ADD PAYMENT MODAL ===== */}
      <Modal
        isOpen={showPaymentModal}
        onRequestClose={() => setShowPaymentModal(false)}
        overlayClassName="erp-modal-overlay"
        className="erp-modal-container">
        <div className="erp-modal-card">
          <div className="erp-modal-header">
            <h5 className="mb-0">Add Payment</h5>
            <button className="btn-close" onClick={() => setShowPaymentModal(false)} />
          </div>

          <div className="erp-modal-body">
            <AddPayment
              billingId={selectedBillingId}
              onClose={() => setShowPaymentModal(false)}
              onSuccess={async () => {
                setShowPaymentModal(false);

                // 1️⃣ Reload pending summary
                await loadPending();

                // 2️⃣ Reload payment history for that billing
                if (selectedBillingId) {
                  const res = await getPaymentsByBillingId(selectedBillingId);

                  setPaymentsMap((prev) => ({
                    ...prev,
                    [selectedBillingId]: res.data || [],
                  }));

                  // 3️⃣ Keep that row open
                  setOpenRowId(selectedBillingId);
                }
              }}
            />
          </div>
        </div>
      </Modal>
    </>
  );
};
