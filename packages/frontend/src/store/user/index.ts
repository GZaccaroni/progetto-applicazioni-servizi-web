import { UserState } from "@/store/user/types";
import { login, logout } from "@/repositories/AuthenticationService";
import { findUser } from "@/repositories/UserRepository";
import { defineStore } from "pinia";
import { UserLoginInput } from "@common/model/network/UserLoginInput";

export const useUserStore = defineStore("user", {
  persist: true,
  state: () =>
    ({
      userProfile: undefined,
    } as UserState),
  getters: {
    isLoggedIn: ({ userProfile }) => userProfile != undefined,
  },
  actions: {
    async login(userCredential: UserLoginInput): Promise<void> {
      if (this.isLoggedIn) return;
      await login(userCredential.username, userCredential.password);
      this.userProfile = await findUser(userCredential.username);
    },

    async logout(): Promise<void> {
      if (this.isLoggedIn) {
        await logout();
        this.userProfile = undefined;
      }
    },
  },
});
