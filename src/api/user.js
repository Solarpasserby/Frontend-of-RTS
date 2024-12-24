import axios from "axios";

const instance = axios.create({
  // baseURL: "http://localhost:8080/api/",
  baseURL: "https://lorenash.me/api/",
  timeout: 1000,
});

const handleAsync = (fn) => {
  return async (...args) => {
    try {
      const response = await fn(...args);
      return response;
    } catch (error) {
      console.error(error);
    }
  };
};

const createUser = handleAsync(async (user) => {
  const response = await instance.post("/users/create", user);
  return response;
});

const login = handleAsync(async (user) => {
  const response = await instance.post("/users/login", user);
  return response;
});

const getUser = handleAsync(async (id) => {
  const response = await instance.get(`/users/${id}`);
  return response;
});

const updateUser = handleAsync(async (id, user) => {
  const response = await instance.patch(`/users/${id}`, user);
  return response;
});

const getRuns = handleAsync(async (demand) => {
  const response = await instance.post("/train_runs/demand", demand);
  return response;
});

const createOrder = handleAsync(async (order) => {
  const response = await instance.post("/orders/create", order);
  return response;
});

const getOrders = handleAsync(async (id) => {
  const response = await instance.get(`/orders/user/${id}`);
  return response;
});

const getNums = handleAsync(async (id) => {
  const response = await instance.get(`/train_run_nums/${id}`);
  return response;
});

const completeOrder = handleAsync(async (id) => {
  const response = await instance.patch(`/orders/${id}/complete`);
  return response;
});

const cancelOrder = handleAsync(async (id) => {
  const response = await instance.patch(`/orders/${id}/cancel`);
  return response;
});

export {
  createUser,
  login,
  getUser,
  updateUser,
  getRuns,
  createOrder,
  getOrders,
  getNums,
  completeOrder,
  cancelOrder,
};
