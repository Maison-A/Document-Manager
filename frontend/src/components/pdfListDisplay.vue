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
          :class="{ 'list-group-item': true, 'active': isActive(document) }"
        )
          div.text-center.row
              div.d-flex.align-items.justify-content-between.col
                    a(@click.prevent="openModal(document)")
                        button.btn.btn-dark.btn-lg {{ document.title }}
                        p.text-wrap.fs-4 {{ document.description }}
              div.col
                button.btn.btn-outline-danger.d-flex.flex-column(
                  type="button"
                  @click="confirmDelete(document._id, document.title)"
                ) Delete
        mDocumentPopout.modal-fade(role="dialog" :documentId="selectedId")
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
    ...mapActions(['fetchAllDocuments','deleteDocument','toggleModal','setPdfSrc', 'fetchDocumentById',]),
    
    isActive(document){
        return document && document?._id === this.selectedId
    },
    
    async confirmDelete(documentId, documentTitle){
      const willDelete = window.confirm(`Confirm you would like to delete ${documentTitle}` )
      
      if(willDelete){
        await this.deleteDocument(documentId)
        await this.fetchAllDocuments() // hard reload all docs
      }
    },
    
    async openModal(document) {
      try {
        const fetchedDocument = await this.fetchDocumentById(document._id)
        
        if(fetchedDocument) {
          await this.setActiveDocument(fetchedDocument)
          await this.toggleModal(true)
        }
      } catch(e) {
        console.log(`ERROR in openModal(document): ${e}`)
        throw e
      }
    },
    
    setActiveDocument(fetchedDocument){
      // console.log(JSON.stringify(fetchedDocument, null,2)) // debug
      // console.log(`Document in setActiveDocument:${fetchedDocument}`) // debug
      this.selectedId = fetchedDocument?._id
      
      this.$store.commit('setCurrentDocument', fetchedDocument)
      // this.$store.commit('setPdfSrc', document.fileUrl)
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
</style>