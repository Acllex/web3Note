import Vue from 'vue'
import Vuex from 'vuex'
import notebooks from "@/store/notebooks";
import notes from "@/store/notes";
import trash from "@/store/trash";

Vue.use(Vuex)

export default new Vuex.Store({
  modules: {
    notebooks,
    notes,
    trash
  },
  state: {},
  getters:{

  },
  mutations: {

  },
  actions: {
  }
})
