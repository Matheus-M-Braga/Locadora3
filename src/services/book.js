import axios from "./config";

export default {
  list: () => {
    return axios.get("/livros");
  },
  create: (livro) => {
    return axios.post("/livro", livro);
  },
  update: (livro) => {
    return axios.put("/livro/", livro);
  },
  delete: (livro) => {
    return axios.delete('livro', { data : livro });
  },
};
