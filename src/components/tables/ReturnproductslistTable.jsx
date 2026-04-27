import { toast } from "react-toastify";
import React, { useState, useEffect } from "react";
import { deleteCustomerReturn,getReturnByBillingId,getReturnById } from "../../services/productretrun.service"; // ✅ FIX API
import { getCustomerBillingById } from "../../services/customerBilling.service";
import * as XLSX from "xlsx"; 
export const ReturnproductslistTable = ({
  data = [], // ✅ changed from customers → data
  search = "",
  loading = false,
  showActions = true,
  onEdit,
  refresh = () => {},
}) => {
const [viewEntry, setViewEntry] = useState(null);

  /* ================= FILTER ================= */
  const filteredData = data.filter((r) => {
    if (!search) return true;
    const k = search.toLowerCase();

    return (
      r.return_number?.toLowerCase().includes(k) ||
      r.customer_name?.toLowerCase().includes(k) ||
      String(r.billing_id).includes(k)
    );
  });

const loadbillingDetails = async (billingId) => {
  try {
    const res = await getCustomerBillingById(billingId);
    return res;
  } catch (err) {
    console.error("Billing load failed", err);
  }
};


  /* ================= PAGINATION ================= */
  const [currentPage, setCurrentPage] = useState(1);
  const rowsPerPage = 10;

  const totalPages = Math.ceil(filteredData.length / rowsPerPage);

  const indexOfLastRow = currentPage * rowsPerPage;
  const indexOfFirstRow = indexOfLastRow - rowsPerPage;

  const currentRows = filteredData.slice(indexOfFirstRow, indexOfLastRow);

  useEffect(() => {
    setCurrentPage(1);
  }, [search]);

  /* ================= EXPORT EXCEL ================= */
//  const exportDeliveryExcel = () => {
//   if (!filteredData.length) return;

//   const sheetData = [];
//   const merges = [];

//   // ✅ TITLE
//   sheetData.push(["DHEERAN TRADERS DELIVERY LIST"]);
//   sheetData.push([]);
//   sheetData.push(["Date", new Date().toLocaleDateString("en-IN")]);
//   sheetData.push([]);

//   // ✅ HEADERS
//   const headers = [
//     "S.No",
//     "Customer Name",
//     "Place",
//     "Phone Number",
//     "Total Bags",
//     "Returned Bags",
//     "Total Amount",
//     "Discount",
//     "Total",
//     "Cash",
//     "UPI",
//     "Pending",
//     "Return"
//   ];

//   sheetData.push(headers);

//   let rowIndex = 5;

//   // ✅ DATA
//   filteredData.forEach((r, index) => {
//     const totalBags = (r.products || []).reduce(
//       (sum, p) => sum + Number(p.quantity || 0),
//       0
//     );

//     const returnBags = (r.products || []).reduce(
//       (sum, p) => sum + Number(p.return_quantity || 0),
//       0
//     );

//     sheetData.push([
//       index + 1,
//       r.customer_name || "",
//       r.place || "",
//       r.phone_number || "",
//       totalBags,
//       Number(r.total_return_qty || 0),
//       Number(r.grand_total || 0),
//       Number(r.discount || 0),
//       Number(r.grand_total || 0),
//       Number(r.cash_amount || 0),
//       Number(r.upi_amount || 0),
//       Number(r.balance_due || 0),
//       Number(r.total_return_amount || 0),
//     ]);

//     rowIndex++;
//   });

//   // ✅ CREATE SHEET
//   const ws = XLSX.utils.aoa_to_sheet(sheetData);

//   // ✅ MERGE TITLE
//   merges.push({
//     s: { r: 0, c: 0 },
//     e: { r: 0, c: headers.length - 1 },
//   });

//   ws["!merges"] = merges;

//   // ✅ COLUMN WIDTH (like paper)
//   ws["!cols"] = [
//     { wch: 6 },
//     { wch: 25 },
//     { wch: 20 },
//     { wch: 15 },
//     { wch: 12 },
//     { wch: 14 },
//     { wch: 15 },
//     { wch: 10 },
//     { wch: 15 },
//     { wch: 10 },
//     { wch: 10 },
//     { wch: 12 },
//     { wch: 12 },
//   ];

//   const wb = XLSX.utils.book_new();
//   XLSX.utils.book_append_sheet(wb, ws, "Return List Report");

//   XLSX.writeFile(wb, "return list-report.xlsx");
// };
  

const exportDeliveryExcel = async () => {
  if (!filteredData.length) return;

  const sheetData = [];
  const merges = [];

  // ✅ TITLE
  sheetData.push(["DHEERAN TRADERS DELIVERY LIST"]);
  sheetData.push([]);
  sheetData.push(["Date", new Date().toLocaleDateString("en-IN")]);
  sheetData.push([]);

  const headers = [
    "S.No",
    "Invoice Number",
    "Customer Name",
    "Place",
    "Phone Number",
    "Total Bags",
    "Returned Bags",
    "Total Amount",
    "Discount",
    "Total",
    "Cash",
    "UPI",
    "Pending",
    "Return"
  ];

  sheetData.push(headers);
const groupedData = Object.values(
  filteredData.reduce((acc, r) => {
    if (!acc[r.billing_id]) {
      acc[r.billing_id] = {
        ...r,
        total_return_qty: 0,
        total_return_amount: 0,
      };
    }

    acc[r.billing_id].total_return_qty += Number(r.total_return_qty || 0);
    acc[r.billing_id].total_return_amount += Number(r.total_return_amount || 0);

    return acc;
  }, {})
);
  // ✅ LOOP WITH API CALL
  for (let i = 0; i < groupedData.length; i++) {
  const r = groupedData[i];

  const billingRes = await loadbillingDetails(r.billing_id);
  console.log("Billing Details for billing_id", r.billing_id, billingRes);
  const billing = billingRes?.billing;
  const products = billingRes?.products || [];

  const totalBags = products.reduce(
    (sum, p) => sum + Number(p.quantity || 0),
    0
  );
 const returnamount = products.reduce(
      (sum, p) => sum + ((p.returned_quantity || 0) * (p.final_rate || 0)),
      0
    );
  const returnedBags = products.reduce(
    (sum, p) => sum + Number(p.returned_quantity || 0),
    0
  );
  sheetData.push([
    i + 1,
    billing?.invoice_number || "",
    billing?.customer_name || "",
    billing?.customer_address || "",
    billing?.phone_number || "",
    totalBags,

    // ✅ NOW CORRECT (combined)
    returnedBags,
    Number(billing?.grand_total || 0),
    Number(billing?.discount || 0),
    Number(billing?.grand_total || 0),
    Number(billing?.cash_amount || 0),
    Number(billing?.upi_amount || 0),
    Number(billing?.balance_due || 0),
    returnamount,
  ]);
}

  const ws = XLSX.utils.aoa_to_sheet(sheetData);

  merges.push({
    s: { r: 0, c: 0 },
    e: { r: 0, c: headers.length - 1 },
  });

  ws["!merges"] = merges;

  ws["!cols"] = [
    { wch: 6 },
    { wch: 15 },
    { wch: 25 },
    { wch: 20 },
    { wch: 15 },
    { wch: 12 },
    { wch: 14 },
    { wch: 15 },
    { wch: 10 },
    { wch: 15 },
    { wch: 10 },
    { wch: 10 },
    { wch: 12 },
    { wch: 12 },
  ];

  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, "Return List Report");

  XLSX.writeFile(wb, "return-list-report.xlsx");
};
/* ================= DELETE ================= */
  const handleDelete = async (id) => {
    if (!window.confirm("Delete this return?")) return;

    try {
      await deleteCustomerReturn(id); // ✅ correct API
      refresh(id);
      setViewEntry(null);
      toast.success("Return deleted successfully");
    } catch (err) {
      toast.error(err?.response?.data?.message || "Delete failed");
    }
  };
 const loadReturnDetails = async (Id) => {
  try {
    const res = await getReturnById(Id);

    console.log("Return List Data:", res);

    const products = res?.data?.products || []; // ✅ FIXED

    console.log("Products in Return:", products);

    setViewEntry(products);
  } catch (err) {
    toast.error(err?.response?.data?.message || "Failed to load return details");
  }
};
console.log("viewEntry:", viewEntry);
   // Debug log

  const visiblePages = 3;

  let startPage = Math.max(1, currentPage - Math.floor(visiblePages / 2));
  let endPage = startPage + visiblePages - 1;

  if (endPage > totalPages) {
    endPage = totalPages;
    startPage = Math.max(1, endPage - visiblePages + 1);
  }

  /* ================= UI ================= */
  return (
    <>
    <div className="d-flex justify-content-end mt-3">
  <button className="excel-btn" onClick={exportDeliveryExcel}>
    Export Delivery Excel
  </button>
</div>
    <div className="common-table-wrapper mt-2">
      {loading && <div className="text-center">Loading...</div>}

      <table className="common-table table-striped">
        <thead>
          <tr>
            <th>ID</th>
            <th>Return Date</th>
            <th>Return No</th>
            <th>Invoice</th>
            <th>Customer</th>
            <th>Total Return</th>
            {/* <th>Status</th> */}
            {showActions && <th className="text-end">Actions</th>}
          </tr>
        </thead>

        <tbody>
          {currentRows.length === 0 ? (
            <tr>
              <td colSpan="7" className="text-center">
                No returns found
              </td>
            </tr>
          ) : (
            currentRows.map((r,index) => (
              <tr key={r.id}>
                <td>{index + 1}</td>
                <td>{r.created_at}</td>
                <td>{r.return_number}</td>
                <td>{r.invoice_number}</td>
                <td>{r.customer_name || "-"}</td>
                <td>₹ {r.total_return_amount || 0}</td>

                {/* <td>
                  <span
                    className={`badge ${
                      r.return_status === "FULL"
                        ? "bg-success"
                        : r.return_status === "PARTIAL"
                        ? "bg-warning text-dark"
                        : "bg-secondary"
                    }`}
                  >
                    {r.return_status}
                  </span>
                </td> */}

                {showActions && (
                  <td className="text-end">
               
<button className="btn btn-sm btn-secondary me-2" onClick={() => loadReturnDetails(r.id) }>
                      <i className="bi bi-file-earmark-text"></i>
                    </button>
                    <button
                      className="btn btn-sm btn-warning me-2"
                      onClick={() => onEdit(r)}
                    >
                      <i className="bi bi-pencil" />
                    </button>

                    <button
                      className="btn btn-sm btn-danger"
                      onClick={() => handleDelete(r.id)}
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

      {/* ================= PAGINATION ================= */}
      {totalPages > 1 && (
        <nav className="mt-4">
          <ul className="pagination justify-content-center">

            <li className={`page-item ${currentPage === 1 ? "disabled" : ""}`}>
              <button
                className="page-link"
                onClick={() => setCurrentPage((p) => p - 1)}
              >
                <i className="bi bi-arrow-left"></i>
              </button>
            </li>

            {Array.from(
              { length: endPage - startPage + 1 },
              (_, i) => startPage + i
            ).map((page) => (
              <li
                key={page}
                className={`page-item ${
                  currentPage === page ? "active" : ""
                }`}
              >
                <button
                  className="page-link"
                  onClick={() => setCurrentPage(page)}
                >
                  {page}
                </button>
              </li>
            ))}

            <li
              className={`page-item ${
                currentPage === totalPages ? "disabled" : ""
              }`}
            >
              <button
                className="page-link"
                onClick={() => setCurrentPage((p) => p + 1)}
              >
                <i className="bi bi-arrow-right"></i>
              </button>
            </li>

          </ul>
        </nav>
      )}

      {/* ================= VIEW ENTRY MODAL ================= */}
      {viewEntry && (
        <div className="modal show d-block" tabIndex="-1">
          <div className="modal-dialog modal-lg">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Return Entry</h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={() => setViewEntry(null)}
                ></button>
              </div>
              <div className="modal-body">
                  <div className="common-table-wrapper">
              <table className="common-table table-striped">
                <thead>
                  <tr>
                    <th>#</th>
                    <th>Product</th>
                    <th>Return Qty</th>
                    <th>Return Rate</th>
                    <th>Return Total Amount</th>
                  </tr>
                </thead>

                <tbody>
                  {viewEntry?.length > 0 ? (
  viewEntry.map((item, index) => (
    <tr key={item.id}>
      <td>{index + 1}</td>
      <td >{item.product_name}({item.brand}|{item.category}|{item.quantity})</td>
      <td>{item.return_quantity}</td>
      <td>{item.return_rate}</td>
      <td>{item.return_amount}</td>
      
    </tr>
  ))
) : (
  <tr>
    <td colSpan="7" className="text-center">
      No items found
    </td>
  </tr>
)}
                </tbody>
              </table>
            </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
    </>
  );
};