<template>
  <v-data-table
    :headers="headers"
    :items="entries"
    :items-per-page="-1"
    :hide-default-footer="true"
    :disable-filtering="true"
    :disable-pagination="true"
    :disable-sort="true"
    :dense="true"
  >
    <template v-slot:[`item.pricePerUnit`]="{ item }">
      {{ $n(item.pricePerUnit, "currency") }}
    </template>
  </v-data-table>
</template>
<script setup lang="ts">
import { PropType } from "vue";
import { DbOrderEntry } from "@/model/db/DbOrder";
import i18n from "@/i18n";

defineProps({
  entries: {
    type: Array as PropType<DbOrderEntry[]>,
    required: true,
  },
});
const headers = [
  {
    text: i18n.t("model.order.varietyName"),
    sortable: false,
    value: "name",
  },
  {
    text: i18n.t("model.order.quantity"),
    sortable: false,
    value: "quantity",
  },
  {
    text: i18n.t("model.order.pricePerUnit"),
    sortable: false,
    value: "pricePerUnit",
  },
];
</script>
<style lang="scss" scoped>
.v-table tr:hover:not(.v-table__expanded__content) {
  background: red !important;
}
</style>
