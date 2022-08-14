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
          {{ dialogTitle }}
        </v-toolbar-title>
      </v-toolbar>
      <v-card-text v-show="!!dialogMessage" class="pa-4 black--text">
        {{ dialogMessage }}
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
        <v-btn text @click.native="agree">{{ $t("word.confirm") }}</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script setup lang="ts">
import { ref } from "vue";

defineExpose({ open });

export type ConfirmDialogOptions = {
  color: string;
  width: number;
  zIndex: number;
  hideCancel: boolean;
};

const dialogVisible = ref(false);
let dialogResolve: (confirmed: boolean) => void | undefined;
const dialogMessage = ref<string>();
const dialogTitle = ref<string>();
const dialogOptions = ref<ConfirmDialogOptions>({
  color: "primary",
  width: 400,
  zIndex: 200,
  hideCancel: false,
});
function open(title: string, message: string, options?: ConfirmDialogOptions) {
  dialogVisible.value = true;
  dialogTitle.value = title;
  dialogMessage.value = message;
  dialogOptions.value = Object.assign(dialogOptions.value, options);
  return new Promise((resolve) => {
    dialogResolve = resolve;
  });
}
function agree() {
  dialogResolve?.(true);
  dialogVisible.value = false;
}
function cancel() {
  dialogResolve?.(false);
  dialogVisible.value = false;
}
</script>
