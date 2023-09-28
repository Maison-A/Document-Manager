<template lang="pug">
div.home
  Landing
  LogInForm
  SignUpForm
</template>

<script>
import Landing from "@/components/Landing.vue"
import LogInForm from "@/components/LogInForm.vue"
import SignUpForm from "@/components/SignUpForm.vue"
export default {
  name: 'vHome',
  components: {
    Landing,
    LogInForm,
    SignUpForm
  }
}
</script>
