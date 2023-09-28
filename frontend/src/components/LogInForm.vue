<template lang="pug">
div
form(@submit.prevent="login")
    input(v-model="email" type="text" placeholder="Email")
    input(v-model="password" type="password" placeholder="Password")
    button(type="submit") Login
</template>

<script>
import { useStore } from 'vuex'

export default {
  data() {
    return {
      email: '',
      password: ''
    }
  },
  methods: {
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
