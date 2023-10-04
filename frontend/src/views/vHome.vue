<template lang="pug">
div.home
  h1(v-if="loggedIn") Welcome, {{user.username}}!
    div.col-md-8.mx-auto.mt-3
      button.btn.btn-outline-danger(type="button" @click="logout") Logout
  
  div(v-else)
    h3 Log In
    LogInForm(ref="loginForm")
    div.col-md-8.mx-auto.mt-3
      button.btn.btn-primary.me-3(type="button" data-bs-toggle="modal" data-bs-target="#signUpModal") Sign Up
      button.btn.btn-primary(type="button" @click="login") Login
    div.modal.fade(tabindex="-1" id="signUpModal")
      div.modal-dialog
        div.modal-content
          div.modal-header
            h5.modal-title Sign Up
            button.btn-close(type="button" data-bs-dismiss="modal" aria-label="Close")
          div.modal-body
            SignUpForm
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
    ...mapActions(['logout']),
    
    login() {
      this.$refs.loginForm.login()
    }
  },
  created() {
    this.$store.dispatch('loadUserFromCookie')
      .catch(error => {
        console.error('Error loading user from cookie:', error)
        // Handle the error here, e.g. show an error message to the user
      })
  }
}
</script>
  