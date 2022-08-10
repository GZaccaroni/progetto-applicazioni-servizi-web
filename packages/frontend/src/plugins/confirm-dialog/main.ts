import _Vue from "vue";
import ConfirmDialog from "@/plugins/confirm-dialog/components/ConfirmDialog.vue";

export default {
  install(Vue: typeof _Vue): void {
    Vue.component("confirm-dialog", ConfirmDialog);
  },
};

export { ConfirmDialog };
