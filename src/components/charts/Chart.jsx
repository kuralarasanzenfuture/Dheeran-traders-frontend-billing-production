import MonthlyIncomeChart from "./chart-list/MonthlyIncomeChart";
import TotalStockColumnChart from "./chart-list/TotalStockChart";
import LowStockChart from "./chart-list/LowStockChart";
import './chart.css'
import OverallCurrentStock from "./chart-list/OverallCurrentStock";

export const Chart = () => {
  return (
    <>
      <div className="chart_list">
        <div className="row gy-4">
          <div className="col-lg-6">
            <div className="chart_box">
              <MonthlyIncomeChart />
            </div>
          </div>
          <div className="col-lg-6">
            <div className="chart_box">
              <TotalStockColumnChart />
            </div>
          </div>
           <div className="col-lg-6">
            <div className="chart_box">
              <OverallCurrentStock/>
            </div>
          </div> <div className="col-lg-6">
            <div className="chart_box">
            <LowStockChart/>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
