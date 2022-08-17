<template>
  <div>
    <v-snackbar
      top
      v-model="isVisible"
      :color="snackbarStore.message?.color"
      role="alert"
    >
      {{ snackbarStore.message?.text }}
      <template v-slot:action="{ attrs }">
        <v-btn text v-bind="attrs" @click="hideSnackbar">
          {{ $t("word.close") }}
        </v-btn>
      </template>
    </v-snackbar>
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from "vue";
import { useSnackbarStore } from "@/store/snackbar";

const isVisible = ref(false);
const snackbarStore = useSnackbarStore();

watch(
  () => snackbarStore.message,
  (newValue) => {
    isVisible.value = newValue != undefined;
  }
);
function hideSnackbar() {
  snackbarStore.hide();
}
</script>
