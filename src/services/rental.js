import axios from './config'
export default {
   list: () => {
     return axios.get("alugueis");
   },
   create: (aluguel) => {
     return axios.post("/aluguel", aluguel);
   },
   update: (aluguel) => {
     return axios.put(`/aluguel`, aluguel);
   },
   delete: (aluguel) => {
     return axios.delete("aluguel", { data: aluguel });
   },
 };