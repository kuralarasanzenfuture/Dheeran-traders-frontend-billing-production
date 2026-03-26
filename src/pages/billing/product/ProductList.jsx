import { useEffect, useState } from "react";
import { ProductTable } from "../../../components/tables/ProductTable";
import { AddProduct } from "./AddProduct";
import { getBrands } from "../../../services/brand.service";
import { getCategories } from "../../../services/category.service";
import "./product.css";

export const ProductList = () => {
  const [showAddModal, setShowAddModal] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);
  const [editProduct, setEditProduct] = useState(null);
  
  // filters
  const [search, setSearch] = useState("");
  const [brand, setBrand] = useState("");
  const [category, setCategory] = useState("");

  // dropdown data
  const [brands, setBrands] = useState([]);
  const [categories, setCategories] = useState([]);
const uniqueCategories = [...new Set(categories.map((c) => c.name))];
  useEffect(() => {
    loadFilters();
  }, []);

  const loadFilters = async () => {
    try {
      const brandData = await getBrands();
      const categoryData = await getCategories();

      setBrands(brandData || []);
      setCategories(categoryData || []);
    } catch (err) {
      console.error("Failed to load filters", err);
    }
  };

  return (
    <div className="product_detail">
      {/* HEADER */}
      <div className="form_element mb-4">
        <div className="form_content">
          <div className="d-flex align-items-center gap-2 flex-wrap">
            <div className="flex-fill">
              <div className="d-flex align-items-center gap-2 flex-wrap flex-md-nowrap">
                
                {/* BRAND */}
                <select
                  className="form-select product-filter"
                  value={brand}
                  onChange={(e) => setBrand(e.target.value)}
                >
                  <option value="">Brand</option>
                  {brands.map((b) => (
                    <option key={b.id} value={b.name}>
                      {b.name}
                    </option>
                  ))}
                </select>

              {/* CATEGORY */}
                <select
                  className="form-select product-filter"
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                >
                  <option value="">Category</option>

                  {uniqueCategories.map((name, index) => (
                    <option key={index} value={name}>
                      {name}
                    </option>
                  ))}
                </select>

                {/* SEARCH */}
                <div className="search-box">
                  <input
                    type="text"
                    className="search-input"
                    placeholder="Search products..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                  />
                  <i className="bi bi-search search-icon"></i>
                </div>
              </div>
            </div>

            {/* ADD BUTTON */}
            <button
              className="btn main-btn"
              onClick={() => {
                setEditProduct(null);   // ✅ Reset edit mode
                setShowAddModal(true);
              }}
            >
              <i className="bi bi-plus-lg me-1"></i>
              Add Product
            </button>
          </div>
        </div>
      </div>

      {/* TABLE */}
      <ProductTable
        refreshKey={refreshKey}
        search={search}
        brand={brand}
        category={category}
        onEdit={(product) => {
          setEditProduct(product);   // ✅ Set product to edit
          setShowAddModal(true);
        }}
      />

      {/* MODAL */}
      <AddProduct
        key={editProduct?.id || "add"}   // ✅ Important fix
        show={showAddModal}
        editData={editProduct}
        onClose={() => {
          setShowAddModal(false);
          setEditProduct(null);         // ✅ Clear state on close
        }}
        onSuccess={() => {
          setShowAddModal(false);
          setEditProduct(null);
          setRefreshKey((k) => k + 1);
        }}
      />
    </div>
  );
};
