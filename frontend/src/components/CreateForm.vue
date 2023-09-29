<template lang="pug">
div.container
  div.row.justify-content-center
    div.col-md-6
      div.form-group
        label(for='documentTitle') Title of document
        input.form-control(
          id="documentTitle",
          placeholder="Enter Title",
          v-model="document.title"
        )
        small.form-text.text-muted(id="titleTag") A default roman numeral titled document will be generated otherwise
      div.form-group
        label(for='documentDescription') Description of Document
        input.form-control(
          id="documentDescription",
          placeholder="Enter Description",
          v-model="document.description"
        )
        small.form-text.text-muted(id="titleTag") A default description will be generated otherwise
      div.form-group
        select.form-control(
          :class="{ 'is-invalid': isCategoryInvalid }",
          id='category',
          v-model="document.category",
          required
        )
          option(disabled value='') --Select Category--
          option(v-for="category in categories" 
            :key="category"
          ) {{ category }}
      div.form-group
        button.btn.btn-success(@click="submitForm") Submit 
</template>

<script>
import {mapState} from 'vuex'
export default {
    name: 'CreateForm',
  data() {
    return {
      document: {
        title: '',
        description: '',
        category: ''
      },
      isCategoryInvalid: false
    }
  },
  computed: {
    ...mapState(['categories'])
  },
  methods: {
    async submitForm() {
        if (!this.document.category) {
            this.isCategoryInvalid = true
            alert('Please select a category')
            return
        }
        
        this.isCategoryInvalid = false
        try {
            console.log("Form Data:", this.document)
            await this.$store.dispatch('createAndStoreDocument', this.document)
        } catch (e) {
            console.log(`Error submitting form ${e}`)
        }
    },
    }
}
</script>

<style>
.center-form {
  margin: auto;
  width: 100%;
  padding: 10px;
  
}
</style>