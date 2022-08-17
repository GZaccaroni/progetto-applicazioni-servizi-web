<template>
  <v-form class="pa-4" @submit.prevent role="search">
    <v-text-field
      v-model="form.searchName"
      :label="$t('components.ListProductsFilter.searchPerName')"
      :clearable="true"
    ></v-text-field>
  </v-form>
</template>

<script setup lang="ts">
import { reactive, watch } from "vue";
import { removeBlanks } from "@/helpers/utils";
import { FindProductsInput } from "@/repositories/ProductRepository";

const emit = defineEmits(["change"]);

const form = reactive<FindProductsInput>({
  limit: 10,
});
watch(form, (newValue) => {
  emit("change", removeBlanks(newValue));
});
</script>
