import axios from "./config";

export default {
  list: () => {
    return axios.get("editoras");
  },
  create: (editora) => {
    return axios.post("editora", editora);
  },
  update: (editora) => {
    return axios.put("editora/", editora);
  },
  delete: (editora) => {
    return axios.delete('editora', { data : editora });
  },
};
