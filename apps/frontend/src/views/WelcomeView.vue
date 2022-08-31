<template>
  <v-container>
    <v-row class="text-center">
      <v-col cols="12">
        <v-img
          :src="require('../assets/logo.png')"
          class="my-3"
          contain
          height="200"
        />
      </v-col>

      <v-col class="mb-4">
        <h1 class="display-2 font-weight-bold mb-3">
          {{ $t("views.welcome.title") }}
        </h1>

        <p class="subheading font-weight-regular">
          {{ welcomeText }}
        </p>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup lang="ts">
import { computed } from "vue";
import { storeToRefs } from "pinia";
import { useUserStore } from "@/store/user";
import i18n from "@/i18n";

const { userProfile } = storeToRefs(useUserStore());

const welcomeText = computed(() => {
  const userProfileVal = userProfile?.value;
  if (userProfileVal != undefined) {
    return i18n
      .t("views.welcome.subtitle.loggedIn", {
        username: userProfileVal.username,
      })
      .toString();
  } else {
    return i18n.t("views.welcome.subtitle.default").toString();
  }
});
</script>
