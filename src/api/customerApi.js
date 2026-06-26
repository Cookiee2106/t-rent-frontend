import axiosClient from "./axiosClient";

const customerApi = {
  getAccount: () => axiosClient.get("/api/customer/account"),

  updateProfile: (data) => axiosClient.put("/api/customer/account/profile", {
    dia_chi: data.address,
    so_cccd: data.identityNumber
  }),

  submitVerification: (formData) =>
    axiosClient.post("/api/customer/verifications", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    }),
};

export default customerApi;
