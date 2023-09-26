<template lang="pug">
div.home
  Landing
  LogInForm
</template>

<script>
import Landing from "@/components/Landing.vue"
import LogInForm from "@/components/LogInForm.vue"
export default {
  name: 'vHome',
  components: {
    Landing,
    LogInForm
  }
}
</script>
