import Vue from "vue";
import VueCompositionAPI from "@vue/composition-api";
import App from "./App.vue";
import router from "./router";
import store from "./store";
import vuetify from "./plugins/vuetify";
import PaginatedTableBuilder from "@/plugins/paginated-table-builder/main";
import TableBuilder from "@/plugins/table-builder/main";
import ConfirmDialog from "@/plugins/confirm-dialog/main";

Vue.config.productionTip = false;
Vue.use(VueCompositionAPI);
Vue.use(PaginatedTableBuilder);
Vue.use(TableBuilder);
Vue.use(ConfirmDialog);

new Vue({
  router,
  store,
  vuetify,
  render: (h) => h(App),
}).$mount("#app");
