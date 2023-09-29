<template lang="pug">
div.home
  h1(v-if="loggedIn") Welcome, #{username}!
  div(v-else)
    h3 Log In
    LogInForm
  div.col-md-8.mx-auto.mt-3
    // Add this for the sign-up modal
    button.btn.btn-primary.me-3(type="button" data-bs-toggle="modal" data-bs-target="#signUpModal") Sign Up
    button.btn.btn-primary(type="submit") Login
          
  // The sign-up modal itself
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
import { mapState } from 'vuex'
import LogInForm from "@/components/LogInForm.vue"
import SignUpForm from "@/components/SignUpForm.vue" // Import the SignUpForm component

export default {
  name: 'vHome',
  components: {
    LogInForm,
    SignUpForm // Add SignUpForm here
  },
  computed: {
    ...mapState({
      loggedIn: state => state.loggedIn,
      username: state => state.username
    })
  }
}

</script>
  