<template>
  <v-form class="pa-4" @submit.prevent>
    <v-container fluid>
      <v-row>
        <v-col cols="12" md="8">
          <v-row>
            <v-col cols="6" sm="3" md="2">
              <async-select
                v-model="form.dataType"
                :label="$t('word.chartDataType').toString()"
                :find-items-fn="getSelectChartDataType"
                :lazy="false"
              />
            </v-col>
            <v-col cols="6" sm="3" md="3">
              <async-select
                v-model="form.storeId"
                :label="$t('word.store').toString()"
                :find-items-fn="getSelectStores"
                :clearable="true"
              />
            </v-col>
            <v-col cols="6" sm="3" md="3">
              <async-select
                v-model="form.customerId"
                :label="$t('word.customer').toString()"
                :find-items-fn="getSelectCustomers"
                :clearable="true"
              />
            </v-col>
            <v-col cols="6" sm="3" md="3">
              <async-select
                v-model="productsKinds"
                :label="$t('model.order.product').toString()"
                :find-items-fn="getSelectProductKinds"
                :multiple="true"
                :clearable="true"
              />
            </v-col>
          </v-row>
        </v-col>
        <v-col cols="12" md="4">
          <v-spacer />
          <v-row>
            <v-col cols="6">
              <text-field-date-picker
                v-model="form.fromDate"
                :max="form.toDate"
                :label="$t('word.fromDate').toString()"
                :clearable="true"
                :button-aria-label="
                  $t('components.StatsFilter.toDateAria').toString()
                "
              />
            </v-col>
            <v-col cols="6">
              <text-field-date-picker
                v-model="form.toDate"
                :min="form.fromDate"
                :label="$t('word.toDate').toString()"
                :clearable="true"
                :button-aria-label="
                  $t('components.StatsFilter.toDateAria').toString()
                "
              />
            </v-col>
          </v-row>
        </v-col>
      </v-row>
    </v-container>
  </v-form>
</template>

<script setup lang="ts">
import { computed, reactive, watch } from "vue";
import { removeBlanks } from "@/helpers/utils";
import TextFieldDatePicker from "@/components/common/TextFieldDatePicker.vue";
import AsyncSelect from "@/components/common/AsyncSelect.vue";
import {
  getSelectChartDataType,
  getSelectCustomers,
  getSelectProductKinds,
  getSelectStores,
  PRODUCT_KIND_IDENTIFIER_SEPARATOR,
} from "@/helpers/asyncSelectUtils";
import { AnalyticsDataInput } from "@/repositories/AnalyticsRepository";
import { DbChartDataType } from "@/model/db/DbChartData";

const emit = defineEmits(["change"]);

const form = reactive<AnalyticsDataInput>({
  dataType: DbChartDataType.price,
  fromDate: undefined,
  toDate: undefined,
});

const productsKinds = computed<string[] | undefined>({
  get: () => {
    return form.items?.map((item) => {
      return item.variantId == undefined
        ? item.productId
        : `${item.productId}${PRODUCT_KIND_IDENTIFIER_SEPARATOR}${item.variantId}`;
    });
  },
  set: (newValue) => {
    form.items = newValue?.map((el) => {
      const kindComponents = el.split(PRODUCT_KIND_IDENTIFIER_SEPARATOR);
      return {
        productId: kindComponents[0],
        variantId: kindComponents[1],
      };
    });
  },
});
watch(
  () => form,
  (newValue) => {
    emit("change", removeBlanks(newValue));
  },
  { deep: true }
);
</script>
