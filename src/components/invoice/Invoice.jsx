import "./invoice.css";
import logo1 from "../../assets/images/logo-1.png";
import logo2 from "../../assets/images/logo-2.png";
import { useEffect, useState, useLayoutEffect, useRef } from "react";
import { useParams } from "react-router-dom";
import { getCustomerBillingById } from "../../services/customerBilling.service";
import { getCompanyDetails } from "../../services/companyDetails.service";
import '../../assets/fonts/fonts.css'

// const BASE_URL = "http://localhost:5000";
const BASE_URL = import.meta.env.VITE_API_BASE_URL;
const A4_BODY_HEIGHT = 200; // tune once for printer
const PAGE_HEIGHT = 1122; // A4 printable height (Chrome)

export const Invoice = () => {
  
  const { id } = useParams();

  const [billing, setBilling] = useState(null);
  const [products, setProducts] = useState([]);
  const [company, setCompany] = useState(null);
  const [readyToPrint, setReadyToPrint] = useState(false);
  const tbodyRef = useRef(null);
  const [fillerRows, setFillerRows] = useState(0);
  const [imageLoaded, setImageLoaded] = useState(false);
  const pageRef = useRef(null);
  const footerRef = useRef(null);
  const [breakFooter, setBreakFooter] = useState(false);

  useEffect(() => {
    const loadData = async () => {
      try {
        const res = await getCustomerBillingById(id);
        const companyRes = await getCompanyDetails();

        setBilling(res.billing);
        setProducts(res.products);
        setCompany(companyRes);

        setReadyToPrint(true);
      } catch (err) {
        console.error("Invoice load failed", err);
      }
    };

    loadData();
  }, [id]);

  useEffect(() => {
    if (readyToPrint && imageLoaded) {
      window.print();
    }
  }, [readyToPrint, imageLoaded]);

  useEffect(() => {
    if (!tbodyRef.current) return;

    // wait until browser finishes layout
    requestAnimationFrame(() => {
      const rows = tbodyRef.current.querySelectorAll("tr[data-row='product']");

      let usedHeight = 0;
      rows.forEach((row) => {
        usedHeight += row.getBoundingClientRect().height;
      });

      const remaining = A4_BODY_HEIGHT - usedHeight;

      if (remaining <= 0) {
        setFillerRows(0);
        return;
      }

      // measure ONE empty row dynamically
      const tempRow = document.createElement("tr");
      tempRow.innerHTML = "<td>&nbsp;</td>".repeat(6);
      tbodyRef.current.appendChild(tempRow);

      const emptyRowHeight = tempRow.getBoundingClientRect().height;
      tbodyRef.current.removeChild(tempRow);

      setFillerRows(Math.floor(remaining / emptyRowHeight));
    });
  }, [products, imageLoaded]);

  useLayoutEffect(() => {
    if (!pageRef.current || !footerRef.current) return;

    requestAnimationFrame(() => {
      const pageHeight = 1122; // Chrome A4 px
      const pageTop = pageRef.current.getBoundingClientRect().top;

      const rows = Array.from(footerRef.current.querySelectorAll("tr"));

      let accumulatedHeight = 0;
      let splitIndex = -1;

      for (let i = 0; i < rows.length; i++) {
        const rowHeight = rows[i].getBoundingClientRect().height;
        accumulatedHeight += rowHeight;

        const rowBottom = rows[i].getBoundingClientRect().bottom - pageTop;

        if (rowBottom > pageHeight) {
          splitIndex = i;
          break;
        }
      }

      if (splitIndex > 0) {
        const newTable = document.createElement("table");
        newTable.className = "invoice-table";
        newTable.style.pageBreakBefore = "always";

        const newTbody = document.createElement("tbody");

        rows.slice(splitIndex).forEach((row) => {
          newTbody.appendChild(row);
        });

        newTable.appendChild(newTbody);
        footerRef.current.parentElement.after(newTable);
      }
    });
  }, [products]);

 // ===== CALCULATION SECTION =====
const calculated = products.reduce(
  (acc, p) => {
    console.log(acc,p);
    
    const rate = Number(p.rate || 0);
    const qty = Number(p.quantity || 0);
    const discount = Number(p.discount_amount || 0);
   // console.log(discount);
    const finalRate =
      p.final_rate !== undefined && p.final_rate !== null
        ? Number(p.final_rate)
        : rate - discount;

    const lineSubtotal = rate * qty;          // before discount
    const lineDiscount = discount * qty; 
  //  console.log("Line Discount:", lineDiscount);
    const lineFinalTotal = finalRate * qty;   // after discount
    const total_gst_percentage = Number(p.gst_total_rate || 0);
    const cgst=Number(p.cgst_amount || 0);
    // console.log("CGST:", cgst);
    const sgst=Number(p.sgst_amount || 0);
    // console.log("SGST:", sgst);
    const gsttotal=Number(p.gst_total_amount || 0);
    // console.log("GST Total:", gsttotal);
    acc.subtotal += lineSubtotal;
    acc.totalDiscount += discount;
    acc.totalAfterDiscount += lineFinalTotal;
    acc.totalQuantity += qty;

    //gst calculation
    acc.total_gst_percentage += total_gst_percentage;
    acc.totalCGST += cgst;
    acc.totalSGST += sgst;
    acc.totalGST += gsttotal;
    

    return acc;
  },
  {
    subtotal: 0,
    totalDiscount: 0,
    total_gst_percentage: 0,
    totalQuantity: 0,
    totalAfterDiscount: 0,
    totalCGST: 0,
    totalSGST: 0,
    totalGST: 0,

  }
);


const grandTotal = calculated.totalAfterDiscount;

  if (!billing || !company) {
    return <p>Loading invoice...</p>;
  }

  

  return (
    <div className="invoice-container " ref={pageRef}>
      <div style={{ border: "2px solid #000", height: "100%", display: "flex", flexDirection: "column" }}>
        <div className="header">
          <div className="header-top">
            <span className="copy-type">Original / Duplicate / Accounts Copy</span>
          </div>

          <div className="header-bottom">
            <div className="left">
              <img src={logo1} alt="" />
            </div>

            <div className="center">
              <div className="center-top">
                <h1 style={{ fontFamily: "Algerian Regular" }}>
                  {company?.company_name} <sup style={{top:"-25px"}}>TM</sup>
                </h1>
              </div>
              <div className="center-bottom">
                <p>
                  {company?.company_address}
                  <br />
                  {company?.district}, {company?.state}, {company?.pincode}
                </p>
                <p className="py-1"><i class="bi bi-whatsapp"></i>&nbsp;<i class="bi bi-telephone"></i>&nbsp;7200002112 , 7200005786, 9865065260</p>
              </div>
            </div>

            <div className="right">
              <img src={logo2} alt="" />
            </div>
          </div>

          <div className="quote-box">
            <p>"{company?.company_quotes}"</p>
          </div>
        </div>

        <div className="info-section">
          <div className="contact-info">
            <div className="padd">
              <p>
                <strong>Email:</strong> {company?.email}
              </p>
              <p>
                <strong>Website:</strong> {company?.website}
              </p>
              <p>
                <strong>GSTIN:</strong> {billing.company_gst_number || "-"}
              </p>
            </div>
            <div className="date-info">
              {new Date(billing.invoice_date).toLocaleDateString("en-IN", {
                weekday: "long",
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </div>
          </div>

          <div className="invoice-details">
            <div className="padd-1">
              <p>
                <strong>INVOICE:</strong> <span style={{ color: "#a52a2a" }}>{billing.invoice_number}</span>
              </p>
              <p>
                <strong>Vechicle No:</strong>
                {billing.vehicle_number ? billing.vehicle_number : "-"}
              </p>
              <p>
                <strong>Way Bill No:</strong>
                {billing.eway_bill_number ? billing.eway_bill_number : "-"}
              </p>

              <p>
                <strong>Staff Name:</strong> <span style={{ color: "#a52a2a" }}>{billing.staff_name}</span>
              </p>

              
            </div>
          </div>
        </div>

        <div className="customer-section">
          <div className="customer-section-top">
            <p>CUSTOMER ADDRESS :</p>
          </div>

          <div style={{ display: "flex" }}>
            <div className="customer-address" style={{ width: "70%" }}>
              <p>{billing.customer_name}</p>
              <p>{billing.customer_address}</p>
            </div>
            <div className="customer-address" style={{ width: "30%" }}>
             
              <p>
                <strong>Customer GST:</strong>
                {billing.customer_gst_number ? billing. customer_gst_number : "-"}
              </p>
              <p>
                <strong>Phone:</strong> {billing.phone_number}
              </p>
            </div>
          </div>
        </div>

        <table className="invoice-table border-end">
          <thead>
            <tr className="text-center">
              <th width="5%">SI No</th>
              <th width="29%">DESCRIPTION</th>
              <th width="10%">HSN</th>
              <th width="10%">RATE</th>
              <th width="10%">Discount</th>
              <th width="6%">GST %</th>
              <th width="6%">QTY</th>
              <th width="12%">Final Rate</th>
              

              <th width="12%" className="border-end-0">
                AMOUNT
              </th>
            </tr>
          </thead>

          <tbody ref={tbodyRef} className="invoice-body">
            {products.map((p, i) => (
              <tr key={i} data-row="product">
                <td width="5%">{i + 1}</td>
                <td width="29%" className="text-left">
                  {`${p.product_name} - ${p.product_brand} - ${p.product_category} - ${p.product_quantity}`}
                </td>
                <td width="10%">{p.hsn_code || "-"}</td>

                <td width="10%">
                  ₹{Number(p.rate || 0).toFixed(2)}
                </td>
                 <td width="10%">
                  {Number(p.discount_amount || 0) > 0
                    ? `₹${Number(p.discount_amount).toFixed(2)}`
                    : "—"}
                </td>
                <td width="6%">{Number(p.gst_total_rate || 0).toFixed(2)} </td>
                <td width="6%">{p.quantity}</td>

                 {/* FINAL RATE */}
                  <td width="12%">
                    ₹{Number(p.final_rate || p.rate || 0).toFixed(2)}
                  </td>
                
                <td width="12%">₹{Number(p.total).toFixed(2)}</td>
              </tr>
            ))}

            {/* AUTO FILLER ROWS */}
            {Array.from({ length: fillerRows }).map((_, i) => (
              <tr key={`filler-${i}`}>
                <td>&nbsp;</td>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
              </tr>
            ))}
          </tbody>

          
        </table>
        <div className="invoice-footer">
          <table className="invoice-table">
            <tbody ref={footerRef} className={`footer-body ${breakFooter ? "page-break-before" : ""}`}>
              <tr>
                <td colSpan="4" width="54%"></td>
                <td width="10%">₹{calculated.totalDiscount.toFixed(2)}</td>
                <td width="6%">₹{calculated.total_gst_percentage}%</td>
                <td width="6%">{calculated.totalQuantity}</td>
                <td width="12%">Subtotal</td>
                <td width="12%"> ₹{calculated.totalAfterDiscount.toFixed(2)}</td>
              </tr>

              <tr>
                {/* LEFT — DISCLAIMER */}

                <td colSpan="7" rowSpan="1" style={{ width: "76%" }}>
                  <h5 style={{ fontSize: "20px", margin: 0 }}>Disclaimer</h5>
                  <p style={{ fontWeight: 400, margin: "3px 0" }}>{company?.disclaimer}</p>
                </td>

                {/* RIGHT — TAX TABLE */}
                <td colSpan="3" style={{ padding: 0, width: "24%" }}>
                  <table style={{ width: "100%", borderCollapse: "collapse" }}>
                    <tbody>
                      <tr className="border-none">
                        <td style={{ border: "none", padding: "4px", width: "50%" }}>GST </td>
                        <td
                          style={{
                            border: "none",
                            padding: "4px",
                            textAlign: "center",
                          }}>
                          {/* ₹{gstAmount.toFixed(2)} */}
                          ₹{calculated.totalGST.toFixed(2)}

                        </td>
                      </tr>

                      <tr>
                        <td style={{ border: "none", padding: "4px", width: "50%" }}>CGST </td>
                        <td
                          style={{
                            border: "none",
                            padding: "4px",
                            textAlign: "center",
                          }}>
                          ₹{calculated.totalCGST.toFixed(2)}
                        </td>
                      </tr>

                      <tr>
                        <td style={{ border: "none", padding: "4px", width: "50%" }}>SGST </td>
                        <td
                          style={{
                            border: "none",
                            padding: "4px",
                            textAlign: "center",
                          }}>
                          ₹{calculated.totalSGST.toFixed(2)}
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </td>
              </tr>

              <tr>
                <td
                  colSpan="7"
                  style={{
                    color: "#a52a2a",
                    width: "76%",
                  }}>
                  {company?.instruction}
                </td>

                <td style={{ fontSize: "16px", width: "12%" }}>Total</td>
                <td className="grand-total" style={{ width: "12%" }}>
                 ₹{grandTotal.toFixed(2)}
                </td>
              </tr>
             

              <tr>
                <td colSpan="7">
                  <div style={{ display: "flex", alignItems: "center" }}>
                    <div style={{ margin: "0px 30px" }}>
                      {/* {billing.qr_code_image && <img src={`${BASE_URL}${billing.qr_code_image}`} style={{ width: "80px" }} alt="Bank QR" />} */}
                      {billing.qr_code_image && (
                        <img
                          src={`${BASE_URL}${billing.qr_code_image}`}
                          style={{ width: "80px" }}
                          alt="Bank QR"
                          onLoad={() => setImageLoaded(true)}
                          onError={() => setImageLoaded(true)}
                        />
                      )}
                    </div>

                    <div className="bank-details">
                      <strong>OUR BANK DETAILS:</strong>
                      <br />
                      BANK NAME: {billing.bank_name}
                      <br />
                      ACCOUNT NAME: {billing.account_name}
                      <br />
                      A/C: {billing.account_number}
                      <br />
                      IFSC CODE: {billing.ifsc_code} | BRANCH: {billing.branch}
                    </div>
                  </div>
                </td>

                <td colSpan="2">
                  <div className="signature">
                    <h6 style={{ margin: "2px 0", fontSize: "16px" }}>For DHEERAN TRADER</h6>
                    <p style={{ margin: "2px 0" }}>Proprietor</p>
                  </div>
                </td>
              </tr>

              <tr style={{ borderTop: "2px solid #000" }}>
                <td colSpan="9">
                  <div className="disclaimer">
                    <span>For Reg :</span>
                    {company?.company_address}, {company?.district}, {company?.state} - {company?.pincode}
                    <br />
                    If you have any questions about this invoice,
                    <br />
                    Please contact Phone No. {company?.phone} & Email ID: {company?.email}
                    <br />
                    <strong>Thank You For Your Business!</strong>
                    <br />
                    "the system generated signature not required"
                  </div>
                </td>
              </tr>
               <tr style={{ borderTop: "2px solid #000" }}>
                <td colSpan="9">
                 <div className="d-flex justify-content-end align-items-center gap-2 pt-4">
                  <span>Customer Signature :</span>
                  <span style={{width:"200px" , borderBottom:"1px dashed #000"}}></span>
                 </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
