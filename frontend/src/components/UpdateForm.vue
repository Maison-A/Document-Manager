<template lang="pug">
div
    form    
        div.row
            div.col
                label(for="updateTitleInput") Update Document Title
                input.form-control(
                    v-model="updateData.title",
                    type="text", 
                    id="updateTitleInput", 
                    :placeholder="currentDocument.title"
                )
            div.col
                .form-group
                    label(for="updateDescriptionInput") Update Document Description
                    input.form-control(
                        v-model="updateData.description",
                        type="text", 
                        id="updateDescriptionInput",
                        :placeholder="currentDocument.description"
                    )
        div.row
            div.col
                button.btn.btn-primary(
                    type='button'
                    @click='updateDocument'
                ) Save changes
</template>

<script>
export default {
  data() {
    return {
      updateData: {
        title: '',
        description: ''
      },
      currentDocument: {
        title: 'current doc title',
        description: 'current doc description',
        id: 'currentDocId'  // You would replace this with the actual current doc id
      }
    }
  },
  methods: {
    updateDocument() {
      if(this.updateData.title || this.updateData.description) {
        this.$store.dispatch('updateDocument', { 
          documentId: this.currentDocument.id, 
          updateData: this.updateData
        });
      } else {
        console.log('No changes made');
      }
    }
  }
}
</script>

<style>

</style>
```

I've removed the file input and its corresponding method. The `updateDocument` method now only checks for changes in title or description before dispatching the store action. Remember to replace the placeholders in the `currentDocument` object with actual data.

Let's roll with this, and if you have more tweaks in mind, feel free to hit me up!