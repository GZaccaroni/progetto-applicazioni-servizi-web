<template>
  <div style="width: 100%">
    <paginated-table-builder
      :observe-items-fn="observeItemsFn"
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

<script lang="ts">
import { defineComponent, ref } from "vue";
import { DataTableHeader } from "vuetify";
import { TableItemEvent } from "@/plugins/table-builder/TableItemEventType";
import i18n from "@/i18n";
import { FindStoresInput } from "@/repositories/StoreRepository";
import {
  FindCustomersInput,
  observeCustomers,
} from "@/repositories/CustomerRepository";
import ListCustomersFilter from "@/components/customers/ListCustomersFilter.vue";
import { DbCustomer } from "@/model/db/DbCustomer";

export default defineComponent({
  components: {
    ListCustomersFilter,
  },
  setup() {
    const observeItemsFn = observeCustomers;
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
    onRowEvent(event: TableItemEvent<DbCustomer>) {
      // Pass-through
      this.$emit("onRowEvent", event);
    },
  },
});
</script>
