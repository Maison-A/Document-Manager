<template lang="pug">
form(@submit.prevent="createUser")
  .form-group
    label(for="email") Email
    input#email.form-control(type="email" v-model="email" placeholder="Enter email")
  .form-group
    label(for="password") Password
    input#password.form-control(type="password" v-model="password" placeholder="Enter password")
  .form-group
    label(for="username") Username
    input#username.form-control(type="text" v-model="username" placeholder="Enter username")
  button.btn.btn-primary(type="submit") Sign Up
</template>

<script>
import { useStore } from 'vuex'

export default {
  data() {
    return {
      email: '',
      password: '',
      username: ''
    }
  },
  methods: {
    createUser() {
      try {
        const payload = {
          email: this.email,
          password: this.password,
          username: this.username
        }
        this.$emit('closeModal')
        this.$store.dispatch('createUser', payload)
      } catch (e) {
        console.log(e)
      }
    }
  }
}
</script>
