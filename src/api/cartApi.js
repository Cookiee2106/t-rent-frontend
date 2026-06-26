import axiosClient from "./axiosClient";

const cartApi = {
  getCart: () => {
    return axiosClient.get("/api/cart");
  },
  addCartItem: (data) => {
    // data: { productModelId, quantity, startDate, endDate }
    return axiosClient.post("/api/cart/items", data);
  },
  removeCartItem: (id) => {
    return axiosClient.delete(`/api/cart/items/${id}`);
  },
};

export default cartApi;
