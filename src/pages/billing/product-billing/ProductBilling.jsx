import React, { use, useEffect, useState } from "react";
import "./product-billing.css";
import { useNavigate, useParams } from "react-router-dom";
import Select from "react-select";
import {
  getCustomers,
  createCustomer,
} from "../../../services/customer.service";
import {
  getEmployees,
  createEmployee,
} from "../../../services/employee.service";
import { getProducts } from "../../../services/product.service";
import { createCustomerBilling ,updateCustomerBilling,getCustomerBillingById,nextInvoiceNumber} from "../../../services/customerBilling.service";
import { getAllBankDetails } from "../../../services/bankDetalis.service";
import { getCompanyDetails } from "../../../services/companyDetails.service";
import { getAllGST } from "../../../services/companygstnumber";
import { useLocation } from "react-router-dom";
import api from "../../../services/api";
import { toast } from "react-toastify";

export const ProductBilling = () => {
  const { id } = useParams(); // 👈 this defines id
  const isEdit = Boolean(id); // 👈 true when editing

  // const [paymentMode, setPaymentMode] = useState("cash");

  /* ================= MASTER DATA ================= */
  const [customers, setCustomers] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [productsList, setProductsList] = useState([]);

  /* ================= CUSTOMER ================= */
  const [customerName, setCustomerName] = useState("");
  const [customerPhone, setCustomerPhone] = useState("");
  const [customerSuggestions, setCustomerSuggestions] = useState([]);
  const [selectedCustomerId, setSelectedCustomerId] = useState(null);
  const [customerAddress, setCustomerAddress] = useState("");

  /* ================= STAFF ================= */
  const [staffName, setStaffName] = useState("");
  const [staffPhone, setStaffPhone] = useState("");
  const [staffSuggestions, setStaffSuggestions] = useState([]);
  const [selectedEmployeeId, setSelectedEmployeeId] = useState(null);

  /* ================= BILL ================= */
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [selectedProductId, setSelectedProductId] = useState("");
  const [selectedOption, setSelectedOption] = useState(null);

  const [billProducts, setBillProducts] = useState([]);
  const [sellQty, setSellQty] = useState("");
  const [finalPrice, setFinalPrice] = useState("");

  // const [advancePaid, setAdvancePaid] = useState(0);
  const [invoicePreview, setInvoicePreview] = useState("");
  // const [gstNumber, setGstNumber] = useState("");
  const [companyGSTNumber, setCompanyGSTNumber] = useState("");
  const [customerGSTNumber, setCustomerGSTNumber] = useState("");
   const [gstSuggestions, setGstSuggestions] = useState([]);  
  const [vehicleNumber, setVehicleNumber] = useState("");
  const [ewayBillNumber, setEwayBillNumber] = useState("");
  const [allGSTNumbers, setAllGSTNumbers] = useState([]);
  const [gstLoaded, setGstLoaded] = useState(false);
  //const [gstPercent, setGstPercent] = useState(0);
  const [cashAmount, setCashAmount] = useState("");
  const [upiAmount, setUpiAmount] = useState("");
  const [chequeAmount, setChequeAmount] = useState("");
  const [selectedBankId, setSelectedBankId] = useState(null);
  const navigate = useNavigate();
  const [banks, setBanks] = useState([]);
  const [company, setCompany] = useState(null);
  const [paymentMode, setPaymentMode] = useState("cash");
  const [errors, setErrors] = useState({});
 const advancePaid =
  Number(cashAmount || 0) +
  Number(upiAmount || 0) +
  Number(chequeAmount || 0);

 const location = useLocation();
 const adminPassword = location.state?.adminPassword;
 console.log("adminPassword:", adminPassword);

useEffect(() => {
  if (!id || !customers.length || !employees.length || !banks.length) return;

  const loadBillingForEdit = async () => {
    try {
      const res = await getCustomerBillingById(id);
      const data = res.data;

      const billing = res.billing; // ✅ IMPORTANT

      console.log("billing:", billing);

      // ✅ CUSTOMER
      const customer = customers.find(
        (c) => Number(c.id) === Number(billing.customer_id)
      );

      console.log("matched customer:", customer);

      if (customer) {
        setCustomerName(customer.name || "");
        setCustomerPhone(customer.phone || "");
        setCustomerAddress(customer.address || "");
        setSelectedCustomerId(customer.id);
      } else {
        // fallback
        setCustomerName(billing.customer_name || "");
        setCustomerPhone(billing.phone_number || "");
      }

      // ✅ STAFF
      const staff = employees.find(
  (e) => String(e.phone) === String(billing.staff_phone)
);
       console.log("matched staff:", staff);
      if (staff) {
        setStaffName(staff.name || "");
        setStaffPhone(staff.phone || "");
        setSelectedEmployeeId(staff.id);
      } else {
        setStaffName(billing.staff_name || "");
        setStaffPhone(billing.staff_phone || "");
        setSelectedEmployeeId(staff.id || billing.staff.id);
      }

      // ✅ BANK
      setSelectedBankId(Number(billing.bank_id) || null);

      // ✅ PAYMENT
      setCashAmount(String(billing.cash_amount || 0));
      setUpiAmount(String(billing.upi_amount || 0));
      setChequeAmount(String(billing.cheque_amount || 0));

      // ✅ GST
      setCompanyGSTNumber(billing.company_gst_number || "");
      setCustomerGSTNumber(billing.customer_gst_number || "");

      setVehicleNumber(billing.vehicle_number || "");
      setEwayBillNumber(billing.eway_bill_number || "");

      setInvoicePreview(billing.invoice_number);

      // ✅ PRODUCTS
      const mappedProducts = (res.products || []).map((p) => ({
        product_id: p.product_id,
        product_name: p.product_name,
        brand: p.product_brand,
        category: p.product_category,
        product_quantity: p.product_quantity,
        sell_qty: Number(p.quantity),
        rate: Number(p.rate),
        final_rate: Number(p.final_rate || p.rate),
        stock: "-",
      }));

      setBillProducts(mappedProducts);

    } catch (err) {
      console.error(err);
      toast.error("Failed to load billing data");
    }
  };

  loadBillingForEdit();
}, [id, customers, employees, banks]);


//  useEffect(() => {
//    const loadGST = async () => {
//     try {
//       const res = await api.get("/customer-billing");

//       console.log("API DATA:", res.data);

//       const gstList = (res.data || [])
//         .map((b) => b.company_gst_number)
//         .filter((g) => g && g.trim() !== ""); // 🔥 strong filter

//       const uniqueGST = [...new Set(gstList)];

//       setAllGSTNumbers(uniqueGST);
//       setGstLoaded(true);   // ✅ mark loaded

//       console.log("GST LIST:", uniqueGST);
//     } catch (err) {
//       console.error("GST fetch error", err);
//       setGstLoaded(true);
//     }
//   };

//   loadGST();
// }, []);


useEffect(() => {
  const loadCompanyGST = async () => {
    try {
      const res = await getAllGST();

      const gstList = res.data || res; // handle both cases

      const defaultGST = gstList.find(g => g.is_default === 1);

      if (defaultGST) {
        setCompanyGSTNumber(defaultGST.gst_number);
      }

    } catch (error) {
      console.error("Get All GST Error:", error.response?.data || error.message);
    }
  };

  loadCompanyGST();
}, []);
  /* ================= LOAD DATA ================= */
  useEffect(() => {
    const loadData = async () => {
      try {
        const custRes = await getCustomers();
        const empRes = await getEmployees();
        setEmployees(Array.isArray(empRes) ? empRes : []);
        // const prodRes = await getProducts();
        const prodRes = await getProducts();
        // console.log("Products API Response:", prodRes);
        // 🔥 NORMALIZE customer name
        const normalizedCustomers = Array.isArray(custRes)
          ? custRes.map((c) => ({
              ...c,
              name: `${c.first_name || ""} ${c.last_name || ""}`.trim(),
            }))
          : [];

        setCustomers(normalizedCustomers);
        const normalizedEmployees = Array.isArray(empRes)
          ? empRes.map((e) => ({
              ...e,
              name: e.employee_name || "",
            }))
          : [];

        setEmployees(normalizedEmployees);

        const normalizedProducts = Array.isArray(prodRes)
          ? prodRes.map((p) => ({
              ...p,
              brand: p.brand,
              category: p.category,
              quantity: p.quantity,
              rate: p.price, // 🔥 map price → rate
              stock: Number(p.stock || 0),

              // 🔥 ADD THESE LINES
              hsn_code: p.hsn_code,
              cgst_rate: Number(p.cgst_rate || 0),
              sgst_rate: Number(p.sgst_rate || 0),
              gst_total_rate: Number(p.gst_total_rate || 0),
            }))
          : [];

        setProductsList(normalizedProducts);
      } catch (err) {
        console.error(err);
      }
    };

    loadData();
  }, []);
  useEffect(() => {
    if (isEdit) return;

    const loadInvoiceNumber = async () => {
      try {
        const res = await nextInvoiceNumber();
        console.log("Next Invoice API Response:", res);
        setInvoicePreview(res.nextInvoiceNumber || "INV-NEW");
        setStaffName(res.staffName || "");
        setStaffPhone(res.staffPhone || "");
        const macthedStaff = employees.find(
          (e) =>
            e.employee_name === res.staffName && e.phone === res.staffPhone
        );
        if(macthedStaff){
          setSelectedEmployeeId(macthedStaff.id);
        }
        
      } catch (err) {
        console.error("Invoice API error:", err);
      }
    };

    loadInvoiceNumber();
  }, [isEdit, employees]);

  useEffect(() => {
    const loadBanks = async () => {
      try {
        const res = await getAllBankDetails();
        const banksData = res.data || res; // handle both cases
        const primaryBank = banksData.find((b) => b.is_primary === 1 || b.is_primary === true);
        if(primaryBank){
          setBanks([primaryBank]);
        }
        console.log("Banks API Response:", banksData);
        //setBanks(res.data || []);
      } catch (err) {
        console.error("Failed to load banks", err);
      }
    };

    loadBanks();
  }, []);
  console.log(banks);

  const subtotal = billProducts.reduce(
    (sum, p) => sum + p.sell_qty * (p.final_rate || p.rate),
    0,
  );

  // const halfGstPercent = gstPercent / 2;

  // const cgstAmount = (subtotal * halfGstPercent) / 100;
  // const sgstAmount = (subtotal * halfGstPercent) / 100;

  // const totalTax = cgstAmount + sgstAmount;
  // const grandTotal = subtotal + totalTax;
  const grandTotal = subtotal;

  const today = new Date().toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });

  const balanceDue = Math.max(grandTotal - advancePaid, 0);

  /* ================= ADD PRODUCT ================= */
  const handleAddToBill = () => {
    if (!selectedProduct) {
      toast.warn("Please select a product");
      return;
    }

    if (!sellQty) {
      toast.error("Enter customer quantity");
      return;
    }

    const qty = Number(sellQty); // ✅ DEFINE FIRST

    if (isNaN(qty) || qty <= 0) {
      toast.error("Enter a valid customer quantity");
      return;
    }

    if (!isEdit && qty > selectedProduct.stock) {
      toast.error("Not enough stock available");
      return;
    }

    setBillProducts((prev) => {
      const existingIndex = prev.findIndex(
        (p) => p.product_id === selectedProduct.id,
      );
      const appliedRate = Number(finalPrice || selectedProduct.rate);

      // 🔁 merge if already exists
      if (existingIndex !== -1) {
        return prev.map((item, index) =>
          index === existingIndex
            ? {
                ...item,
                sell_qty: item.sell_qty + qty,
                stock: item.stock - qty,
                final_rate: appliedRate,
              }
            : item,
        );
      }

      return [
        ...prev,
        {
          product_id: selectedProduct.id,
          product_name: selectedProduct.product_name,
          brand: selectedProduct.brand,
          category: selectedProduct.category,
          product_quantity: selectedProduct.quantity,
          sell_qty: qty,
          stock: selectedProduct.stock - qty,
          rate: selectedProduct.rate,
          final_rate: appliedRate,

          // ✅ ADD THESE
          hsn_code: selectedProduct.hsn_code,
          cgst_rate: Number(selectedProduct.cgst_rate || 0),
          sgst_rate: Number(selectedProduct.sgst_rate || 0),
          gst_total_rate: Number(selectedProduct.gst_total_rate || 0),
        },
      ];
    });

    // 🔻 reduce stock from master list
    setProductsList((prev) =>
      prev.map((p) =>
        p.id === selectedProduct.id ? { ...p, stock: p.stock - qty } : p,
      ),
    );

    setSellQty("");
    setFinalPrice("");
    //setSelectedProductId("");
   // productOptions = [];
    setSelectedProduct(null);
   setSelectedProductId(null);
   setSelectedOption(null); // ✅ THIS WILL CLEAR UI PERFECTLY
  };

  /* ================= REMOVE PRODUCT ================= */
  const removeProduct = (index) => {
    const removed = billProducts[index];

    setProductsList((prev) =>
      prev.map((p) =>
        p.id === removed.product_id
          ? { ...p, stock: p.stock + removed.sell_qty }
          : p,
      ),
    );

    setBillProducts((prev) => prev.filter((_, i) => i !== index));
  };

  const ensureCustomerExists = async () => {
    if (selectedCustomerId) return selectedCustomerId;

    const existing = customers.find(
      (c) => String(c.phone) === String(customerPhone),
    );

   

    if (existing) {
      const existingName = (existing.name || "").trim().toLowerCase();
      const enteredName = (customerName || "").trim().toLowerCase();

      // 🚨 If phone exists but name different → throw error
      if (existingName !== enteredName) {
        throw new Error("Customer already exists with this phone number");
      }

      return existing.id; // same name, safe
    }

    // ➕ Create only if phone not found
    const [first_name, ...rest] = customerName.trim().split(" ");
    const last_name = rest.join(" ");

    const res = await createCustomer({
      first_name,
      last_name,
      phone: customerPhone,
      address: customerAddress || null, // ✅ ADD THIS
    });

    const customer = res.data.customer;

    setCustomers((prev) => [
      ...prev,
      {
        ...customer,
        name: `${customer.first_name} ${customer.last_name}`.trim(),
        address: customer.address,
      },
    ]);

    return customer.id;
  };

  const ensureEmployeeExists = async () => {
    if (!selectedEmployeeId) {
      throw new Error("Please select staff from suggestion list");
    }

    return selectedEmployeeId;
  };

  /* ================= SAVE ================= */

  const handleSaveBilling = async () => {
    setErrors({});
    if (!billProducts.length) {
      toast.error("Add at least one product");
      return;
    }
    if (!customerName.trim()) {
      toast.error("Customer name is required");
      return;
    }

    if (!/^\d{10}$/.test(customerPhone)) {
      toast.error("Enter valid customer phone");
      return;
    }
    if (!staffName.trim()) {
      toast.error("Staff name is required");
      return;
    }
    if (!selectedBankId) {
      toast.warn("Select bank details");
      return;
    }

    const totalPaid =
      Number(cashAmount) + Number(upiAmount) + Number(chequeAmount);

    if (totalPaid < 0) {
      toast.error("Invalid payment amount");
      return;
    }

    if (totalPaid - grandTotal > 0.01) {
      toast.error("Payment exceeds bill amount");
      return;
    }

    // ✅ SINGLE PRODUCT VALIDATION
    if (!billProducts.length) {
      toast.error("Add at least one product");
      return;
    }

    const hasInvalidQty = billProducts.some((p) => Number(p.sell_qty) <= 0);

    if (hasInvalidQty) {
      toast.error("Product quantity cannot be zero. Please enter quantity.");
      return;
    }

    const validProducts = billProducts.filter((p) => Number(p.sell_qty) > 0);

    try {
      const customer_id = await ensureCustomerExists();
      const staff_id = await ensureEmployeeExists();

      const payload = {
        customer_id,
        customer_name: customerName,
        phone_number: customerPhone,
        customer_gst_number: customerGSTNumber || null,
        company_gst_number: companyGSTNumber || null,
        vehicle_number: vehicleNumber || null,
        eway_bill_number: ewayBillNumber || null,
        staff_id,
        staff_name: staffName,
        staff_phone: staffPhone || null,
        bank_id: selectedBankId,
        //    tax_gst_percent: gstPercent,
        advance_paid: advancePaid,
        cash_amount: Number(cashAmount || 0),
        upi_amount: Number(upiAmount || 0),
        cheque_amount: Number(chequeAmount || 0),
        products: validProducts.map((p) => ({
          product_id: p.product_id,
          quantity: Number(p.sell_qty),
          product_quantity: p.product_quantity,
          rate: Number(p.rate),
          final_rate: Number(p.final_rate || p.rate),

          // ✅ SEND GST DATA
          hsn_code: p.hsn_code,
          cgst_rate: p.cgst_rate,
          sgst_rate: p.sgst_rate,
          gst_total_rate: p.gst_total_rate,
        })),
      };

      let billingId = id;

      if (isEdit) {
       await updateCustomerBilling(billingId, payload,adminPassword);
       if (!adminPassword ) {
            toast.error("Session expired. Please enter password again.");
            navigate("/report/customer-billing-report");
            return;
          } 
       toast.success("Invoice updated successfully");
      } else {
        const res = await createCustomerBilling(payload);
        console.log("Create Billing Response:", res);
       toast.success("Invoice saved successfully");
        billingId = res.invoice.id;
      }
      navigate(`/invoice/print/${billingId}`);
    } catch (err) {
      console.error("Billing Save Error:", err);
      if(!err?.response?.status === 401 && !err?.response?.data?.message === "Invalid admin password"){
      toast.error("Please correct the highlighted fields.");
      }
      navigate("/report/customer-billing-report");
      const message = err?.response?.data?.message || err.message;

      // 🔥 FIELD MAPPING LOGIC
      if (message.includes("staff")) {
        setErrors((prev) => ({ ...prev, staffName: message }));
      } else if (message.includes("Customer")) {
        setErrors((prev) => ({ ...prev, customerName: message }));
      } else if (message.includes("bank")) {
        setErrors((prev) => ({ ...prev, bank: message }));
      } else if (message.includes("GST")) {
        setErrors((prev) => ({ ...prev, gst: message }));
      } else if (message.includes("stock")) {
        setErrors((prev) => ({ ...prev, products: message }));
      } else if (message.includes("Payment")) {
        setErrors((prev) => ({ ...prev, payment: message }));
      } else {
        toast.error(message);
      }
    }
  };

  const resetBillingPage = () => {
    setCustomerName("");
    setCustomerPhone("");
    setCustomerGSTNumber("");
    setCompanyGSTNumber("");
    setVehicleNumber("");
    setEwayBillNumber("");

    setStaffName("");
    setStaffPhone("");

    setCashAmount(0);
    setUpiAmount(0);
    setChequeAmount(0);

    setSelectedBankId(null);

    setBillProducts([]);

    //setGstPercent(0); // default

    navigate("/product-billing", { replace: true });
  };

  const handleSaveDraft = async () => {
    if (!billProducts.length) {
      toast.warn("Add at least one product before saving draft");
      return;
    }

    const totalPaid =
      Number(cashAmount) + Number(upiAmount) + Number(chequeAmount);

    if (totalPaid < 0) {
      toast.error("Invalid payment amount");
      return;
    }

    if (totalPaid - grandTotal > 0.01) {
      toast.error("Payment exceeds bill amount");
      return;
    }

    try {
      const customer_id = await ensureCustomerExists();
      await ensureEmployeeExists();

      const payload = {
        customer_id,
        customer_name: customerName,
        phone_number: customerPhone,

        customer_gst_number: customerGSTNumber || null,
        company_gst_number: companyGSTNumber || null,

        vehicle_number: vehicleNumber || null,
        eway_bill_number: ewayBillNumber || null,

        staff_name: staffName,
        staff_phone: staffPhone || null,

        bank_id: selectedBankId || null, // ✅ allow null in draft

        //   tax_gst_percent: gstPercent,
        advance_paid: Number(advancePaid),
        cash_amount: Number(cashAmount),
        upi_amount: Number(upiAmount),
        cheque_amount: Number(chequeAmount),

        status: "DRAFT",
        print_required: false,

        products: billProducts.map((p) => ({
          product_id: p.product_id,
          quantity: Number(p.sell_qty),
          product_quantity: p.product_quantity,
          rate: Number(p.rate),
          final_rate: Number(p.final_rate || p.rate),
          // ✅ SEND GST DATA
          hsn_code: p.hsn_code,
          cgst_rate: p.cgst_rate,
          sgst_rate: p.sgst_rate,
          gst_total_rate: p.gst_total_rate,
        })),
      };

      if (isEdit) {
        await updateCustomerBilling(id,payload,adminPassword);
        if (!adminPassword ) {
          toast.error("Session expired. Please enter password again.");
          navigate("/report/customer-billing-report");
          return;
        }

      } else {
        await createCustomerBilling(payload);
      }
      if(isEdit){
        toast.success("Draft Updated successfully");
        navigate("/report/customer-billing-report"); 
      }
      else{
      toast.success("Draft saved successfully");
      }resetBillingPage();
    } catch (err) {
      console.error("Billing Save Error:", err);
    if(!err?.response?.status === 401 && !err?.response?.data?.message === "Invalid admin password"){
      toast.error("Please correct the highlighted fields.");
      }
      const message = err?.response?.data?.message || err.message;

      // 🔥 FIELD MAPPING LOGIC
      if (message.includes("staff")) {
        setErrors((prev) => ({ ...prev, staffName: message }));
      } else if (message.includes("Customer")) {
        setErrors((prev) => ({ ...prev, customerName: message }));
      } else if (message.includes("bank")) {
        setErrors((prev) => ({ ...prev, bank: message }));
      } else if (message.includes("GST")) {
        setErrors((prev) => ({ ...prev, gst: message }));
      } else if (message.includes("stock")) {
        setErrors((prev) => ({ ...prev, products: message }));
      } else if (message.includes("Payment")) {
        setErrors((prev) => ({ ...prev, payment: message }));
      } else {
         toast.error(message);
         if( message.includes("admin password")){
            setTimeout(() => {
        navigate("/report/customer-billing-report");
        }, 3000);
         }
      
      }
    }
  };
  useEffect(() => {
  // ✅ Only for CREATE mode
  if (isEdit) return;

  // ✅ Only when employees loaded
  if (!employees.length) return;

  // ✅ Only if not already selected
  if (selectedEmployeeId) return;

  const firstStaff = employees[0];
   console.log("firstStaff:", firstStaff);
 // setStaffName(firstStaff.employee_name || "");
  //setStaffPhone(firstStaff.phone || "");
 // setSelectedEmployeeId(firstStaff.id);

}, [employees]);


