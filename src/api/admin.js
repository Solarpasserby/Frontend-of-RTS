import axios from "axios";
import { h } from "vue";

const tableList = ["stations", "trains", "users", "orders", "runs", "nums"];
const pathList = [
  "stations",
  "trains",
  "users",
  "orders",
  "train_runs",
  "train_run_nums",
];

const checkPath = (path) => {
  if (!pathList.includes(path)) {
    throw new Error("Invalid path name");
  }
};

const instance = axios.create({
  baseURL: "http://127.0.0.1:8080/",
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

// Admin API
const authenticateAdmin = handleAsync(async (admin) => {
  const response = await instance.post("/admin/login", admin);
  return response;
});

const getTableCount = handleAsync(async (table) => {
  if (!tableList.includes(table)) {
    if (table === "train_runs") {
      table = "runs";
    } else if (table === "train_run_nums") {
      table = "nums";
    } else {
      throw new Error("Invalid table name");
    }
  }
  const response = await instance.get(`/admin/count?query=${table}`);
  return response;
});

// Admin Universal API
const createEntity = handleAsync(async (path, entity) => {
  checkPath(path);
  const response = await instance.post(`/${path}/create`, entity);
  return response;
});

const getEntities = handleAsync(async (path, offset = 0, limit = 10) => {
  checkPath(path);
  const response = await instance.get(
    `/${path}/?offset=${offset}&limit=${limit}`
  );
  return response;
});

const getEntity = handleAsync(async (path, id) => {
  checkPath(path);
  const response = await instance.get(`/${path}/${id}`);
  return response;
});

const updateEntity = handleAsync(async (path, id, entity) => {
  checkPath(path);
  const response = await instance.patch(`/${path}/${id}`, entity);
  return response;
});

const deleteEntity = handleAsync(async (path, id) => {
  checkPath(path);
  const response = await instance.delete(`/${path}/${id}`);
  return response;
});

const setEntityStatus = handleAsync(async (path, id, kidPath, status={}) => {
  console.log(`/${path}/${id}/${kidPath}`);
  checkPath(path);
  // 没做orders的status设置
  const response = await instance.patch(`/${path}/${id}/${kidPath}`, status);
  return response;
});

// Station API
const createStation = handleAsync(async (station) => {
  const response = await instance.post("/stations/create", station);
  return response;
});

const getStations = handleAsync(async (offset = 0, limit = 10) => {
  const response = await instance.get(
    `/stations/?offset=${offset}&limit=${limit}`
  );
  return response;
});

const getStation = handleAsync(async (id) => {
  const response = await instance.get(`/stations/${id}`);
  return response;
});

const updateStation = handleAsync(async (id, station) => {
  const response = await instance.patch(`/stations/${id}`, station);
  return response;
});

const deleteStation = handleAsync(async (id) => {
  const response = await instance.delete(`/stations/${id}`);
  return response;
});

const deprecateStation = handleAsync(async (id, status) => {
  const response = await instance.patch(`/stations/${id}/deprecated`, status);
  return response;
});

export {
  authenticateAdmin,
  getTableCount,
  createStation,
  getStations,
  getStation,
  updateStation,
  deleteStation,
  deprecateStation,
  createEntity,
  getEntities,
  getEntity,
  updateEntity,
  deleteEntity,
  setEntityStatus,
};
