<template>
   <div class="container_master">
      <v-container>
         <v-layout row wrap justify-space-between class="top">
            <div class="title_btn">
               <h1 class="subheading black--text">Usuários</h1>
               <v-btn dark @click="openModalCreate">Novo +</v-btn>
            </div>
            <div class="searchbar">
               <input type="text" v-model="search" placeholder="Pesquisar...">
               <v-icon>mdi-magnify</v-icon>
            </div>
         </v-layout>
         <v-row wrap class="table">
            <v-data-table dark :headers="headers" :items="users" :items-per-page="5" class="elevation-1" item-key="id"
               :search="search" :custom-filter="filter" :no-results-text="noDataText" :footer-props="{
                  'items-per-page-text': 'Registros por página',
                  'items-per-page-options': [5, 10, 15, this.users.length]
               }">
               <template v-slot:[`item.acoes`]="{ item }">
                  <td>
                     <v-icon class="mr-2" @click="openModalEdit(item)">
                        mdi-pencil
                     </v-icon>
                     <v-icon class="mr-2" @click="openModalDelete(item)">
                        mdi-delete
                     </v-icon>
                  </td>
               </template>
            </v-data-table>
         </v-row>
      </v-container>
      <!-- modal -->
      <v-row justify="center">
         <v-dialog v-model="dialog" persistent max-width="500px">
            <v-form ref form>
               <v-card dark>
                  <v-card-title>
                     <span class="text-h5">{{ ModalTitle }}</span>
                  </v-card-title>
                  <v-card-text>
                     <v-col>
                        <v-col cols="12">
                           <v-text-field v-model="nome" :counter="30" label="Nome" required :error-messages="NomeError"
                              @input="$v.nome.$touch()" @blur="$v.nome.$touch()"></v-text-field>
                        </v-col>
                        <v-col cols="12">
                           <v-text-field v-model="cidade" :counter="30" label="Cidade" required :error-messages="CidadeError"
                              @input="$v.cidade.$touch()" @blur="$v.cidade.$touch()"></v-text-field>
                        </v-col>
                        <v-col cols="12">
                           <v-text-field v-model="endereco" :counter="30" label="Endereço" required
                              :error-messages="EnderecoError" @input="$v.endereco.$touch()"
                              @blur="$v.endereco.$touch()"></v-text-field>
                        </v-col>
                        <v-col cols="12">
                           <v-text-field v-model="email" :counter="50" label="Email" type="email" required
                              :error-messages="EmailError" @input="$v.email.$touch()"
                              @blur="$v.email.$touch()"></v-text-field>
                        </v-col>
                     </v-col>
                  </v-card-text>
                  <v-card-actions>
                     <v-spacer></v-spacer>
                     <v-btn color="red darken-1" text @click="closeModal">
                        Cancelar
                     </v-btn>
                     <v-btn color="blue darken-1" text @click="confirm">
                        Salvar
                     </v-btn>
                  </v-card-actions>
               </v-card>
            </v-form>
         </v-dialog>
      </v-row>
      <!-- modal delete -->
      <v-row justify="center">
         <v-dialog v-model="dialogDelete" persistent max-width="600px">
            <v-card dark>
               <v-card-title>
                  <span class="text-h5">Excluir Usuário</span>
               </v-card-title>
               <v-card-text>
                  <v-container>
                     Tem certeza que deseja excluir o usuário selecionado?
                  </v-container>
               </v-card-text>
               <v-card-actions>
                  <v-spacer></v-spacer>
                  <v-btn color="green darken-1" text @click="closeModalDelete">
                     Cancelar
                  </v-btn>
                  <v-btn color="red darken-1" text @click="confirmDelete">
                     Confirmar
                  </v-btn>
               </v-card-actions>
            </v-card>
         </v-dialog>
      </v-row>
   </div>
</template>

<script>
import Usuario from "@/services/users";
import Swal from "sweetalert2";
import { validationMixin } from 'vuelidate';
import { required, maxLength, email } from 'vuelidate/lib/validators';