useEffect(() => {
  // ✅ Only for CREATE mode
  if (isEdit) return;

  // ✅ Wait until banks loaded
  if (!banks.length) return;

  // ✅ Don’t override if already selected
  if (selectedBankId) return;

  const firstBank = banks[0];

  setSelectedBankId(firstBank.id);

}, [banks]);

  const handleDiscard = () => {
    setCustomerName("");
    setCustomerPhone("");
    setCustomerAddress("");
    setSelectedCustomerId(null);

    setStaffName("");
    setStaffPhone("");
    setSelectedEmployeeId(null);

    setBillProducts([]);
    setSelectedProduct(null);
    setSellQty("");

    // setAdvancePaid(0);

    //    setGstNumber("");
    setCompanyGSTNumber("");
    setGstPercent(0);
    setSelectedBankId(null);

    toast.info("Billing discarded");
  };

  useEffect(() => {
    getCompanyDetails().then((res) => {
      setCompany(res);
    });
  }, []);
  useEffect(() => {
    if (!isEdit || !selectedCustomerId || !customers.length) return;

    const customer = customers.find((c) => c.id === selectedCustomerId);
    if (customer) {
      setCustomerAddress(customer.address || "");
    }
  }, [customers, selectedCustomerId, isEdit]);

const productOptions = productsList.map((p) => ({
  value: p.id,
  label: `${p.product_name} (${p.brand} - ${p.category} - ${p.quantity})`,
  product: p
}));
  return (
    <div className="product-billing">
      <div className="row gy-4 gx-0">
        {/* ================= LEFT ================= */}
        <div className="col-md-7">
          <div className="product-list-items">
            <div className="row gy-4 gx-0">
              {/* ================= STAFF (SMALL – TOP LEFT) ================= */}
              <div className="col-lg-12">
                <div className="product-list-box">
                  <h5 className="box-title">
                    <i className="fi fi-tr-user-pen"></i> Staff Details
                  </h5>
                  <div className="row g-2">
                    {/* STAFF NAME */}
                    <div className="col-md-6 position-relative">
                      <label className="form-label">Staff Name</label>
                      <input
                        className={`form-control ${errors.staffName ? "is-invalid" : ""}`}
                        value={staffName}
                        onChange={(e) => {
                          const v = e.target.value;
                          setStaffName(v);
                          setSelectedEmployeeId(null);

                          // 🔥 Clear error while typing
                          setErrors((prev) => ({ ...prev, staffName: null }));

                          if (!v) {
                            setStaffSuggestions([]);
                            return;
                          }

                          const matches = employees.filter(
                            (s) =>
                              (s.name || "")
                                .toLowerCase()
                                .includes(v.toLowerCase()) ||
                              (s.phone || "").includes(v),
                          );

                          setStaffSuggestions(matches);
                        }}
                      />

                      {errors.staffName && (
                        <div className="invalid-feedback d-block">
                          {errors.staffName}
                        </div>
                      )}
                      {/* 🔥 ONLY HERE suggestion should render */}
                      {staffSuggestions.length > 0 && (
                        <ul className="list-group position-absolute w-100 z-3 small">
                          {staffSuggestions.map((s) => (
                            <li
                              key={s.id}
                              className="list-group-item list-group-item-action py-1"
                              onClick={() => {
                                setStaffName(s.name || "");
                                setStaffPhone(s.phone || "");
                                setSelectedEmployeeId(s.id);
                                setStaffSuggestions([]);
                              }}
                            >
                              {s.name} – {s.phone}
                            </li>
                          ))}
                        </ul>
                      )}
                    </div>

                    <div className="col-md-6 position-relative">
                      <label className="form-label">Staff Phone</label>
                      <input
                        className="form-control"
                        value={staffPhone}
                        inputMode="numeric"
                        maxLength={10}
                        onChange={(e) => {
                          let v = e.target.value.replace(/\D/g, "");
                          if (v.length > 10) v = v.slice(0, 10);

                          setStaffPhone(v);
                          setSelectedEmployeeId(null);

                          if (!v) {
                            setStaffSuggestions([]);
                            return;
                          }

                          const matches = employees.filter(
                            (s) =>
                              (s.phone || "").includes(v) ||
                              (s.name || "")
                                .toLowerCase()
                                .includes(v.toLowerCase()),
                          );

                          setStaffSuggestions(matches);
                        }}
                        onBlur={() =>
                          setTimeout(() => setStaffSuggestions([]), 150)
                        }
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* CUSTOMER DETAILS */}
              <div className="col-lg-12">
                <div className="product-list-box">
                  <h5 className="box-title">
                    <i className="fi fi-tr-user-pen"></i> Customer Details
                  </h5>

                  <div className="row gy-4">
                    {/* CUSTOMER NAME */}
                    <div className="col-md-6 position-relative">
                      <label className="form-label">Customer Name</label>
                      <input
                        className="form-control"
                        value={customerName}
  //                       onChange={(e) => {
  //                         const v = e.target.value;
  //                         setCustomerName(v);
  //                         setSelectedCustomerId(null);
  //                           // ❌ DO NOT reset in edit mode
  // if (!isEdit) {
  //   setSelectedCustomerId(null);
  // }
  //                         if (!v) {
  //                           setCustomerSuggestions([]);
  //                           return;
  //                         }

  //                         setCustomerSuggestions(
  //                           customers.filter(
  //                             (c) =>
  //                               (c.name || "")
  //                                 .toLowerCase()
  //                                 .includes(v.toLowerCase()) ||
  //                               (c.phone || "").includes(v),
  //                           ),
  //                         );
  //                       }}
  onChange={(e) => {
  const v = e.target.value;
  setCustomerName(v);

  // ❌ DO NOT reset in edit mode
  if (!isEdit) {
    setSelectedCustomerId(null);
  }
  if (!v) {
                            setCustomerSuggestions([]);
                            return;
                          }

                          setCustomerSuggestions(
                            customers.filter(
                              (c) =>
                                (c.name || "")
                                  .toLowerCase()
                                  .includes(v.toLowerCase()) ||
                                (c.phone || "").includes(v),
                            ),
                          );
} }
                        onFocus={() => {
                          if (customerName) {
                            setCustomerSuggestions(customers);
                          }
                        }}
                      />
                      {errors.customerName && (
                        <div className="invalid-feedback">
                          {errors.customerName}
                        </div>
                      )}
                      {customerSuggestions.length > 0 && (
                        <ul className="list-group position-absolute w-100 z-3 small">
                          {customerSuggestions.map((c) => (
                            <li
                              key={c.id}
                              className="list-group-item list-group-item-action"
                              onClick={() => {
                                setCustomerName(c.name || "");
                                setCustomerPhone(c.phone || "");
                                setCustomerAddress(c.address || "");
                                setSelectedCustomerId(c.id);
                                setCustomerSuggestions([]);
                              }}
                            >
                              {c.name || "No Name"} – {c.phone}
                            </li>
                          ))}
                        </ul>
                      )}
                    </div>

                    {/* CUSTOMER PHONE */}
                    <div className="col-md-6">
                      <label className="form-label">Customer Phone</label>
                      <input
                        className="form-control readonly"
                        value={customerPhone}
                        inputMode="numeric"
                        pattern="[0-9]*"
                        maxLength={10}
                        onChange={(e) => {
                          let v = e.target.value.replace(/\D/g, "");

                          if (v.length > 10) v = v.slice(0, 10);

                          setCustomerPhone(v);

                          const existing = customers.find((c) => c.phone === v);

                          if (existing) {
                            setCustomerName(existing.name);
                            setSelectedCustomerId(existing.id);
                          } else {
                            setSelectedCustomerId(null);
                          }
                       if (!v) {
                            setCustomerSuggestions([]);
                            return;
                          }

                        setCustomerSuggestions(
                          customers.filter(
                            (c) =>
                              (c.phone || "").includes(v) 
                          ),
                        )
                        }}
                        
                        onBlur={() =>
                          setTimeout(() => setCustomerSuggestions([]), 150)
                        }
                      />
                    </div>
                    {/* CUSTOMER ADDRESS */}
                    <div className="col-md-12">
                      <label className="form-label">Customer Address</label>
                      <textarea
                        className={`form-control ${selectedCustomerId ? "bg-light" : ""}`}
                        rows="2"
                        value={customerAddress}
                        onChange={(e) => setCustomerAddress(e.target.value)}
                        placeholder="Enter customer address"
                        disabled={!!selectedCustomerId} // ✅ ADD THIS LINE
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* ADD PRODUCT */}
              <div className="col-lg-12">
                <div className="product-list-box">
                  <h5 className="box-title">
                    <i className="fi fi-tr-shopping-cart-add"></i> Add Products
                  </h5>

                  <div className="row gy-4">
                {/*    <div className="col-md-6">
                      <select
                        className="form-select"
                        value={selectedProductId}
                        onChange={(e) => {
                          const id = e.target.value;
                          setSelectedProductId(id);

                          const prod = productsList.find(
                            (p) => Number(p.id) === Number(id),
                          );
                          setSelectedProduct(prod || null);
                        }}
                      >
                        <option value="">Select Product</option>
                        {productsList.map((p) => (
                          <option key={p.id} value={p.id}>
                            {p.product_name} ({p.brand} - {p.category} -{" "}
                            {p.quantity})
                          </option>
                        ))}
                      </select>
                    </div>
*/}
<div className="col-md-6">
  <Select
    options={productOptions}
    placeholder="Search or Select Product"
    // value={productOptions.find(
    //   (opt) => opt.value === selectedProductId
    // )}
     value={selectedOption}
    onChange={(selected) => {
      setSelectedProductId(selected.value);
      setSelectedProduct(selected.product);
      setSelectedOption(selected);
    }}
    isSearchable
      styles={{
    control: (base) => ({
      ...base,
      fontSize: "14px",   // 🔽 input text size
      minHeight: "32px"
    }),
    menu: (base) => ({
      ...base,
      fontSize: "12px"    // 🔽 dropdown font size
    }),
    option: (base) => ({
      ...base,
      fontSize: "12px",   // 🔽 each option
      padding: "6px 10px"
    }),
    singleValue: (base) => ({
      ...base,
      fontSize: "12px"
    }),
  }}
  />
