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
        <list-stores-filter @change="filterList" />
      </template>
    </paginated-table-builder>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref } from "@vue/composition-api";
import { DataTableHeader } from "vuetify";
import { TableItemEvent } from "@/plugins/table-builder/TableItemEventType";
import i18n from "@/i18n";
import ListStoresFilter from "@/components/stores/ListStoresFilter.vue";
import { FindStoresInput, observeStores } from "@/repositories/StoreRepository";
import { DbStore } from "@/model/db/DbStore";

export default defineComponent({
  components: {
    ListStoresFilter,
  },
  setup() {
    const observeItemsFn = observeStores;
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
    onRowEvent(event: TableItemEvent<DbStore>) {
      // Pass-through
      this.$emit("onRowEvent", event);
    },
  },
});
</script>
