import api from "./api";

// ➕ Create employee
export const createEmployee = async (data) => {
  const res = await api.post("/employees", data);
  return res.data;
};

// 📄 Get all employees
export const getEmployees = async () => {
  const res = await api.get("/employees");
  return res.data;
};

// 🔍 Get employee by ID
export const getEmployeeById = (id) => {
  return api.get(`/employees/${id}`);
};

// ✏️ Update employee
export const updateEmployee = (id, data) => {
  return api.put(`/employees/${id}`, data);
};

// ❌ Delete employee
export const deleteEmployee = (id) => {
  return api.delete(`/employees/${id}`);
};
