import React, { useEffect, useState } from "react";
import { createCustomerReturn,updateCustomerReturn } from "../../../services/productretrun.service";
import { getAllCustomerBillings } from "../../../services/customerBilling.service";
import Select from "react-select";
import "./add-payment-model.css";
import { toast } from "react-toastify";

export const AddReturnProduct = ({
  closeModal,
  editData,
  invoiceId,
  refresh = () => {},
}) => {
  /* ================= STATE ================= */
  const [formData, setFormData] = useState({
    billing_id: "",
    invoice_number: "",
    product_id: "",
    return_qty: "",
    reason: "",
  });

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [billings, setBillings] = useState([]);

  const [selectedInvoice, setSelectedInvoice] = useState(null);
  const [products, setProducts] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [addedProducts, setAddedProducts] = useState([]);
  const isEdit = Boolean(editData);
  /* ================= FETCH BILLINGS ================= */
  useEffect(() => {
    const fetchBillings = async () => {
      try {
        const data = await getAllCustomerBillings();
        setBillings(data || []);
      } catch (err) {
        toast.error("Failed to load invoices");
      }
    };

    fetchBillings();
  }, []);
console.log(billings);
  /* ================= VALIDATION ================= */
  const validate = () => {
  const e = {};

  // ✅ Invoice required
  if (!formData.invoice_number) {
    e.invoice_number = "Invoice required";
  }

  // ✅ At least one product must be added
  if (addedProducts.length === 0) {
    e.products = "Add at least one product";
    toast.error("Please add at least one product");
  }

  setErrors(e);
  return Object.keys(e).length === 0;
};
  /* ================= HANDLERS ================= */

  const handleInvoiceChange = (selected) => {
    if (!selected) return;

    const invoiceId = selected.value;

    const invoice = billings.find((b) => b.id == invoiceId);
     console.log("Selected Invoice:", invoice);
     console.log("Invoice Products:", invoiceId);
    setFormData((prev) => ({
      ...prev,
     // billing_id: invoiceId,
      invoice_number: invoiceId,
      product_id: "",
      return_qty: "",
    }));

    setSelectedInvoice(invoice);
    setProducts(invoice?.products || []);
    setSelectedProduct(null);
  };
console.log("Selected Product:", selectedProduct);
const handleProductSelect = (product) => {
  setSelectedProduct(product);

  setFormData(prev => ({
    ...prev,
    product_id: String(product.id), // ✅ billing_product_id
  }));
};
  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    setErrors((prev) => ({
      ...prev,
      [name]: "",
    }));
  };
  const handleAddProduct = () => {
  if (!selectedProduct || !formData.return_qty) {
    toast.error("Select product & qty");
    return;
  }

  const qty = Number(formData.return_qty);

  if (qty <= 0) {
    return toast.error("Invalid quantity");
  }

  if (qty > selectedProduct.remaining_quantity) {
  return toast.error("Qty exceeds remaining stock");
}
  // ✅ prevent duplicate
  const exists = addedProducts.find(
    (p) => String(p.product_id) === String(formData.product_id)
  );

  if (exists) {
    return toast.error("Product already added");
  }

 const newItem = {
  billing_product_id: selectedProduct.id,

  product_name: selectedProduct.product_name,
  brand: selectedProduct.product_brand,
  category: selectedProduct.product_category,

  // ✅ CLEAR NAMING
  buying_qty: selectedProduct.quantity,   // original purchase qty
  remaining_quantity: selectedProduct.remaining_quantity, // for reference
  return_qty: Number(formData.return_qty),

  pack_size: selectedProduct.product_quantity, // 25kg etc
  
  rate: selectedProduct.final_rate,
  total: selectedProduct.total,
};
  console.log("Adding Product:", newItem);
  setAddedProducts((prev) => [...prev, newItem]);

  // reset
  setSelectedProduct(null);
  setFormData((prev) => ({
    ...prev,
    product_id: "",
    return_qty: "",
  }));
};
useEffect(() => {
  if (!invoiceId || billings.length === 0) return;

  const invoice = billings.find(
    (b) => String(b.id) === String(invoiceId)
  );

  if (!invoice) return;

  console.log("AUTO LOAD INVOICE:", invoice);

  setSelectedInvoice(invoice);
  setProducts(invoice.products || []);

  setFormData((prev) => ({
    ...prev,
    invoice_number: invoice.id,
  }));

}, [invoiceId, billings]);
const handleDeleteAddedProduct = (index) => {
  setAddedProducts((prev) => prev.filter((_, i) => i !== index));
};
const handleEditAddedProduct = (index) => {
  const item = addedProducts[index];

  console.log("Edit Product ITEM:", item); // ✅ correct debug

 setSelectedProduct({
  billing_product_id: item.billing_product_id,
  id: item.billing_product_id,

  product_name: item.product_name,
  product_brand: item.brand,
  product_category: item.category,

  quantity: item.buying_qty,

  // ❌ missing before
  remaining_quantity: item.remaining_quantity,

  final_rate: item.rate,
  total: item.total,
});

  setFormData((prev) => ({
    ...prev,
    product_id: String(item.billing_product_id), // ✅ FIXED
    // return_qty: item.quantity,
    return_qty: item.return_qty, // ✅ FIX
    reason: item.reason || "",
  }));

  // remove from table (so user can re-add)
  setAddedProducts((prev) =>
    prev.filter((_, i) => i !== index)
  );
};
console.log("Added Products:", addedProducts);

