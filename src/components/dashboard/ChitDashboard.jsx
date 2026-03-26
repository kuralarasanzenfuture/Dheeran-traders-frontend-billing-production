import { ChitStack } from "../stackcards/ChitStack";
import { ChitChart } from "../charts/ChitChart";


export const ChitDashboard = () => {
  return (
    <div className="container-fluid">
      {/* ================= STAT CARDS ================= */}

      <ChitStack />

      {/* ================= CHARTS ================= */}
      <div className="row g-3 mb-4">
        {/* BAR CHART */}

        <div className="col-lg-12">
          <ChitChart />
        </div>
      </div>

      {/* ================= TABLES ================= */}

      {/* RECENT COLLECTIONS */}
      <h6 className="fw-bold mb-3">Recent Collections</h6>
      <div className="common-table-wrapper mb-4">
        <table className="common-table table-striped">
          <thead>
            <tr>
              <th>Member</th>
              <th>Group</th>
              <th>Amount</th>
              <th>Date</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>Ramesh</td>
              <td>Group A</td>
              <td>₹ 10,000</td>
              <td>12 Aug</td>
            </tr>
            <tr>
              <td>Suresh</td>
              <td>Group B</td>
              <td>₹ 15,000</td>
              <td>13 Aug</td>
            </tr>
            <tr>
              <td>Priya</td>
              <td>Group C</td>
              <td>₹ 12,000</td>
              <td>14 Aug</td>
            </tr>
          </tbody>
        </table>
      </div>
      {/* UPCOMING AUCTIONS */}
      <h6 className="fw-bold mb-3">Upcoming Auctions</h6>
      <div className="common-table-wrapper mt-4">
        <table className="common-table table-striped">
          <thead>
            <tr>
              <th>Group</th>
              <th>Auction Date</th>
              <th>Members</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>Group A</td>
              <td>18 Aug</td>
              <td>20</td>
              <td>
                <span className="badge bg-warning">Upcoming</span>
              </td>
            </tr>
            <tr>
              <td>Group B</td>
              <td>20 Aug</td>
              <td>25</td>
              <td>
                <span className="badge bg-success">Ready</span>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
};
