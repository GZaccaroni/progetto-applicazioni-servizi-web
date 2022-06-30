<template>
  <div>
    <v-snackbar
      top
      v-if="message !== undefined"
      :value="message !== undefined"
      :color="message.color"
    >
      {{ message.text }}
      <template v-slot:action="{ attrs }">
        <v-btn text v-bind="attrs" @click="hideSnackbar">
          {{ $t("word.close") }}
        </v-btn>
      </template>
    </v-snackbar>
  </div>
</template>

<script lang="ts">
import { mapGetters, mapMutations } from "vuex";
import { defineComponent, ref } from "@vue/composition-api";
import { SnackbarState } from "@/store/snackbar/types";

export default defineComponent({
  setup() {
    const isVisible = ref(false);
    return { isVisible };
  },
  computed: {
    ...mapGetters("snackbar", {
      message: "getMessage",
    }),
  },
  watch: {
    message(newValue?: SnackbarState) {
      this.isVisible = newValue != undefined;
    },
  },
  methods: {
    ...mapMutations("snackbar", ["HIDE_MESSAGE"]),
    hideSnackbar() {
      this.HIDE_MESSAGE();
    },
  },
});
</script>
