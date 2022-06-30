<template>
  <v-form class="pa-4" @submit.prevent>
    <v-container fluid>
      <v-row no-gutters>
        <v-col col="4">
          <async-select
            v-model="selectedStore"
            label="Store"
            :find-items-fn="findItemsFn"
            :clearable="true"
          />
        </v-col>
        <v-spacer />
        <v-col col="4">
          <text-field-date-picker
            v-model="form.fromDate"
            :max="form.toDate"
            label="Da"
          />
        </v-col>
        <v-col col="4">
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
import { defineComponent, reactive, ref, watch } from "@vue/composition-api";
import { removeBlanks } from "@/helpers/utils";
import { FindOrdersInput } from "@/repositories/OrdersRepository";
import TextFieldDatePicker from "@/components/common/TextFieldDatePicker.vue";
import AsyncSelect, {
  AsyncSelectItem,
} from "@/components/common/AsyncSelect.vue";
import { getSelectStoreItems } from "@/helpers/asyncSelectUtils";
import { observableRef } from "@/components/common/VueComposition";
import Vue from "vue";

export default defineComponent({
  components: {
    AsyncSelect,
    TextFieldDatePicker,
  },
  setup(props, { emit }) {
    const findItemsFn = getSelectStoreItems;
    const form = reactive<FindOrdersInput>({
      limit: 10,
      storeId: undefined,
    });

    watch(
      () => form,
      (newValue) => {
        emit("change", removeBlanks(newValue));
      },
      { deep: true }
    );
    const selectedStore = observableRef<AsyncSelectItem | undefined>(
      undefined,
      (newValue) => {
        form.storeId = newValue?.id;
      }
    );
    return { findItemsFn, form, selectedStore };
  },
});
</script>
