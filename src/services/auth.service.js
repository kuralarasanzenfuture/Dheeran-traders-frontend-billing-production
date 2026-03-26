// import api from "./api";

// export const loginUser = async (username, password) => {
//   const response = await api.post("auth/admin/login", {
//     username,
//     password,
//   });
//   return response.data;
// };
// export const logout = () => {
//   localStorage.removeItem("token");
//   localStorage.removeItem("user");
//   window.location.href = "/login";
// };
import api from "./api";

export const loginUser = async (identifier, password) => {
  const response = await api.post("/users/login", {
    identifier,
      password,
  });
  return response.data;
};
export const logout = () => {
  localStorage.removeItem("token");
  localStorage.removeItem("user");
  window.location.href = "/login";
};