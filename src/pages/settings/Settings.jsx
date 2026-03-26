import { NavLink, Outlet } from "react-router-dom";
import "./settings.css";

export const Settings = () => {
  const loggedInUser = JSON.parse(localStorage.getItem("user"));

  const isAdmin = loggedInUser?.role === "admin";

  return (
    <div className="settings-container">
      <h3>Settings</h3>

      <div className="settings-tabs mt-4">
        <NavLink to="edit-profile">Profile</NavLink>

        <NavLink to="bank-details">Bank Details</NavLink>

        {isAdmin && (
          <NavLink to="create-profile">Create Profile</NavLink>
        )}

        {isAdmin && (
          <NavLink to="company-details">Create Company Details</NavLink>
        )}
      </div>

      <div className="settings-content">
        <Outlet />
      </div>
    </div>
  );
};
