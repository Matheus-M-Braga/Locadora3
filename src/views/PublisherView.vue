<template>
  <div>
    <v-container fluid class="pa-4">
      <TableTop
        :search="search"
        @updateSearch="updateSearch"
        @open-modal="openModalCreate"
        :PageTitle="PageTitle"
      />
      <v-row wrap class="table">
        <v-data-table
          dark
          :headers="headers"
          :header-props="headerprops"
          :items="publishers"
          :items-per-page="7"
          class="elevation-1"
          item-key="id"
          :search="search"
          :custom-filter="filter"
          :no-results-text="noDataText"
          :footer-props="{
            'items-per-page-text': 'Registros por página',
            'items-per-page-options': [7, 10, 15, this.publishers.length],
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
                    v-model="cidade"
                    label="Cidade"
                    required
                    :error-messages="CityError"
                    @input="$v.cidade.$touch()"
                    @blur="$v.cidade.$touch()"
                  ></v-text-field>
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
import Publisher from "@/services/publi";
import Swal from "sweetalert2";
import { validationMixin } from "vuelidate";
import { required } from "vuelidate/lib/validators";
import TableTop from "@/components/TableTop.vue";

export default {
components: {
  TableTop,
},
  mixins: [validationMixin],
  validations: {
    nome: { required },
    cidade: { required },
  },
  data() {
    return {
      noDataText: "Nenhum registro encontrado",
      search: "",
      ModalTitle: "",
      PageTitle: "Editoras",
      headers: [
        { text: "ID", value: "id" },
        { text: "Nome", value: "nome" },
        { text: "Cidade", value: "cidade" },
        { text: "Ações", value: "acoes", sortable: false },
      ],
      headerprops: {
        sortByText: "Ordenar Por",
      },
      publishers: [],
      nome: "",
      cidade: "",
      dialog: false,
      dialogDelete: false,
      publisherId: null,
      nameExists: false,
    };
  },
  mounted() {
    this.fetchPubli();
  },
  computed: {
    // validacao
    NameError() {
      const errors = [];
      if (!this.$v.nome.$dirty) return errors;
      !this.$v.nome.required && errors.push("Informe o nome.");
      if (this.nameExists) {
        errors.push("Editora já cadastrada!");
      }
      return errors;
    },
    CityError() {
      const errors = [];
      if (!this.$v.cidade.$dirty) return errors;
      !this.$v.cidade.required && errors.push("Informe a cidade.");
      return errors;
    },
  },
  methods: {
    updateSearch(newSearchValue) {
      this.search = newSearchValue;
    },
    // Search
    filter(value, search) {
      return (
        value != null &&
        search != null &&
        (typeof value === "string" || typeof value === "number") &&
        value.toString().toLowerCase().indexOf(search.toLowerCase()) !== -1
      );
    },
    // Listar
    fetchPubli() {
      Publisher.list()
        .then((response) => {
          this.publishers = response.data;
          this.publishers.sort((a, b) => {
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
          console.error("Erro ao buscar editoras:", error);
        });
    },
    CheckNames() {
      return this.publishers.some((publisher) => publisher.nome == this.nome);
    },
    validateName() {
      this.nameExists = this.CheckNames(this.nome);
      if (this.nameExists) {
        this.$v.nome.$touch();
      }
    },
    // Abrir modal para adicionar
    openModalCreate() {
      this.ModalTitle = "Adicionar Editora";
      this.dialog = true;
      this.$v.$reset();

      this.nome = "";
      this.cidade = "";
    },
    // Abrir o modal para editar
    openModalEdit(publisher) {
      this.ModalTitle = "Editar Editora";
      this.dialog = true;
      this.$v.$reset();

      this.publisherId = publisher.id;
      this.nome = publisher.nome;
      this.cidade = publisher.cidade;
    },
    //  Fechar modal
    closeModal() {
      this.dialog = false;
    },
    confirm() {
      if (!this.nameExists) {
        this.$v.$touch();
        if (!this.$v.$error) {
          // Identifica qual modal foi ativado (Add)
          if (this.ModalTitle === "Adicionar Editora") {
            const newpublisher = {
              nome: this.nome,
              cidade: this.cidade,
            };
            Publisher.create(newpublisher)
              .then((response) => {
                this.publishers.push({ id: response.data.id, ...newpublisher });
                Swal.fire({
                  icon: "success",
                  title: "Editora adicionada com êxito!",
                  showConfirmButton: false,
                  timer: 3500,
                });
                this.closeModal();
              })
              .catch((error) => {
                console.error("Erro ao adicionar editora:", error);
                Swal.fire({
                  icon: "error",
                  title: "Erro ao adicionar editora.",
                  text: error.response.data.error,
                  showConfirmButton: false,
                  timer: 3500,
                });
              });
          }
          // Caso contrário, edita =)
          else {
            const editedpublisher = {
              id: this.publisherId,
              nome: this.nome,
              cidade: this.cidade,
            };
            Publisher.update(editedpublisher)
              .then(() => {
                this.publishers = this.publishers.map((publisher) => {
                  if (publisher.id === editedpublisher.id) {
                    return editedpublisher;
                  } else {
                    return publisher;
                  }
                });
                Swal.fire({
                  icon: "success",
                  title: "Editora atualizada com êxito!",
                  showConfirmButton: false,
                  timer: 3500,
                });
                this.closeModal();
              })
              .catch((error) => {
                console.error("Erro ao atualizar editora:", error);
                Swal.fire({
                  icon: "error",
                  title: "Erro ao atualizar editora.",
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
    openModalDelete(publisher) {
      this.publisherId = publisher.id;
      this.nome = publisher.nome;
      this.cidade = publisher.cidade;
      this.dialogDelete = true;
    },
    closeModalDelete() {
      this.dialogDelete = false;
    },
    confirmDelete() {
      const deletedpublisher = {
        id: this.publisherId,
        nome: this.nome,
        cidade: this.cidade,
      };
      Publisher.delete(deletedpublisher)
        .then((response) => {
          if (response.status === 200) {
            Swal.fire({
              icon: "success",
              title: "Editora deletada com êxito!",
              showConfirmButton: false,
              timer: 3500,
            });
            this.removeFromList(deletedpublisher.id);
          } else {
            Swal.fire({
              icon: "error",
              title: "Erro ao deletar editora.",
              showConfirmButton: false,
              timer: 3500,
            });
          }
        })
        .catch((e) => {
          console.error("Erro ao deletar a editora:", e);
          Swal.fire({
            icon: "error",
            title: "Erro ao deletar editora.",
            text: e.response.data.error,
            showConfirmButton: false,
            timer: 3500,
          });
          this.closeModalDelete();
        });
      this.dialogDelete = false;
    },
    removeFromList(publisherId) {
      this.publishers = this.publishers.filter(
        (publisher) => publisher.id !== publisherId
      );
    },
  },
};
</script>
