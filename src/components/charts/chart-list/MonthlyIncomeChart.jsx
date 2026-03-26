import { useEffect, useState } from "react";
import Chart from "react-apexcharts";
import { getAllCustomerBillings } from "../../../services/customerBilling.service";

const MonthlyIncomeChart = () => {
  const [monthlyData, setMonthlyData] = useState(Array(12).fill(0));

  useEffect(() => {
    const loadMonthlyIncome = async () => {
      try {
        const billings = await getAllCustomerBillings();

        // init 12 months
        const incomeByMonth = Array(12).fill(0);

        billings.forEach((b) => {
          if (!b.created_at) return;

          const date = new Date(b.created_at);
          const month = date.getMonth(); // 0 - Jan, 11 - Dec

          incomeByMonth[month] += Number(b.grand_total || 0);
        });

        setMonthlyData(incomeByMonth);
      } catch (err) {
        console.error("Monthly income load failed", err);
      }
    };

    loadMonthlyIncome();
  }, []);

  const series = [
    {
      name: "Income",
      data: monthlyData,
    },
  ];

  const options = {
    chart: {
      type: "area",
      toolbar: { show: false },
      zoom: { enabled: false },
    },
    dataLabels: { enabled: false },
    stroke: {
      curve: "smooth",
      width: 3,
    },
    xaxis: {
      categories: [
        "Jan", "Feb", "Mar", "Apr", "May", "Jun",
        "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
      ],
    },
    yaxis: {
      labels: {
        formatter: (val) => `₹${val.toLocaleString("en-IN")}`,
      },
    },
    tooltip: {
      y: {
        formatter: (val) => `₹${val.toLocaleString("en-IN")}`,
      },
    },
    colors: ["#d4483b"],
    fill: {
      type: "gradient",
      gradient: {
        shadeIntensity: 1,
        opacityFrom: 0.4,
        opacityTo: 0.1,
        stops: [0, 90, 100],
      },
    },
  };

  return (
    <div>
      <h6 className="mb-3 fw-semibold text-dark">
        Monthly Income
      </h6>

      <Chart
        options={options}
        series={series}
        type="area"
        height={320}
      />
    </div>
  );
};

export default MonthlyIncomeChart;
