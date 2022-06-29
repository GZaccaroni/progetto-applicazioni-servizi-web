<template>
  <v-form class="pa-4" @submit.prevent>
    <v-container>
      <v-row no-gutters>
        <v-col col="6">
          <text-field-date-picker
            v-model="form.fromDate"
            :max="form.toDate"
            label="Da"
          />
        </v-col>
        <v-col col="6">
          <text-field-date-picker
            v-model="form.toDate"
            :min="form.fromDate"
            label="a"
          />
        </v-col>
      </v-row>
    </v-container>
  </v-form>
</template>

<script lang="ts">
import { defineComponent, reactive, watch } from "@vue/composition-api";
import { removeBlanks } from "@/helpers/utils";
import { FindOrdersInput } from "@/repositories/OrdersRepository";
import TextFieldDatePicker from "@/components/common/TextFieldDatePicker.vue";

export default defineComponent({
  components: {
    TextFieldDatePicker,
  },
  setup(props, { emit }) {
    const form = reactive<FindOrdersInput>({
      limit: 10,
    });
    watch(form, (newValue) => {
      emit("change", removeBlanks(newValue));
    });
    return { form };
  },
});
</script>
