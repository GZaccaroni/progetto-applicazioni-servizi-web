import { SnackbarState, SnackbarStateMessage } from "@/store/snackbar/types";
import { defineStore } from "pinia";

export const useSnackbarStore = defineStore("snackbar", {
  state: () =>
    ({
      message: undefined,
    } as SnackbarState),
  actions: {
    show(message: SnackbarStateMessage) {
      this.message = message;
    },
    hide() {
      this.message = undefined;
    },
  },
});
