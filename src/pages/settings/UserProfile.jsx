import React, { useEffect, useState } from "react";
import userImg from "../../assets/images/man.png";
import { getProfile } from "../../services/user.service";

export const UserProfile = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await getProfile();
        setUser(res.data);
      } catch (err) {
        console.error("Failed to load profile");
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  if (loading) return <p className="text-center">Loading profile...</p>;
  if (!user) return <p className="text-center text-danger">Profile not found</p>;

  return (
    <div className="user-profile">
      <div className="row gy-4 align-items-center">
        {/* LEFT: DEFAULT IMAGE */}
        <div className="col-md-3 text-center">
          <img
            src={userImg}
            alt="User Avatar"
            className="img-circle"
            style={{ width: "90px" }}
          />
        </div>

        {/* RIGHT: USER INFO */}
        <div className="col-md-9 personal-info">
          <h5 className="mb-4">Personal Info</h5>

          {/* USERNAME */}
          <div className="form-group row mb-3 align-items-center">
            <label className="col-md-3 form-label">Username</label>
            <div className="col-md-9">
              <input
                type="text"
                className="form-control"
                value={user.username || ""}
                readOnly
              />
            </div>
          </div>

          {/* EMAIL */}
          <div className="form-group row mb-3 align-items-center">
            <label className="col-md-3 form-label">Email</label>
            <div className="col-md-9">
              <input
                type="email"
                className="form-control"
                value={user.email || ""}
                readOnly
              />
            </div>
          </div>

          {/* PASSWORD */}
          <div className="form-group row align-items-center">
            <label className="col-md-3 form-label">Password</label>
            <div className="col-md-9">
              <input
                type="password"
                className="form-control"
                value="********"
                readOnly
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
