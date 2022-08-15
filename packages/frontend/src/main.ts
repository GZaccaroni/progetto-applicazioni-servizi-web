import Vue from "vue";
import store from "./store";
import router from "./router";
import vuetify from "./plugins/vuetify";
import i18n from "./i18n";
import App from "./App.vue";
import PaginatedTableBuilder from "@/plugins/paginated-table-builder/main";
import TableBuilder from "@/plugins/table-builder/main";

Vue.config.productionTip = false;
Vue.use(PaginatedTableBuilder);
Vue.use(TableBuilder);

new Vue({
  pinia: store,
  router,
  vuetify,
  i18n,
  render: (h) => h(App),
}).$mount("#app");
