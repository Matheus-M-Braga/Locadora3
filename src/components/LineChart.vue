<template>
  <v-card elevation="4" class="col-6">
    <canvas ref="myChart" width="450" height="200" class="chartBar"></canvas>
  </v-card>
</template>

<script>
import Chart from "chart.js";
import Rental from "@/services/rental";

export default {
  data() {
    return {
      rentals: [],
      mostrented: [],
    };
  },
  mounted() {
    this.listRentals();
  },
  watch: {
    rentals: {
      handler() {
        this.updateBarChart();
      },
      deep: true,
    },
  },
  methods: {
    listRentals() {
      Rental.list()
        .then((response) => {
          this.rentals = response.data;
          this.sortRentals();
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
    sortRentals() {
      // Mais alugados
      const RentalCount = {};
      this.rentals.forEach((rental) => {
        const bookname = rental.livro_id.nome;
        if (RentalCount[bookname]) {
          RentalCount[bookname]++;
        } else {
          RentalCount[bookname] = 1;
        }
      });
      this.mostrented = Object.keys(RentalCount)
        .sort((a, b) => RentalCount[b] - RentalCount[a])
        .map((bookname) => ({ bookname, quantidade: RentalCount[bookname] }));
    },
    updateBarChart() {
      const ctx = this.$refs.myChart.getContext("2d");
      const topFour = this.mostrented.slice(0, 4);
      const labels = topFour.map((item) => this.truncateLabel(item.bookname));
      const data = topFour.map((item) => item.quantidade);
      console.log(data);
      new Chart(ctx, {
        type: "bar",
        data: {
          labels: labels,
          datasets: [
            {
              label: "",
              data: data,
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
          title: {
            display: true,
            text: "Livros mais alugados",
            fontSize: 25,
            fontFamily: "Roboto",
          },
        },
      });
    },
  },
};
</script>
