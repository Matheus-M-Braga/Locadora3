<template>
  <div class="container_master">
    <v-container>
      <v-layout row wrap justify-space-between class="top">
        <div class="title_btn">
          <h1 class="subheading black--text">Livros</h1>
          <v-btn dark @click="openModalCreate">Novo +</v-btn>
        </div>
        <div class="searchbar">
          <input type="text" v-model="search" placeholder="Pesquisar..." />
          <v-icon right>mdi-magnify</v-icon>
        </div>
      </v-layout>
      <v-row wrap class="table">
        <v-data-table
          dark
          :headers="headers"
          :items="books"
          :items-per-page="5"
          class="elevation-1"
          item-key="id"
          :search="search"
          :custom-filter="filter"
          :no-results-text="noDataText"
          :footer-props="{
            'items-per-page-text': 'Registros por página',
            'items-per-page-options': [5, 10, 15, this.books.length],
          }"
        >
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
        <v-card dark>
          <v-card-title>
            <span class="text-h5">{{ ModalTitle }}</span>
          </v-card-title>
          <v-card-text>
            <v-col>
              <v-col cols="12">
                <v-text-field
                  v-model="nome"
                  :counter="30"
                  label="Nome"
                  required
                  :error-messages="NomeError"
                  @input="$v.nome.$touch()"
                  @blur="$v.nome.$touch()"
                ></v-text-field>
              </v-col>
              <v-col cols="12">
                <v-text-field
                  v-model="autor"
                  :counter="30"
                  label="Autor"
                  required
                  :error-messages="AutorError"
                  @input="$v.autor.$touch()"
                  @blur="$v.autor.$touch()"
                ></v-text-field>
              </v-col>
              <v-col cols="12">
                <v-select
                  v-model="editora"
                  :items="listEdits"
                  item-text="nome"
                  label="Editora"
                  required
                  :error-messages="EditoraError"
                  @input="$v.editora.$touch()"
                  @blur="$v.editora.$touch()"
                ></v-select>
              </v-col>
              <v-col cols="12">
                <v-text-field
                  v-model="lancamento"
                  :counter="30"
                  label="Lançamento"
                  required
                  :error-messages="LancaError"
                  @input="$v.lancamento.$touch()"
                  @blur="$v.lancamento.$touch()"
                  type="number"
                ></v-text-field>
              </v-col>
              <v-col cols="12">
                <v-text-field
                  v-model="quantidade"
                  :counter="30"
                  label="Quantidade"
                  required
                  :error-messages="QuantiError"
                  @input="$v.quantidade.$touch()"
                  @blur="$v.quantidade.$touch()"
                  type="number"
                ></v-text-field>
              </v-col>
            </v-col>
          </v-card-text>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn color="red darken-1" text @click="closeModal">
              Cancelar
            </v-btn>
            <v-btn color="blue darken-1" text @click="confirm"> Salvar </v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
    </v-row>
    <!-- modal delete -->
    <v-row justify="center">
      <v-dialog v-model="dialogDelete" persistent max-width="600px">
        <v-card dark>
          <v-card-title>
            <span class="text-h5">Excluir Livro</span>
          </v-card-title>
          <v-card-text>
            <v-container>
              Tem certeza que deseja excluir o livro selecionado?
            </v-container>
          </v-card-text>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn color="red darken-1" text @click="closeModalDelete">
              Cancelar
            </v-btn>
            <v-btn color="green darken-1" text @click="confirmDelete">
              Confirmar
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
    </v-row>
  </div>
</template>