export default {
   mixins: [validationMixin],

   validations: {
      nome: { required, maxLength: maxLength(30) },
      endereco: { required, maxLength: maxLength(30) },
      cidade: { required, maxLength: maxLength(30) },
      email: { required, email, maxLength: maxLength(50) }
   },
   data() {
      return {
         noDataText: "Nenhum registro encontrado",
         search: "",
         ModalTitle: "",
         headers: [
            { text: 'ID', value: 'id', },
            { text: 'Nome', value: 'nome' },
            { text: 'Endereço', value: 'endereco' },
            { text: 'Cidade', value: 'cidade' },
            { text: 'Email', value: 'email' },
            { text: 'Ações', value: 'acoes', sortable: false },
         ],
         users: [],
         nome: "",
         endereco: "",
         cidade: "",
         email: "",
         dialog: false,
         dialogDelete: false,
         userId: null,
      }
   },
   mounted() {
      this.fetchUsers();
   },
   computed: {
      // validacao
      NomeError() {
         const errors = []
         if (!this.$v.nome.$dirty) return errors
         !this.$v.nome.maxLength && errors.push('O limite é de 30 caracteres.')
         !this.$v.nome.required && errors.push('Informe o nome.')
         return errors
      },
      EnderecoError() {
         const errors = []
         if (!this.$v.endereco.$dirty) return errors
         !this.$v.endereco.maxLength && errors.push('O limite é de 30 caracteres.')
         !this.$v.endereco.required && errors.push('Informe o endereco.')
         return errors
      },
      CidadeError() {
         const errors = []
         if (!this.$v.cidade.$dirty) return errors
         !this.$v.cidade.maxLength && errors.push('O limite é de 30 caracteres.')
         !this.$v.cidade.required && errors.push('Informe a cidade.')
         return errors
      },
      EmailError() {
         const errors = []
         if (!this.$v.email.$dirty) return errors
         !this.$v.email.maxLength && errors.psuh('O limite é de 50 caracteres.')
         !this.$v.email.email && errors.push('Informe um e-mail válido.')
         !this.$v.email.required && errors.push('Informe o e-mail.')
         return errors
      }
   },
   methods: {
      // search
      filter(value, search) {
         return value != null &&
            search != null &&
            (typeof value === 'string' || typeof value === 'number') && 
            value.toString().toLowerCase().indexOf(search.toLowerCase()) !== -1;
      },
      // Listar
      fetchUsers() {
         Usuario.list()
            .then((response) => {
               this.users = response.data;
            })
            .catch((error) => {
               console.error("Erro ao buscar usuarios", error);
            });
      },
      // Abrir o modal para adicionar
      openModalCreate() {
         this.ModalTitle = "Adicionar Usuário"
         this.dialog = true;
         this.$v.$reset()

         this.nome = "";
         this.endereco = "";
         this.cidade = "";
         this.email = "";
      },
      // Abrir o modal para editar
      openModalEdit(usuario) {
         this.ModalTitle = "Editar Usuário"
         this.dialog = true
         this.$v.$reset()

         this.userId = usuario.id
         this.nome = usuario.nome
         this.endereco = usuario.endereco
         this.cidade = usuario.cidade
         this.email = usuario.email
      },
      // Fechar modal
      closeModal() {
         this.dialog = false;
      },
      // confirm
      confirm() {
         this.$v.$touch()
         if (!this.$v.$error) {
            // Identica qual modal foi ativado (Add)
            if (this.ModalTitle === "Adicionar Usuário") {
               const novoUsuario = {
                  nome: this.nome,
                  endereco: this.endereco,
                  cidade: this.cidade,
                  email: this.email
               }
               Usuario.create(novoUsuario)
                  .then((response) => {
                     this.users.push({ id: response.data.id, ...novoUsuario });
                     Swal.fire({
                        icon: 'success',
                        title: 'Usuário adicionado com êxito!',
                        showConfirmButton: false,
                        timer: 1700,
                     });
                     this.closeModal();
                  })
                  .catch((error) => {
                     console.error("Erro ao adicionar o usuario:", error);
                     Swal.fire({
                        icon: 'error',
                        title: 'Erro ao adicionar usuário.',
                        showConfirmButton: false,
                        timer: 1700,
                     });
                  });
            }
            // Caso contrário, edita
            else {
               const usuarioEditado = {
                  id: this.userId,
                  nome: this.nome,
                  endereco: this.endereco,
                  cidade: this.cidade,
                  email: this.email
               };
               Usuario.update(usuarioEditado)
                  .then(() => {
                     this.users = this.users.map((usuario) => {
                        if (usuario.id === usuarioEditado.id) {
                           return usuarioEditado;
                        } else {
                           return usuario;
                        }
                     });
                     this.dialogEdit = false;
                     Swal.fire({
                        icon: 'success',
                        title: 'Usuário atualizado com êxito!',
                        showConfirmButton: false,
                        timer: 1700,
                     });
                     this.closeModal();
                  })
                  .catch((error) => {
                     console.error("Erro ao atualizar usuário:", error);
                     Swal.fire({
                        icon: 'success',
                        title: 'Erro ao atualizar usuário.',
                        showConfirmButton: false,
                        timer: 1700,
                     });
                  });
            }
         }
      },
      // Excluir
      openModalDelete(usuario) {
         this.userId = usuario.id;
         this.nome = usuario.nome;
         this.endereco = usuario.endereco;
         this.cidade = usuario.cidade;
         this.email = usuario.email
         this.dialogDelete = true;
      },
      closeModalDelete() {
         this.dialogDelete = false;
      },
      confirmDelete() {
         const deleteUsuario = {
            id: this.userId,
            nome: this.nome,
            endereco: this.endereco,
            cidade: this.cidade,
            email: this.email,
         };
         Usuario.delete(deleteUsuario)
            .then((response) => {
               if (response.status === 200) {
                  Swal.fire({
                     icon: 'success',
                     title: 'Usuário deletado com êxito!',
                     showConfirmButton: false,
                     timer: 1700,
                  });
                  this.removerUsuarioDaLista(deleteUsuario.id);
                  this.dialogDelete = false
               } else {
                  Swal.fire({
                     icon: 'error',
                     title: 'Erro ao deletar usuário.',
                     showConfirmButton: false,
                     timer: 1700,
                  });
               }
            })
            .catch((e) => {
               console.error("Erro ao deletar a usuário:", e);
               Swal.fire({
                  icon: 'error',
                  title: 'Erro ao deletar usuário.',
                  showConfirmButton: false,
                  timer: 1700,
               });
            });

      },
      removerUsuarioDaLista(usuarioId) {
         this.users = this.users.filter((usuario) => usuario.id !== usuarioId);
      },
   },
}
</script>