useEffect(() => {
  if (!editData) return;

  // wait until billings loaded
  if (billings.length === 0) return;

  console.log("EDIT DATA:", editData);

  setFormData({
    billing_id: editData.billing_id,
    invoice_number: editData.billing_id,
    product_id: "",
    return_qty: "",
    reason: editData.remarks || "",
  });

  const invoice = billings.find(
    (b) => String(b.id) === String(editData.billing_id)
  );

  console.log("FOUND INVOICE:", invoice);

  setSelectedInvoice(invoice || null);
  setProducts(invoice?.products || []);
// const mappedProducts = (editData.products || []).map((p) => ({
//   billing_product_id: p.billing_product_id,
//   product_name: p.product_name || "Product",

//   // ✅ correct fields
//   brand: p.brand || "-",
//   category: p.category || "-",

//   // ✅ return values
//   quantity: p.return_quantity || 0,

//   // ✅ from API
//   stock: p.stock_quantity|| "0", // this is like "25kg"
//   rate: Number(p.original_rate) || 0,
//   total: Number(p.original_total) || 0,
// }));
 const mappedProducts = (editData.products || []).map((p) => {
  const originalProduct = invoice?.products?.find(
    (prod) => String(prod.id) === String(p.billing_product_id)
  );

  return {
    billing_product_id: p.billing_product_id,

    product_name: p.product_name,
    brand: p.brand,
    category: p.category,

    // ✅ ALWAYS correct
    buying_qty: originalProduct?.quantity || 0,

    // ✅ ALWAYS correct
    remaining_quantity: originalProduct?.remaining_quantity || 0,

    return_qty: p.return_quantity || 0,

    pack_size: p.product_quantity,
    rate: Number(p.original_rate),
    total: Number(p.original_total),
  };
});
    setAddedProducts(mappedProducts);

  }, [editData, billings]); // ✅ VERY IMPORTANT
  /* ================= SUBMIT ================= */
 const handleSubmit = async (e) => {
  e.preventDefault();

  if (loading) return;
  if (!validate()) return;

  setLoading(true);

  try {
    const payload = {
      billing_id: formData.invoice_number,
      remarks: formData.reason || "",
      products: addedProducts.map((p) => ({
        billing_product_id: p.billing_product_id,
        return_quantity: p.return_qty,
      })),
    };

    let res;

    if (editData) {
      // ✅ EDIT
      res = await updateCustomerReturn(editData.id, payload);
      toast.success("Return updated successfully");
    } else {
      // ✅ ADD
      res = await createCustomerReturn(payload);
      toast.success("Return added successfully");
    }

    refresh(res?.data?.data || res?.data);
    closeModal();

  } catch (err) {
    toast.error(
      err?.response?.data?.message ||
      err.message ||
      "Operation failed"
    );
  } finally {
    setLoading(false);
  }
};
  const handleRefresh = (payload) => {
  // DELETE
  if (typeof payload === "number") {
    setReturns((prev) => prev.filter((r) => r.id !== payload));
    return;
  }

  // ❗ SAFETY CHECK
  if (!payload || !payload.id) {
    console.warn("Invalid payload:", payload);
    fetchReturns(); // fallback reload
    return;
  }

  // ADD / EDIT
  // setReturns((prev) => {
  //   const exists = prev.find((r) => r?.id === payload.id);

  //   if (exists) {
  //     return prev.map((r) =>
  //       r.id === payload.id ? payload : r
  //     );
  //   }

  //   return [payload, ...prev];
  // });
};
// const productOptions = products.map(p => ({
//   value: String(p.id),
//   label: `${p.product_name} (${p.product_brand})`,
//   product: {
//     ...p,
//     remaining_quantity: p.remaining_quantity || p.quantity
//   }
// }));

