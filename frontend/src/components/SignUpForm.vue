<template lang="pug">
div.modal.fade.show.d-block(
    v-if="showSignUpModal", 
    id='SignUpForm', 
    tabindex='-1', 
    role='dialog',
    aria-labelledby='SignUpFormLabel', 
    aria-hidden='false'
)
  div.modal-dialog
    div.modal-content
      div.modal-header
        h5.modal-title Sign Up
        button.btn-close(type="button" aria-label="Close" @click="closeSignUpModal")
      div.modal-body
        form(@submit.prevent="createUser")
          .form-group
            label(for="email") Email
            input.form-control#email(type="email" v-model="email" placeholder="Enter email")
          .form-group
            label(for="password") Password
            input.form-control#password(type="password" v-model="password" placeholder="Enter password")
          .form-group
            label(for="username") Username
            input.form-control#username(type="text" v-model="username" placeholder="Enter username")
          button.btn.btn-primary(type="submit") Sign Up
</template>

<script>
export default {
  name: 'SignUpForm',
  created() {

  },
  
  data() {
    return {
      email: '',
      password: '',
      username: ''
    }
  },
  
  props: {
  },
  
  components: {
  },
  
  computed: {
    showSignUpModal(){
      return this.$store.state.showSignUpModal
    },
  },
  
  methods: {
    async createUser() { // on submit of the form - create the user then emit the closeModal event
      try {
        const payload = {
          email: this.email,
          password: this.password,
          username: this.username
        }
        await this.$store.dispatch('createUser', payload)
        console.log(`Created user: ${this.username}`)
        this.closeSignUpModal()
        console.log(`Emitted closeSignUpModal`)
      } catch (e) {
        console.log(e)
      }
    },
    closeSignUpModal(){
      this.$store.commit('toggleSignUpModal', false)
    },
  },
}
</script>