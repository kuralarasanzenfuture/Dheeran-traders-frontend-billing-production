import { useEffect, useState } from "react";
import { getCustomers } from "../../services/customer.service";
import { Chart } from "../charts/Chart";
import { StackCard } from "../stackcards/StackCard";
import { CustomerTable } from "../tables/CustomerTable";
import "./dashboard.css";

// export const Dashboard = () => {
//   const [customers, setCustomers] = useState([]);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     const fetchCustomers = async () => {
//       try {
//         const data = await getCustomers();
//         setCustomers(Array.isArray(data) ? data : []);
//       } catch (err) {
//         console.error("Failed to load customers");
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchCustomers();
//   }, []);

//   return (
//     <>
//       <StackCard />
//       <Chart />

//       {/* ✅ NOW TABLE WILL SHOW */}
//       <CustomerTable
//         customers={customers}
//         loading={loading}
//         showActions={false}
//       />
//     </>
//   );
// };
export const Dashboard = () => {
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCustomers = async () => {
      try {
        const data = await getCustomers();
        setCustomers(Array.isArray(data) ? data : []);
      } finally {
        setLoading(false);
      }
    };
    fetchCustomers();
  }, []);

  const pendingCustomers = customers.filter((c) => Number(c.pending_amount) > 0);

  return (
    <>
      <StackCard />
      <Chart />

      {/* ✅ ONLY PENDING CUSTOMERS */}
      <CustomerTable customers={pendingCustomers} loading={loading} showActions={false} />
    </>
  );
};
