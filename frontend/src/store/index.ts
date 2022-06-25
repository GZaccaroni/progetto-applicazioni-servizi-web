import Vue from "vue";
import Vuex from "vuex";
import snackbar from "@/store/snackbar/snackbar";
import { RootState } from "@/store/rootState";

Vue.use(Vuex);

export default new Vuex.Store<RootState>({
  state: {
    version: "1.0.0",
  },
  getters: {},
  mutations: {},
  actions: {},
  modules: {
    snackbar,
  },
});
