
import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import {
  getProductWiseReport,
  getProductWiseReportByDate,
} from "../../../services/customerBilling.service";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";

export const ProductWiseReport = () => {
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
   const rowsPerPage = 7;
        
  /* ================= FETCH ================= */
  const fetchProductSales = async (from = "", to = "") => {
    try {
      setLoading(true);

      const data =
        from || to
          ? await getProductWiseReportByDate(from, to)
          : await getProductWiseReport();

      setRows(data);
    } catch (error) {
      console.error(error);
      toast.error("Failed to load product sales report");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // No dates → normal fetch
    if (!fromDate && !toDate) {
      fetchProductSales();
      return;
    }

    // Only run when BOTH are selected
    if (fromDate && toDate) {
      fetchProductSales(fromDate, toDate);
    }
  }, [fromDate, toDate]);

  useEffect(() => {
  if (fromDate && toDate) {
    if (new Date(fromDate) > new Date(toDate)) {
      toast.error("From date cannot be after To date");
      return;
    }

    fetchProductSales(fromDate, toDate);
  }
}, [fromDate, toDate]);

  /* ================= SEARCH FILTER ================= */
  const filteredRows = rows.filter((item) => {
    const value = search.toLowerCase();
    return Object.values(item).some(
      (val) => val && val.toString().toLowerCase().includes(value)
    );
  });

  /* ================= EXCEL EXPORT ================= */
  const exportExcel = () => {
    const excelData = filteredRows.map((item) => ({
      Product: item.product_name,
      Brand: item.product_brand,
      Category: item.product_category,
      Unit: item.product_quantity,
      "Total Sold": item.total_quantity_sold,
    }));

    const worksheet = XLSX.utils.json_to_sheet(excelData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Product Wise Report");

    const buffer = XLSX.write(workbook, {
      bookType: "xlsx",
      type: "array",
    });

    saveAs(
      new Blob([buffer], { type: "application/octet-stream" }),
      "product-wise-report.xlsx"
    );
  };

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

  return (
    <div className="row justify-content-center">
      <div className="col-lg-12">
        {/* DATE FILTER */}
        <div className="d-flex align-items-center justify-content-md-end gap-2 mb-3 filter-calender flex-wrap">
          <div className="d-flex align-items-center gap-2">
            <label>From Date :</label>
            <input
              type="date"
              className="form-control"
              value={fromDate}
              onChange={(e) => setFromDate(e.target.value)}
            />
          </div>

          <div className="d-flex align-items-center gap-2">
            <label>To Date :</label>
            <input
              type="date"
              className="form-control"
              value={toDate}
              onChange={(e) => setToDate(e.target.value)}
            />
          </div>
        </div>

        {/* HEADER */}
        <div className="report-header d-flex justify-content-between align-items-center mb-3">
          <div className="search-box">
            <input
              type="text"
              className="search-input"
              placeholder="Search..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
            <i className="bi bi-search search-icon"></i>
          </div>

          <button className="excel-btn" onClick={exportExcel}>
            <i className="fi fi-tr-file-excel"></i> Export Excel
          </button>
        </div>

        {/* TABLE */}
        {loading ? (
          <div className="text-center py-5">Loading product sales report...</div>
        ) : (
          <div className="common-table-wrapper">
            <table className="common-table table-striped">
              <thead>
                <tr>
                  <th className="text-start">Product</th>
                  <th className="text-center">
                    Details (Brand | Category | Unit)
                  </th>
                  <th className="text-end">Total Sold Count</th>
                </tr>
              </thead>

              <tbody>
              {currentRows.length ? (
                  currentRows.map((item, i) => (
                    <tr key={i}>
                      <td className="text-start">{item.product_name}</td>

                      <td className="text-center">
                        {item.product_brand} • {item.product_category} •{" "}
                        {item.product_quantity}
                      </td>

                      <td className="text-end">
                        <span style={{ fontSize: "14px" }}>
                          {item.total_quantity_sold}
                        </span>{" "}
                        <span style={{ fontSize: "12px", color: "#888" }}>
                          Pack
                        </span>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="3" className="text-center">
                      No product sales found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
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
      </div>
    </div>
  );
};