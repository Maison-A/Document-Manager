import { createStore } from 'vuex'
import Cookies from 'js-cookie'
import router from '@/router/r_index'
const { log } = require('../../../utils/generalUtils')
const axios = require('axios')
axios.defaults.baseURL = 'http://localhost:3000/'
axios.defaults.withCredentials = true


axios.interceptors.request.use(config => {
  // No need to set Authorization header, cookie will be sent automatically
  return config
})


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
    user:  null, // get user from cookie
    loggedIn: false,
  },
  
  getters: {
    getCurrentDocument(state){
      return state.currentDocument
    },
    
    isAuthenticated(state){
      return !!state.user // turn the value into a boolean. check if token exists. returns true to indicate the user is authenticated; otherwise, false.
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
    
    setUser(state, user) {
      state.user = user
      document.cookie = `user=${JSON.stringify(user)}; expires=${new Date(Date.now() + 86400000).toUTCString()}; path=/` // save user to cookie
    },
    
    setLoggedIn(state, loggedIn){
      state.loggedIn = loggedIn
    },
    
    setAuthToken(state, token){
      state.authToken = token
    },
    // Mutation to clear user info - DO NOT use async in mutations
    logoutUser(state) {
      state.user = null // reset user state
      document.cookie = 'user=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/' // clear user cookie
      state.loggedIn = false // reset loggedIn state
      // need to clear token from cookie/session (is there a difference?)
    },
    loginCreatedUser(state, { user, token }) {
      state.user = user
      state.loggedIn = true
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`
      document.cookie = `token=${token}`
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

      
      
    /**
     * Name: 
     * Desc: 
     * @param {}  - 
     * @returns {}  - 
    */      
    toggleModal({commit}, payload){
      commit('toggleModal', payload)
    },
    
      
      
    /**
     * Name: 
     * Desc: 
     * @param {}  - 
     * @returns {}  - 
    */     
    setPdfSrc({commit}, payload){
      commit('setPdfSrc', payload)
    },
  
      
      
    /**
     * Name: loginUser
     * Desc: Handles user login.
     * @param {Object} commit - Vuex commit object for calling mutations
     * @param {Object} payload - Login credentials
     * @returns {void} - logs user in, updates store state, or logs an error
     */
    async loginUser({ commit }, payload) {
      try {
        const res = await axios.post('/user/login', payload)
        if (res.data.user) {
          const { user } = res.data
          commit('setUser', user) 
          commit('setLoggedIn', true)
          log(`username in state: ${this.state.user.username}`)
          log(`email in state: ${this.state.user.email}`)
          log(`loggedIn in state: ${this.state.loggedIn}`)
        }
      } catch (e) {
        console.log(`>>ERROR in loginUser ${e}<<`)
      }
    },
      
    // Action to handle user logout
    async logoutUser({ commit }) {
      try {
        await axios.post('/user/logout') // This should clear the server-side cookie
        commit('logoutUser')
      } catch (error) {
        console.error('Failed to logout:', error)
      }
    },

      
    /**
     * Name: createUser
     * Desc: Handles user signup.
     * @param {Object} commit - Vuex commit object for calling mutations
     * @param {Object} payload - Signup credentials
     * @returns {void} - creates a user, updates store state, or logs an error
     */
    async createUser({ commit }, payload) {
      try{
        const res = await axios.post('/user/signup', payload)
        const { user, token } = res.data
        commit('loginCreatedUser', { user, token })
        router.push('/home')
        commit('toggleModal', false)
      } catch(e){
        log(`>>ERROR in FRONTEND 'createUser': ${e}<<`)
      }
    },
    
    
    async fetchUser({ commit }) {
      try {
        const config = {
          withCredentials: true
        }
        const response = await axios.get('/user/me', config)
        commit('setUser', response.data)
      } catch (error) {
        console.error('Failed to fetch user:', error)
      }
    },


    /**
     * Loads the user data from the server using the token stored in the cookie.
     * If the token is invalid or expired, removes the token from the cookie and sets the user to null.
     * @param {Object} commit - The Vuex commit function.
     * @returns {Promise<Object>} - A Promise that resolves with the loaded user data.
     * @throws {Error} - If the token is not found in the cookie or an error occurs while loading the user data.
     */
    async loadUserFromCookie({ commit }) {
      const token = Cookies.get('token') // Get the token from the cookie
      log(`loadUserFromCookie() token: ${token}`)
      if (!token) {
        return Promise.reject(new Error('No token found in cookie')) // If the token is not found, reject the Promise with an error
      }
      
      try {
        const response = await axios.get('/user/me', { // Send a GET request to the server to get the user data
          headers: { Authorization: `Bearer ${token}` }
        })
        const user = response.data
        commit('setUser', user) // update the user state with the loaded user data
        
        return Promise.resolve(user) // resolve the Promise with the loaded user data
      } catch (e) {
        if (e.response && e.response.status === 401) { // if the server responds with a 401 status code, the token is invalid or expired
          
          Cookies.remove('token') // remove the token from the cookie and set the user to null
          commit('setUser', null)
          
          return Promise.reject(new Error('Token is invalid or expired')) // reject the Promise with an error
        } else {
          return Promise.reject(e) // if an error occurs while loading the user data, reject the Promise with the error
        }
      }
    }
    
  },
  
  modules: {
  },
})