const productOptions = products.map(p => {
  const remaining =
    Number(p.quantity) - Number(p.returned_quantity || 0);

  return {
    value: String(p.id),
    label: `${p.product_name} (${p.product_brand})`,
    product: {
      ...p,
      remaining_quantity: remaining
    }
  };
});
  /* ================= UI ================= */
  return (
 <form onSubmit={handleSubmit} className="customer-modal-form">
  <div className="row gy-3">

    {/* ===== INVOICE ===== */}
    <div className="col-md-6">
      <label>Invoice *</label>
      <Select
       isDisabled={isEdit} // prevent changing invoice on edit
        value={
          billings
            .map(b => ({ value: b.id, label: b.invoice_number }))
            .find(opt => opt.value === formData.invoice_number) || null
        }
        options={billings.map(b => ({
          value: b.id,
          label: b.invoice_number
        }))}
        onChange={handleInvoiceChange}
      />
      <div className="text-danger">{errors.invoice_number}</div>
    </div>

    {/* ===== CUSTOMER ===== */}
    {selectedInvoice && (
      <>
        <div className="col-md-3">
          <label>Customer</label>
          <input
            value={selectedInvoice.customer_name}
            disabled
            className="form-control"
          />
        </div>

        <div className="col-md-3">
          <label>Phone</label>
          <input
            value={selectedInvoice.phone_number}
            disabled
            className="form-control"
          />
        </div>
      </>
    )}

    {/* ===== PRODUCT SELECT ===== */}
    {products.length > 0 && (
      <div className="col-md-6">
        <label>Product *</label>

 <Select
  options={productOptions}

  value={
    productOptions.find(
      opt => opt.value === String(formData.product_id)
    ) || null
  }

  onChange={(selected) => {
    if (!selected) return;

    handleProductSelect(selected.product);
  }}
/>

        <div className="text-danger">{errors.product_id}</div>
      </div>
    )}

    {/* ===== PRODUCT INFO ===== */}
    {selectedProduct && (
      <>
        <div className="col-md-2">
          <label>Buying Qty</label>
          <input
            value={selectedProduct.quantity}
            disabled
            className="form-control"
          />
        </div>
   <div className="col-md-2">
          <label>Remaining Qty</label>
          <input
           value={selectedProduct.remaining_quantity}
            disabled
            className="form-control"
          />
        </div>
        <div className="col-md-2">
          <label>Price</label>
          <input
            value={`₹ ${selectedProduct.final_rate}`}
            disabled
            className="form-control"
          />
        </div>

        <div className="col-md-2">
          <label>Total</label>
          <input
            value={`₹ ${selectedProduct.total}`}
            disabled
            className="form-control"
          />
        </div>
      </>
    )}

    {/* ===== BILL SUMMARY INLINE ===== */}
    {selectedInvoice && (
      <>
        <div className="col-md-3">
          <label>Grand Total</label>
          <input
            value={`₹ ${selectedInvoice.grand_total}`}
            disabled
            className="form-control"
          />
        </div>

        <div className="col-md-3">
          <label>Paid</label>
          <input
            value={`₹ ${selectedInvoice.total_paid_amount || 0}`}
            disabled
            className="form-control"
          />
        </div>

        <div className="col-md-3">
          <label>Pending</label>
          <input
            value={`₹ ${selectedInvoice.balance_due || 0}`}
            disabled
            className="form-control"
          />
        </div>
        {/* <div className="col-md-3 d-flex align-items-end">
  <button
    type="button"
    className="btn btn-danger w-100"
    onClick={handleAddProduct}
  >
    Add Product +
  </button>
</div> */}
      </>
    )}

   {selectedProduct && (
  <>
    {/* ===== RETURN QTY ===== */}
    <div className="col-md-3">
      <label>Return Qty *</label>
      <input
        type="number"
        name="return_qty"
        value={formData.return_qty}
        onChange={handleChange}
        max={selectedProduct.quantity}
        className="form-control"
      />
      <div className="text-danger">{errors.return_qty}</div>
    </div>

    {/* ===== REASON ===== */}
    <div className="col-md-6">
      <label>Reason</label>
      <textarea
        name="reason"
        rows="2"
        value={formData.reason}
        onChange={handleChange}
        className="form-control"
      />
    </div>

    {/* ===== ADD BUTTON ===== */}
    <div className="col-md-3 d-flex align-items-end">
      <button
        type="button"
        className="btn btn-danger w-100"
        onClick={handleAddProduct}
      >
        Add Product +
      </button>
    </div>
  </>
)}
   
  <div className="col-12 mt-3">
    <label className="form-label fw-semibold">Added Products</label>

    {addedProducts.length === 0 ? (
      <div className="form-control text-muted">
        No products added
      </div>
    ) : (
      <div className="common-table-wrapper">
        <table className="common-table table-striped">
          <thead>
            <tr>
              <th className="text-center" style={{ width: "60px" }}>#</th>
              <th className="text-center">Products</th>
              {/* <th className="text-center">Brand</th>
              <th className="text-center">Category</th> */}
              <th className="text-center">Return Qty</th>
              <th className="text-center">remaining Qty</th>
              {/* <th className="text-center">Reason</th> */}
              <th className="text-center">Actions</th>
            </tr>
          </thead>

          <tbody>
            {addedProducts.map((item, index) => (
              <tr key={index}>
                <td className="fw-bold text-center">
                  {index + 1}
                </td>

                <td className="fw-semibold text-center">
                  {item.product_name}({item.brand}|{item.category}|{item.product_quantity})
                </td>

              

              <td className="text-center">
                  {item.return_qty}
                </td>

                <td className="fw-bold text-center">
                  {item.remaining_quantity}
                </td>

                {/* <td className="text-center">
                  {item.reason || "-"}
                </td> */}

            <td className="text-center">
  <div className="action-group">
    <button
      type="button"
      className="btn btn-sm btn-warning me-2"
      onClick={() => handleEditAddedProduct(index)}
    >
      <i className="bi bi-pencil"></i>
    </button>

    <button
      type="button"
      className="btn btn-sm btn-danger me-2"
      style={{padding: "8px 4px !important"}}
      onClick={() => handleDeleteAddedProduct(index)}
    >
      <i className="bi bi-trash"></i>
    </button>
  </div>
</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    )}
  </div>

    {/* ===== SUBMIT ===== */}
    <div className="col-md-12 text-end">
      <button className="btn main-btn px-4" disabled={loading}>
        {loading ? "Saving..." : "Submit Return"}
      </button>
    </div>

  </div>
</form>
  );
};