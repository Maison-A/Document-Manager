<template lang="pug">
div.modal.fade.show.d-block(
    v-if="showModal", 
    id='docDisplay', 
    tabindex='-1', 
    role='dialog',
    aria-labelledby='docDisplayLabel', 
    aria-hidden='false'
)
    div.modal-dialog.modal-lg.border.border.primary.rounded(role='document')
        div.modal-content
            h5.modal-title.m-3(id='docDisplayLabel') {{ currentTitle }}
                button(
                    type='button'
                    class='close'
                    @click='closeModal'
                    aria-label='Close'
                )
                    span(aria-hidden='true') &times;
            div.modal-body
                vue-pdf-embed(
                    :source="pdfSrc"
                    width="600"
                    height="500"
                )
            div.modal-footer
            form    
                div.row.mb-3
                    div.col
                        label(for="updateTitleInput") Update Document Title
                        input.form-control(
                            v-model="updateData.title",
                            id="updateTitleInput",
                            :placeholder="currentTitle"
                        )
                    div.col
                            label(for="updateDescriptionInput") Update Document Description
                            input.form-control(
                                v-model="updateData.description",
                                id="updateDescriptionInput",
                                :placeholder="currentDescription"
                            )
                div.row.mb-3
                    div.col
                        button.btn.btn-secondary(
                            type='button',
                            @click='closeModal'
                        ) Close
                    div.col
                        button.btn.btn-success(
                            type='button'
                            @click='updateDocument'
                        ) Save Changes
</template>

<script>
import VuePdfEmbed from 'vue-pdf-embed'

export default {
    name: 'DocumentPopout',
    props: {
        documentId:{
            type: String,
            default: 'no-document-id-passed'
        },
    },
    components:{ 
        VuePdfEmbed,
     },
    
    data() {
        return {
            updateData: {
                title: '',
                description: ''
            },
            isDataLoaded: false,
        }
    },

    computed: {
        showModal(){
            return this.$store.state.showModal
        },
        pdfSrc(){
            console.log(`> DocumentPopout - pdfSrc returned from pdfSrc(): ${this.$store.state.pdfSrc} <`)
            return this.$store.state.pdfSrc
        },
        currentDocument(){
            console.log(`> DocumentPopout - document returned from currentDocument(): ${JSON.stringify(this.$store.getters.getCurrentDocument, null, 2)} <`)
            return this.$store.getters.getCurrentDocument
        },
        currentTitle(){
            console.log(`> DocumentPopout - title returned from currentTitle(): ${this.currentDocument?.title} <`)
            return this.currentDocument ? this.currentDocument.title  : 'Error in backend'
        },
        currentDescription(){
            console.log(`> DocumentPopout - description returned from currentDescription(): ${this.currentDocument?.description} <`)
            return this.currentDocument ? this.currentDocument.description : 'Error in backend'
        }

    },
    
    methods: {
        closeModal(){
            this.$store.commit('setCurrentDocument', null)
            console.log(`> DocumentPopout - current Document cleared: ${this.currentDocument}<`) // logs current document again due to nature of calling currentDocument
            this.$store.commit('toggleModal', false)
        },
        updateDocument() {
            if(this.updateData.title || this.updateData.description) {
                console.log(`> Sending Update Data: ${JSON.stringify(this.updateData, null, 2)} <`)
                console.log(`> Document ID passed in UpdateDocument(): ${this.documentId} <`)
                if(this.updateData.title === ''){
                    this.updateData.title = this.currentTitle
                }
                if(this.updateData.description === ''){
                    this.updateData.description = this.currentDescription
                }
                this.$store.dispatch('updateDocument', {
                    documentId: this.documentId,
                    updateData: this.updateData
                })
            } else {
                console.log('No changes made')
            }
        },
    },
    created() {
        console.log(`> Document Popout - Doc on Created(): ${JSON.stringify(this.$store.getters.getCurrentDocument, null, 2)} <`)
        
        if(this.documentId && this.documentId !== 'no-document-id-passed'){
            console.log(`> Document Popout - Document ID on creation: ${this.documentId} <`) // debug
            console.log(`> Document Popout - Current Document on creation fetch: ${this.$store.getters.getCurrentDocument} <`) // debug
            
            this.updateData.title = this.currentDocument?.title || ''
            this.updateData.description = this.currentDocument?.description || ''
            
            this.isDataLoaded = true  // set isDataLoaded to true once data is fetched
        }
    },

}
</script>

<style>
.modal.fade.show {
  display: block;
  background: rgba(0, 0, 0, 0.5);
}
</style>
