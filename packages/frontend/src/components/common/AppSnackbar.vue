<template>
  <div>
    <v-snackbar top v-if="message !== undefined" :color="message.color">
      {{ message.text }}
      <template v-slot:action="{ attrs }">
        <v-btn text v-bind="attrs" @click="hideSnackbar">Close</v-btn>
      </template>
    </v-snackbar>
  </div>
</template>

<script lang="ts">
import { mapGetters, mapMutations } from "vuex";
import { defineComponent } from "@vue/composition-api";

export default defineComponent({
  computed: {
    ...mapGetters("snackbar", {
      message: "getMessage",
    }),
  },

  methods: {
    ...mapMutations("snackbar", ["HIDE_MESSAGE"]),
    hideSnackbar() {
      this.HIDE_MESSAGE();
    },
  },
});
</script>
