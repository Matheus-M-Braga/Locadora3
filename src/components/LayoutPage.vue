<template >
   <nav>
      <v-navigation-drawer absolute temporary dark v-model="isDrawerOpen" class="sidebar">
         <!-- links -->
         <v-list>
            <v-list-item>
               <v-layout flex class="header_side">
                  <v-app-bar-nav-icon large @click="isDrawerOpen = !isDrawerOpen" class="menu_icon"></v-app-bar-nav-icon>
                  <div class="d-flex align-center white--text" style="font-size: 22px;">
                     <v-icon>mdi-bookshelf</v-icon>WDA Livraria
                  </div>
                  <div>
               </div>
               </v-layout>
            </v-list-item>
            <v-list-item flat v-for="link in links" :key="link.text" router :to="link.route">
               <v-list-item-icon>
                  <v-icon>{{ link.icon }}</v-icon>
               </v-list-item-icon>
               <v-list-item-title>{{ link.text }}</v-list-item-title>
            </v-list-item>
         </v-list>
      </v-navigation-drawer>
      <v-app-bar
         app
         dark
       >
         <v-app-bar-nav-icon @click="isDrawerOpen = !isDrawerOpen" class="menu_icon"></v-app-bar-nav-icon>
         <div class="d-flex align-center">
           <v-btn href="/"><v-icon>mdi-bookshelf</v-icon> WDA LIVRARIA</v-btn>
         </div>
         <v-spacer></v-spacer>
         <v-btn
           href="/"
           text
         >
           <span class="mr-2">Sair</span>
           <v-icon>mdi-logout</v-icon>
         </v-btn>
      </v-app-bar>
      <v-main>
         <slot></slot>
      </v-main>
   </nav>
</template>
<script>
export default {
   data() {
      return {
         links: [
            { icon: 'mdi-widgets', text: 'Dashboard', route: '/' },
            { icon: 'mdi-account', text: 'Usuário', route: '/user' },
            { icon: 'mdi-book', text: 'Livro', route: '/book' },
            { icon: 'mdi-pencil', text: 'Editora', route: '/edit' },
            { icon: 'mdi-book-account', text: 'Aluguel', route: '/alug' }
         ]
      }
   }
}
</script>
<script setup>
import { ref } from "vue";

const isDrawerOpen = ref(false)
</script>
