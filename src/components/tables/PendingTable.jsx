import React, { useEffect, useState, useMemo } from "react";
import Modal from "react-modal";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
import "../../pages/billing/accounts/add-payment-model.css";

import { getPendingBills } from "../../services/customerBilling.service";
import { getPaymentsByBillingId } from "../../services/customerBillingPayment.service";
import { AddPayment } from "../../pages/billing/accounts/AddPayment";

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
  const rowsPerPage = 5;
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
  const exportExcel = async () => {
    if (!filteredList.length) return;

    let excelRows = [];

    for (let i = 0; i < filteredList.length; i++) {
      const row = filteredList[i]; //✅

      // 🔹 Load payments if not already loaded
      let payments = paymentsMap[row.id];
      if (!payments) {
        const res = await getPaymentsByBillingId(row.id);
        payments = res.data || [];
      }

      // 🔹 If no payments, still export invoice row
      if (payments.length === 0) {
        excelRows.push({
          "Customer Name": row.customer_name,
          "Mobile Number": row.phone_number,
          "Total Amount": row.grand_total,
          "Paid Amount": row.advance_paid,
          "Pending Amount": row.balance_due,
          "Payment Date & Time": "-",
          "Cash Amount": 0,
          "UPI Amount": 0,
          "CHEQUE Amount": 0,
          "Reference No": "-",
          Remarks: "-",
        });
      } else {
        // 🔹 One row per payment
        payments.forEach((p) => {
          excelRows.push({
            "Customer Name": row.customer_name,
            "Mobile Number": row.phone_number,
            "Total Amount": row.grand_total,
            "Paid Amount": row.advance_paid,
            "Pending Amount": row.balance_due,
            "Payment Date & Time": new Date(p.created_at).toLocaleString("en-IN"),
            "Cash Amount": Number(p.cash_amount),
            "UPI Amount": Number(p.upi_amount),
            "CHEQUE Amount": Number(p.cheque_amount || 0),
            "Reference No": p.reference_no || "-",
            Remarks: p.remarks || "-",
          });
        });
      }
    }

    // 🔹 Create Excel
    const worksheet = XLSX.utils.json_to_sheet(excelRows);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Pending Payments Full Report");

    const buffer = XLSX.write(workbook, {
      bookType: "xlsx",
      type: "array",
    });

    saveAs(new Blob([buffer], { type: "application/octet-stream" }), "Pending_Payments_Full_Report.xlsx");
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
                    <td className="">{row.customer_name}</td>
                    <td className="text-center">{row.phone_number}</td>
                    <td className="text-center">₹{row.grand_total.toFixed(2)}</td>
                    <td className="text-center">₹{row.advance_paid.toFixed(2)}</td>
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
                      </div>
                    </td>
                  </tr>

                  {/* ===== PAYMENT HISTORY ===== */}
                  {openRowId === row.id && (
                    <tr>
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
                            </tr>
                          </thead>
                          <tbody>
                            {paymentsMap[row.id]?.length ? (
                              paymentsMap[row.id].map((p) => (
                                <tr key={p.id}>
                                  <td>{new Date(p.created_at).toLocaleString("en-IN")}</td>
                                  <td>₹{Number(p.cash_amount).toFixed(2)}</td>
                                  <td>₹{Number(p.upi_amount).toFixed(2)}</td>
                                  <td>₹{Number(p.cheque_amount || 0).toFixed(2)}</td>
                                  <td>{p.reference_no || "-"}</td>
                                  <td>{p.remarks || "-"}</td>
                                </tr>
                              ))
                            ) : (
                              <tr>
                                <td colSpan="5" className="text-center">
                                  No payments found
                                </td>
                              </tr>
                            )}
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
