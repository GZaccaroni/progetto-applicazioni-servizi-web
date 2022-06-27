<template>
  <v-dialog
    v-model="innerIsVisible"
    :persistent="customParams.persistent"
    :fullscreen="$vuetify.breakpoint.xsOnly"
  >
    <v-toolbar v-if="$vuetify.breakpoint.xsOnly" dark color="primary">
      <v-btn icon dark :disabled="actionsDisabled" @click="closeForm">
        <v-icon>mdi-close</v-icon>
      </v-btn>
      <v-toolbar-title>{{ title }}</v-toolbar-title>
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
      <v-btn color="blue darken-1" text @click="closeForm">Chiudi</v-btn>
      <v-btn
        color="blue darken-1"
        :disabled="actionsDisabled"
        text
        @click="submitForm"
      >
        {{ submitButtonText }}
      </v-btn>
    </v-card-actions>
  </v-dialog>
</template>

<script lang="ts">
import { computed, defineComponent, PropType } from "@vue/composition-api";

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
    actionsDisabled: {
      type: Boolean,
      default: false,
    },
    customParams: {
      type: Object as PropType<FormDialogParams>,
      default: () => {
        return {
          persistent: false,
        };
      },
    },
    isVisible: {
      type: Boolean,
      default: false,
    },
  },
  setup(props, { emit }) {
    const innerIsVisible = computed({
      get: (_) => {
        return props.isVisible;
      },
      set: (ctx) => {
        emit("dialogVisible", ctx);
      },
    });
    return { innerIsVisible };
  },
  model: {
    prop: "isVisible",
    event: "dialogVisible",
  },
  methods: {
    submitForm() {
      this.$emit("submitForm");
    },
    closeForm() {
      this.$emit("dialogShown", false);
    },
  },
});
</script>
