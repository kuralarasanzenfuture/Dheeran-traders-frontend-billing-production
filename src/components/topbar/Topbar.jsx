import "./topbar.css";
import userImg from "../../assets/images/man.png";
import { Link } from "react-router-dom";
import { logout } from "../../services/auth.service";

export const Topbar = () => {
  const toggleSidebar = () => {
    window.dispatchEvent(new Event("toggle-sidebar"));
  };

  // ✅ SAFE PARSE (THIS FIXES YOUR ERROR)
  let user = null;
  try {
    const storedUser = localStorage.getItem("user");
    user = storedUser ? JSON.parse(storedUser) : null;
  } catch (e) {
    user = null;
  }
  const handleLogout = () => {
    logout(); // 🔥 already clears storage + redirects
  };

  return (
    <div className="topbar">
      <div className="topbar-left d-flex gap-lg-5 gap-2 align-items-center">
        <button className="main-btn mobile_only" onClick={toggleSidebar}>
          <i className="bi bi-list"></i>
        </button>

        <p className="welcome-text">
          👋 Welcome back,
          <span className="d-md-inline-block d-none"> {user?.username || "Admin"} — manage your billing & reports efficiently!</span>
        </p>
      </div>

      <div className="topbar-right">
        <div className="topbar-icons">
          {/* <Link to="/notifications" className="icon-wrapper">
              <i className="bi bi-bell topbar-icon"></i>
              <span className="notification-badge">3</span>
            </Link> */}

          <div className="profile-section dropdown">
            <Link className="dropdown-toggle" data-bs-toggle="dropdown">
              <img src={userImg} alt="Profile" className="profile-pic" />
            </Link>

            <ul className="dropdown-menu">
              <li>
                <Link to="/settings/edit-profile" className="dropdown-item">
                  <i className="fi fi-tr-customize"></i>&nbsp;Settings
                </Link>
              </li>
              <li>
                <button type="button" className="dropdown-item " onClick={handleLogout}>
                  <i className="fi fi-tr-sign-out-alt"></i>&nbsp;Logout
                </button>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};
