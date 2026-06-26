import axiosClient from "./axiosClient";

const deviceApi = {
  getDeviceModels: (params) => {
    return axiosClient.get("/api/device-models", { params });
  },

  getDeviceModelDetail: (id) => {
    return axiosClient.get(`/api/device-models/${id}`);
  },
};

export default deviceApi;
