<template>
  <v-form class="pa-4" @submit.prevent role="search">
    <v-text-field
      v-model="form.searchName"
      :label="$t('components.ListStoresFilter.searchPerName')"
      :clearable="true"
    ></v-text-field>
  </v-form>
</template>

<script lang="ts">
import { defineComponent, reactive, watch } from "vue";
import { removeBlanks } from "@/helpers/utils";
import { FindCustomersInput } from "@/repositories/CustomerRepository";

export default defineComponent({
  setup(props, { emit }) {
    const form = reactive<FindCustomersInput>({
      limit: 10,
    });
    watch(form, (newValue) => {
      emit("change", removeBlanks(newValue));
    });
    return { form };
  },
});
</script>
