<template lang="pug">
div.home
  h1(v-if="loggedIn") Welcome, {{user.username}}!
    div.col-md-8.mx-auto.mt-3
      button.btn.btn-outline-danger(type="button" @click="logoutUser") Logout
  
  div(v-else)
    h3 Log In
    LogInForm(ref="loginForm")
    div.col-md-8.mx-auto.mt-3
      button.btn.btn-primary.me-3(type="button" @click="toggleSignUpModal") Sign Up
      button.btn.btn-primary(type="button" @click="login") Login
      SignUpForm.modal-fade(role="dialog")
</template>
  
<script>
import { mapState, mapActions } from 'vuex'
import LogInForm from "@/components/LogInForm.vue"
import SignUpForm from "@/components/SignUpForm.vue"

export default {
  name: 'vHome',
  components: {
    LogInForm,
    SignUpForm
  },
  computed: {
    ...mapState({
      loggedIn: state => state.loggedIn,
      user: state => state.user  // get whole user object
    })
  },
  methods: {
    ...mapActions([
      'logoutUser',
    'toggleSignUpModal']),
    async login() {
        this.$refs.loginForm.login()
    }
  },
  created() {
    if (this.$store.state.user){
      this.$store.dispatch('fetchUser').catch((e) => {
        console.error('Error fetching user:', e)
      })
    }

  }
}
</script> 