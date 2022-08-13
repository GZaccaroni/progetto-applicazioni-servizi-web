<template>
  <v-container>
    <user-login-dialog v-model="loginDialogVisible" />
    <v-app-bar app color="white" elevate-on-scroll ref="menubar">
      <v-app-bar-nav-icon
        v-if="isLoggedIn"
        :aria-label="$t('word.mainMenu')"
        @click.stop="drawer = !drawer"
      />
      <div class="d-flex align-center">
        <v-img
          alt=""
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
          <div v-bind="attrs" v-on="on" :aria-label="$t('word.userMenu')">
            {{ userProfile.username }}
            <v-avatar>
              <v-icon large>mdi-account-circle</v-icon>
            </v-avatar>
          </div>
        </template>
        <v-list>
          <v-list-item @click="logout">
            <v-list-item-title>{{ $t("word.logout") }}</v-list-item-title>
          </v-list-item>
        </v-list>
      </v-menu>
      <v-btn v-if="!isLoggedIn" target="_blank" text @click="login">
        <span class="mr-2">{{ $t("word.login") }}</span>
        <v-icon>mdi-login</v-icon>
      </v-btn>
    </v-app-bar>
    <v-navigation-drawer
      v-if="isLoggedIn"
      app
      v-model="drawer"
      temporary
      :aria-label="$t('word.mainMenu')"
    >
      <app-navigation-drawer />
    </v-navigation-drawer>
  </v-container>
</template>
<script lang="ts">
import UserLoginDialog from "@/components/form/user/UserLoginDialog.vue";
import { defineComponent, PropType } from "vue";
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
