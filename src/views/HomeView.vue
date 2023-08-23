<template>
  <div class="container_master">
    <v-container>
      <!-- graficos -->
      <v-layout row justify-space-between>
        <LineChart />
        <PieChart />
      </v-layout>
      <v-layout row justify-center>
        <!-- ultimo alugado-->
        <v-flex sm6 xs12 md6 lg4>
          <v-card class="ma-3" dark>
            <v-list-item>
              <v-list-item-avatar tile="" class="mt-n7">
                <v-sheet
                  color="blue-grey darken-2"
                  width="80"
                  height="80"
                  elevation="10"
                >
                  <v-icon dark large>mdi-book-sync</v-icon>
                </v-sheet>
              </v-list-item-avatar>
              <v-list-item-content>
                <div class="title">Último livro alugado</div>
                <br /><br /><br />
                <v-list-item-title class="mb-1">
                  {{ lastRented }}
                </v-list-item-title>
                <div><v-divider></v-divider></div>
              </v-list-item-content>
            </v-list-item>
          </v-card>
        </v-flex>
        <!-- total disponível -->
        <v-flex sm6 xs12 md6 lg4>
          <v-card class="ma-3" dark>
            <v-list-item>
              <v-list-item-avatar tile="" class="mt-n7">
                <v-sheet
                  color="blue-grey darken-2"
                  width="80"
                  height="80"
                  elevation="10"
                >
                  <v-icon dark large>mdi-book-check</v-icon>
                </v-sheet>
              </v-list-item-avatar>
              <v-list-item-content>
                <div class="title">Livros disponíveis</div>
                <br /><br /><br />
                <v-list-item-title class="mb-1">
                  {{ availableBooks }}
                </v-list-item-title>
                <div><v-divider></v-divider></div>
              </v-list-item-content>
            </v-list-item>
          </v-card>
        </v-flex>
        <!-- livros alugados -->
        <v-flex sm6 xs12 md6 lg4>
          <v-card class="ma-3" dark>
            <v-list-item>
              <v-list-item-avatar tile="" class="mt-n7">
                <v-sheet
                  color="blue-grey darken-2"
                  width="80"
                  height="80"
                  elevation="10"
                >
                  <v-icon dark large>mdi-book-open-variant</v-icon>
                </v-sheet>
              </v-list-item-avatar>
              <v-list-item-content>
                <div class="title">Livros alugados</div>
                <br /><br /><br />
                <v-list-item-title class="mb-1">
                  {{ this.rented }}
                </v-list-item-title>
                <div><v-divider></v-divider></div>
              </v-list-item-content>
            </v-list-item>
          </v-card>
        </v-flex>
        <!-- Total de aluguéis -->
        <v-flex sm6 xs12 md6 lg4>
          <v-card class="ma-3" dark>
            <v-list-item>
              <v-list-item-avatar tile="" class="mt-n7">
                <v-sheet
                  color="blue-grey darken-2"
                  width="80"
                  height="80"
                  elevation="10"
                >
                  <v-icon dark large>mdi-book-account</v-icon>
                </v-sheet>
              </v-list-item-avatar>
              <v-list-item-content>
                <div class="title">Total de Aluguéis</div>
                <br /><br /><br />
                <v-list-item-title class="mb-1">
                  {{ this.rentals.length }}
                </v-list-item-title>
                <div><v-divider></v-divider></div>
              </v-list-item-content>
            </v-list-item>
          </v-card>
        </v-flex>
        <!-- Usuários -->
        <v-flex sm6 xs12 md6 lg4>
          <v-card class="ma-3" dark>
            <v-list-item>
              <v-list-item-avatar tile="" class="mt-n7">
                <v-sheet
                  color="blue-grey darken-2"
                  width="80"
                  height="80"
                  elevation="10"
                >
                  <v-icon dark large>mdi-account</v-icon>
                </v-sheet>
              </v-list-item-avatar>
              <v-list-item-content>
                <div class="title">Usuários cadastrados</div>
                <br /><br /><br />
                <v-list-item-title class="mb-1">
                  {{ this.users }}
                </v-list-item-title>
                <div><v-divider></v-divider></div>
              </v-list-item-content>
            </v-list-item>
          </v-card>
        </v-flex>
        <!-- Editoras -->
        <v-flex sm6 xs12 md6 lg4>
          <v-card class="ma-3" dark>
            <v-list-item>
              <v-list-item-avatar tile="" class="mt-n7">
                <v-sheet
                  color="blue-grey darken-2"
                  width="80"
                  height="80"
                  elevation="10"
                >
                  <v-icon dark large>mdi-pencil</v-icon>
                </v-sheet>
              </v-list-item-avatar>
              <v-list-item-content>
                <div class="title">Editoras cadastradas</div>
                <br /><br /><br />
                <v-list-item-title class="mb-1">
                  {{ this.publis }}
                </v-list-item-title>
                <div><v-divider></v-divider></div>
              </v-list-item-content>
            </v-list-item>
          </v-card>
        </v-flex>
      </v-layout>
    </v-container>
  </div>
</template>

<script>
import LineChart from "@/components/LineChart";
import PieChart from "@/components/PieChart";
import User from "@/services/users";
import Book from "@/services/book";
import Publi from "@/services/edit";
import Rental from "@/services/alug";
export default {
  data: () => ({
    books: [],
    availableBooks: 0,
    rented: 0,
    users: 0,
    publis: 0,
    Listusers: [],
    Listpublis: [],
    total: 0,
    rentals: [],
    lastRented: "",
  }),
  mounted() {
    this.fetchBooks();
    this.fetchAlugs();
    this.fetchUsersPubli();
  },
  components: {
    LineChart,
    PieChart,
  },
  methods: {
    // listar livros
    fetchBooks() {
      Book.list()
        .then((response) => {
          this.books = response.data;
          this.CalcDisp();
        })
        .catch((error) => {
          console.error("Erro na busca de livros", error);
        });
    },
    // Listar alugueis
    fetchAlugs() {
      Rental.list()
        .then((response) => {
          this.rentals = response.data;
          this.CalcAlug();
          this.totalCalc();
        })
        .catch((error) => {
          console.error("Erro na busca de aluguéis", error);
        });
    },
    fetchUsersPubli() {
      User.list().then((response) => {
        this.Listusers = response.data;
        this.users = this.Listusers.length;
      });
      Publi.list().then((response) => {
        this.Listpublis = response.data;
        this.publis = this.Listpublis.length;
      });
    },
    // Livros
    CalcDisp() {
      // Total disponível
      this.availableBooks = this.books.reduce(
        (total, book) => total + book.quantidade,
        0
      );
    },
    totalCalc() {
      // filtra so os alugueis que nao estão devolvidos
      const filtereds = this.rentals.filter((rental) => !rental.data_devolucao);
      this.rented = filtereds.length;
    },
    // Aluguéis
    CalcAlug() {
      // Último alugado
      const last = this.rentals.reduce((prev, current) => {
        return prev.id < current.id ? current : prev;
      });
      this.lastRented = last.livro_id.nome;
    },
  },
};
</script>
