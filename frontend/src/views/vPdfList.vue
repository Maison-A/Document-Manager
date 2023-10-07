<!-- 
* Title: vPdfList
* Description:
-->
<template lang="pug">
div
    div(v-if='!loggedIn')
        h3.form-label Please login to view PDFs
        button.btn.btn-primary.btn-lg.shadow-sm.me-4(@click="login()")
            | Login
    div(v-if='loggedIn')
        PdfListDisplay(v-if="documents" :documents="documents")
</template>
    
<script>
import PdfListDisplay from "@/components/pdfListDisplay.vue"
import { mapState, mapActions } from "vuex"

export default {
    name: "vPdfList",
    props: {},
    computed: {
        ...mapState(['documents', 'loggedIn', 'user'])
    },

    components:{
        PdfListDisplay,
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

<style scoped lang="scss">

</style>