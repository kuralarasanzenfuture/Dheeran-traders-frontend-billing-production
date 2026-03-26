
import React, { useEffect, useState } from "react";
import { getAllCustomerBillings } from "../../../services/customerBilling.service";
import { getAllPayments } from "../../../services/customerBillingPayment.service";
import { toast } from "react-toastify";
import "../../../assets/css/style.css";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";

export const DailySalesReport = () => {
  const today = new Date().toISOString().split("T")[0];

  const [billings, setBillings] = useState([]);
  const [payments, setPayments] = useState([]);

  const [fromDate, setFromDate] = useState(today);
  const [toDate, setToDate] = useState(today);

  const [summary, setSummary] = useState({
    invoiceCount: 0,
    totalSales: 0,
    totalCGST: 0,
    totalSGST: 0,
    totalGST: 0,
    grandTotal: 0,
    totalReceived: 0,
    totalCash: 0,
    totalUPI: 0,
    totalCheque: 0,
  });

  /* ================= FETCH DATA ================= */

  const fetchBillings = async () => {
    try {
      const data = await getAllCustomerBillings();
      setBillings(data);
    } catch (err) {
      toast.error("Failed to load billings");
    }
  };

  const fetchPayments = async () => {
    try {
      const data = await getAllPayments();
      setPayments(data);
    } catch (err) {
      toast.error("Failed to load payments");
    }
  };

  useEffect(() => {
    fetchBillings();
    fetchPayments();
  }, []);

 
useEffect(() => {
  let invoiceCount = 0;
  let totalSales = 0;
  let totalCGST = 0;
  let totalSGST = 0;
  let totalGST = 0;
  let grandTotal = 0;

  let totalReceived = 0;
  let totalCash = 0;
  let totalUPI = 0;
  let totalCheque = 0;

  const filteredBills = billings.filter((bill) => {
    const billDate = new Date(bill.created_at);
    return (
      (!fromDate || billDate >= new Date(fromDate)) &&
      (!toDate || billDate <= new Date(toDate + "T23:59:59"))
    );
  });

  invoiceCount = filteredBills.length;

  filteredBills.forEach((bill) => {
    const subtotal = Number(bill.subtotal || 0);
    // const cgst = Number(bill.cgst_amount || 0);
    // console.log("CGST for bill", bill.invoice_number, ":", cgst);
    // const sgst = Number(bill.sgst_amount || 0);
    // const gst = Number(bill.gst_total_amount || 0);
    let cgst = 0;
    let sgst = 0;
    let gst = 0;

bill.products?.forEach((product) => {
  cgst += Number(product.cgst_amount || 0);
  sgst += Number(product.sgst_amount || 0);
  gst += Number(product.gst_total_amount || 0);
});
    const gTotal = Number(bill.grand_total || 0);

    totalSales += subtotal;
    totalCGST += cgst;
    totalSGST += sgst;
    totalGST += gst;
    grandTotal += gTotal;

    const billPayments = payments.filter(
      (pay) => pay.billing_id === bill.id
    );

    let billReceived = 0;

    billPayments.forEach((pay) => {
      const cash = Number(pay.cash_amount || 0);
      const upi = Number(pay.upi_amount || 0);
      const cheque = Number(pay.cheque_amount || 0);

      totalCash += cash;
      totalUPI += upi;
      totalCheque += cheque;

      billReceived += cash + upi + cheque;
    });

    totalReceived += billReceived;
  });

  setSummary({
    invoiceCount,
    totalSales,
    totalCGST,
    totalSGST,
    totalGST,
    grandTotal,
    totalReceived,
    totalCash,
    totalUPI,
    totalCheque,
  });
}, [billings, payments, fromDate, toDate]);
  /* ================= EXCEL EXPORT ================= */

  const exportToExcel = () => {
    const filteredBills = billings.filter((bill) => {
      const billDate = new Date(bill.created_at);
      return (
        (!fromDate || billDate >= new Date(fromDate)) &&
        (!toDate || billDate <= new Date(toDate + "T23:59:59"))
      );
    });

    const invoiceData = filteredBills.map((bill, index) => {
      const billPayments = payments.filter(
        (pay) => pay.billing_id === bill.id
      );

      let cash = 0;
      let upi = 0;
      let cheque = 0;

      billPayments.forEach((pay) => {
        cash += Number(pay.cash_amount || 0);
        upi += Number(pay.upi_amount || 0);
        cheque += Number(pay.cheque_amount || 0);
      });

      return {
        "S.No": index + 1,
       "Invoice No": bill.invoice_number || "-",
        Date: new Date(bill.created_at).toLocaleDateString(),
        "Sub Total": bill.subtotal || 0,
        CGST: bill.cgst_amount || 0,
        SGST: bill.sgst_amount || 0,
        GST: bill.gst_total_amount || 0,
        "Grand Total": bill.grand_total || 0,
        "Received Cash": cash,
        "Received UPI": upi,
        "Received Cheque": cheque,
        "Total Received": cash + upi + cheque,
      };
    });

    const summaryData = [
      { Label: "Total Invoices", Value: summary.invoiceCount },
      { Label: "Total Sales", Value: summary.totalSales },
      { Label: "Total CGST", Value: summary.totalCGST },
      { Label: "Total SGST", Value: summary.totalSGST },
      { Label: "Total GST", Value: summary.totalGST },
      { Label: "Grand Total", Value: summary.grandTotal },
      {Label: "Pending bills Received Amount",Value : "--"},
      { Label: "Total Received", Value: summary.totalReceived },
      { Label: "Received Cash", Value: summary.totalCash },
      { Label: "Received UPI", Value: summary.totalUPI },
      { Label: "Received Cheque", Value: summary.totalCheque },
    ];

    const wb = XLSX.utils.book_new();

    const wsSummary = XLSX.utils.json_to_sheet(summaryData);
    const wsInvoices = XLSX.utils.json_to_sheet(invoiceData);

    XLSX.utils.book_append_sheet(wb, wsSummary, "Summary");
    XLSX.utils.book_append_sheet(wb, wsInvoices, "Invoices");

    const excelBuffer = XLSX.write(wb, { bookType: "xlsx", type: "array" });
    const file = new Blob([excelBuffer], {
      type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    });

    saveAs(file, `Daily_Sales_Report_${fromDate}_to_${toDate}.xlsx`);
  };

  return (
    <div className="row justify-content-center">
      <div className="col-lg-8">

        {/* DATE FILTER */}
        <div className="modal_form mb-3">
          <div className="form_content">
            <div className="d-flex justify-content-end gap-2">
              <input
                type="date"
                className="form-control"
                style={{ maxWidth: "170px" }}
                value={fromDate}
                onChange={(e) => setFromDate(e.target.value)}
              />
              <input
                type="date"
                className="form-control"
                style={{ maxWidth: "170px" }}
                value={toDate}
                onChange={(e) => setToDate(e.target.value)}
              />
            </div>
          </div>
        </div>

        <div className="d-flex justify-content-end mb-3">
          <button className="btn excel-btn" onClick={exportToExcel}>
            Download Excel
          </button>
        </div>

        {/* SUMMARY TABLE */}
        <div className="common-table-wrapper">
          <table className="common-table table-striped align-middle">
            <thead>
               <tr className="thead">
                <th>Total Invoices</th>
                 <th className="text-end fw-bold">{summary.invoiceCount}</th>
               </tr>
     </thead>
            <tbody>

              {/* <tr>
                <td><b>Total Invoices</b></td>
                <td className="text-end fw-bold">{summary.invoiceCount}</td>
              </tr> */}

              <tr>
                <td><b>Total Sales</b></td>
                <td className="text-end">₹ {summary.totalSales.toFixed(2)}</td>
              </tr>

              <tr>
                <td><b>Total CGST</b></td>
                <td className="text-end">₹ {summary.totalCGST.toFixed(2)}</td>
              </tr>

              <tr>
                <td><b>Total SGST</b></td>
                <td className="text-end">₹ {summary.totalSGST.toFixed(2)}</td>
              </tr>

              <tr>
                <td><b>Total GST</b></td>
                <td className="text-end">₹ {summary.totalGST.toFixed(2)}</td>
              </tr>

              <tr className="table-light">
                <td><b>Grand Total</b></td>
                <td className="text-end fw-bold text-primary">
                  ₹ {summary.grandTotal.toFixed(2)}
                </td>
              </tr>

                <tr className="table-secondary">
                  <td colSpan="2"><b>Pending Bills – Received Amount</b></td>
                </tr>
               <tr>
                <td><b>Total Received</b></td>
                <td className="text-end text-success">
                  ₹ {summary.totalReceived.toFixed(2)}
                </td>
              </tr>

              <tr>
                <td><b>Received – Cash</b></td>
                <td className="text-end">
                  ₹ {summary.totalCash.toFixed(2)}
                </td>
              </tr>

              <tr>
                <td><b>Received – UPI</b></td>
                <td className="text-end">
                  ₹ {summary.totalUPI.toFixed(2)}
                </td>
              </tr>

              <tr>
                <td><b>Received – Cheque</b></td>
                <td className="text-end">
                  ₹ {summary.totalCheque.toFixed(2)}
                </td>
              </tr>

            </tbody>
          </table>
        </div>

      </div>
    </div>
  );
};
