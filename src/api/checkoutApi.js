import axiosClient from "./axiosClient";

const checkoutApi = {
  getCurrentTerms: () => {
    return axiosClient.get("/api/rental-terms/current");
  },
  acceptTerms: (data) => {
    // data: { termsId, termsVersion }
    return axiosClient.post("/api/rental-terms/accept", data);
  },
  sendOtp: (data) => {
    // data: { nguoi_dung_id, xac_nhan_dieu_khoan_id }
    return axiosClient.post("/api/rental-otp/send", data);
  },
  verifyOtp: (data) => {
    // data: { otp_id, ma_otp, nguoi_dung_id, xac_nhan_dieu_khoan_id }
    return axiosClient.post("/api/rental-otp/verify", data);
  },
  createSession: (data) => {
    // data: { xac_nhan_dieu_khoan_id, xac_thuc_otp_id }
    return axiosClient.post("/api/checkout-sessions", data);
  },
  createPaymentUrl: (data) => {
    // data: { phien_thanh_toan_id }
    return axiosClient.post("/api/payments/vnpay/create-payment-url", data);
  }
};

export default checkoutApi;
