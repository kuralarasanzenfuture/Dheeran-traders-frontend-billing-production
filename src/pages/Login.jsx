// import React, { useState ,useEffect} from "react";
// import { useNavigate } from "react-router-dom";
// import Logo from "../assets/images/logo.png";
// import LoginImg from "../assets/images/login.png";
// import { loginUser } from "../services/auth.service";

// export const Login = () => {
//   const navigate = useNavigate();

//   const [username, setUsername] = useState("");
//   const [password, setPassword] = useState("");
//   const [error, setError] = useState("");
//   const [loading, setLoading] = useState(false);

//   useEffect(() => {
//   const token = localStorage.getItem("token");
//   if (token) {
//     navigate("/billing");
//   }
// }, [navigate]);

//   const handleLogin = async (e) => {
//     e.preventDefault();
//     setError("");
//     setLoading(true);

//     try {
//       const data = await loginUser(username, password);

//       // ✅ Save auth data
//       localStorage.setItem("token", data.token);
//       localStorage.setItem("user", JSON.stringify(data.user));

//       // ✅ Redirect after login
//       navigate("/billing");
//     } catch (err) {
//       setError(err.response?.data?.message || "Login failed");
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="login_detail">
//       <div className="row gx-0 gy-4 justify-content-center align-items-center min-vh-100">

//         {/* LEFT IMAGE SECTION */}
//         <div className="col-lg-7 d-none d-lg-block">
//           <div className="login_img text-center">
//             <h4 className="title mb-4">
//               Welcome to <br /> Billing System
//             </h4>
//             <img src={LoginImg} alt="Login" className="img-fluid" />
//           </div>
//         </div>

//         {/* RIGHT LOGIN FORM */}
//         <div className="col-lg-5">
//           <div className="login_left">
//             <div className="login-box p-4 shadow">

//               <div className="header_logo text-center mb-4">
//                 <img src={Logo} alt="Logo" height="60" />
//               </div>

//               <h5 className="login_title text-center mb-3">
//                 Sign in to your account
//               </h5>

//               {error && (
//                 <div className="alert alert-danger text-center">
//                   {error}
//                 </div>
//               )}

//               <form onSubmit={handleLogin}>

//                 <div className="form-group mb-3">
//                   <label className="form-label">
//                     Email or Username
//                   </label>
//                   <input
//                     type="text"
//                     className="form-control"
//                     placeholder="Enter email or username"
//                     value={username}
//                     onChange={(e) => setUsername(e.target.value)}
//                     required
//                   />
//                 </div>

//                 <div className="form-group mb-4">
//                   <label className="form-label">
//                     Password
//                   </label>
//                   <input
//                     type="password"
//                     className="form-control"
//                     placeholder="Enter password"
//                     value={password}
//                     onChange={(e) => setPassword(e.target.value)}
//                     required
//                   />
//                 </div>

//                 <button
//                   type="submit"
//                   className="btn main-btn w-100"
//                   disabled={loading}
//                 >
//                   {loading ? "Logging in..." : "Login"}
//                 </button>

//               </form>

//             </div>
//           </div>
//         </div>

//       </div>
//     </div>
//   );
// };
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Logo from "../assets/images/logo.png";
import LoginImg from "../assets/images/login.png";
import { loginUser } from "../services/auth.service";

export const Login = () => {
  const navigate = useNavigate();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      navigate("/billing");
    }
  }, [navigate]);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const data = await loginUser(username, password);

      // ✅ Save auth data
      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));

      // ✅ Redirect after login
      navigate("/billing");
    } catch (err) {
      setError(err.response?.data?.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login_detail">
      <div className="row gx-0 gy-4 justify-content-center align-items-center min-vh-100">
        {/* LEFT IMAGE SECTION */}
        <div className="col-lg-7 d-none d-lg-block">
          <div className="login_img text-center">
            <h4 className="title mb-4">
              Welcome to <br /> Billing System
            </h4>
          </div>
        </div>

        {/* RIGHT LOGIN FORM */}
        <div className="col-lg-5">
          <div className="login_left">
            <div className="login-box p-4 shadow">
              <div className="header_logo text-center mb-4">
                <img src={Logo} alt="Logo" />
              </div>

              <h5 className="login_title text-center mb-3">Sign in to your account</h5>

              {error && <div className="alert alert-danger text-center">{error}</div>}

              <form onSubmit={handleLogin}>
                <div className="form-group mb-3">
                  <label className="form-label">Email or Username</label>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Enter email or username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    required
                  />
                </div>

                <div className="form-group mb-4">
                  <label className="form-label">Password</label>
                  <input
                    type="password"
                    className="form-control"
                    placeholder="Enter password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                </div>

                <button type="submit" className="btn main-btn w-100" disabled={loading}>
                  {loading ? "Logging in..." : "Login"}
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
