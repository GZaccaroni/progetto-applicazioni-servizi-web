<template>
  <v-row justify="start" class="mt-2">
    <v-btn
      v-if="showBackButton"
      elevation="0"
      icon
      class="ms-2"
      @click="$router.back()"
      :aria-label="$t('components.HeaderView.goBack')"
    >
      <v-icon>mdi-arrow-left</v-icon>
    </v-btn>
    <p class="v-heading text-h4 text-sm-h4 mb-10 ms-4">
      {{ title }}
    </p>
    <v-spacer></v-spacer>
    <slot name="endItems"></slot>
  </v-row>
</template>

<script lang="ts">
import { defineComponent } from "vue";

export default defineComponent({
  props: {
    title: {
      type: String,
      required: true,
    },
    showBackButton: {
      type: Boolean,
      default: false,
    },
  },
});
</script>

<style lang="scss" scoped>
p {
  font-size: 30px;
}
</style>
