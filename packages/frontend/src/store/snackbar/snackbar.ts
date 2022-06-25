import { Module } from "vuex";
import { SnackbarState } from "@/store/snackbar/types";
import { RootState } from "@/store/rootState";

const module: Module<SnackbarState, RootState> = {
  namespaced: true,
  state: {
    message: undefined,
  },

  getters: {
    getMessage: ({ message }) => message,
  },

  mutations: {
    SHOW_MESSAGE(state, payload) {
      state.message = {
        text: payload.text,
        color: payload.color,
        timeout: payload.timeout,
      };
    },
    HIDE_MESSAGE(state) {
      state.message = undefined;
    },
  },
  actions: {
    show({ commit }, payload) {
      commit("SHOW_MESSAGE", payload);
    },
  },
};
export default module;
