import { defineStore } from "pinia";
import {
  ConfirmDialogInfo,
  ConfirmDialogState,
} from "@/store/confirm_dialog/types";

export const useConfirmDialogStore = defineStore("confirm_dialog", {
  state: () => ({ data: undefined } as ConfirmDialogState),
  actions: {
    show(dialog: ConfirmDialogInfo): Promise<boolean> {
      this.data = dialog;
      return new Promise((resolve) => {
        this.dialogResolve = resolve;
      });
    },
    confirm() {
      this.data = undefined;
      this.dialogResolve?.(true);
      this.dialogResolve = undefined;
    },
    cancel() {
      this.data = undefined;
      this.dialogResolve?.(false);
      this.dialogResolve = undefined;
    },
  },
});
