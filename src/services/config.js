import axios from "axios";

const api = axios.create({
  baseURL: "https://livraria-api-linux.altislabtech.com.br/api",
});

export default api;
