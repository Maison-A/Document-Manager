import { createStore } from 'vuex'
const { log } = require('../../../utils/generalUtils')
const axios = require('axios')
axios.defaults.baseURL = 'http://localhost:3000/'

export default createStore({
  state: {
    // state props
    documents: [],
    showModal: false,
    pdfSrc: '',
    categories: ['signatures', 'supporting documents'],
    currentDocument:{},
  },
  getters: {
    // getters
    getCurrentDocument(state){
      return state.currentDocument
    }
  },
  mutations: {
    addDocument(state,document){
      state.documents.push(document)
    },
    
    setDocuments(state, documents){
      state.documents = documents
    },
    
    deleteDocument(state, documentId) {
      state.documents = state.documents.filter(document => document._id !== documentId)
    },
    
    toggleModal(state, payload){
      state.showModal = payload
    },
    
    setPdfSrc(state, url){
      state.pdfSrc = url
      console.log(`pdfSrc in mutation: ${state.pdfSrc}`)
    },
    
    setCurrentDocument(state, document) {
      state.currentDocument = document
    },
  },
  actions: {
    /**
     * Name: fetchAllDocuments
     * Desc: 
     * @param {}  - 
     * @returns {}  - 
     */
    async fetchAllDocuments({commit}){
      try{
        const res = await axios.get('/docs/all')
        commit('setDocuments', res.data)
      }catch(e){
        console.log('ERROR || s_Index fetchAllDcouments(): ', e)
        commit('setDocuments',[]) // clear array
      }
    },
    
    
    
  /**
   * Name: createAndStoreDocument
   * Desc: 
   * @param {}  - 
   * @returns {}  - 
  */
    async createAndStoreDocument({ commit }, payload) {
      try {
        const response = await axios.post('/docs/create', payload)
        if (response.data.message.includes('saved successfully')) {
          commit('addDocument', response.data.result)
          this.dispatch('fetchAllDocuments') // hard reload
        }
      } catch (e) {
        console.log('Error in createAndStoreDocument', e)
      }
    },
    
    
    
  /**
   * Name: fetchDocumentById
   * Desc: 
   * @param {}  - 
   * @returns {}  - 
  */
    async fetchDocumentById({commit}, documentId){
      try{
        const res = await axios.get(`docs/display/${documentId}`)
        log(`response fileUrl: ${res.data.fileUrl}`)
        
        commit('setPdfSrc', `http://localhost:3000${res.data.fileUrl}`)
        log(`response-data-document: ${res.data}`)
        log(`response-data: ${res.data}`)
        
        commit('setCurrentDocument', res.data)
        // log(`Current Document Now Set: ${res.data}`) // debug
        // log(`Final PDF Source URL: http://localhost:3000${res.data.fileUrl}`) // debug

        return res.data
        
      }catch(e){
        console.log(`Error fetching document by id ${e}`)
      }
    },
  
  
    
  /**
   * Name: updateDocument
   * Desc: 
   * @param {}  - 
   * @returns {}  - 
  */
    async updateDocument({ commit }, { documentId, updateData, file }) {
      try {
        const formData = new FormData()
        Object.keys(updateData).forEach(key => {
          formData.append(key, updateData[key])
        })
        if(file) {
          formData.append('file', file)
        }
        
        const response = await axios.post(`/docs/update/${documentId}`, formData)
        
        if (response.data.message.includes('updated successfully')) {
          commit('setDocuments', response.data.updatedDocument) // update state with the new document data
          this.dispatch('fetchAllDocuments') // hard reload to ensure data consistency
        }
      } catch (e) {
        console.log(`Error in updateDocument: ${e}`)
      }
    },


  /**
   * Name: deleteDocument
   * Desc: 
   * @param {}  - 
   * @returns {}  - 
  */
    async deleteDocument({commit}, documentId){
      try {
        const response = await axios.delete(`/docs/delete/${documentId}`);
        if (response.data.message === 'Document deleted') {
          commit('deleteDocument', documentId) // Update Vuex state
          this.dispatch('fetchAllDocuments') // hard reload
        }
      } catch(e){
        console.log(`error in delete documents ${e}`)
        commit('deleteDocument', documentId)
      }
    },

    
    toggleModal({commit}, payload){
      commit('toggleModal', payload)
    },
    
    setPdfSrc({commit}, payload){
      commit('setPdfSrc', payload)
    },
  },
  modules: {
  }
})