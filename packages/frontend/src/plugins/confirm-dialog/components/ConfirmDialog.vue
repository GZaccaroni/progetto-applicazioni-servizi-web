<template>
  <v-dialog
    v-model="dialogVisible"
    :max-width="options.width"
    :style="{ zIndex: options.zIndex }"
    @click:outside="cancel"
    @keydown.esc="cancel"
  >
    <v-card>
      <v-toolbar dark color="primary" dense flat>
        <v-toolbar-title class="text-body-2 font-weight-bold white--text">
          {{ title }}
        </v-toolbar-title>
      </v-toolbar>
      <v-card-text
        v-show="!!message"
        class="pa-4 black--text"
        v-html="message"
      ></v-card-text>
      <v-card-actions class="pt-3">
        <v-spacer></v-spacer>
        <v-btn
          v-if="!options.hideCancel"
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

<script lang="ts">
import { defineComponent } from "@vue/composition-api";

export type ConfirmDialogOptions = {
  color: string;
  width: number;
  zIndex: number;
  hideCancel: boolean;
};
export default defineComponent({
  data(): {
    dialogVisible: boolean;
    resolve?: (confirmed: boolean) => void;
    message?: string;
    title?: string;
    options: ConfirmDialogOptions;
  } {
    return {
      dialogVisible: false,
      resolve: undefined,
      message: undefined,
      title: undefined,
      options: {
        color: "primary",
        width: 400,
        zIndex: 200,
        hideCancel: false,
      },
    };
  },

  methods: {
    open(title: string, message: string, options?: ConfirmDialogOptions) {
      this.dialogVisible = true;
      this.title = title;
      this.message = message;
      this.options = Object.assign(this.options, options);
      return new Promise((resolve, _) => {
        this.resolve = resolve;
      });
    },
    agree() {
      this.resolve?.(true);
      this.dialogVisible = false;
    },
    cancel() {
      this.resolve?.(false);
      this.dialogVisible = false;
    },
  },
});
</script>
