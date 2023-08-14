<template>
  <div class="container_master">
    <v-container>
      <v-row wrap justify="space-between" class="top">
        <div class="title_btn">
          <h1 class="subheading black--text">Editoras</h1>
          <v-btn dark @click="openModalCreate" width="110">Novo +</v-btn>
        </div>
        <div class="searchbar">
          <input type="text" v-model="search" placeholder="Pesquisar...">
          <v-icon>mdi-magnify</v-icon>
        </div>
      </v-row>
      <v-row wrap class="table">
        <v-data-table dark :headers="headers" :items="editoras" :items-per-page="5" class="elevation-1" item-key="id"
          :search="search" :custom-filter="filter" :no-results-text="noDataText" :footer-props="{
            'items-per-page-text': 'Registros por página',
            'items-per-page-options': [5, 10, 15, this.editoras.length]
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
    <!-- Modal -->
    <v-row justify="center">
      <v-dialog v-model="dialog" persistent max-width="600px">
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
              </v-col>
              <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn color="red darken-1" text @click="closeModal">
                  Cancelar
                </v-btn>
                <v-btn color="blue darken-1" text @click="confirm">
                  Salvar
                </v-btn>
              </v-card-actions>
            </v-card-text>
          </v-card>
        </v-form>
      </v-dialog>
    </v-row>
    <!-- Modal delete -->
    <v-row justify="center">
      <v-dialog v-model="dialogDelete" persistent max-width="600px">
        <v-card dark>
          <v-card-title>
            <span class="text-h5">Excluir Editora</span>
          </v-card-title>
          <v-card-text>
            <v-container>
              Tem certeza que deseja excluir a editora selecionada?
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
import Editora from "@/services/edit";
import Swal from "sweetalert2";
import { validationMixin } from 'vuelidate'
import { required, maxLength } from 'vuelidate/lib/validators'

export default {
  mixins: [validationMixin],

  validations: {
    nome: { required, maxLength: maxLength(30) },
    cidade: { required, maxLength: maxLength(30) },
  },
  data() {
    return {
      noDataText: "Nenhum registro encontrado",
      search: "",
      ModalTitle: "",
      headers: [
        { text: "ID", value: "id", },
        { text: "Nome", value: "nome" },
        { text: "Cidade", value: "cidade" },
        { text: "Ações", value: "acoes", sortable: false },
      ],
      editoras: [],
      nome: "",
      cidade: "",
      dialog: false,
      dialogDelete: false,
      selectedEditoraId: null,
    };
  },
  mounted() {
    this.fetchEdits();
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
    CidadeError() {
      const errors = []
      if (!this.$v.cidade.$dirty) return errors
      !this.$v.cidade.maxLength && errors.push('O limite é de 30 caracteres.')
      !this.$v.cidade.required && errors.push('Informe a cidade.')
      return errors
    },
  },
  methods: {
    // Search
    filter(value, search) {
      return (
        value != null &&
        search != null &&
        typeof value === "string" &&
        value.toLowerCase().indexOf(search.toLowerCase()) !== -1
      );
    },
    // Listar
    fetchEdits() {
      Editora.list()
        .then((response) => {
          this.editoras = response.data;
        })
        .catch((error) => {
          console.error("Erro ao buscar editoras:", error);
        });
    },
    // Abrir modal para adicionar
    openModalCreate() {
      this.ModalTitle = "Adicionar Editora"
      this.dialog = true;
      this.$v.$reset()

      this.nome = "";
      this.cidade = "";
    },
    // Abrir o modal para editar
    openModalEdit(editora) {
      this.ModalTitle = "Editar Editora"
      this.dialog = true;
      this.$v.$reset()

      this.selectedEditoraId = editora.id;
      this.nome = editora.nome;
      this.cidade = editora.cidade;
    },
    //  Fechar modal
    closeModal() {
      this.dialog = false;
    },
    confirm() {
      this.$v.$touch()
      if (!this.$v.$error) {
        // Identifica qual modal foi ativado (Add)
        if (this.ModalTitle === "Adicionar Editora") {
          const novaEditora = {
            nome: this.nome,
            cidade: this.cidade,
          };
          Editora.create(novaEditora)
            .then((response) => {
              this.editoras.push({ id: response.data.id, ...novaEditora });
              Swal.fire({
                icon: 'success',
                title: 'Editora adicionada com êxito!',
                showConfirmButton: false,
                timer: 1700,
              });
              this.closeModal();
            })
            .catch((error) => {
              console.error("Erro ao adicionar editora:", error);
              Swal.fire({
                icon: 'error',
                title: 'Erro ao adicionar editora.',
                showConfirmButton: false,
                timer: 1700,
              })
            });

        }
        // Caso contrário, edita =)
        else {
          const editoraEditada = {
            id: this.selectedEditoraId,
            nome: this.nome,
            cidade: this.cidade,
          };
          Editora.update(editoraEditada)
            .then(() => {
              this.editoras = this.editoras.map((editora) => {
                if (editora.id === editoraEditada.id) {
                  return editoraEditada;
                } else {
                  return editora;
                }
              });
              Swal.fire({
                icon: 'success',
                title: 'Editora atualizada com êxito!',
                showConfirmButton: false,
                timer: 1700,
              });
              this.closeModal();
            })
            .catch((error) => {
              console.error("Erro ao atualizar editora:", error);
              Swal.fire({
                icon: 'error',
                title: 'Erro ao atualizar editora.',
                showConfirmButton: false,
                timer: 1700,
              })
            });
        }
      }
    },
    // Excluir
    openModalDelete(editora) {
      this.selectedEditoraId = editora.id;
      this.nome = editora.nome;
      this.cidade = editora.cidade;
      this.dialogDelete = true;
    },
    closeModalDelete() {
      this.dialogDelete = false;
    },
    confirmDelete() {
      const deleteEditora = {
        id: this.selectedEditoraId,
        nome: this.nome,
        cidade: this.cidade,
      };
      Editora.delete(deleteEditora)
        .then((response) => {
          if (response.status === 200) {
            Swal.fire({
              icon: 'success',
              title: 'Editora deletada com êxito!',
              showConfirmButton: false,
              timer: 1700,
            });
            this.removerEditoraDaLista(deleteEditora.id);
          } else {
            Swal.fire({
              icon: 'error',
              title: 'Erro ao deletar editora.',
              showConfirmButton: false,
              timer: 1700,
            });
          }
        })
        .catch((e) => {
          console.error("Erro ao deletar a editora:", e);
          Swal.fire({
            icon: 'error',
            title: 'Erro ao deletar editora.',
            showConfirmButton: false,
            timer: 1700,
          });
        });
      this.dialogDelete = false
    },
    removerEditoraDaLista(editoraId) {
      this.editoras = this.editoras.filter((editora) => editora.id !== editoraId);
    },
  },
};
</script>