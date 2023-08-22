<template>
   <v-flex sm6 xs12 md6>
      <div class="chart_container">
         <div class="title text-center">Status de Aluguéis</div>
         <canvas ref="myPieChart" width="450" height="200" class="chartPie"></canvas>
      </div>
   </v-flex>
</template>

<script>
import Chart from "chart.js";
import Rentals from "@/services/alug";

export default {
   data() {
      return {
         alugs: [],
      };
   },
   mounted() {
      this.fetchStatus();
   },
   watch: {
      alugs: {
         handler() {
            this.updatePieChart();
         },
         deep: true,
      }
   },
   methods: {
      parseDateISO(date) {
         const [dd, mm, yyyy] = date.split("/");
         return `${yyyy}-${mm}-${dd}`;
      },
      async fetchStatus() {
         try {
            const rentals = await Rentals.list();
            const status = {
               "No prazo": 0,
               "Atrasado": 0,
               "Pendente": 0,
            };

            rentals.data.forEach((rental) => {
               if (rental.data_devolucao != null) {
                  const devolucaoDate = this.parseDateISO(rental.data_devolucao);
                  const previsaoDate = this.parseDateISO(rental.data_previsao);
                  if (devolucaoDate > previsaoDate) {
                     status["Atrasado"]++;
                  } else {
                     status["No prazo"]++;
                  }
               } else {
                  status["Pendente"]++;
               }
            });

            const statusCountArray = Object.entries(status);

            // statusCountArray.sort((a, b) => b[1] - a[1]);

            this.alugs = statusCountArray;

            this.updatePieChart();
         } catch (error) {
            console.error("Erro ao buscar dados:", error);
         }
      },
      updatePieChart() {
         if (!this.alugs) return;

         const labels = this.alugs.map((item) => item[0]);
         const data = this.alugs.map((item) => item[1]);
         const ctx = this.$refs.myPieChart.getContext("2d");
         new Chart(ctx, {
            type: "pie",
            options: {
               indexAxis: "x",
               scales: {
                  x: {
                     display: false, // Remove o eixo X
                  },
                  y: {
                     beginAtZero: true,
                  },
               },
            },
            data: {
               labels: labels,
               datasets: [
                  {
                     axis: "y",
                     label: "Livros Alugados",
                     data: data,
                     fill: false,
                     backgroundColor: [
                        'rgb(2, 149, 90)',
                        'rgb(168, 45, 54)',
                        'rgb(235, 204, 0)',
                     ],
                     borderColor: [
                        'rgb(2, 149, 90)',
                        'rgb(168, 45, 54)',
                        'rgb(235, 204, 0)',
                     ],
                     borderWidth: 1,
                  },
               ],
            },
            plugins: {
               legend: {
                  display: false,
               },
            },
         });
      },
   }
}
</script>
