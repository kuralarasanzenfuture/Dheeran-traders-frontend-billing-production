import { Link } from "react-router-dom";
import "./footer.css";

export const Footer = () => {
  return (
    <>
      <div className="footer">
        <p>
          Copyright © 2025 Dheeran Traders. All rights reserved. Designed by{" "}
          <Link to="https://www.zenfuture.in/" target="_blank" style={{ color: "rgba(143, 12, 0, 1)" }}>ZenFuture</Link>
        </p>
      </div>
    </>
  );
};
