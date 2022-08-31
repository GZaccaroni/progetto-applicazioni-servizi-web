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
                :return-object="true"
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
import { ref, watch } from "vue";
import { removeBlanks } from "@/helpers/utils";
import TextFieldDatePicker from "@/components/common/TextFieldDatePicker.vue";
import AsyncSelect from "@/components/common/AsyncSelect.vue";
import {
  getSelectChartDataType,
  getSelectCustomers,
  getSelectProductKinds,
  getSelectStores,
  SelectProductKind,
} from "@/helpers/asyncSelectUtils";
import { ChartDataType } from "@common/model/common/ChartDataType";
import { GetAnalyticsInput } from "@common/model/network/GetAnalyticsInput";
import { AsyncSelectItem } from "@/components/common/AsyncSelectTypes";

const emit = defineEmits(["change"]);

const form = ref<GetAnalyticsInput>({
  dataType: ChartDataType.Quantity,
  fromDate: undefined,
  toDate: undefined,
  products: undefined,
});

const productsKinds = ref<AsyncSelectItem<SelectProductKind>[]>([]);
watch(
  productsKinds,
  (newValue) => {
    if (newValue.length == 0) {
      form.value.products = undefined;
    } else {
      form.value.products = newValue.flatMap((selectItem) =>
        selectItem.item != undefined
          ? [
              {
                productId: selectItem.item.productId,
                variantId: selectItem.item.variantId,
              },
            ]
          : []
      );
    }
  },
  { deep: true }
);
watch(
  form,
  (newValue) => {
    emit("change", removeBlanks(newValue));
  },
  { deep: true }
);
</script>
