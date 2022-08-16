<template>
  <div style="width: 100%">
    <paginated-table-builder
      :observe-items-fn="observeOrders"
      :observe-fn-input="observeFnInput"
      @onRowEvent="onRowEvent"
      :columns="headers"
      :actions="['edit', 'delete']"
      :loading="tableLoading"
      :show-expand="true"
    >
      <template v-slot:header>
        <list-orders-filter @change="filterList" />
      </template>
      <template v-slot:[`item.date`]="{ item }">
        {{ new Date(item.date).toLocaleDateString() }}
      </template>
      <template v-slot:[`item.price`]="{ item }">
        {{ $n(item.price, "currency") }}
      </template>
      <template v-slot:expanded-item="{ headers, item }">
        <td :colspan="headers.length" class="px-4 py-3">
          <div class="subtitle-2">{{ $t("word.orderEntries") }}</div>
          <list-order-entries :entries="item.entries" />
        </td>
      </template>
    </paginated-table-builder>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { DataTableHeader } from "vuetify";
import { TableItemEvent } from "@/plugins/table-builder/TableItemEventType";
import i18n from "@/i18n";
import { FindOrdersInput, observeOrders } from "@/repositories/OrderRepository";
import ListOrdersFilter from "@/components/orders/ListOrdersFilter.vue";
import { NetworkOrder } from "@/model/network/NetworkOrder";
import ListOrderEntries from "@/components/orders/ListOrderEntries.vue";

const emit = defineEmits(["onRowEvent"]);

const tableLoading = ref(false);
const observeFnInput = ref<FindOrdersInput>({ limit: 10 });
const headers = ref<DataTableHeader[]>([
  {
    text: i18n.t("model.order.date").toString(),
    value: "date",
    sortable: false,
  },
  {
    text: i18n.t("model.order.store").toString(),
    value: "store.name",
    sortable: false,
  },
  {
    text: i18n.t("model.order.customer").toString(),
    value: "customer.name",
    sortable: false,
  },
  {
    text: i18n.t("model.order.price").toString(),
    value: "price",
    sortable: false,
  },
  { text: "", value: "data-table-expand" },
  {
    text: i18n.t("word.actions").toString(),
    value: "actions",
    sortable: false,
    width: "130px",
  },
]);

function filterList(input: FindOrdersInput) {
  observeFnInput.value = input;
}
function onRowEvent(event: TableItemEvent<NetworkOrder>) {
  // Pass-through
  emit("onRowEvent", event);
}
</script>
