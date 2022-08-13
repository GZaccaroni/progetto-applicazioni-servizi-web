<template>
  <v-app>
    <app-navbar :is-logged-in="isLoggedIn" :user-profile="userProfile" />
    <v-main>
      <v-container fluid>
        <app-snackbar />
        <router-view />
      </v-container>
    </v-main>
  </v-app>
</template>

<script lang="ts">
import AppSnackbar from "@/components/common/AppSnackbar.vue";
import { defineComponent } from "vue";
import AppNavbar from "@/components/common/AppNavbar.vue";
import { mapGetters } from "vuex";
import { setDocumentLang } from "@/i18n";

export default defineComponent({
  name: "App",
  components: {
    AppNavbar,
    AppSnackbar,
  },
  computed: {
    ...mapGetters("user", {
      isLoggedIn: "isLoggedIn",
      userProfile: "userProfile",
    }),
  },
  data: () => ({
    loginDialogVisible: false,
  }),
  mounted() {
    this.$watch(
      "$i18n.locale",
      (newLocale, oldLocale) => {
        if (newLocale === oldLocale) {
          return;
        }
        setDocumentLang(newLocale);
      },
      { immediate: true }
    );
  },
});
</script>
