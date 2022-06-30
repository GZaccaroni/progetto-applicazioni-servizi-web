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
          {{ $t("views.welcome.title", { appName: $t("name") }) }}
        </h1>

        <p class="subheading font-weight-regular">
          {{ welcomeText }}
        </p>
      </v-col>
    </v-row>
  </v-container>
</template>

<script lang="ts">
import { defineComponent } from "@vue/composition-api";
import { mapGetters } from "vuex";

export default defineComponent({
  computed: {
    ...mapGetters("user", {
      isLoggedIn: "isLoggedIn",
      userProfile: "userProfile",
    }),
    welcomeText(): string {
      if (this.userProfile != undefined) {
        return this.$t("views.welcome.subtitle.loggedIn", {
          username: this.userProfile.username,
        }).toString();
      } else {
        return this.$t("views.welcome.subtitle.default").toString();
      }
    },
  },
});
</script>
