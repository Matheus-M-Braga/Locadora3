<template>
  <v-toolbar class="top">
    <v-row :align="'center'" class="my-0 mx-0">
      <v-toolbar-title class="title subheading text-h4 mr-15">{{
        PageTitle
      }}</v-toolbar-title>
      <v-btn dark @click="openModalCreate"
        >Novo <v-icon>mdi-plus</v-icon></v-btn
      >
    </v-row>
    <v-spacer></v-spacer>
    <v-text-field
      v-model="localSearch"
      dense
      hide-details
      label="Pesquisar"
      outlined
      prepend-inner-icon="mdi-magnify"
      filled
    ></v-text-field>
  </v-toolbar>
</template>
<script>
export default {
  props: {
    PageTitle: String,
    search: String,
  },
  data() {
    return {
      localSearch: this.search, // Use uma propriedade local para manter o estado
    };
  },
  watch: {
    localSearch(newSearchValue) {
      // Emitir um evento personalizado para atualizar a propriedade "search" no componente pai
      this.$emit("updateSearch", newSearchValue);
    },
  },
  methods: {
   openModalCreate() {
      // Emitir um evento personalizado para indicar que o modal deve ser aberto
      this.$emit("open-modal");
    },
  }
};
</script>
