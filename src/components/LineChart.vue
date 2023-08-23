<template>
  <v-flex sm6 xs12 md6>
    <div class="chart_container">
      <div class="title text-center">Livros mais alugados</div>
      <canvas ref="myChart" width="450" height="200" class="chartBar"></canvas>
    </div>
  </v-flex>
</template>

<script>
import Chart from "chart.js";
import Aluguel from "@/services/alug";

export default {
  data() {
    return {
      alugs: [],
      maisalugados: [],
    };
  },
  mounted() {
    this.fetchAlugs();
  },
  watch: {
    alugs: {
      handler() {
        this.updateBarChart();
      },
      deep: true,
    },
  },
  methods: {
    fetchAlugs() {
      Aluguel.list()
        .then((response) => {
          this.alugs = response.data;
          this.sortAlugs();
        })
        .catch((error) => {
          console.error("Erro na busca de aluguéis", error);
        });
    },
    // Função pra reduzir as labels do gráfico de barra
    truncateLabel(label) {
      const maxLength = 13;
      if (label.length > maxLength) {
        return label.substring(0, maxLength) + "...";
      }
      return label;
    },
    sortAlugs() {
      // Mais alugados
      const AlugsCount = {};
      this.alugs.forEach((alug) => {
        const livronome = alug.livro_id.nome;
        if (AlugsCount[livronome]) {
          AlugsCount[livronome]++;
        } else {
          AlugsCount[livronome] = 1;
        }
      });
      this.maisalugados = Object.keys(AlugsCount)
        .sort((a, b) => AlugsCount[b] - AlugsCount[a])
        .map((livronome) => ({ livronome, quantidade: AlugsCount[livronome] }));
    },
    updateBarChart() {
      // Barra
      const ctx = this.$refs.myChart.getContext("2d");
      new Chart(ctx, {
        type: "bar",
        data: {
          labels: [
            this.truncateLabel(this.maisalugados[0].livronome),
            this.truncateLabel(this.maisalugados[1].livronome),
            this.truncateLabel(this.maisalugados[2].livronome),
            this.truncateLabel(this.maisalugados[3].livronome),
          ],
          datasets: [
            {
              label: "",
              data: [
                this.maisalugados[0].quantidade,
                this.maisalugados[1].quantidade,
                this.maisalugados[2].quantidade,
                this.maisalugados[3].quantidade,
              ],
              backgroundColor: [
                "rgb(168, 71, 82)",
                "rgb(51, 126, 204)",
                "rgb(255, 204, 0)",
                "rgb(51, 204, 204)",
                "rgb(123, 104, 238)",
              ],
              borderWidth: 0,
            },
          ],
        },
        options: {
          legend: {
            display: false,
          },
        },
      });
    },
  },
};
</script>
