import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import Logo from "../../assets/images/logo.png";
import "./sidebar.css";
import { logout } from "../../services/auth.service";

/* ================= HELPERS ================= */
const isActive = (path, current) => current === path || current.startsWith(path + "/");

const isAnyActive = (paths, current) => paths.some((p) => isActive(p, current));

const routeMap = {
  billing: {
    main: "billing",
    base: ["/dashboard", "/products", "/accounts", "/report"],
    subs: {
      products: ["/products"],
      accounts: ["/accounts"],
      report: ["/report"],
    },
  },
};

export const Sidebar = () => {
  /* ================= STATE ================= */
  const [openMain, setOpenMain] = useState(null);
  const [openSub, setOpenSub] = useState(null);
  const [mobileOpen, setMobileOpen] = useState(false);
  const location = useLocation();
  const loggedInUser = JSON.parse(localStorage.getItem("user"));

  const isAdmin = loggedInUser?.role === "admin";

  /* ================= MOBILE TOGGLE ================= */
  useEffect(() => {
    const handler = () => setMobileOpen((prev) => !prev);
    window.addEventListener("toggle-sidebar", handler);
    return () => window.removeEventListener("toggle-sidebar", handler);
  }, []);

  useEffect(() => {
    if (window.innerWidth < 992) {
      setMobileOpen(false);
    }
  }, [location.pathname]);

  /* ================= AUTO OPEN BILLING ================= */
  useEffect(() => {
    Object.values(routeMap).forEach((menu) => {
      if (menu.base.some((p) => location.pathname.startsWith(p))) {
        setOpenMain(menu.main);

        if (menu.subs) {
          const subKey = Object.keys(menu.subs).find((key) => menu.subs[key].some((p) => location.pathname.startsWith(p)));
          setOpenSub(subKey || null);
        }
      }
    });
  }, [location.pathname]);

  const handleLogout = () => {
    logout(); // 🔥 already clears storage + redirects
  };

  return (
    <aside className={`sidebar ${mobileOpen ? "mobile_open" : ""}`}>
      {/* ================= HEADER ================= */}
      <div className="sidebar_header">
        <div className="header_logo">
          <Link to="">
            <img src={Logo} alt="logo" />
          </Link>
        </div>
        <button className="sidebar_close_btn d-lg-none" onClick={() => setMobileOpen(false)}>
          <i className="bi bi-x-lg"></i>
        </button>
      </div>

      {/* ================= MENU ================= */}
      <ul className="sidebar_menu_items">
        {/* ================= BILLING ================= */}
        <li className={`sidebar_menu ${openMain === "billing" ? "open" : ""} `}>
          <div className="menu_header" onClick={() => setOpenMain(openMain === "billing" ? null : "billing")}>
            <span className="sidebar_icon">
              <i className="fi fi-tr-calculator-money"></i>
            </span>
            <Link to="/billing" className="sidebar_text">
              Billing
            </Link>

            <i className="fi fi-tr-angle-small-down arrow"></i>
          </div>

          {openMain === "billing" && (
            <ul className="submenu pd-l15">
              {/* DASHBOARD */}
              {isAdmin && (
                <li className={`sidebar_menu ${isActive("/dashboard", location.pathname) ? "active" : ""}`}>
                  <Link to="/dashboard" className="menu_header">
                    <span className="sidebar_icon">
                      <i className="fi fi-tr-objects-column"></i>
                    </span>
                    <span className="sidebar_text">Dashboard</span>
                  </Link>
                </li>
              )}
              {/* EMPLOYEES */}
              {isAdmin && (
                <li className={`sidebar_menu pd-l15 ${isActive("/employees", location.pathname) ? "active" : ""}`}>
                  <Link to="/employees" className="menu_header">
                    <span className="sidebar_icon">
                      <i className="fi fi-tr-employee-man"></i>
                    </span>
                    <span className="sidebar_text">Employees</span>
                  </Link>
                </li>
              )}
              {/* PRODUCTS */}
              <li className={`sidebar_menu pd-l15 ${isAnyActive(["/products"], location.pathname) ? "active" : ""}`}>
                <div className="menu_header" onClick={() => setOpenSub(openSub === "products" ? null : "products")}>
                  <span className="sidebar_icon">
                    <i className="fi fi-tr-box-open-full"></i>
                  </span>
                  <span className="sidebar_text">Products</span>
                  <i className="fi fi-tr-angle-small-down arrow"></i>
                </div>

                {openSub === "products" && (
                  <ul className="submenu submenu_list pd-l25">
                    <li className={isActive("/products/add-product", location.pathname) ? "active" : ""}>
                      <Link to="/products/add-product">
                        <span className="submenu_icon">
                          <i className="fi fi-tr-boxes"></i>
                        </span>
                        <span className="submenu_text">Add Product</span>
                      </Link>
                    </li>
                    <li className={isActive("/products/add-brand", location.pathname) ? "active" : ""}>
                      <Link to="/products/add-brand">
                        <span className="submenu_icon">
                          <i className="fi fi-tr-brand-badge"></i>
                        </span>
                        <span className="submenu_text">Brand</span>
                      </Link>
                    </li>
                    <li className={isActive("/products/add-categorey", location.pathname) ? "active" : ""}>
                      <Link to="/products/add-categorey">
                        <span className="submenu_icon">
                          <i className="fi fi-tr-brand"></i>
                        </span>
                        <span className="submenu_text">Category</span>
                      </Link>
                    </li>
                    <li className={isActive("/products/add-quantity", location.pathname) ? "active" : ""}>
                      <Link to="/products/add-quantity">
                        <span className="submenu_icon">
                          <i className="fi fi-tr-supplier-alt"></i>
                        </span>
                        <span className="submenu_text">Quantity</span>
                      </Link>
                    </li>
                  </ul>
                )}
              </li>

              {/* ACCOUNTS */}
              <li
                className={`sidebar_menu pd-l15 ${
                  isAnyActive(["/accounts/pending-list", "/accounts/stock-maintanence", "/accounts/current-stock"], location.pathname) ? "active" : ""
                }`}>
                <div className="menu_header" onClick={() => setOpenSub(openSub === "accounts" ? null : "accounts")}>
                  <span className="sidebar_icon">
                    <i className="fi fi-tr-calculator-bill"></i>
                  </span>
                  <span className="sidebar_text">Accounts</span>
                  <i className="fi fi-tr-angle-small-down arrow"></i>
                </div>

                {openSub === "accounts" && (
                  <ul className="submenu submenu_list pd-l25">
                    {/* Pending List */}
                    <li className={isActive("/accounts/pending-list", location.pathname) ? "active" : ""}>
                      <Link to="/accounts/pending-list">
                        <span className="submenu_icon">
                          <i className="fi fi-tr-pending"></i>
                        </span>
                        <span className="submenu_text">Pending List</span>
                      </Link>
                    </li>

                    {/* Stock Maintenance */}
                    <li className={isAnyActive(["/accounts/stock-maintanence"], location.pathname) ? "active" : ""}>
                      <Link to="/accounts/stock-maintanence">
                        <span className="submenu_icon">
                          <i className="fi fi-tr-shopping-cart"></i>
                        </span>
                        <span className="submenu_text">Stock Maintenance</span>
                      </Link>
                    </li>

                    {/* ✅ Current Stock */}
                
                      <li className={isActive("/accounts/current-stock", location.pathname) ? "active" : ""}>
                        <Link to="/accounts/current-stock">
                          <span className="submenu_icon">
                            <i className="fi fi-tr-box-open"></i>
                          </span>
                          <span className="submenu_text">Current Stock</span>
                        </Link>
                      </li>
                  </ul>
                )}
              </li>

              {/* Customers */}

              <li className={`sidebar_menu ${isActive("/customers", location.pathname) ? "active" : ""}`}>
                <Link to="/customers" className="menu_header">
                  <span className="sidebar_icon">
                    <i className="fi fi-tr-user-bag"></i>
                  </span>
                  <span className="sidebar_text">Customers</span>
                </Link>
              </li>

              {/* Vendors */}

              <li className={`sidebar_menu ${isActive("/vendors", location.pathname) ? "active" : ""}`}>
                <Link to="/vendors" className="menu_header">
                  <span className="sidebar_icon">
                    <i className="fi fi-tr-seller"></i>
                  </span>
                  <span className="sidebar_text">Vendors</span>
                </Link>
              </li>

              {/* REPORT */}
              <li className={`sidebar_menu pd-l15 ${isAnyActive(["/report"], location.pathname) ? "active" : ""}`}>
                <div className="menu_header" onClick={() => setOpenSub(openSub === "report" ? null : "report")}>
                  <span className="sidebar_icon">
                    <i className="fi fi-tr-file-spreadsheet"></i>
                  </span>
                  <span className="sidebar_text">Report</span>
                  <i className="fi fi-tr-angle-small-down arrow"></i>
                </div>

                {openSub === "report" && (
                  <ul className="submenu submenu_list pd-l25">
                    <li className={isActive("/report/customer-billing-report", location.pathname) ? "active" : ""}>
                      <Link to="/report/customer-billing-report">
                        <span className="sumenu_icon">
                          <i className="fi fi-tr-users"></i>
                        </span>
                        <span className="submneu_text">Customer Billing Reports</span>
                      </Link>
                    </li>
                    <li className={isActive("/report/product-wise-report", location.pathname) ? "active" : ""}>
                      <Link to="/report/product-wise-report">
                        <span className="submenu_icon">
                          <i className="fi fi-tr-box-open"></i>
                        </span>
                        <span className="submenu_text">Product Wise Report</span>
                      </Link>
                    </li>
                    <li className={isActive("/report/daily-sales-report", location.pathname) ? "active" : ""}>
                      <Link to="/report/daily-sales-report">
                        <span className="submenu_icon">
                          <i className="fi fi-tr-daily-calendar"></i>
                        </span>
                        <span className="submenu_text">Daliy Sales Report</span>
                      </Link>
                    </li>
                  </ul>
                )}
              </li>
            </ul>
          )}
        </li>
      </ul>

      {/* ================= FOOTER ================= */}
      <div className="sidebar_footer">
        <button type="button" className="footer_item" onClick={handleLogout}>
          <span className="sidebar_icon">
            <i className="fi fi-tr-sign-out-alt"></i>
          </span>
          <span className="sidebar_text">Logout</span>
        </button>
      </div>
    </aside>
  );
};
