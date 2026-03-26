import { useEffect, useState } from "react";
import "./stackcard.css";

import { getAllCustomerBillings } from "../../services/customerBilling.service";
import { getVendors } from "../../services/vendor.service";
import { getCustomers } from "../../services/customer.service";

export const StackCard = () => {
  const [stats, setStats] = useState({
    totalIncome: 0,
    monthlyIncome: 0,
    vendors: 0,
    customers: 0,
  });

  useEffect(() => {
    const loadStats = async () => {
      try {
        const [billings, vendors, customers] = await Promise.all([
          getAllCustomerBillings(),
          getVendors(),
          getCustomers(),
        ]);

        // TOTAL INCOME
        const totalIncome = billings.reduce(
          (sum, b) => sum + Number(b.grand_total || 0),
          0
        );

        // MONTHLY INCOME
        const currentMonth = new Date().getMonth();
        const currentYear = new Date().getFullYear();

        const monthlyIncome = billings
          .filter((b) => {
            const d = new Date(b.created_at);
            return (
              d.getMonth() === currentMonth &&
              d.getFullYear() === currentYear
            );
          })
          .reduce((sum, b) => sum + Number(b.grand_total || 0), 0);

        setStats({
          totalIncome,
          monthlyIncome,
          vendors: vendors.length,
          customers: customers.length,
        });
      } catch (err) {
        console.error("Dashboard stats load failed", err);
      }
    };

    loadStats();
  }, []);

  const stackData = [
    {
      id: 1,
      title: "Total Income",
      count: `₹${stats.totalIncome.toLocaleString("en-IN")}`,
      icon: "fi fi-tr-coins",
    },
    {
      id: 2,
      title: "Monthly Income",
      count: `₹${stats.monthlyIncome.toLocaleString("en-IN")}`,
      icon: "fi fi-tr-send-money",
    },
    {
      id: 3,
      title: "Total Vendors",
      count: stats.vendors,
      icon: "fi fi-tr-seller",
    },
    {
      id: 4,
      title: "Total Customers",
      count: stats.customers,
      icon: "fi fi-tr-user-bag",
    },
  ];

  return (
    <div className="stack_details">
      <div className="row gy-4">
        {stackData.map((item) => (
          <div className="col-lg-3 col-md-6 col-12" key={item.id}>
            <div className="stack_card">
              <div className="d-flex justify-content-between gap-2">
                <div className="content">
                  <p className="stack_text">{item.title}</p>
                  <h5 className="stack_title">{item.count}</h5>
                </div>
                <div className="icon">
                  <i className={item.icon}></i>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
