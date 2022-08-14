<template>
  <v-form class="pa-4" @submit.prevent role="search">
    <v-text-field
      v-model="form.searchName"
      :label="$t('components.ListUsersFilter.searchPerName')"
      :clearable="true"
    ></v-text-field>
  </v-form>
</template>

<script setup lang="ts">
import { reactive, watch } from "vue";
import { FindUsersInput } from "@/repositories/UserRepository";
import { removeBlanks } from "@/helpers/utils";

const emit = defineEmits(["change"]);

const form = reactive<FindUsersInput>({
  limit: 10,
});
watch(form, (newValue) => {
  emit("change", removeBlanks(newValue));
});
</script>
