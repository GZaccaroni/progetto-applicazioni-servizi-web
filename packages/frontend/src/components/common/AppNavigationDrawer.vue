<template>
  <div>
    <v-list-item>
      <v-list-item-content>
        <v-list-item-title class="title"> Menu</v-list-item-title>
        <v-list-item-subtitle>
          {{ userProfile.username }}
        </v-list-item-subtitle>
      </v-list-item-content>
    </v-list-item>

    <v-divider></v-divider>

    <v-list dense nav>
      <template v-for="group in menuItems">
        <v-subheader :key="group.title" v-if="group.title !== undefined">
          {{ group.title }}
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
import { defineComponent } from "@vue/composition-api";

const menuItems = [
  {
    title: undefined,
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
    title: "Amministrazione",
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
  data() {
    return {
      menuItems: menuItems,
    };
  },

  computed: {
    ...mapGetters("user", {
      userProfile: "userProfile",
    }),
  },
});
</script>
