import axiosClient from "./axiosClient";

const authApi = {
  login: (email, password) => {
    return axiosClient.post("/api/auth/login", { email, mat_khau: password });
  },

  register: (data) => {
    return axiosClient.post("/api/auth/register", {
      ho_ten: data.fullName,
      email: data.email,
      so_dien_thoai: data.phone,
      mat_khau: data.password
    });
  },

  getAccount: () => {
    return axiosClient.get("/api/customer/account");
  },
};

export default authApi;
