import { useEffect, useState } from "react";
import Chart from "react-apexcharts";
import { getBrandWiseReport } from "../../../services/customerBilling.service";

const TotalStockColumnChart = () => {
  const [chartData, setChartData] = useState([]);

  // useEffect(() => {
  //   const loadBrands = async () => {
  //     try {
  //       const data = await getBrandWiseReport();
  //       setChartData(Array.isArray(data) ? data : []);
  //     } catch (err) {
  //       console.error("Brand report load failed", err);
  //       setChartData([]); // 🔒 NEVER undefined
  //     }
  //   };

  //   loadBrands();
  // }, []);
useEffect(() => {
  const loadBrands = async () => {
    try {
      const data = await getBrandWiseReport();

      if (Array.isArray(data)) {
        // 🔥 Sort by qty DESC and take Top 5
        const topFive = data
          .sort((a, b) => (Number(b.qty) || 0) - (Number(a.qty) || 0))
          .slice(0, 5);

        setChartData(topFive);
      } else {
        setChartData([]);
      }
    } catch (err) {
      console.error("Brand report load failed", err);
      setChartData([]);
    }
  };

  loadBrands();
}, []);
  const hasData = Array.isArray(chartData) && chartData.length > 0;

  const categories = hasData
  ? chartData.map((b) => {
      const name = b.brand ?? "Unknown";
      return name.length > 8 ? name.substring(0, 8) + "..." : name;
    })
  : ["No Sales"];
  const series = [
    {
      name: "Stock",
      data: hasData ? chartData.map((b) => Number(b.qty) || 0) : [0],
    },
  ];

  const options = {
    chart: {
      type: "bar",
      toolbar: { show: false },
    },
    plotOptions: {
      bar: {
        columnWidth: "45%",
        borderRadius: 6,
      },
    },
    colors: hasData ? ["rgba(143, 12, 0, 1)"] : ["#e0e0e0"],
    dataLabels: { enabled: false },
   xaxis: {
  categories,
  labels: {
    rotate: 0,
    trim: false,
    style: {
      fontSize: "12px",
    },
  },
},
    yaxis: {
      title: { text: "Selling Quantity" },
    },
   tooltip: {
  enabled: hasData,
  x: {
    formatter: function (val, { dataPointIndex }) {
      return chartData[dataPointIndex]?.brand || val;
    },
  },
  y: {
    formatter: (val) => `${val} qty`,
  },
},
  };

  return (
    <div>
      <h6 className="mb-3 fw-semibold text-dark">Highest Selling Brands</h6>

      {/* 🔒 EXTRA SAFETY */}
      {Array.isArray(series[0].data) && <Chart options={options} series={series} type="bar" height={320} />}
    </div>
  );
};

export default TotalStockColumnChart;