</div>
                    <div className="col-md-3">
                      <select className="form-select" disabled>
                        <option>
                          {selectedProduct ? selectedProduct.quantity : "Qty"}
                        </option>
                      </select>
                    </div>

                    <div className="col-md-3">
                      <input
                        type="number"
                        className="form-control readonly"
                        placeholder="Price"
                        value={selectedProduct ? selectedProduct.rate : ""}
                        readOnly
                      />
                    </div>

                    <div className="col-md-4">
                      <input
                        type="text"
                        className="form-control"
                        placeholder="Qty"
                        value={sellQty}
                        inputMode="numeric"
                        pattern="[0-9]*"
                        onChange={(e) => {
                          const value = e.target.value.replace(/\D/g, ""); // remove non-digits
                          setSellQty(value);
                        }}
                        onKeyDown={(e) => {
                          if (["e", "E", "+", "-", "."].includes(e.key)) {
                            e.preventDefault();
                          }
                        }}
                      />
                    </div>

                    {/* Final Price (Editable) */}
                    <div className="col-md-4">
                      <input
                        type="number"
                        className="form-control"
                        placeholder="Final Price"
                        inputMode="decimal"
                        value={finalPrice}
                        onChange={(e) => {
                          let value = e.target.value;

                          // allow only numbers and one decimal
                          if (/^\d*\.?\d{0,2}$/.test(value)) {
                            setFinalPrice(value);
                          }
                        }}
                        onWheel={(e) => e.target.blur()}
                        onKeyDown={(e) => {
                          if (["e", "E", "+", "-"].includes(e.key)) {
                            e.preventDefault();
                          }
                        }}
                      />
                    </div>

                    <div className="col-md-4 ">
                      <button className="main-btn " onClick={handleAddToBill}>
                        <i className="bi bi-plus"></i> Add to Bill
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              {/* PRODUCT TABLE */}
              <div className="col-lg-12">
                <div className="common-table-wrapper">
                  <table className="common-table table-striped">
                    <thead>
                      <tr>
                        <th>Product</th>
                        <th>Brand</th>
                        <th>Qty</th>
                        <th>Customer Qty</th>
                        <th>Stock</th>
                        <th>Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {billProducts.length ? (
                        billProducts.map((p, i) => (
                          <tr key={i}>
                            <td>{p.product_name}</td>
                            <td>
                              {p.brand} - {p.category}
                            </td>

                            <td>{p.product_quantity}</td>

                            <td>{p.sell_qty}</td>

                            <td>{isEdit ? "-" : p.stock}</td>

                            <td>
                              <button
                                className="btn btn-sm btn-danger"
                                onClick={() => removeProduct(i)}
                              >
                                <i className="bi bi-trash"></i>
                              </button>
                            </td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td colSpan="5" className="text-center">
                            No products added
                          </td>
                        </tr>
                      )}
                    </tbody>
                    {errors.products && (
                      <div className="text-danger mb-2">{errors.products}</div>
                    )}
                  </table>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ================= RIGHT ================= */}
        <div className="col-md-5">
          <div className="product-list-box invoice-box">
            {/* Header */}
            <div className="row invoice-header">
              <div className="col-6 left">
                <div className="title">INVOICE</div>
                <div className="invoice-no">{invoicePreview}</div>
              <div className="position-relative">
                  <input
                    className="form-control form-control-sm mt-2"
                    type="text"
                    placeholder="Company GST Number"
                    value={companyGSTNumber}
                   onChange={(e) => {
                      const value = e.target.value.toUpperCase();

                      if (value.length > 15) return;

                      setCompanyGSTNumber(value);

                      // ❗ wait until data loaded
                      if (!gstLoaded) return;

                      if (!value) {
                        setGstSuggestions([]);
                        return;
                      }

                      const filtered = allGSTNumbers.filter((gst) =>
                        gst.includes(value)
                      );

                      setGstSuggestions(filtered);
                    }}
                    onBlur={() => setTimeout(() => setGstSuggestions([]), 200)}
                
                  readOnly
                />

                  {gstSuggestions.length > 0 && (
                   <ul className="list-group position-absolute w-100 shadow bg-white z-3 gst-suggestion-list">
  {gstSuggestions.map((gst, i) => (
    <li
      key={i}
      className="list-group-item gst-suggestion-item"
      onMouseDown={() => {
        setCompanyGSTNumber(gst);
        setGstSuggestions([]);
      }}
    >
      {gst}
    </li>
  ))}
</ul>
                  )}
                </div>
                <input
                  className="form-control form-control-sm mt-2"
                  type="text"
                  placeholder="Way bill Number"
                  value={ewayBillNumber}
                  onChange={(e) => setEwayBillNumber(e.target.value)}
                />
              </div>

              <div className="col-6 right">
                <div className="date">Date</div>
                <div className="due">{today}</div>

                <input
                  className="form-control form-control-sm mt-2"
                  placeholder="Customer GST Number"
                  value={customerGSTNumber}
                  onChange={(e) => {
                    const value = e.target.value.toUpperCase();

                    // ✅ Limit 15 characters
                    if (value.length > 15) return;

                    setCustomerGSTNumber(value);
                  }}
                  maxLength={15}
                  pattern="^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$"
                  title="Enter Valid GST Number (Example: 22AAAAA0000A1Z5)"
                  required
                />

                {/* vechicle number */}
                <input
                  className="form-control form-control-sm mt-2"
                  placeholder="Vehicle Number"
                  type="text"
                  value={vehicleNumber}
                  onChange={(e) =>
                    setVehicleNumber(e.target.value.toUpperCase())
                  }
                  onWheel={(e) => e.target.blur()}
                />
              </div>
              {/* ================= BANK SELECT ================= */}
              <div className="mt-3">
                <label className="form-label">Select Bank</label>
                <select
                  className="form-select foem-select-sm"
                  value={selectedBankId || ""}
                  onChange={(e) => setSelectedBankId(Number(e.target.value))}
                >
                  <option value="">Select Bank</option>

                  {banks.map((b) => (
                    <option key={b.id} value={b.id}>
                      {b.bank_name} – {b.account_number}
                    </option>
                  ))}
                </select>
                {errors.bank && (
                  <div className="invalid-feedback d-block">{errors.bank}</div>
                )}
              </div>
            </div>

            {/* Bill Info */}
            <div className="row bill-info justify-content-end">
              {company && (
                <div className="col-6">
                  <div className="label">Bill From</div>
                  <div className="name">{company.company_name}</div>
                  <div className="text">{company.company_address}</div>
                  <div className="text">
                    {company.district}, {company.state} - {company.pincode}
                  </div>
                </div>
              )}

              <div className="col-6 right">
                <div className="label">Bill To</div>
                <div className="name">{customerName || "-"}</div>
                <div className="text worde-break">{customerAddress || "-"}</div>
              </div>
            </div>

            {/* Product Details */}
            <div className="products">
              <div className="label">Product Details</div>

              <div className="row product-head fw-semibold border-bottom pb-2">
                <div className="col-4">Product</div>
                <div className="col-2 center">Qty</div>
                <div className="col-2 right">Rate</div>
                <div className="col-2 right">Discount</div> {/* NEW */}
                <div className="col-2 right">Total</div>
              </div>

              {billProducts.length === 0 ? (
                <div className="text-center py-2">No products added</div>
              ) : (
                billProducts.map((p, i) => (
                  <div
                    className="row product-row align-items-center py-2 border-bottom"
                    key={i}
                  >
                    <div className="col-4">
                      {p.product_name} ({p.product_quantity})
                    </div>

                    <div className="col-2 text-center">{p.sell_qty}</div>

                    <div className="col-2 text-end">
                      {Number(p.final_rate) !== Number(p.rate) ? (
                        <>
                          <div
                            style={{
                              textDecoration: "line-through",
                              fontSize: "12px",
                              color: "#888",
                            }}
                          >
                            ₹{Number(p.rate).toFixed(2)}
                          </div>
                          <div>₹{Number(p.final_rate).toFixed(2)}</div>
                        </>
                      ) : (
                        <>₹{Number(p.rate).toFixed(2)}</>
                      )}
                    </div>

                    <div className="col-2 text-end text-danger">
                      {Number(p.rate) > Number(p.final_rate)
                        ? `₹${(Number(p.rate) - Number(p.final_rate)).toFixed(2)}`
                        : "—"}
                    </div>

                    <div className="col-2 text-end fw-semibold">
                      ₹{(p.sell_qty * (p.final_rate || p.rate)).toFixed(2)}
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Amounts */}
            <div className="amounts">
              <div className="row">
                <div className="col-6">
                  <p className="amount-text">Subtotal</p>
                </div>
                <div className="col-6 right">
                  <p className="amount-text">₹{subtotal.toFixed(2)}</p>
                </div>
              </div>
              {/* GST SELECTION
              <div className="row align-items-center">
                <div className="col-6 d-flex align-items-center gap-2">
                  <p className="amount-text mb-0">Tax (GST)</p>

                  <select
                    className={`form-select ${errors.gst ? "is-invalid" : ""}`}
                    style={{ width: "60px" }}
                    value={gstPercent}
                    onChange={(e) => setGstPercent(Number(e.target.value))}>
                    <option value={0}>0%</option>
                    <option value={5}>5%</option>
                    <option value={12}>12%</option>
                    <option value={18}>18%</option>
                    <option value={28}>28%</option>
                    <option value={48}>48%</option>
                  </select>
                </div>

                <div className="col-6 text-end">
                  <p className="amount-text mb-0">₹{totalTax.toFixed(2)}</p>
                </div>
              </div> */}
              {/* 
              {/* CGST *
              <div className="row align-items-center mt-1">
                <div className="col-6">
                  <p className="amount-text mb-0">CGST ({halfGstPercent}%)</p>
                </div>
                <div className="col-6 text-end">
                  <p className="amount-text mb-0">₹{cgstAmount.toFixed(2)}</p>
                </div>
              </div>

              {/* SGST *
              <div className="row align-items-center mt-2">
                <div className="col-6">
                  <p className="amount-text mb-0">SGST ({halfGstPercent}%)</p>
                </div>
                <div className="col-6 text-end">
                  <p className="amount-text mb-0">₹{sgstAmount.toFixed(2)}</p>
                </div>
              </div> */}

              <div className="row grand">
                <div className="col-6">
                  <p className="amount-text">Grand Total</p>
                </div>
                <div className="col-6 right">
                  <p className="amount-text">₹{grandTotal.toFixed(2)}</p>
                </div>
              </div>
            </div>

            {/* Payment Values */}
            <div className="row payment-values">
              <div className="col-6">
                <div className="label">Advance Paid</div>
                <input
                  className="form-control"
                  value={`₹${advancePaid.toFixed(2)}`}
                  readOnly
                />
              </div>

              <div className="col-6">
                <div className="label">Balance Due</div>
                <input
                  className="form-control danger"
                  value={`₹${balanceDue.toFixed(2)}`}
                  readOnly
                />
              </div>
            </div>

            {/* Payment Mode */}
            <div className="payment-mode">
              <div className="label mb-2">Payment Mode</div>

              <div className="row g-3">
                {/* CASH */}
                <div className="col-4">
                  <div
                    className={`radio-card ${paymentMode === "cash" ? "active" : ""}`}
                    onClick={() => setPaymentMode("cash")}
                  >
                    <div className="icon">
                      <i className="bi bi-cash-coin"></i>
                    </div>
                    <span>CASH</span>
                  </div>

                  {paymentMode === "cash" && (
                    <input
                      type="number"
                      className="form-control mt-2"
                      placeholder="Cash amount"
                      min="0"
                      value={cashAmount}
                     // disabled={isEdit}
                   onChange={(e) => {
  const value = e.target.value;

  // ✅ allow only numbers + decimal
  if (!/^\d*\.?\d*$/.test(value)) return;

  // ✅ safe calculation
  const newTotal =
    Number(value || 0) +
    Number(upiAmount || 0) +
    Number(chequeAmount || 0);

  if (newTotal > grandTotal) {
    toast.error("Advance cannot exceed Grand Total");
    return;
  }

  // ✅ store as string (important)
  setCashAmount(value);
}}
                      onWheel={(e) => e.target.blur()}
                    />
                  )}
                </div>

                {/* UPI */}
                <div className="col-4">
                  <div
                    className={`radio-card ${paymentMode === "upi" ? "active" : ""}`}
                    onClick={() => setPaymentMode("upi")}
                  >
                    <div className="icon">
                      <i className="bi bi-qr-code-scan"></i>
                    </div>
                    <span>UPI / QR</span>
                  </div>

                  {paymentMode === "upi" && (
                    <input
                      type="number"
                      className="form-control mt-2"
                      placeholder="UPI amount"
                      min="0"
                      value={upiAmount}
                    //  disabled={isEdit}
                   onChange={(e) => {
  const value = e.target.value;

  // ✅ allow only numbers + decimal
  if (!/^\d*\.?\d*$/.test(value)) return;

  // ✅ safe calculation
  const newTotal =
    Number(cashAmount || 0) +
    Number(value || 0) +
    Number(chequeAmount || 0);

  if (newTotal > grandTotal) {
    toast.error("Advance cannot exceed Grand Total");
    return;
  }

  // ✅ store as string (important)
  setUpiAmount(value);
}}
                      onWheel={(e) => e.target.blur()}
                    />
                  )}
                </div>

                {/* CHEQUE */}
                <div className="col-4">
                  <div
                    className={`radio-card ${paymentMode === "cheque" ? "active" : ""}`}
                    onClick={() => setPaymentMode("cheque")}
                  >
                    <div className="icon">
                      <i className="bi bi-cash-stack"></i>
                    </div>
                    <span>CHEQUE</span>
                  </div>

                  {paymentMode === "cheque" && (
                    <input
                      type="number"
                      className="form-control mt-2"
                      placeholder="Cheque amount"
                      min="0"
                      value={chequeAmount}
                    //  disabled={isEdit}
                    onChange={(e) => {
  const value = e.target.value;

  // ✅ allow only numbers + decimal
  if (!/^\d*\.?\d*$/.test(value)) return;

  // ✅ safe calculation
  const newTotal =
    Number(cashAmount || 0) +
    Number(upiAmount || 0) +
    Number(value || 0);

  if (newTotal > grandTotal) {
    toast.error("Advance cannot exceed Grand Total");
    return;
  }

  // ✅ store as string (important)
  setChequeAmount(value);
}}
                      onWheel={(e) => e.target.blur()}
                    />
                  )}
                </div>
              </div>
            </div>

            {/* Action */}
            <button
              className="main-btn w-100 text-center d-block"
              onClick={handleSaveBilling}
              disabled={
                Number(cashAmount || 0) +
                  Number(upiAmount || 0) +
                  Number(chequeAmount || 0) -
                  grandTotal >
                0.01
              }
            >
              <i className="fi fi-tr-print me-2"></i>
              Save & Print
            </button>

            <div className="invoice-footer">
              <button
                type="button"
                className="btn btn-sm me-3"
                onClick={handleSaveDraft}
              >
                <i className="bi bi-save me-2"></i>
                Save Draft
              </button>

              <button
                type="button"
                className="btn btn-sm me-3"
                onClick={handleDiscard}
              >
                <i className="bi bi-x-circle-fill me-2"></i>
                Discard
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
