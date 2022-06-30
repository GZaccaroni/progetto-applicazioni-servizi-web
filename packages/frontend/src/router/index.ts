import Vue from "vue";
import VueRouter, { RouteConfig } from "vue-router";
import store from "@/store";
import WelcomeView from "@/views/WelcomeView.vue";

Vue.use(VueRouter);

const routes: Array<RouteConfig> = [
  {
    path: "/",
    name: "welcome",
    component: WelcomeView,
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
      import(
        /* webpackChunkName: "customers" */ "../views/store/StoresView.vue"
      ),
    meta: {
      requiresAuth: true,
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
    },
  },
];

const router = new VueRouter({
  mode: "history",
  base: process.env.BASE_URL,
  routes,
});

router.beforeEach((to, from, next) => {
  const requiresAuth = to.matched.some((record) => record.meta.requiresAuth);
  if (requiresAuth) {
    if (store.getters["user/isLoggedIn"]) {  // eslint-disable-line
      next();
      return;
    } else {
      next("/welcome");
    }
  } else {
    next();
  }
});

export default router;
