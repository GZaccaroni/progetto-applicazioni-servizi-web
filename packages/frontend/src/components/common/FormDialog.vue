<template>
  <v-dialog
    v-model="isVisibleState"
    :persistent="customParams.persistent || submitButtonLoading"
    :fullscreen="$vuetify.breakpoint.xsOnly"
    max-width="700"
  >
    <v-card v-if="isVisibleState">
      <v-toolbar v-if="$vuetify.breakpoint.xsOnly" dark color="primary">
        <v-btn icon dark :disabled="submitButtonLoading" @click="closeForm">
          <v-icon>mdi-close</v-icon>
        </v-btn>
        <v-toolbar-title>{{ title }}</v-toolbar-title>
        <v-spacer />
        <v-btn
          text
          :disabled="submitButtonLoading"
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
        <v-container>
          <slot></slot>
        </v-container>
      </v-card-text>
      <v-card-actions v-if="!$vuetify.breakpoint.xsOnly">
        <v-spacer></v-spacer>
        <v-btn
          color="blue darken-1"
          :disabled="submitButtonLoading"
          text
          @click="closeForm"
          >Chiudi</v-btn
        >
        <v-btn
          color="blue darken-1"
          :disabled="submitButtonLoading"
          :loading="submitButtonLoading"
          text
          @click="submitForm"
        >
          {{ submitButtonText }}
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script lang="ts">
import {
  defineComponent,
  PropType,
  reactive,
  SetupContext,
} from "@vue/composition-api";
import { passthroughVModel } from "@/helpers/passthroughVModel";

export type GenericFormDialogModel<T> =
  | ({ isVisible: true } & T)
  | { isVisible: false };

type FormDialogParams = {
  persistent: boolean;
};
export function useFormDialog(
  props: GenericFormDialogModel<unknown>,
  context: SetupContext
) {
  return reactive({
    isVisible: passthroughVModel(props, context, "isVisible"),
  });
}
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
  },
  setup(props, context) {
    console.log("Value: ", props.value);
    const isVisibleState = passthroughVModel(props, context, "value");
    return { isVisibleState };
  },
  methods: {
    submitForm() {
      this.$emit("submit");
    },
    closeForm() {
      this.isVisibleState = false;
    },
  },
});
</script>
