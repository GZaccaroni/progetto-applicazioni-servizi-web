import _Vue from "vue";
import TableBuilder from "./components/TableBuilder.vue";

export default {
  install(Vue: typeof _Vue): void {
    Vue.component("table-builder", TableBuilder);
  },
};

export { TableBuilder };
