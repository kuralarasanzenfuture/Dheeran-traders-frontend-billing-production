import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { ProtectedRoute } from "./routes/ProtectedRoute";
import EmployeePage from "./pages/billing/employee/EmployeePage";

import { Dashboard } from "./components/dashboard/Dashboard";
import { Topbar } from "./components/topbar/Topbar";
import { Sidebar } from "./components/sidebar/Sidebar";
import { Login } from "./pages/Login";
import { Invoice } from "./components/invoice/Invoice";

import { ProductLayout } from "./pages/billing/product/ProductLayout";
import { AddProduct } from "./pages/billing/product/AddProduct";
import { AddBrand } from "./pages/billing/product/AddBrand";
import { AddCategorey } from "./pages/billing/product/AddCategorey";
import { AddQuantity } from "./pages/billing/product/AddQuantity";

import { AccountsLayout } from "./pages/billing/accounts/AccountsLayout";
import { ProductList } from "./pages/billing/product/ProductList";
import { StockMaintanence } from "./pages/billing/accounts/stocks/StockMaintanence";
import { AddStock } from "./pages/billing/accounts/stocks/AddStock";
import { StockList } from "./pages/billing/accounts/stocks/StockList";
import { PendingPaymentList } from "./pages/billing/accounts/PendingPaymentList";
import Currentstock from "./pages/billing/accounts/stocks/Currentstock";

import { Vendors } from "./pages/billing/vendors/Vendors";
import { Customers } from "./pages/billing/customers/Customers";
import { AddCustomers } from "./pages/billing/customers/AddCustomers";
import { AddVendors } from "./pages/billing/vendors/AddVendors";
import { CustomerList } from "./pages/billing/customers/CustomerList";
import { VendorList } from "./pages/billing/vendors/VendorList";
import { CustomerDetail } from "./pages/billing/customers/CustomerDetail";

import { ReportLayout } from "./pages/billing/reports/ReportLayout";

import { Notifications } from "./pages/Notifications";
import { Footer } from "./components/footer/Footer";
import Modal from "react-modal";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { ProductBilling } from "./pages/billing/product-billing/ProductBilling";

import { Settings } from "./pages/settings/Settings";
import { UserProfile } from "./pages/settings/UserProfile";
import { BankDetails } from "./pages/settings/BankDetails";
import { BankDetailsList } from "./pages/settings/BankDetailsList";
import { AddBankDetails } from "./pages/settings/AddBankDetails";
import { AddPayment } from "./pages/billing/accounts/AddPayment";
import CompanyDetails from "./pages/settings/CompanyDetails";
import CreateProfile from "./pages/settings/CreateProfile";
import { CustomerBillingReport } from "./pages/billing/reports/CustomerBillingReport";
import { ProductWiseReport } from "./pages/billing/reports/ProductWiseReport";
import { DailySalesReport } from "./pages/billing/reports/DailySalesReport";
Modal.setAppElement("#root");

/* ======================
   DASHBOARD LAYOUT
====================== */

const DashboardLayout = () => (
  <>
    <Sidebar />
    <div className="dashboard_main">
      <Topbar />
      <div className="dashboard_container">
        <Routes>
          <Route path="/product-billing/:id" element={<ProductBilling />} />
          <Route path="/product-billing" element={<ProductBilling />} />
          <Route path="billing" element={<ProductBilling />} />
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="products" element={<ProductLayout />}>
            {/* ADD PRODUCT PAGE */}
            <Route path="add-product" element={<ProductList />} />

            
           

            {/* OPTIONAL (KEEP IF YOU NEED THEM LATER) */}
            <Route path="add-brand" element={<AddBrand />} />
            <Route path="add-categorey" element={<AddCategorey />} />
            <Route path="add-quantity" element={<AddQuantity />} />
          </Route>
          <Route path="customers" element={<Customers />}>
            <Route index element={<CustomerList />} />
            <Route path="add-customers" element={<AddCustomers />} />
            <Route path="customers-detail" element={<CustomerDetail />} />
          </Route>
          <Route path="vendors" element={<Vendors />}>
            <Route index element={<VendorList />} />
            <Route path="add-vendors" element={<AddVendors />} />
          </Route>
          <Route path="/accounts" element={<AccountsLayout />}>
            <Route path="pending-list" element={<PendingPaymentList />} />
            <Route path="add-payment/:id" element={<AddPayment />} />

            <Route path="stock-maintanence" element={<StockMaintanence />}>
              <Route index element={<StockList />} />
              <Route path="add-stock" element={<AddStock />} />
            </Route>

            {/* ✅ Current Stock – single page */}
            <Route path="current-stock" element={<Currentstock />} />
          </Route>

          <Route path="report" element={<ReportLayout />}>
            <Route path="customer-billing-report" element={<CustomerBillingReport />} />
            <Route path="product-wise-report" element={<ProductWiseReport />} />
            <Route path="daily-sales-report" element={<DailySalesReport />} />
          </Route>

          <Route path="/employees" element={<EmployeePage />} />

          <Route path="/settings" element={<Settings />}>
            <Route index element={<UserProfile />} />
            <Route path="edit-profile" element={<UserProfile />} />
            <Route path="bank-details" element={<BankDetails />}>
              <Route index element={<BankDetailsList />} />
              <Route path="add-bank" element={<AddBankDetails />} />
              <Route path="edit-bank/:id" element={<AddBankDetails />} />
            </Route>
            <Route path="create-profile" element={<CreateProfile />} />

            <Route path="company-details" element={<CompanyDetails />} />
          </Route>
          <Route path="notifications" element={<Notifications />} />
          <Route path="invoice/print/:id" element={<Invoice />} />
        </Routes>
      </div>
      <Footer />
    </div>
    <ToastContainer position="top-right" autoClose={3000} hideProgressBar={false} newestOnTop closeOnClick pauseOnHover theme="light" />
  </>
);

/* ======================
   APP
====================== */
function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* DEFAULT */}
        <Route path="/" element={<Navigate to="/login" replace />} />

        {/* LOGIN */}
        <Route path="/login" element={<Login />} />

        {/* PROTECTED DASHBOARD (includes billing) */}
        <Route
          path="/*"
          element={
            <ProtectedRoute>
              <DashboardLayout />
            </ProtectedRoute>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
