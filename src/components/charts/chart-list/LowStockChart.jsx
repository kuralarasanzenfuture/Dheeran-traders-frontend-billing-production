import { useEffect, useState } from "react";
import Chart from "react-apexcharts";
import { getProducts } from "../../../services/product.service";

const LowStockChart = () => {
  const [labels, setLabels] = useState([]);
  const [series, setSeries] = useState([]);

  const LOW_STOCK_LIMIT = 10;

  useEffect(() => {
    const loadLowStock = async () => {
      try {
        const products = await getProducts();

        const lowStockProducts = (products || [])
          .map((p) => {
            const qty =
              p.stock ??
              p.current_stock ??
              p.available_qty ??
              p.quantity ??
              0;

            return {
              name: p.product_name || p.name || "Unknown",
              qty: Number(qty),
            };
          })
          .filter((p) => p.qty > 0 && p.qty <= LOW_STOCK_LIMIT);

        console.log("⚠️ LOW STOCK:", lowStockProducts);

        setLabels(lowStockProducts.map((p) => p.name));
        setSeries(lowStockProducts.map((p) => p.qty));
      } catch (err) {
        console.error("Low stock load failed", err);
        setLabels([]);
        setSeries([]);
      }
    };

    loadLowStock();
  }, []);

  const hasData = labels.length > 0;

  const finalLabels = hasData ? labels : ["No Low Stock"];
  const finalSeries = hasData ? series : [0];

  const options = {
    chart: {
      toolbar: { show: false },
    },
    plotOptions: {
      bar: {
        horizontal: true,
        borderRadius: 4,
      },
    },
    xaxis: {
      categories: finalLabels,
    },
    colors: hasData ? ["#d4483b"] : ["#e0e0e0"],
    title: {
      text: "Low Stock Comparison",
      align: "center",
    },
    tooltip: {
      enabled: hasData,
    },
  };

  return (
    <Chart
      type="bar"
      height={320}
      series={[
        {
          name: "Stock Quantity",
          data: finalSeries,
        },
      ]}
      options={options}
    />
  );
};

export default LowStockChart;
