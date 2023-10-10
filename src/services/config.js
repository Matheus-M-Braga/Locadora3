import axios from "axios";

const api = axios.create({
  baseURL: "http://wdaw.hopto.org:8185/api/",
});

export default api;
a