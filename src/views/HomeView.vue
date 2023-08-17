<template>
  <div class="container_master">
    <v-container>
      <v-layout row justify-space-between>
        <v-flex sm6 xs12 md6>
          <div class="chart_container">
            <div class="title text-center">Livros mais alugados</div>
            <canvas ref="myChart" width="450" height="200" class="chartBar"></canvas>
          </div>
        </v-flex>
        <v-flex sm6 xs12 md6>
          <div class="chart_container">
            <div class="title text-center">Livros disponíveis</div>
            <canvas ref="myPieChart" width="450" height="200" class="chartPie"></canvas>
          </div>
        </v-flex>
      </v-layout>
      <v-layout row justify-center>
        <!-- ultimo alugado-->
        <v-flex sm6 xs12 md6 lg4>
          <v-card class="ma-3" dark>
            <v-list-item>
              <v-list-item-avatar tile="" class="mt-n7">
                <v-sheet color="blue-grey darken-2" width="80" height="80" elevation="10">
                  <v-icon dark large>mdi-book-sync</v-icon>
                </v-sheet>
              </v-list-item-avatar>
              <v-list-item-content>
                <div class="title">Último livro alugado</div>
                <br><br><br>
                <v-list-item-title class="mb-1">{{ ultimoAlug }}</v-list-item-title>
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
                <v-sheet color="blue-grey darken-2" width="80" height="80" elevation="10">
                  <v-icon dark large>mdi-book-check</v-icon>
                </v-sheet>
              </v-list-item-avatar>
              <v-list-item-content>
                <div class="title">Livros disponíveis</div>
                <br><br><br>
                <v-list-item-title class="mb-1">{{ totalDisp }}</v-list-item-title>
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
                <v-sheet color="blue-grey darken-2" width="80" height="80" elevation="10">
                  <v-icon dark large>mdi-book-multiple</v-icon>
                </v-sheet>
              </v-list-item-avatar>
              <v-list-item-content>
                <div class="title">Total de livros</div>
                <br><br><br>
                <v-list-item-title class="mb-1">{{ total }}</v-list-item-title>
                <div><v-divider></v-divider></div>
              </v-list-item-content>
            </v-list-item>
          </v-card>
        </v-flex>
        <v-flex sm6 xs12 md6 lg4>
          <v-card class="ma-3" dark>
            <v-list-item>
              <v-list-item-avatar tile="" class="mt-n7">
                <v-sheet color="blue-grey darken-2" width="80" height="80" elevation="10">
                  <v-icon dark large>mdi-book-account</v-icon>
                </v-sheet>
              </v-list-item-avatar>
              <v-list-item-content>
                <div class="title">Aluguéis</div>
                <br><br><br>
                <v-list-item-title class="mb-1">Total: {{ alugs.length }}</v-list-item-title>
                <div><v-divider></v-divider></div>
              </v-list-item-content>
            </v-list-item>
          </v-card>
        </v-flex>
        <v-flex sm6 xs12 md6 lg4>
          <v-card class="ma-3" dark>
            <v-list-item>
              <v-list-item-avatar tile="" class="mt-n7">
                <v-sheet color="blue-grey darken-2" width="80" height="80" elevation="10">
                  <v-icon dark large>mdi-book-refresh</v-icon>
                </v-sheet>
              </v-list-item-avatar>
              <v-list-item-content>
                <div class="title">Aluguéis</div>
                <br><br><br>
                <v-list-item-title class="mb-1">Devolvidos: {{ alugsDevol.length }}</v-list-item-title>
                <div><v-divider></v-divider></div>
              </v-list-item-content>
            </v-list-item>
          </v-card>
        </v-flex>
        <v-flex sm6 xs12 md6 lg4>
          <v-card class="ma-3" dark>
            <v-list-item>
              <v-list-item-avatar tile="" class="mt-n7">
                <v-sheet color="blue-grey darken-2" width="80" height="80" elevation="10">
                  <v-icon dark large>mdi-book-clock</v-icon>
                </v-sheet>
              </v-list-item-avatar>
              <v-list-item-content>
                <div class="title">Aluguéis</div>
                <br><br><br>
                <v-list-item-title class="mb-1">Pendentes: {{ alugsPends.length }}</v-list-item-title>
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
import Chart from 'chart.js'
import Livro from '@/services/book'
import Aluguel from '@/services/alug'
export default {

  data: () => ({
    books: [],
    totalDisp: 0,
    DispId: {},
    total: 0,
    alugs: [],
    alugsPends: 0,
    alugsDevol: 0,
    maisalugados: [],
    ultimoAlug: "",
  }),
  mounted() {
    this.fetchBooks()
    this.fetchAlugs()
  },
  watch: {
    books: {
      handler() {
        this.updateCharts();
      },
      deep: true,
    },
    alugs: {
      handler() {
        this.updateCharts();
      },
      deep: true,
    }
  },
  methods: {
    // listar livros
    fetchBooks() {
      Livro.list()
        .then(response => {
          this.books = response.data
          this.CalcDisp()
          this.CalcDispId()
          this.SortQuant()
        })
        .catch((error) => {
          console.error("Erro na busca de livros", error)
        });
    },
    // Listar alugueis
    fetchAlugs() {
      Aluguel.list()
        .then(response => {
          this.alugs = response.data
          this.totalCalc()
          this.alugsPends = this.alugs.filter(alug => !alug.data_devolucao);
          this.alugsDevol = this.alugs.filter(alug => alug.data_devolucao);
          this.CalcMaisAlug()
          const ultimo = this.alugs.reduce((prev, current) => {
            return prev.id < current.id ? current : prev;
          });
          this.ultimoAlug = ultimo.livro_id.nome
        })
        .catch((error) => {
          console.error("Erro na busca de aluguéis", error)
        })
    },
    // Livros
    CalcDisp() {
      // Total disponível
      this.totalDisp = this.books.reduce((total, book) => total + book.quantidade, 0)
      // Quantidade dos livros disponíveis
      this.books.forEach(book => {
        this.$set(this.DispId, book.nome, book.quantidade);
      });
      // Ordena os livros de acordo com a disponibilidade
      this.books.sort((a, b) => b.quantidade - a.quantidade);
    },
    totalCalc() {
      // filtra so os alugueis que nao estao devolvidos
      const filtereds = this.alugs.filter(alug => !alug.data_devolucao);
      // armazena o total 
      this.total = this.totalDisp + filtereds.length
    },
    CalcMaisAlug() {
      const AlugsCount = {};
      this.alugs.forEach(alug => {
        const livronome = alug.livro_id.nome;
        if (AlugsCount[livronome]) {
          AlugsCount[livronome]++;
        } else {
          AlugsCount[livronome] = 1;
        }
      });
      this.maisalugados = Object.keys(AlugsCount)
        .sort((a, b) => AlugsCount[b] - AlugsCount[a])
        .map(livronome => ({ livronome, quantidade: AlugsCount[livronome] }));
    },
    truncateLabel(label) {
      const maxLength = 13;
      if (label.length > maxLength) {
        return label.substring(0, maxLength) + '...';
      }
      return label;
    },
    // graficos
    updateCharts() {
      // Barra
      const ctx = this.$refs.myChart.getContext('2d');
      new Chart(ctx, {
        type: 'bar',
        data: {
          labels: [
            this.truncateLabel(this.maisalugados[0].livronome),
            this.truncateLabel(this.maisalugados[1].livronome),
            this.truncateLabel(this.maisalugados[2].livronome),
            this.truncateLabel(this.maisalugados[3].livronome),
            this.truncateLabel(this.maisalugados[4].livronome),
          ],
          datasets: [{
            label: '',
            data: [
              this.maisalugados[0].quantidade,
              this.maisalugados[1].quantidade,
              this.maisalugados[2].quantidade,
              this.maisalugados[3].quantidade,
              this.maisalugados[4].quantidade,
            ],
            backgroundColor: [
              'rgb(105, 0, 12)',
              'rgb(3, 100, 166)',
              'rgb(217, 155, 2)',
              'rgb(3, 166, 166)',
              'rgb(72, 0, 217)',
            ],
            borderWidth: 0
          }]
        },
        options: {
          legend: {
            display: false,
          },
          scales: {
            y: {
              beginAtZero: true,
              grid: {
                offset: false
              }
            },

          }
        }
      });
      // Torta/Pizza
      const ctz = this.$refs.myPieChart.getContext('2d');
      new Chart(ctz, {
        type: 'pie',
        data: {
          labels: [
            this.books[0].nome,
            this.books[1].nome,
            this.books[2].nome,
            this.books[3].nome,
            this.books[4].nome
          ],
          datasets: [{
            label: '# Livro1',
            data: [
              this.books[0].quantidade,
              this.books[1].quantidade,
              this.books[2].quantidade,
              this.books[3].quantidade,
              this.books[4].quantidade
            ],
            backgroundColor: [
              'rgb(105, 0, 12)',
              'rgb(3, 100, 166)',
              'rgb(217, 155, 2)',
              'rgb(3, 166, 166)',
              'rgb(72, 0, 217)',
            ],
            borderWidth: 0
          }]
        },
        options: {
          scales: {
            y: {
              beginAtZero: true
            }
          }
        }
      });
    }
  }
}
</script>
