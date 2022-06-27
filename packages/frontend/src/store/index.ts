import Vue from "vue";
import Vuex from "vuex";
import snackbar from "@/store/snackbar";
import user from "@/store/user";
import { RootState } from "@/store/types";

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
    user,
  },
});
