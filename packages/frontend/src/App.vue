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

<script setup lang="ts">
import AppSnackbar from "@/components/common/AppSnackbar.vue";
import { watch } from "vue";
import AppNavbar from "@/components/common/AppNavbar.vue";
import i18n, { setDocumentLang } from "@/i18n";
import { storeToRefs } from "pinia";
import { useUserStore } from "@/store/user";

const { userProfile, isLoggedIn } = storeToRefs(useUserStore());

watch(
  () => i18n.locale,
  (newLocale, oldLocale) => {
    if (newLocale === oldLocale) {
      return;
    }
    setDocumentLang(newLocale);
  },
  { immediate: true }
);
</script>
