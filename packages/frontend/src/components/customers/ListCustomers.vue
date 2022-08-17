<template>
  <div style="width: 100%">
    <paginated-table-builder
      :observe-items-fn="observeCustomers"
      :observe-fn-input="observeFnInput"
      @onRowEvent="onRowEvent"
      :columns="headers"
      :actions="['edit', 'delete']"
      :loading="tableLoading"
    >
      <template v-slot:header>
        <list-customers-filter @change="filterList" />
      </template>
    </paginated-table-builder>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { DataTableHeader } from "vuetify";
import { TableItemEvent } from "@/plugins/table-builder/TableItemEventType";
import i18n from "@/i18n";
import {
  FindCustomersInput,
  observeCustomers,
} from "@/repositories/CustomerRepository";
import ListCustomersFilter from "@/components/customers/ListCustomersFilter.vue";
import { NetworkCustomer } from "@/model/network/NetworkCustomer";

const emit = defineEmits(["onRowEvent"]);

const tableLoading = ref(false);
const observeFnInput = ref<FindCustomersInput>({ limit: 10 });
const headers = ref<DataTableHeader[]>([
  {
    text: i18n.t("model.customer.name").toString(),
    value: "name",
    sortable: false,
  },
  {
    text: i18n.t("model.customer.address").toString(),
    value: "address",
    sortable: false,
  },
  {
    text: i18n.t("model.customer.phoneNumber").toString(),
    value: "phoneNumber",
    sortable: false,
  },
  {
    text: i18n.t("model.customer.vatNumber").toString(),
    value: "vatNumber",
    sortable: false,
  },
  {
    text: i18n.t("word.actions").toString(),
    value: "actions",
    sortable: false,
    width: "130px",
  },
]);

function filterList(input: FindCustomersInput) {
  observeFnInput.value = input;
}
function onRowEvent(event: TableItemEvent<NetworkCustomer>) {
  // Pass-through
  emit("onRowEvent", event);
}
</script>
