import { useEffect, useState } from "react";
import Chart from "react-apexcharts";
import { getProducts } from "../../../services/product.service";

const OverallCurrentStock = () => {
  const [series, setSeries] = useState([]);
  const [labels, setLabels] = useState([]);

  // useEffect(() => {
  //   const loadOverallStock = async () => {
  //     const products = await getProducts();

  //   const stockData = (products || [])
  // .map((p) => {
  //   const category =
  //     p.product_category ||
  //     p.category_name ||
  //     p.category?.name ||
  //     p.category ||
  //     "Uncategorized";

  //   return {
  //     label: `${p.product_name || p.name} (${category})`,
  //     qty: Number(p.stock ?? p.current_stock ?? p.available_qty ?? 0),
  //   };
  // })
  // .filter((p) => p.qty > 0);


  //     setLabels(stockData.map((p) => p.label));
  //     setSeries(stockData.map((p) => p.qty));
  //   };

  //   loadOverallStock();
  // }, []);
useEffect(() => {
  const loadOverallStock = async () => {
    const products = await getProducts();

    const stockData = (products || [])
      .map((p) => {
        const category =
          p.product_category ||
          p.category_name ||
          p.category?.name ||
          p.category ||
          "Uncategorized";

        return {
          label: `${p.product_name || p.name} (${category})`,
          qty: Number(p.stock ?? p.current_stock ?? p.available_qty ?? 0),
        };
      })
      .filter((p) => p.qty > 0)
      .sort((a, b) => b.qty - a.qty)   // 🔹 sort by highest stock
      .slice(0, 12);                   // 🔹 show only first 12 items

    setLabels(stockData.map((p) => p.label));
    setSeries(stockData.map((p) => p.qty));
  };

  loadOverallStock();
}, []);

  const hasData = labels.length > 0;

  const options = {
    chart: { type: "pie" },
    labels: hasData ? labels : ["No Data"],
    colors: hasData
      ? ["#68ceed", "#ffd864", "#56ffb1", "#ff7a7a", "#b084ff"]
      : ["#e0e0e0"],
    title: {
      text: "Overall Current Stock",
      align: "center",
    },
   legend: {
    show: false,   // 🔥 THIS REMOVES BOTTOM LINE
  } ,
    tooltip: {
      y: {
        formatter: (val) => `${val} qty`,
      },
    },
  };

  return (
    <Chart
      options={options}
      series={hasData ? series : [1]}
      type="pie"
      height={320}
    />
  );
};

export default OverallCurrentStock;
