import PaginatedTableBuilder from "./components/TableBuilder.vue";
import _Vue from "vue";

export default {
  install(Vue: typeof _Vue): void {
    Vue.component("paginated-table-builder", PaginatedTableBuilder);
  },
};

export { PaginatedTableBuilder };
