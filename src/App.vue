<template>
  <v-app>
    <LayoutPage v-if="!login" />
    <router-view></router-view>
  </v-app>
</template>

<script>

import LayoutPage from './components/LayoutPage'

  export default {
    name: 'App',

    components: {
      LayoutPage,
    },
    computed: {
      login() {
        return this.$route.path === '/login';
      }
    }
  }
</script>
<style src="./assets/style.css"></style>