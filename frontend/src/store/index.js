import { createStore } from 'vuex'
import createPersistedState from 'vuex-persistedstate'

export default createStore({
  state: {
    connexion:false,
    connexionAdmin:false,
    userId:null,
    token:null,
    nom:null,
    prenom:null,
    urlPhotoProfil: null,
  },
  plugins: [createPersistedState()],
  mutations: {
    MUTATION_CONNEXION(state, payload) {
      state.connexion = payload
    },
    MUTATION_CONNEXION_ADMIN(state, payload) {
      state.connexionAdmin = payload
    },
    MUTATION_USERID(state, payload) {
      state.userId = payload
    },
    MUTATION_TOKEN(state, payload) {
      state.token = payload
    },
    MUTATION_NOM(state, payload) {
      state.nom = payload
    },
    MUTATION_PRENOM(state, payload) {
      state.prenom = payload
    },
    MUTATION_URL_PHOTO_PROFIL(state, payload) {
      state.urlPhotoProfil = payload
    },
  },
  actions: {
  },
  modules: {
  }
})
