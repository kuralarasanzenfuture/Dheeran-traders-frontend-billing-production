import api from "./api";

export const registerUser = (data) => {
  return api.post("/users/register", data);
};

export const loginUser = async (identifier, password) => {
  const response = await api.post("/users/login", {
    identifier,
    password,
  });
  return response.data;
};

export const getProfile = () => {
  return api.get("/users/me");
};

export const getUsers = () => {
  return api.get("/users");
};

export const deleteUser = (id) => {
  return api.delete(`/users/${id}`);
};

export const updateUserRole = (id, role) => {
  return api.put(`/users/${id}/role`, { role });
};

export const updateUser = (id, data) => {
  return api.put(`/users/${id}`, data);
};