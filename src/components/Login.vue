<template>
   <div style="background-color: #1E1E1E; height: 100vh; widows: 100vw;">
      <div class="login">
         <div class="title text-center">Login</div>
         <v-form v-model="valid">
         <v-layout row justify-center>
            <v-col>
               <v-text-field
                  v-model="firstname"
                  :rules="nameRules"
                  :counter="10"
                  label="First name"
                  required
               ></v-text-field>
               <v-text-field
                  v-model="email"
                  :rules="emailRules"
                  type="password"
                  label="E-mail"
                  required
               ></v-text-field>
            </v-col>
         </v-layout>
         <v-layout row justify-center>
            <v-btn
               dark
               width="60%"
               class=""
               type="submit"
               :disabled="invalid"
            >
            Entrar
            </v-btn>
         </v-layout>
      </v-form>
      </div>
   </div>
</template>
<script>
  export default {
    data: () => ({
      valid: false,
      firstname: '',
      lastname: '',
      nameRules: [
        v => !!v || 'Name is required',
        v => v.length <= 10 || 'Name must be less than 10 characters',
      ],
      email: '',
      emailRules: [
        v => !!v || 'E-mail is required',
        v => /.+@.+/.test(v) || 'E-mail must be valid',
      ],
    }),
  }
</script>
<style scoped>
.login{
   position: absolute;
   top: 50%;
   left: 50%;
   transform: translate(-50%, -50%);
   background: whitesmoke;
   width: 50%;
   height: 400px;
   display: flex;
   flex-direction: column;
   justify-content: center;
   padding: 15px;
   border-radius: 10px;
}
</style>