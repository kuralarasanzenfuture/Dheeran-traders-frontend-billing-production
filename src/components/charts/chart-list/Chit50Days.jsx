import Chart from "react-apexcharts";

const Chit50Days = () => {
  const chart = {
    series: [
      { name: "Single Payment", data: [22500, 45000, 90000] },
      { name: "Highest Gross", data: [25000, 50000, 100000] },
    ],
    options: {
      chart: { type: "bar", height: 350 },
      plotOptions: { bar: { borderRadius: 0, columnWidth: "75%" } },
      colors: ["#d4483b", "#a52a2a"],
      xaxis: { categories: ["Plan A", "Plan B", "Plan C"] },
    },
  };

  return (
    <div>
      <h6>50 Days – Single Payment</h6>
        <Chart options={chart.options} series={chart.series} type="bar" height={300} />
    </div>
  );
};

export default Chit50Days;
