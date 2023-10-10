import axios from "./config";

export default {
  list: () => {
    return axios.get("usuarios");
  },
  create: (usuario) => {
    return axios.post("usuario", usuario);
  },
  update: (usuario) => {
    return axios.put("usuario/", usuario);
  },
  delete: (usuario) => {
    return axios.delete('usuario', { data : usuario });
  },
};
