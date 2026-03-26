import React, { useEffect, useState } from "react";
import { EmployeeTable } from "../../../components/tables/EmployeeTable";
import { AddEmployee } from "./AddEmployee";
import { getEmployees, deleteEmployee } from "../../../services/employee.service";
import { toast } from "react-toastify";
import "./employeeModal.css";

const EmployeePage = () => {
  const [employees, setEmployees] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [editData, setEditData] = useState(null);

 const fetchEmployees = async () => {
  const data = await getEmployees();
  setEmployees(Array.isArray(data) ? data : []);
};
useEffect(() => {
  console.log("Employees from API:", employees);
}, [employees]);



  useEffect(() => {
    fetchEmployees();
  }, []);

  /* EDIT */
  const handleEdit = (employee) => {
    setEditData(employee);
    setShowModal(true);
  };

  /* DELETE */
  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this employee?")) return;

    try {
      await deleteEmployee(id);
      toast.success("Employee deleted successfully");
      fetchEmployees();
    } catch {
      toast.error("Failed to delete employee");
    }
  };

  return (
    <div>
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h4>Employees</h4>
        <button className="btn main-btn" onClick={() => {
          setEditData(null);
          setShowModal(true);
        }}>
          + Add Employee
        </button>
      </div>

      <EmployeeTable
      data={employees}     // ✅ CORRECT
      onEdit={handleEdit}
      onDelete={handleDelete}
    />



     {showModal && (
  <div
    className="employee-modal-overlay"
    onClick={() => setShowModal(false)}
  >
    <div
      className="employee-modal-box"
      onClick={(e) => e.stopPropagation()}
    >
      <div className="employee-modal-header">
        <h5>{editData ? "Edit Employee" : "Add Employee"}</h5>
        <button
          className="employee-modal-close"
          onClick={() => setShowModal(false)}
        >
          ×
        </button>
      </div>

      <div className="employee-modal-body">
        <AddEmployee
          editData={editData}
          onSuccess={() => {
            setShowModal(false);
            fetchEmployees();
          }}
        />
      </div>
    </div>
  </div>
)}


    </div>
  );
};

export default EmployeePage;
