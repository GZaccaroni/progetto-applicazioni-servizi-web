import { Module } from "vuex";
import { RootState } from "@/store/types";
import { UserState } from "@/store/user/types";
import { UserCredential } from "@/model/UserCredential";
import { DbUser } from "@/model/db/DbUser";
import { login, logout } from "@/repositories/AuthenticationService";
import { findUser } from "@/repositories/UserRepository";

const module: Module<UserState, RootState> = {
  namespaced: true,
  state: {
    userProfile: undefined,
  },
  getters: {
    userProfile: ({ userProfile }) => userProfile,
    isLoggedIn: ({ userProfile }) => userProfile != undefined,
  },
  mutations: {
    auth_success(state, userProfile: DbUser) {
      state.userProfile = userProfile;
    },
    logout(state) {
      state.userProfile = undefined;
    },
  },
  actions: {
    async login(context, userCredential: UserCredential): Promise<void> {
      if (context.getters.isLoggedIn) return;
      await login(userCredential.username, userCredential.password);
      const user = await findUser(userCredential.username);
      context.commit("auth_success", user);
    },

    async logout(context): Promise<void> {
      await logout();
      context.commit("logout");
    },
  },
};
export default module;
