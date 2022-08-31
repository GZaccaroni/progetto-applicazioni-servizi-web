import PaginatedTableBuilder from "./components/PaginatedTableBuilder.vue";
import _Vue from "vue";

export default {
  install(Vue: typeof _Vue): void {
    Vue.component("paginated-table-builder", PaginatedTableBuilder);
  },
};

export { PaginatedTableBuilder };
