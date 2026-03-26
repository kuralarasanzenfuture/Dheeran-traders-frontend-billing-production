import Chart from "react-apexcharts";

const Chit90Days = () => {
  const chart = {
    series: [
      {
        name: "Highest Gross",
        data: [6250, 12500, 25000, 50000, 100000],
      },
    ],
    options: {
      chart: { type: "line", height: 350 },
      stroke: { curve: "smooth", width: 3 },
      colors: ["#a52a2a"],
      xaxis: { categories: ["5K", "10K", "20K", "40K", "80K"] },
    },
  };

  return (
    <div>
      <h5>90 Days - Single Payment</h5>
      <Chart options={chart.options} series={chart.series} type="line" height={300} />
    </div>
  );
};

export default Chit90Days;
