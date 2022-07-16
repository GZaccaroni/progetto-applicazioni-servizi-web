<template>
  <v-form class="pa-4" @submit.prevent>
    <v-text-field
      v-model="form.searchName"
      :label="$t('components.ListUsersFilter.searchPerName')"
    ></v-text-field>
  </v-form>
</template>

<script lang="ts">
import { defineComponent, reactive, watch } from "vue";
import { FindUsersInput } from "@/repositories/UserRepository";
import { removeBlanks } from "@/helpers/utils";

export default defineComponent({
  setup(props, { emit }) {
    const form = reactive<FindUsersInput>({
      limit: 10,
    });
    watch(form, (newValue) => {
      emit("change", removeBlanks(newValue));
    });
    return { form };
  },
});
</script>
