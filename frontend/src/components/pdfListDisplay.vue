<!-- 
 * Title: PdfListDisplay.vue
 * Description:
-->
<template lang="pug">
div
  div(v-if='documents && documents.length > 0')
    h3.form-label PDF List
    ul.list-group.container
        li(v-for="document in documents"
          :key="document._id"
          :class="{ 'list-group-item': true }"
        )
          div.text-center.row
              div.d-flex.align-items.justify-content-between.col
                    a(@click.prevent="openModal(document)")
                        button.btn.btn-dark.btn-lg.shadow-sm.me-4 {{ document.title }}
                        p.text-wrap.fs-4.d-inline-flex {{ document.description }}
              div.col
                button.btn.btn-outline-danger.shadow-sm.d-flex.flex-row-reverse(
                  type="button"
                  @click="confirmDelete(document._id, document.title)"
                ) Delete
        mDocumentPopout.modal-fade(
          role="dialog" 
          :key="selectedId"
          :documentId="selectedId" 
        )
</template>

<script>
import {mapState, mapActions} from 'vuex'
import mDocumentPopout from './mDocumentPopout.vue'
export default {
  name: "PdfListDisplay",
  props: {},
  components:{
    mDocumentPopout
  },
  computed:{
    ...mapState(['documents']),
  },
  data(){
    return{
        selectedId: null
    }
  },
  methods:{
    ...mapActions([
      'fetchAllDocuments',
    'deleteDocument',
    'toggleModal',
    'setPdfSrc', 
    'fetchDocumentById'
  ]),
    
    isActive(document){
        return document && document?._id === this.selectedId
    },
    
    async confirmDelete(documentId, documentTitle){
      const willDelete = window.confirm(`Confirm you would like to delete ${documentTitle}`)
      
      if(willDelete){
        await this.deleteDocument(documentId)
        await this.fetchAllDocuments() // hard reload all docs
      }
    },
    
    async openModal(document){
      try {
        this.selectedId = document?._id // set id to pass in to modal
        const fetchedDocument = await this.fetchDocumentById(document._id) // fetch doc to pass
        
        if(fetchedDocument) { // if successful, update store
          await this.$store.commit('setCurrentDocument', fetchedDocument) // commiut new doc and set as 'current doc'
          await this.toggleModal(true)
        }
      } catch(e) {
        console.log(`>>> ERROR in openModal(document): ${e} <<<`)
        throw e
      }
    },
},
    
    watch: {
    documentId(newVal, oldVal) {
      console.log(`> pdfListDisplay - documentId changed: ${oldVal} -> ${newVal} <`)
    }

  },
}
</script>

<style scoped lang="scss">
h3 {
    margin: 40px 0 0;
}
ul {
    list-style-type: none;
    padding: 0;
}
li {
    display: inline-block;
    margin: 0 10px;
}
a {
    color: #000000;
    text-decoration: none;
    &:hover {
      text-decoration: underline;
    }
}
.mr{
  margin-right: 10;
}
</style>