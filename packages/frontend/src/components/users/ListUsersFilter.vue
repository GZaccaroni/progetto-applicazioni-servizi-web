<template>
  <v-form class="pa-4" @submit.prevent>
    <v-text-field
      v-model="form.searchName"
      label="Cerca per nome"
    ></v-text-field>
  </v-form>
</template>

<script lang="ts">
import { defineComponent, reactive, watch } from "@vue/composition-api";
import { FindUsersInput } from "@/repositories/UserRepository";
import { removeBlanks } from "@/helpers/textUtils";

export default defineComponent({
  setup(props, { emit }) {
    const form = reactive<FindUsersInput>({
      limit: 10,
    });
    console.log("Setup called!");

    watch(form, (newValue) => {
      emit("change", removeBlanks(newValue));
    });
    return { form };
  },
});
</script>
