import React from "react";

const notifications = [
  {
    id: 1,
    title: "New Order Received",
    message: "Order #INV-1023 has been placed successfully.",
    time: "2 minutes ago",
    type: "success",
    unread: true,
  },
  {
    id: 2,
    title: "Payment Pending",
    message: "Customer payment is still pending for invoice #INV-1019.",
    time: "1 hour ago",
    type: "warning",
    unread: true,
  },
  {
    id: 3,
    title: "Monthly Report Ready",
    message: "Your monthly sales report is ready to download.",
    time: "Yesterday",
    type: "info",
    unread: false,
  },
  {
    id: 4,
    title: "Password Changed",
    message: "Your account password was updated successfully.",
    time: "2 days ago",
    type: "primary",
    unread: false,
  },
];

export const Notifications = () => {
  return (
    <div className="notify-box mt-4">
      <div className=" notification-card">
        {/* HEADER */}
        <div className="card-header d-flex justify-content-between align-items-center">
          <h5 className="mb-0">
            <i className="bi bi-bell-fill me-2"></i>
            Notifications
          </h5>
          <button className="btn btn-sm main-btn">Mark all as read</button>
        </div>

        {/* LIST */}
        <ul className="ps-0">
          {notifications.map((item) => (
            <li key={item.id} className={`list-group-item notification-item ${item.unread ? "unread" : ""}`}>
              <div className="d-flex">
                {/* ICON */}
                <div className={`notify-icon bg-${item.type}`}>
                  <i className="bi bi-info-circle-fill"></i>
                </div>

                {/* CONTENT */}
                <div className="ms-3 flex-grow-1">
                  <div className="d-flex justify-content-between">
                    <h6 className="mb-1">{item.title}</h6>
                    <small className="text-muted">{item.time}</small>
                  </div>
                  <p className="mb-0 text-muted">{item.message}</p>
                </div>
              </div>
            </li>
          ))}
        </ul>

        {/* FOOTER */}
        <div className="card-footer text-center">
          <button className="btn filter-btn">View All Notifications</button>
        </div>
      </div>
    </div>
  );
};
