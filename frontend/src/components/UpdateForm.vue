<template lang="pug">
div
    form    
        div.row
            div.col
                label(for="updateTitleInput") Update Document Title
                input.form-control(
                    v-model="updateData.title",
                    id="updateTitleInput",
                    :placeholder="currentTitle"
                )
            div.col
                .form-group
                    label(for="updateDescriptionInput") Update Document Description
                    input.form-control(
                        v-model="updateData.description",
                        id="updateDescriptionInput",
                        :placeholder="currentDescription"
                    )
            div.col
                button.btn.btn-primary(
                    type='button'
                    @click='updateDocument'
                ) Save Changes
</template>

<script>
export default {
  name: 'UpdateForm',
  props: ['currentDocument'],
  data() {
    return {
      updateData: {
        title: '',
        description: ''
      }
    }
  },
  computed:{
    currentTitle(){
      return this.currentDocument ? this.currentDocument.title: 'undefined'
    },
    currentDescription(){
      return this.currentDocument ? this.currentDocument.description: 'undefined'
    }
  },
  watch: {
    currentDocument: {
      handler(newValue) {
        if(newValue) {
          this.updateData.title = newValue.title
          this.updateData.description = newValue.description
        }
      },
      deep: true,
      immediate: true
    }
  },
  methods: {
    updateDocument() {
      if(this.updateData.title || this.updateData.description) {
        this.$store.dispatch('updateDocument', { 
          documentId: this.currentDocument._id, 
          updateData: this.updateData
        })
      } else {
        console.log('No changes made')
      }
    }
  }
}
</script>