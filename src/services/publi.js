import axios from "./config";

export default {
  list: () => {
    return axios.get("publishers");
  },
  create: (publisher) => {
    return axios.post("publishers", publisher);
  },
  update: (publisher) => {
    return axios.put("publishers/", publisher);
  },
  delete: (publisher) => {
    return axios.delete("publishers/", { publisher });
  },
};
