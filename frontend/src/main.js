import { createApp } from 'vue'
import App from './App.vue'
import router from './router/r_index'
import store from './store/s_index'

const app = createApp(App)
// initialize the user state from the cookie
// handle the error if the cookie is empty or invalid
// set the loggedIn state based on the user state
// use a try-catch block to handle the JSON.parse error
async function init() {
  try {
    const userCookie = document.cookie.replace(/(?:(?:^|.*;\s*)user\s*\=\s*([^;]*).*$)|^.*$/, "$1")
    if (userCookie) {
      const user = JSON.parse(userCookie)
      store.commit('setUser', user)
    }
  } catch (error) {
    console.error(error)
  } finally {
    store.commit('setLoggedIn', !!store.state.user)
  }
}

init().then(() => {
  app.use(store).use(router).mount('#app')
})

// createApp(App).use(store).use(router).mount('#app')