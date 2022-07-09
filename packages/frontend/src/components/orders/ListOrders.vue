<template>
  <div style="width: 100%">
    <paginated-table-builder
      :observe-items-fn="observeItemsFn"
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
        {{ item.date.toLocaleDateString() }}
      </template>
      <template v-slot:[`item.price`]="{ item }">
        {{ $n(item.price, "currency") }}
      </template>
      <template v-slot:expanded-item="{ headers, item }">
        <td :colspan="headers.length" class="px-4 py-3">
          <div class="subtitle-2">Contenuto dell'ordine</div>
          <list-order-entries :entries="item.entries" />
        </td>
      </template>
    </paginated-table-builder>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref } from "@vue/composition-api";
import { DataTableHeader } from "vuetify";
import { TableItemEvent } from "@/plugins/table-builder/TableItemEventType";
import i18n from "@/i18n";
import { FindOrdersInput, observeOrders } from "@/repositories/OrderRepository";
import { FindStoresInput } from "@/repositories/StoreRepository";
import ListOrdersFilter from "@/components/orders/ListOrdersFilter.vue";
import { DbOrder } from "@/model/db/DbOrder";
import ListOrderEntries from "@/components/orders/ListOrderEntries.vue";

export default defineComponent({
  components: {
    ListOrderEntries,
    ListOrdersFilter,
  },
  setup() {
    const observeItemsFn = observeOrders;
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
    ]);
    return {
      observeItemsFn,
      observeFnInput,
      tableLoading,
      headers,
    };
  },
  methods: {
    filterList(input: FindStoresInput) {
      this.observeFnInput = input;
    },
    onRowEvent(event: TableItemEvent<DbOrder>) {
      // Pass-through
      this.$emit("onRowEvent", event);
    },
  },
});
</script>
