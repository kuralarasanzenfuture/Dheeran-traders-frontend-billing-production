import "./chart.css";
import Chit50Days from "./chart-list/Chit50Days";
import Chit90Days from "./chart-list/Chit90Days";

export const ChitChart = () => {
  return (
    <>
      <div className="chart_list">
        <div className="row gy-4">
          <div className="col-lg-6">
            <div className="chart_box">
              <Chit50Days />
            </div>
          </div>
          <div className="col-lg-6">
            <div className="chart_box">
              <Chit90Days />
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
