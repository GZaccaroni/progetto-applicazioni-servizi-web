<template>
  <v-form class="pa-4" @submit.prevent role="search">
    <v-container fluid>
      <v-row no-gutters>
        <v-col cols="4" md="3" lg="2">
          <async-select
            v-model="form.storeId"
            :label="$t('word.store').toString()"
            :find-items-fn="getSelectStores"
            :clearable="true"
          />
        </v-col>
        <v-spacer />
        <v-col cols="4" md="3" lg="2">
          <text-field-date-picker
            v-model="form.fromDate"
            :max="form.toDate"
            :label="$t('word.fromDate').toString()"
            :clearable="true"
            :button-aria-label="
              $t('components.ListOrdersFilter.fromDateAria').toString()
            "
          />
        </v-col>
        <v-col cols="4" md="3" lg="2">
          <text-field-date-picker
            v-model="form.toDate"
            :min="form.fromDate"
            :label="$t('word.toDate').toString()"
            :clearable="true"
            :button-aria-label="
              $t('components.ListOrdersFilter.toDateAria').toString()
            "
          />
        </v-col>
      </v-row>
    </v-container>
  </v-form>
</template>

<script setup lang="ts">
import { reactive, watch } from "vue";
import { removeBlanks } from "@/helpers/utils";
import TextFieldDatePicker from "@/components/common/TextFieldDatePicker.vue";
import AsyncSelect from "@/components/common/AsyncSelect.vue";
import { getSelectStores } from "@/helpers/asyncSelectUtils";
import { FindOrdersInput } from "@common/model/network/FindOrdersInput";

const emit = defineEmits(["change"]);

const form = reactive<FindOrdersInput>({
  limit: 10,
  storeId: undefined,
  fromDate: undefined,
  toDate: undefined,
});

watch(
  () => form,
  (newValue) => {
    emit("change", removeBlanks(newValue));
  },
  { deep: true }
);
</script>
