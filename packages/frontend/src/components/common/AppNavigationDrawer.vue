<template>
  <div>
    <v-list-item>
      <v-list-item-content>
        <v-list-item-title class="title">
          {{ $t("word.mainMenu") }}
        </v-list-item-title>
        <v-list-item-subtitle>
          {{ userProfile.username }}
        </v-list-item-subtitle>
      </v-list-item-content>
    </v-list-item>

    <v-divider></v-divider>

    <v-list dense nav>
      <template v-for="group in menuItems">
        <v-subheader :key="group.title" v-if="group.title !== undefined">
          {{ $t(group.title) }}
        </v-subheader>
        <v-list-item
          v-for="item in group.items"
          :key="item.title"
          link
          router
          :to="item.route"
        >
          <v-list-item-icon>
            <v-icon>{{ item.icon }}</v-icon>
          </v-list-item-icon>

          <v-list-item-content>
            <v-list-item-title>{{ $t(item.title) }}</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
      </template>
    </v-list>
  </div>
</template>

<script lang="ts">
import { mapGetters } from "vuex";
import { defineComponent } from "vue";

interface MenuGroup {
  title?: string;
  meta: {
    requiresAuth: boolean;
    requiresAdmin: boolean;
  };
  items: MenuItem[];
}
interface MenuItem {
  title: string;
  icon: string;
  route: string;
}
const menuItems: MenuGroup[] = [
  {
    title: undefined,
    meta: {
      requiresAuth: true,
      requiresAdmin: false,
    },
    items: [
      {
        title: "views.orders.title",
        icon: "mdi-format-list-bulleted",
        route: "/orders",
      },
      {
        title: "views.stats.title",
        icon: "mdi-google-analytics",
        route: "/stats",
      },
      {
        title: "views.customers.title",
        icon: "mdi-account-group",
        route: "/customers",
      },
    ],
  },
  {
    title: "components.AppNavigationDrawer.sections.admin",
    meta: {
      requiresAuth: true,
      requiresAdmin: true,
    },
    items: [
      {
        title: "views.products.title",
        icon: "mdi-food-apple",
        route: "/products",
      },
      {
        title: "views.stores.title",
        icon: "mdi-store",
        route: "/stores",
      },
      {
        title: "views.users.title",
        icon: "mdi-account-multiple",
        route: "/users",
      },
    ],
  },
];
export default defineComponent({
  computed: {
    ...mapGetters("user", {
      userProfile: "userProfile",
    }),
    menuItems() {
      const userHasAccess = (group: MenuGroup) => {
        if (group.meta.requiresAuth) {
          if (this.userProfile == undefined) return false;
        }
        if (group.meta.requiresAdmin) {
          if (this.userProfile?.isAdmin != true) return false;
        }
        return true;
      };
      return menuItems.filter((group) => userHasAccess(group));
    },
  },
});
</script>
