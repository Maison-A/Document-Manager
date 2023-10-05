<template lang="pug">
div.container
  div.row.justify-content-center
    div.col-md-6.mx-auto
      form(@submit.prevent="login")
        div.row
          div.col-md-8.mx-auto
            div.form-group.mb-2
              label(for="login-email") Email
              input.form-control(v-model="email" type="text" id="login-email" placeholder="Enter email")
        div.row
          div.col-md-8.mx-auto
            div.form-group
              label(for="login-password") Password
              input.form-control(v-model="password" type="password" id="login-password" placeholder="Enter password")
</template>

<script>
import { mapActions } from 'vuex'

export default {
  data() {
    return {
      email: '',
      password: ''
    }
  },
  methods: {
    ...mapActions(['loginUser']),
    login() {
      const payload = {
        email: this.email,
        password: this.password
      }
      this.$store.dispatch('loginUser', payload)
    }
  }
}
</script>
