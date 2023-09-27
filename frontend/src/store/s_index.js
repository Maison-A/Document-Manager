import { createStore } from 'vuex'
const { log } = require('../../../utils/generalUtils')
const axios = require('axios')
axios.defaults.baseURL = 'http://localhost:3000/'
      
function setFileTitle(inputData){
  let fileTitle = inputData.title
  .trim()
  .replace(/\s+/g, '-') // trim whitespace and replace with - for user titled files
  
  if (!fileTitle.toLowerCase().endsWith('.pdf')){
    fileTitle += `.pdf` // check if .pdf extention exists and place if not
  }
  return fileTitle
}
export default createStore({
  state: {
    documents: [],
    showModal: false,
    pdfSrc: '',
    categories: ['signatures', 'supporting documents'],
    currentDocument:{},
    user: null,
    authToken: null,
  },
  
  getters: {
    getCurrentDocument(state){
      return state.currentDocument
    },
    
    isAuthenticated(state){
      return !!state.user
    },
    
    getAuthToken(state){
      return state.authToken
    },
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
    
    updateDocumentInState(state, updatedDocument) {
      const index = state.documents.findIndex(document => document._id === updatedDocument._id)
      if (index !== -1) {
        state.documents.splice(index, 1, updatedDocument)
      } else 
      {
        log('>> ERROR: Document not found in state <<')
      }
    },
    
    setUser(state, user){
      state.user = user
    },
    
    setAuthToken(state, token){
      state.authToken = token
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
        log(`>>ERROR: Store - fetchAllDcouments() ${e}<<`)
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
        log(`Store - fetchDocumentById() param - documentID: ${documentId}`)
        
        log(`Store - fetchDocumentById() response - fileUrl: ${res.data.fileUrl}`)
        commit('setPdfSrc', `http://localhost:3000${res.data.fileUrl}`)
        
        log(`Store - fetchDocumentById() response - res.data: ${JSON.stringify(res.data, null, 2)}`)
        commit('setCurrentDocument', res.data)
        
        return res.data
      }catch(e){
        console.log(`>> ERROR: fetching document by id ${e} <<`)
      }
    },
  
    
  /**
   * Name: updateDocument
   * Desc: 
   * @param {}  - 
   * @returns {}  - 
  */
  async updateDocument({ commit }, { documentId, updateData }) {
    try {
      
      // Clean up the title and append .pdf
      updateData.title = setFileTitle(updateData)
      const response = await axios.post(`/docs/update/${documentId}`, updateData)
      
      if (response.data.message.includes('updated successfully')) {
        log(`Store - UpdateDocument() response -  response.data.updatedDocument: ${JSON.stringify(response.data.updatedDocument, null, 2)}`)
        
        commit('updateDocumentInState', response.data.updatedDocument) // update state with the new document data
        
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
        log(`>>ERROR in delete documents ${e}<<`)
        commit('deleteDocument', documentId)
      }
    },

    
    toggleModal({commit}, payload){
      commit('toggleModal', payload)
    },
    
    setPdfSrc({commit}, payload){
      commit('setPdfSrc', payload)
    },
    
    /**
     * Name: deleteDocument
     * Desc: 
     * @param {}  - 
     * @returns {}  - 
    */
    async loginUser({ commit }, payload) {  
      try{
        const res = await axios.post('/user/login', payload)
        if(res.data.token){
          commit('setAuthToken', res.data.token)
          commit('setUser', payload.email)
          localStorage.setItem('authToken', res.data.token)
        }
      }
      catch(e){
        log(`>>ERROR in loginUser ${e}<<`)
      }
    },
  
  modules: {
  }
})