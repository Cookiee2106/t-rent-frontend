import axiosClient from "./axiosClient";

const orderApi = {
  customer: {
    getOrders: () => axiosClient.get("/api/customer/orders"),
    getOrderById: (id) => axiosClient.get(`/api/customer/orders/${id}`),
    cancelOrder: (id, cancelReason) =>
      axiosClient.patch(`/api/customer/orders/${id}/cancel`, { cancelReason }),
  },
  admin: {
    // ─── Quản lý đơn hàng ───
    getOrders: () => axiosClient.get("/api/admin/orders"),
    getOrderById: (id) => axiosClient.get(`/api/admin/orders/${id}`),
    getAvailableAssets: (id) =>
      axiosClient.get(`/api/admin/orders/${id}/available-assets`),

    // ─── Giai đoạn 2: Bàn giao (Handover) ───

    /** API 11 – Upload file hợp đồng giấy (single file, field "file") */
    uploadContractFile: (orderId, file) => {
      const formData = new FormData();
      formData.append("file", file);
      return axiosClient.post(
        `/api/admin/orders/${orderId}/contract-file`,
        formData,
        { headers: { "Content-Type": "multipart/form-data" } }
      );
    },

    /** API 12 – Upload ảnh bàn giao (multiple files, field "images", max 10) */
    uploadHandoverImages: (orderId, files) => {
      const formData = new FormData();
      files.forEach((file) => formData.append("images", file));
      return axiosClient.post(
        `/api/admin/orders/${orderId}/handover-images`,
        formData,
        { headers: { "Content-Type": "multipart/form-data" } }
      );
    },

    /** API 13 – Lập phiếu bàn giao
     *  @param {string} orderId
     *  @param {Object} payload - { danh_sach_tai_san, danh_sach_anh_url, ghi_chu }
     */
    createHandover: (orderId, payload) => {
      return axiosClient.post(`/api/admin/orders/${orderId}/handover`, payload);
    },

    // ─── Giai đoạn 3: Thanh lý / Trả hàng ───

    /** API 14 – Lấy danh sách thanh lý hợp đồng */
    getLiquidations: (params) =>
      axiosClient.get("/api/admin/contract-liquidations", { params }),

    /** API 15 – Lấy chi tiết thanh lý */
    getLiquidationDetail: (id) =>
      axiosClient.get(`/api/admin/contract-liquidations/${id}`),

    /** API 16 – Upload ảnh trả hàng */
    uploadReturnImages: (orderId, files) => {
      const formData = new FormData();
      files.forEach((file) => formData.append("images", file));
      return axiosClient.post(
        `/api/admin/contract-liquidations/${orderId}/return-images`,
        formData,
        { headers: { "Content-Type": "multipart/form-data" } }
      );
    },

    /** API 17 – Tạo phiếu kiểm kê trả hàng
     *  @param {Object} data - { assets[], imageUrls[], note, result }
     */
    createReturnInspection: (orderId, data) =>
      axiosClient.post(
        `/api/admin/contract-liquidations/${orderId}/return-inspection`,
        data
      ),

    /** API 18 – Hoàn trả tiền cọc
     *  @param {Object} data - { amount?, transactionCode?, note? }
     */
    processRefundDeposit: (orderId, data) =>
      axiosClient.post(
        `/api/admin/contract-liquidations/${orderId}/refund-deposit`,
        data
      ),

    /** API 19 – Khấu trừ tiền cọc
     *  @param {Object} data - { charges[], transactionCode?, note? }
     */
    processDeductDeposit: (orderId, data) =>
      axiosClient.post(
        `/api/admin/contract-liquidations/${orderId}/deduct-deposit`,
        data
      ),

    /** API 20 – Tạo phiếu bảo trì */
    createMaintenanceRecord: (orderId, data) =>
      axiosClient.post(
        `/api/admin/contract-liquidations/${orderId}/maintenance`,
        data
      ),
    // ─── Bảo trì (Maintenance) ───
    getMaintenanceRecords: (params) =>
      axiosClient.get("/api/admin/maintenance", { params }),
    createMaintenanceRecord: (data) =>
      axiosClient.post("/api/admin/maintenance", data),
  },
};

export default orderApi;
