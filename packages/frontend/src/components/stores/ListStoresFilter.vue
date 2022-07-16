<template>
  <v-form class="pa-4" @submit.prevent>
    <v-text-field
      v-model="form.searchName"
      :label="$t('components.ListStoresFilter.searchPerName')"
    ></v-text-field>
  </v-form>
</template>

<script lang="ts">
import { defineComponent, reactive, watch } from "vue";
import { removeBlanks } from "@/helpers/utils";
import { FindStoresInput } from "@/repositories/StoreRepository";

export default defineComponent({
  setup(props, { emit }) {
    const form = reactive<FindStoresInput>({
      limit: 10,
    });
    watch(form, (newValue) => {
      emit("change", removeBlanks(newValue));
    });
    return { form };
  },
});
</script>
