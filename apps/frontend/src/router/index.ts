import Vue from "vue";
import VueRouter, { RouteConfig } from "vue-router";
import i18n from "@/i18n";
import { useUserStore } from "@/store/user";

Vue.use(VueRouter);

const routes: Array<RouteConfig> = [
  {
    path: "/",
    name: "welcome",
    component: () =>
      import(/* webpackChunkName: "welcome" */ "../views/WelcomeView.vue"),
  },
  {
    path: "/customers",
    name: "customers",
    component: () =>
      import(
        /* webpackChunkName: "customers" */ "../views/customer/CustomersView.vue"
      ),
    meta: {
      requiresAuth: true,
    },
  },
  {
    path: "/users",
    name: "users",
    component: () =>
      import(/* webpackChunkName: "users" */ "../views/user/UsersView.vue"),
    meta: {
      requiresAuth: true,
      requiresAdmin: true,
    },
  },
  {
    path: "/orders",
    name: "orders",
    component: () =>
      import(/* webpackChunkName: "orders" */ "../views/order/OrdersView.vue"),
    meta: {
      requiresAuth: true,
    },
  },
  {
    path: "/stores",
    name: "stores",
    component: () =>
      import(/* webpackChunkName: "stores" */ "../views/store/StoresView.vue"),
    meta: {
      requiresAuth: true,
      requiresAdmin: true,
    },
  },
  {
    path: "/products",
    name: "products",
    component: () =>
      import(
        /* webpackChunkName: "products" */ "../views/product/ProductsView.vue"
      ),
    meta: {
      requiresAuth: true,
      requiresAdmin: true,
    },
  },
  {
    path: "/stats",
    name: "stats",
    component: () =>
      import(/* webpackChunkName: "stats" */ "../views/stats/StatsView.vue"),
    meta: {
      requiresAuth: true,
      requiresAdmin: false,
    },
  },
  {
    path: "*",
    redirect: "/",
  },
];

const router = new VueRouter({
  mode: "history",
  base: process.env.BASE_URL,
  routes,
});

router.beforeEach((to, from, next) => {
  const requiresAuth = to.matched.some((record) => record.meta.requiresAuth);
  const requiresAdmin = to.matched.some((record) => record.meta.requiresAdmin);
  const store = useUserStore();
  if (requiresAuth) {
    if (!store.isLoggedIn) {
      next("/");
      return;
    }
  }
  if (requiresAdmin) {
    if (store.userProfile?.isAdmin != true) {
      next("/");
      return;
    }
  }
  next();
});
router.afterEach((to) => {
  // Use next tick to handle router history correctly
  // see: https://github.com/vuejs/vue-router/issues/914#issuecomment-384477609
  Vue.nextTick(() => {
    document.title = i18n.t(`views.${to.name}.title`).toString();
  });
});
export default router;
