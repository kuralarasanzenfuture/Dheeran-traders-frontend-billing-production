import { Link, Navigate } from "react-router-dom";
import { EmployeeTable } from "../../../components/tables/EmployeeTable";

export const EmployeeList = () => {
  return (
    <>
      <div className="product_detail">
        <div className="mb-4">
          <div className="row gy-3 align-items-center">
            <div className="col-lg-12 ">
              <div className="search-box ms-auto">
                <input type="text" className="search-input" placeholder="Search..." />
                <i className="bi bi-search search-icon"></i>
              </div>
            </div>
          </div>
        </div>
        <EmployeeTable />
      </div>
    </>
  );
};
