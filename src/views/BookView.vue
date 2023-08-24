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
          :header-props="headerprops"
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
                  label="Nome"
                  required
                  :error-messages="NameError"
                  @input="validateName()"
                  @blur="$v.nome.$touch()"
                ></v-text-field>
              </v-col>
              <v-col cols="12">
                <v-text-field
                  v-model="autor"
                  label="Autor"
                  required
                  :error-messages="AuthorError"
                  @input="$v.autor.$touch()"
                  @blur="$v.autor.$touch()"
                ></v-text-field>
              </v-col>
              <v-col cols="12">
                <v-select
                  v-model="editora"
                  :items="listPublishers"
                  item-text="nome"
                  label="Editora"
                  required
                  :error-messages="PublisherError"
                  @input="$v.editora.$touch()"
                  @blur="$v.editora.$touch()"
                ></v-select>
              </v-col>
              <v-col cols="12">
                <v-text-field
                  v-model="lancamento"
                  label="Lançamento"
                  required
                  :error-messages="DateError"
                  @input="$v.lancamento.$touch()"
                  @blur="$v.lancamento.$touch()"
                  type="number"
                ></v-text-field>
              </v-col>
              <v-col cols="12">
                <v-text-field
                  v-model="quantidade"
                  label="Quantidade"
                  required
                  :error-messages="AmountError"
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
import Book from "@/services/book";
import Publisher from "@/services/publi";
import Swal from "sweetalert2";
import { validationMixin } from "vuelidate";
import { required, maxLength } from "vuelidate/lib/validators";
export default {
  mixins: [validationMixin],

  validations: {
    nome: { required },
    autor: { required },
    editora: { required },
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
      headerprops: {
        sortByText: "Ordenar Por",
      },
      books: [],
      listPublishers: [],
      nome: "",
      autor: "",
      editora: "",
      lancamento: 0,
      quantidade: 0,
      totalalugado: 0,
      dialog: false,
      dialogDelete: false,
      bookId: null,
      nameExists: false,
    };
  },
  computed: {
    // validacao
    NameError() {
      const errors = [];
      if (!this.$v.nome.$dirty) return errors;
      !this.$v.nome.required && errors.push("Informe o nome.");
      if (this.nameExists) {
        errors.push("Livro já cadastrado!");
      }
      return errors;
    },
    AuthorError() {
      const errors = [];
      if (!this.$v.autor.$dirty) return errors;
      !this.$v.autor.required && errors.push("Informe o autor.");
      return errors;
    },
    PublisherError() {
      const errors = [];
      if (!this.$v.editora.$dirty) return errors;
      !this.$v.editora.required && errors.push("Informe a editora.");
      return errors;
    },
    DateError() {
      const errors = [];
      if (!this.$v.lancamento.$dirty) return errors;
      !this.$v.lancamento.maxLength && errors.push("O limite é de 4 dígitos.");
      !this.$v.lancamento.required &&
        errors.push("Informe o ano de Lançamento.");
      return errors;
    },
    AmountError() {
      const errors = [];
      if (!this.$v.quantidade.$dirty) return errors;
      !this.$v.quantidade.maxLength && errors.push("O limite é de 4 dígitos.");
      !this.$v.quantidade.required && errors.push("Informe a quantidade.");
      return errors;
    },
  },
  mounted() {
    this.fetchBooks();
    this.fetchPubli();
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
      Book.list()
        .then((response) => {
          this.books = response.data;
          this.books.sort((a, b) => {
            if (a.id > b.id) {
              return 1;
            } else if (a.id < b.id) {
              return -1;
            } else {
              return 0;
            }
          });
        })
        .catch((error) => {
          console.error("Erro na busca de livros", error);
        });
    },
    fetchPubli() {
      Publisher.list().then((response) => {
        this.listPublishers = response.data;
      });
    },
    CheckNames() {
      return this.books.some((book) => book.nome == this.nome);
    },
    validateName() {
      this.nameExists = this.CheckNames(this.nome);
      if (this.nameExists) {
        this.$v.nome.$touch();
      }
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
    openModalEdit(book) {
      this.ModalTitle = "Editar livro";
      this.dialog = true;
      this.$v.$reset();

      const selectedPubli = this.listPublishers.find(
        (editora) => editora.nome === book.editora.nome
      );
      this.bookId = book.id;
      this.nome = book.nome;
      this.autor = book.autor;
      this.editora = selectedPubli;
      this.lancamento = book.lancamento;
      this.quantidade = book.quantidade;
    },
    // Fechar modal
    closeModal() {
      this.dialog = false;
    },
    // confirm
    confirm() {
      if (!this.nameExists) {
        this.$v.$touch();
        if (!this.$v.$error) {
          // Identifica qual modal foi ativado (Add)
          if (this.ModalTitle === "Adicionar Livro") {
            const selectedPubli = this.listPublishers.find(
              (editora) => editora.nome === this.editora
            );
            const newbook = {
              nome: this.nome,
              autor: this.autor,
              editora: selectedPubli,
              lancamento: this.lancamento,
              quantidade: this.quantidade,
              totalalugado: "0",
            };
            Book.create(newbook)
              .then((response) => {
                this.books.push({ id: response.data.id, ...newbook });
                Swal.fire({
                  icon: "success",
                  title: "Book adicionado com êxito!",
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
            const selectedPubli = this.listPublishers.find(
              (publisher) => publisher.nome === this.publisher
            );
            const editedbook = {
              id: this.bookId,
              nome: this.nome,
              autor: this.autor,
              editora: selectedPubli ? { ...selectedPubli } : this.editora,
              lancamento: this.lancamento,
              quantidade: this.quantidade,
            };
            Book.update(editedbook)
              .then(() => {
                this.books = this.books.map((book) => {
                  if (this.bookId === editedbook.id) {
                    return editedbook;
                  } else {
                    return book;
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
      }
    },
    // Excluir
    openModalDelete(book) {
      this.bookId = book.id;
      this.nome = book.nome;
      this.autor = book.autor;
      this.editora = book.editora;
      this.lancamento = book.lancamento;
      this.quantidade = book.quantidade;
      this.dialogDelete = true;
    },
    closeModalDelete() {
      this.dialogDelete = false;
    },
    confirmDelete() {
      const deletedbook = {
        id: this.bookId,
        nome: this.nome,
        autor: this.autor,
        editora: this.editora,
        lancamento: this.lancamento,
      };
      Book.delete(deletedbook)
        .then((response) => {
          if (response.status === 200) {
            Swal.fire({
              icon: "success",
              title: "Livro deletado com êxito!",
              showConfirmButton: false,
              timer: 3500,
            });
            this.removerLivroDaLista(deletedbook.id);
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
    removerLivroDaLista(bookId) {
      this.books = this.books.filter((book) => book.id !== bookId);
    },
  },
};
</script>
