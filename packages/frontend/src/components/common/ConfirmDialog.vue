<template>
  <v-dialog
    v-if="dialogVisible"
    v-model="dialogVisible"
    :max-width="dialogOptions.width"
    :style="{ zIndex: dialogOptions.zIndex }"
    @click:outside="cancel"
    @keydown.esc="cancel"
    role="alertdialog"
  >
    <v-card>
      <v-toolbar dark color="primary" dense flat>
        <v-toolbar-title class="text-body-2 font-weight-bold white--text">
          {{ confirmDialogStore.data.title }}
        </v-toolbar-title>
      </v-toolbar>
      <v-card-text
        v-show="!!confirmDialogStore.data.message"
        class="pa-4 black--text"
      >
        {{ confirmDialogStore.data.message }}
      </v-card-text>
      <v-card-actions class="pt-3">
        <v-spacer></v-spacer>
        <v-btn
          v-if="!dialogOptions.hideCancel"
          color="grey"
          text
          class="body-2 font-weight-bold"
          @click.native="cancel"
        >
          {{ $t("word.cancel") }}
        </v-btn>
        <v-btn text @click.native="confirm">{{ $t("word.confirm") }}</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script setup lang="ts">
import { computed, ref, watch } from "vue";
import { useConfirmDialogStore } from "@/store/confirm_dialog";
import { ConfirmDialogOptions } from "@/store/confirm_dialog/types";
import { clone } from "lodash";

const dialogVisible = ref(false);
const defaultDialogOptions: ConfirmDialogOptions = {
  color: "primary",
  width: 400,
  zIndex: 200,
  hideCancel: false,
};
const dialogOptions = computed(() => {
  const defaultOptions = clone(defaultDialogOptions);
  const currentOptions = clone(confirmDialogStore.data?.options) ?? {};
  return Object.assign(currentOptions, defaultOptions);
});
const confirmDialogStore = useConfirmDialogStore();

watch(
  () => confirmDialogStore.data,
  (newValue) => {
    console.log("Confirm dialog data changed, hey!");
    dialogVisible.value = newValue != undefined;
  }
);
function confirm() {
  confirmDialogStore.confirm();
}
function cancel() {
  confirmDialogStore.cancel();
}
</script>
