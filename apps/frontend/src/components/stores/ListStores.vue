<template>
  <div style="width: 100%">
    <paginated-table-builder
      :observe-items-fn="observeStores"
      :observe-fn-input="observeFnInput"
      @onRowEvent="onRowEvent"
      :columns="headers"
      :actions="['edit', 'delete']"
      :loading="tableLoading"
    >
      <template v-slot:header>
        <list-stores-filter @change="filterList" />
      </template>
    </paginated-table-builder>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { DataTableHeader } from "vuetify";
import { TableItemEvent } from "@/plugins/table-builder/TableItemEventType";
import i18n from "@/i18n";
import ListStoresFilter from "@/components/stores/ListStoresFilter.vue";
import { observeStores } from "@/repositories/StoreRepository";
import { NetworkStore } from "@common/model/network/NetworkStore";
import { FindStoresInput } from "@common/model/network/FindStoresInput";

const emit = defineEmits(["onRowEvent"]);

const tableLoading = ref(false);
const observeFnInput = ref<FindStoresInput>({ limit: 10 });
const headers = ref<DataTableHeader[]>([
  {
    text: i18n.t("model.store.name").toString(),
    value: "name",
    sortable: false,
  },
  {
    text: i18n.t("word.actions").toString(),
    value: "actions",
    sortable: false,
    width: "130px",
  },
]);

function filterList(input: FindStoresInput) {
  observeFnInput.value = input;
}
function onRowEvent(event: TableItemEvent<NetworkStore>) {
  // Pass-through
  emit("onRowEvent", event);
}
</script>
