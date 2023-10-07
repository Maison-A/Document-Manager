<template lang="pug">
div(v-if='loggedIn')
  h1 Create a New Pdf!
  CreateForm
div(v-if='!loggedIn')
  h3.form-label Please login to create PDFs
  button.btn.btn-primary.btn-lg.shadow-sm.me-4(@click="login()")
    | Login
</template>
<script>
import CreateForm from '../components/CreateForm.vue'
import { mapState, mapActions } from "vuex"
export default {
  name: "vNewDocument",
  components:{
    CreateForm,
  },
  computed: {
        ...mapState(['documents', 'loggedIn', 'user'])
    },
  methods:{
        ...mapActions(['fetchAllDocuments', 'fetchUser'])
    },    
   
    async created(){
        if(this.loggedIn) {
            await this.fetchAllDocuments()
            this.$store.commit('setLoggedIn', true)
        } else {
            this.$store.commit('setLoggedIn', false)
        }
    }
}
</script>

<style>

</style>