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
<script lang="ts">
import { defineComponent, PropType, ref } from "@vue/composition-api";
import { DbOrderEntry } from "@/model/db/DbOrder";

export default defineComponent({
  props: {
    entries: {
      type: Array as PropType<DbOrderEntry[]>,
      required: true,
    },
  },
  data() {
    return {
      headers: [
        {
          text: "Nome",
          sortable: false,
          value: "name",
        },
        {
          text: "Quantità",
          sortable: false,
          value: "quantity",
        },
        {
          text: "Prezzo Unitario",
          sortable: false,
          value: "pricePerUnit",
        },
      ],
    };
  },
});
</script>
<style lang="scss" scoped>
.v-table tr:hover:not(.v-table__expanded__content) {
  background: red !important;
}
</style>