<script>
import Livro from "@/services/book";
import Editora from "@/services/edit";
import Swal from "sweetalert2";
import { validationMixin } from "vuelidate";
import { required, maxLength } from "vuelidate/lib/validators";
export default {
  mixins: [validationMixin],

  validations: {
    nome: { required, maxLength: maxLength(30) },
    autor: { required, maxLength: maxLength(30) },
    editora: { required, maxLength: maxLength(30) },
    lancamento: { required, maxLength: maxLength(4) },
    quantidade: { required, maxLength: maxLength(4) },
  },
  data() {
    return {
      noDataText: "Nenhum registro encontrado",
      search: "",
      ModalTitle: "",
      headers: [
        { text: "ID", value: "id" },
        { text: "Nome", value: "nome" },
        { text: "Autor", value: "autor" },
        { text: "Editora", value: "editora.nome" },
        { text: "Lançamento", value: "lancamento" },
        { text: "Estoque", value: "quantidade" },
        { text: "Alugados", value: "totalalugado" },
        { text: "Ações", value: "acoes", sortable: false },
      ],
      books: [],
      listEdits: [],
      nome: "",
      autor: "",
      editora: "",
      lancamento: 0,
      quantidade: 0,
      totalalugado: 0,
      dialog: false,
      dialogDelete: false,
      selectedLivroId: null,
    };
  },
  computed: {
    // validacao
    NomeError() {
      const errors = [];
      if (!this.$v.nome.$dirty) return errors;
      !this.$v.nome.maxLength && errors.push("O limite é de 30 caracteres.");
      !this.$v.nome.required && errors.push("Informe o nome.");
      return errors;
    },
    AutorError() {
      const errors = [];
      if (!this.$v.autor.$dirty) return errors;
      !this.$v.autor.maxLength && errors.push("O limite é de 30 caracteres.");
      !this.$v.autor.required && errors.push("Informe o autor.");
      return errors;
    },
    EditoraError() {
      const errors = [];
      if (!this.$v.editora.$dirty) return errors;
      !this.$v.editora.maxLength && errors.push("O limite é de 30 caracteres.");
      !this.$v.editora.required && errors.push("Informe a editora.");
      return errors;
    },
    LancaError() {
      const errors = [];
      if (!this.$v.lancamento.$dirty) return errors;
      !this.$v.lancamento.maxLength && errors.push("O limite é de 4 dígitos.");
      !this.$v.lancamento.required &&
        errors.push("Informe o ano de Lançamento.");
      return errors;
    },
    QuantiError() {
      const errors = [];
      if (!this.$v.quantidade.$dirty) return errors;
      !this.$v.quantidade.maxLength && errors.push("O limite é de 4 dígitos.");
      !this.$v.quantidade.required && errors.push("Informe a quantidade.");
      return errors;
    },
  },
  mounted() {
    this.fetchBooks();
    this.fetchEdits();
  },
  methods: {
    // search
    filter(value, search) {
      return (
        value != null &&
        search != null &&
        (typeof value === "string" || typeof value === "number") &&
        value.toString().toLowerCase().indexOf(search.toLowerCase()) !== -1
      );
    },
    // Listar
    fetchBooks() {
      Livro.list()
        .then((response) => {
          this.books = response.data;
          console.log(this.books);
        })
        .catch((error) => {
          console.error("Erro na busca de livros", error);
        });
    },
    fetchEdits() {
      Editora.list().then((response) => {
        this.listEdits = response.data;
      });
    },
    // Abrir o modal para adicionar
    openModalCreate() {
      this.ModalTitle = "Adicionar Livro";
      this.dialog = true;
      this.$v.$reset();

      this.nome = "";
      this.autor = "";
      this.editora = "";
      this.lancamento = "";
      this.quantidade = "";
    },
    // Abrir o modal para editar
    openModalEdit(livro) {
      this.ModalTitle = "Editar livro";
      this.dialog = true;
      this.$v.$reset();

      const selectedEdit = this.listEdits.find(
        (editora) => editora.nome === livro.editora.nome
      );
      this.selectedLivroId = livro.id;
      this.nome = livro.nome;
      this.autor = livro.autor;
      this.editora = selectedEdit;
      this.lancamento = livro.lancamento;
      this.quantidade = livro.quantidade;
    },
    // Fechar modal
    closeModal() {
      this.dialog = false;
    },
    // confirm
    confirm() {
      this.$v.$touch();
      if (!this.$v.$error) {
        // Identifica qual modal foi ativado (Add)
        if (this.ModalTitle === "Adicionar Livro") {
          const selectedEdit = this.listEdits.find(
            (editora) => editora.nome === this.editora
          );
          const novoLivro = {
            nome: this.nome,
            autor: this.autor,
            editora: selectedEdit,
            lancamento: this.lancamento,
            quantidade: this.quantidade,
            totalalugado: "0",
          };
          Livro.create(novoLivro)
            .then((response) => {
              this.books.push({ id: response.data.id, ...novoLivro });
              Swal.fire({
                icon: "success",
                title: "Livro adicionado com êxito!",
                showConfirmButton: false,
                timer: 3500,
              });
              this.closeModal();
              this.fetchBooks();
            })
            .catch((error) => {
              console.error("Erro ao adicionar o livro:", error);
              Swal.fire({
                icon: "error",
                title: "Erro ao adicionar o livro.",
                text: error.response.data.error,
                showConfirmButton: false,
                timer: 3500,
              });
            });
        }
        // Caso contrário, edita
        else {
          const selectedEdit = this.listEdits.find(
            (editora) => editora.nome === this.editora
          );
          const livroEditado = {
            id: this.selectedLivroId,
            nome: this.nome,
            autor: this.autor,
            editora: selectedEdit ? { ...selectedEdit } : this.editora,
            lancamento: this.lancamento,
            quantidade: this.quantidade,
          };
          Livro.update(livroEditado)
            .then(() => {
              this.books = this.books.map((livro) => {
                if (this.selectedLivroId === livroEditado.id) {
                  return livroEditado;
                } else {
                  return livro;
                }
              });
              Swal.fire({
                icon: "success",
                title: "Livro atualizado com êxito!",
                showConfirmButton: false,
                timer: 3500,
              });
              this.closeModal();
              this.fetchBooks();
            })
            .catch((error) => {
              console.error("Erro ao atualizar livro:", error);
              Swal.fire({
                icon: "error",
                title: "Erro ao atualizar o livro.",
                text: error.response.data.error,
                showConfirmButton: false,
                timer: 3500,
              });
            });
        }
      }
    },
    // Excluir
    openModalDelete(livro) {
      this.selectedLivroId = livro.id;
      this.nome = livro.nome;
      this.autor = livro.autor;
      this.editora = livro.editora;
      this.lancamento = livro.lancamento;
      this.quantidade = livro.quantidade;
      this.dialogDelete = true;
    },
    closeModalDelete() {
      this.dialogDelete = false;
    },
    confirmDelete() {
      const deleteLivro = {
        id: this.selectedLivroId,
        nome: this.nome,
        autor: this.autor,
        editora: this.editora,
        lancamento: this.lancamento,
      };
      Livro.delete(deleteLivro)
        .then((response) => {
          if (response.status === 200) {
            Swal.fire({
              icon: "success",
              title: "Livro deletado com êxito!",
              showConfirmButton: false,
              timer: 3500,
            });
            this.removerLivroDaLista(deleteLivro.id);
            this.closeModalDelete();
          }
        })
        .catch((e) => {
          console.error("Erro ao deletar o livro:", e);
          Swal.fire({
            icon: "error",
            title: "Erro ao deletar o livro.",
            text: e.response.data.error,
            showConfirmButton: false,
            timer: 3500,
          });
          this.closeModalDelete();
        });
    },
    removerLivroDaLista(livroId) {
      this.books = this.books.filter((livro) => livro.id !== livroId);
    },
  },
};
</script>
