import { useEffect, useState } from "react";
import {
  getCategories,
  createCategory,
  updateCategory,
  deleteCategory,
} from "../../../services/category.service";
import { getBrands } from "../../../services/brand.service";
import { toast } from "react-toastify";

export const AddCategorey = () => {
  const [brands, setBrands] = useState([]);
  const [categories, setCategories] = useState([]);

  // create states
  const [brand, setBrand] = useState("");
  const [categoryName, setCategoryName] = useState("");

  // edit states
  const [editingId, setEditingId] = useState(null);
  const [editBrand, setEditBrand] = useState("");
  const [editName, setEditName] = useState("");
  
  // validation
  const [error, setError] = useState("");
  // create states
const [hsnCode, setHsnCode] = useState("");
const [currentPage, setCurrentPage] = useState(1);
  const rowsPerPage = 7;

// edit states
const [editHsnCode, setEditHsnCode] = useState("");
  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    const brandData = await getBrands();
    const categoryData = await getCategories();
    setBrands(brandData);
    setCategories(categoryData);
  };

  /* ================= CREATE CATEGORY ================= */
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!brand || !categoryName.trim()) {
      setError("Brand and Category name are required");
      return;
    }
    if (hsnCode && !/^\d+$/.test(hsnCode)) {
      setError("HSN Code must be a number digits only");
      return;
    }

    try {
     await createCategory({
  name: categoryName,
  brand_id: Number(brand),
  hsn_code: hsnCode || null,
});

      setBrand("");
      setCategoryName("");
      setHsnCode("");
      setError("");
      loadData();
      toast.success("Category Added successfully ✅");
    } catch (err) {
      setError(err.response?.data?.message || "Something went wrong");
    }
  };

  /* ================= EDIT ================= */
  const startEdit = (cat) => {
  const brandObj = brands.find((b) => b.id === cat.brand_id);

  if (brandObj && brandObj.status === "inactive") {
    alert("This category belongs to an inactive brand");
    return;
  }

  setEditingId(cat.id);
  setEditBrand(cat.brand_id);
  setEditName(cat.name);
   setEditHsnCode(cat.hsn_code || "");
 };

  const saveEdit = async (id) => {
    if (!editBrand || !editName.trim()) return;
 if (editHsnCode && !/^\d+$/.test(editHsnCode)) {
    toast.error("HSN Code must be number digits only ");
    return;
  }
    await updateCategory(id, {
      name: editName,
      brand_id: Number(editBrand),
      hsn_code: editHsnCode || null,
    });
    toast.success("Category Updated successfully ✅");

    setEditingId(null);
    loadData();
  };

  const cancelEdit = () => {
    setEditingId(null);
  };

  /* ================= DELETE ================= */
  const handleDelete = async (id) => {
    if (window.confirm("Delete this category?")) {
      await deleteCategory(id);
      loadData();
      toast.success("Category has been deleted");

    }
  };
 /* ================= PAGINATION LOGIC ================= */

const totalPages = Math.ceil(categories.length / rowsPerPage);

const indexOfLastRow = currentPage * rowsPerPage;
const indexOfFirstRow = indexOfLastRow - rowsPerPage;

const currentRows = categories.slice(indexOfFirstRow, indexOfLastRow);

// Reset page if brands change
useEffect(() => {
  setCurrentPage(1);
}, [categories]);

const visiblePages = 3;

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
    <>
      <div className="row gy-4">
        {/* ================= FORM ================= */}
        <div className="col-lg-12">
          <div className="form_element">
            <div className="form_title">
              <h5 className="title">Add Category</h5>
            </div>

            <div className="form_content">
              <form className="row gy-3" onSubmit={handleSubmit}>
                <div className="col-md-4">
                  <select
                    className={`form-select ${error ? "is-invalid" : ""}`}
                    value={brand}
                    onChange={(e) => {
                      setBrand(e.target.value);
                      if (error) setError("");
                    }}
                  >
                    <option value="">Select Brand</option>
                    {brands.map((b) => (
                      <option key={b.id} value={b.id}>
                        {b.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="col-md-4">
                  <input
                    type="text"
                    className={`form-control ${error ? "is-invalid" : ""}`}
                    placeholder="Category Name"
                    value={categoryName}
                    onChange={(e) => {
                      setCategoryName(e.target.value);
                      if (error) setError("");
                    }}
                  />
                  {error && (
                    <div className="invalid-feedback d-block">{error}</div>
                  )}
                </div>
                <div className="col-md-2">
              <input
                type="text"
                className={`form-control ${error ? "is-invalid" : ""}`}
                placeholder="HSN Code"
                value={hsnCode}
                onChange={(e) => {
                  setHsnCode(e.target.value);
                  if (error) setError("");
                }}
              />
            </div>

                <div className="col-md-2 text-lg-end">
                  <button
                    className="btn main-btn"
                    disabled={!brand || !categoryName.trim()}
                  >
                    Add Category
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>

        {/* ================= TABLE ================= */}
        <div className="col-lg-12">
          <div className="common-table-wrapper">
            <table className="common-table table-striped">
              <thead>
                <tr>
                  <th>Brand Name</th>
                  <th>Category</th>
                  <th>HSN Code</th>
                  <th></th>
                </tr>
              </thead>

              <tbody>
                {currentRows.map((cat) => (
                  <tr key={cat.id}>
                    {/* BRAND */}
                    <td>
                      {editingId === cat.id ? (
                        <select
                          className="form-select"
                          value={editBrand}
                          onChange={(e) => setEditBrand(e.target.value)}
                        >
                          {brands.map((b) => (
                            <option key={b.id} value={b.id}>
                              {b.name}
                            </option>
                          ))}
                        </select>
                      ) : (
                        cat.brand_name
                      )}
                    </td>

                    {/* CATEGORY */}
                    <td>
                      {editingId === cat.id ? (
                        <input
                          type="text"
                          className="form-control"
                          value={editName}
                          onChange={(e) => setEditName(e.target.value)}
                        />
                      ) : (
                        cat.name
                      )}
                    </td>
                   {/* HSN CODE */}
                      <td>
                        {editingId === cat.id ? (
                          <input
                            type="text"
                            className="form-control"
                            value={editHsnCode}
                            onChange={(e) => setEditHsnCode(e.target.value)}
                          />
                        ) : (
                          cat.hsn_code || "-"
                        )}
                      </td>

                    {/* ACTIONS */}
                    <td className="action-buttons d-flex justify-content-end">
                      {editingId === cat.id ? (
                        <>
                          <button
                            className="btn btn-sm btn-success me-2"
                            onClick={() => saveEdit(cat.id)}
                          >
                            ✔
                          </button>
                          <button
                            className="btn btn-sm btn-secondary"
                            onClick={cancelEdit}
                          >
                            ✖
                          </button>
                        </>
                      ) : (
                        <>
                          <button
                            className="btn btn-sm btn-warning me-2"
                            onClick={() => startEdit(cat)}
                          >
                            <i className="bi bi-pencil"></i>
                          </button>
                          <button
                            className="btn btn-sm btn-danger"
                            onClick={() => handleDelete(cat.id)}
                          >
                            <i className="bi bi-trash"></i>
                          </button>
                        </>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
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
                    onClick={() =>
                        setCurrentPage((prev) => Math.min(prev + 1, totalPages))
                      }
                    >
                      <i className="bi bi-arrow-right"></i>
                    </button>
                  </li>

                </ul>
              </nav>
            )}
        </div>
      </div>
    </>
  );
};
