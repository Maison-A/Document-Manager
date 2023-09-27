<template lang="pug">
div
form(@submit.prevent="login")
    input(v-model="email" type="text" placeholder="Email")
    input(v-model="password" type="password" placeholder="Password")
    button(type="submit") Login
</template>

<script>
import axios from 'axios'

export default {
  data() {
    return {
      email: '',
      password: ''
    }
  },
  methods: {
    async login() {
      try {
        // Post request to your API to validate the user.
        const res = await axios.post('/user/login', {
          email: this.email,
          password: this.password
        })
        // Assume the API responds with a token to be saved.
        localStorage.setItem('token', res.data.token)
      } catch (err) {
        console.error('An error occurred during login:', err)
      }
    }
  }
}
</script>
