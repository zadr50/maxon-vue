import Vuex from 'vuex'

export const state = () => ({
    categories: [],
    errors: [],
    page: 1,
    dialogVisible: false,
    isAuth: false,
})

export const mutations = {
   //MUTATION UNTUK MENGUBAH STATE DI ATAS
    SET_IS_AUTH(state, payload) {
      state.isAuth = payload
    },
    SET_CATEGORY_DATA(state, payload) {
        state.categories = payload
    },
    SET_ERRORS(state, payload) {
        state.errors = payload
    },
    SET_PAGE(state, payload) {
        state.page = payload
    },
    SET_DIALOG(state, payload) {
        state.dialogVisible = payload
    }

}

const createStore = () => {
  return new Vuex.Store({
    state: {
      counter: 0,
      dialogVisible: false,
    },
    mounted() {
      
    },
    mutations: {
      increment (state) {
        state.counter++
      },
      dialogVisible(state){
          console.log('index.js.mutations.dialogVisible')
          state.dialogVisible=true;
      }
    },
    getData({ commit, state }, payload) {
        let search = payload ? payload:''
        console.log('index.js.getData');
        return new Promise((resolve, reject) => {
            //this.$axios.get(`/categories?q=${search}&page=${state.page}`).then((response) => {
            //    commit('SET_CATEGORY_DATA', response.data.data)
            //    resolve()
            //})
        })    
    },
    delData({ commit, state }, payload) {
        console.log('index.js.delData');
        return
    },

  })

}
export const actions = {
  //PERMASALAH BARU AKAN MUNCUL KETIKA HALAMAN DIRELOAD, MAKA STATE ISAUTH AKAN DISET KEMBALI JADI FALSE KARENA PADA DASARKAN STATE AKAN HILANG JIKA HALAMAN DIRELOAD
  //MAKA KITA JALANKAN FUNGSI DIBAWHA INI, DIMANA INI AKAN BERJALAN SECARA OTOMATIS KETIKA APLIKASI KITA DILOAD
  nuxtServerInit({ commit }, context) {
      //KEMUDIAN KITA SET ISAUTH MENYESUAIKAN VALUE DARI STATE AUTHENTICATION
      commit('SET_IS_AUTH', context.app.$auth.$state.loggedIn)
  }
}

export default createStore
