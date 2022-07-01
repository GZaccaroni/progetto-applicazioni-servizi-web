<template>
  <v-container>
    <user-login-dialog v-model="loginDialogVisible" />
    <v-app-bar app color="white" elevate-on-scroll>
      <v-app-bar-nav-icon v-if="isLoggedIn" @click.stop="drawer = !drawer" />
      <div class="d-flex align-center">
        <v-img
          alt="Colture in Cloud Logo"
          class="shrink mr-2"
          contain
          :src="require('../../assets/logo.png')"
          transition="scale-transition"
          width="40"
        />
      </div>
      <v-toolbar-title>{{ $t("name") }}</v-toolbar-title>

      <v-spacer></v-spacer>

      <v-menu offset-y v-if="isLoggedIn">
        <template v-slot:activator="{ on, attrs }">
          <v-avatar v-bind="attrs" v-on="on">
            <v-icon large>mdi-account-circle</v-icon>
          </v-avatar>
          {{ userProfile.username }}
        </template>
        <v-list>
          <v-list-item @click="logout">
            <v-list-item-title>Logout</v-list-item-title>
          </v-list-item>
        </v-list>
      </v-menu>
      <v-btn v-if="!isLoggedIn" target="_blank" text @click="login">
        <span class="mr-2">Accedi</span>
        <v-icon>mdi-login</v-icon>
      </v-btn>
    </v-app-bar>
    <v-navigation-drawer v-if="isLoggedIn" app v-model="drawer" temporary>
      <app-navigation-drawer />
    </v-navigation-drawer>
  </v-container>
</template>
<script lang="ts">
import UserLoginDialog from "@/components/form/user/UserLoginDialog.vue";
import { defineComponent, PropType } from "@vue/composition-api";
import { DbUser } from "@/model/db/DbUser";
import AppNavigationDrawer from "@/components/common/AppNavigationDrawer.vue";

export default defineComponent({
  components: {
    UserLoginDialog,
    AppNavigationDrawer,
  },
  props: {
    isLoggedIn: {
      type: Boolean,
      required: true,
    },
    userProfile: {
      type: Object as PropType<DbUser>,
    },
  },
  data: () => ({
    loginDialogVisible: false,
    drawer: false,
  }),
  methods: {
    login() {
      this.loginDialogVisible = true;
    },
    async logout() {
      await this.$store.dispatch("user/logout");
      await this.$router.push("/");
    },
  },
});
</script>
