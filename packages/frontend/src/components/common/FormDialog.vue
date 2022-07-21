<template>
  <v-dialog
    v-model="isVisibleState"
    :persistent="isPersistent"
    :fullscreen="$vuetify.breakpoint.xsOnly"
    max-width="900"
    @click:outside="closeFormIfNotPersistent"
    @keydown.esc="closeFormIfNotPersistent"
  >
    <v-card v-if="isVisibleState">
      <v-form
        @submit.prevent="submitForm"
        :disabled="submitButtonLoading"
        class="pa-sm-4"
      >
        <v-toolbar
          v-if="$vuetify.breakpoint.xsOnly && !dialogLoading"
          dark
          color="primary"
        >
          <v-btn icon dark :disabled="submitButtonLoading" @click="closeForm">
            <v-icon>mdi-close</v-icon>
          </v-btn>
          <v-toolbar-title>{{ title }}</v-toolbar-title>
          <v-spacer />
          <v-btn
            text
            :disabled="submitButtonLoading || !submitButtonEnabled"
            @click="submitForm"
            class="me-4 px-4"
          >
            {{ submitButtonText }}
          </v-btn>
        </v-toolbar>

        <v-card-title v-if="!$vuetify.breakpoint.xsOnly">
          <span class="headline">{{ title }}</span>
        </v-card-title>
        <v-card-text>
          <v-container v-if="!dialogLoading">
            <slot></slot>
          </v-container>
          <v-progress-linear
            v-else
            indeterminate
            class="mb-0"
          ></v-progress-linear>
        </v-card-text>
        <v-card-actions v-if="!$vuetify.breakpoint.xsOnly && !dialogLoading">
          <v-spacer></v-spacer>
          <v-btn
            color="blue darken-1"
            :disabled="submitButtonLoading"
            text
            tabindex="-1"
            @click="closeForm"
            >Chiudi</v-btn
          >
          <v-btn
            color="blue darken-1"
            :disabled="submitButtonLoading || !submitButtonEnabled"
            :loading="submitButtonLoading"
            text
            @click="submitForm"
          >
            {{ submitButtonText }}
          </v-btn>
        </v-card-actions>
      </v-form>
    </v-card>
  </v-dialog>
</template>

<script lang="ts">
import { defineComponent, PropType } from "vue";
import { passthroughVModel } from "@/helpers/passthroughVModel";

export type GenericFormDialogModel<T> =
  | ({ isVisible: true } & T)
  | { isVisible: false };

type FormDialogParams = {
  persistent: boolean;
};
export default defineComponent({
  props: {
    title: {
      type: String,
      required: true,
    },
    submitButtonText: {
      type: String,
      required: true,
    },
    submitButtonEnabled: {
      type: Boolean,
      default: true,
    },
    submitButtonLoading: {
      type: Boolean,
      required: true,
    },
    customParams: {
      type: Object as PropType<FormDialogParams>,
      default: () => {
        return {
          persistent: false,
        };
      },
    },
    value: {
      type: Boolean,
      required: true,
    },
    dialogLoading: {
      value: Boolean,
      default: false,
    },
  },
  setup(props, context) {
    const isVisibleState = passthroughVModel(props, context, "value");
    return { isVisibleState };
  },
  computed: {
    isPersistent(): boolean {
      return this.$props.customParams.persistent || this.submitButtonLoading;
    },
  },
  methods: {
    submitForm() {
      this.$emit("submit");
    },
    closeFormIfNotPersistent() {
      if (!this.isPersistent) {
        this.closeForm();
      }
    },
    closeForm() {
      this.isVisibleState = false;
      this.$emit("close");
    },
  },
});
</script>
