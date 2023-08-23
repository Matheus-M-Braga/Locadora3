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
                <v-list-item-title class="mb-1">{{
                  ultimoAlug
                }}</v-list-item-title>
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
                <v-list-item-title class="mb-1">{{
                  totalDisp
                }}</v-list-item-title>
                <div><v-divider></v-divider></div>
              </v-list-item-content>
            </v-list-item>
          </v-card>
        </v-flex>
        <!-- todos os livros no total -->
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
                  <v-icon dark large>mdi-book-multiple</v-icon>
                </v-sheet>
              </v-list-item-avatar>
              <v-list-item-content>
                <div class="title">Livros alugados</div>
                <br /><br /><br />
                <v-list-item-title class="mb-1">{{
                  this.renteds
                }}</v-list-item-title>
                <div><v-divider></v-divider></div>
              </v-list-item-content>
            </v-list-item>
          </v-card>
        </v-flex>
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
                  <v-icon dark large>mdi-book-multiple</v-icon>
                </v-sheet>
              </v-list-item-avatar>
              <v-list-item-content>
                <div class="title">Total de Aluguéis</div>
                <br /><br /><br />
                <v-list-item-title class="mb-1">{{
                  this.alugs.length
                }}</v-list-item-title>
                <div><v-divider></v-divider></div>
              </v-list-item-content>
            </v-list-item>
          </v-card>
        </v-flex>
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
                  <v-icon dark large>mdi-book-multiple</v-icon>
                </v-sheet>
              </v-list-item-avatar>
              <v-list-item-content>
                <div class="title">Usuários cadastrados</div>
                <br /><br /><br />
                <v-list-item-title class="mb-1">{{
                  this.users
                }}</v-list-item-title>
                <div><v-divider></v-divider></div>
              </v-list-item-content>
            </v-list-item>
          </v-card>
        </v-flex>
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
                  <v-icon dark large>mdi-book-multiple</v-icon>
                </v-sheet>
              </v-list-item-avatar>
              <v-list-item-content>
                <div class="title">Editoras cadastradas</div>
                <br /><br /><br />
                <v-list-item-title class="mb-1">{{
                  this.publis
                }}</v-list-item-title>
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
import Livro from "@/services/book";
import Publi from "@/services/edit";
import Aluguel from "@/services/alug";
export default {
  data: () => ({
    books: [],
    totalDisp: 0,
    renteds: 0,
    users: 0,
    publis: 0,
    Listusers: [],
    Listpublis: [],
    DispId: {},
    total: 0,
    alugs: [],
    maisalugados: [],
    ultimoAlug: "",
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
      Livro.list()
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
      Aluguel.list()
        .then((response) => {
          this.alugs = response.data;
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
      this.totalDisp = this.books.reduce(
        (total, book) => total + book.quantidade,
        0
      );

      // Quantidade dos livros disponíveis
      this.books.forEach((book) => {
        this.$set(this.DispId, book.nome, book.quantidade);
      });

      // Ordena os livros de acordo com a disponibilidade
      this.books.sort((a, b) => b.quantidade - a.quantidade);
    },
    totalCalc() {
      // filtra so os alugueis que nao estão devolvidos
      const filtereds = this.alugs.filter((alug) => !alug.data_devolucao);
      // armazena o total de livros
      this.total = this.totalDisp + filtereds.length;
      this.renteds = filtereds.length;
    },
    // Aluguéis
    CalcAlug() {
      // Último alugado
      const ultimo = this.alugs.reduce((prev, current) => {
        return prev.id < current.id ? current : prev;
      });
      this.ultimoAlug = ultimo.livro_id.nome;
    },
  },
};
</script>
