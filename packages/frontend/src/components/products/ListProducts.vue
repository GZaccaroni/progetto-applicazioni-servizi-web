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
        <list-products-filter @change="filterList" />
      </template>
    </paginated-table-builder>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref } from "vue";
import { DataTableHeader } from "vuetify";
import { TableItemEvent } from "@/plugins/table-builder/TableItemEventType";
import i18n from "@/i18n";
import {
  FindProductsInput,
  observeProducts,
} from "@/repositories/ProductRepository";
import { DbProduct } from "@/model/db/DbProduct";
import ListProductsFilter from "@/components/products/ListProductsFilter.vue";

export default defineComponent({
  components: {
    ListProductsFilter,
  },
  setup() {
    const observeItemsFn = observeProducts;
    const tableLoading = ref(false);
    const observeFnInput = ref<FindProductsInput>({ limit: 10 });
    const headers = ref<DataTableHeader[]>([
      {
        text: i18n.t("model.product.name").toString(),
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
    filterList(input: FindProductsInput) {
      this.observeFnInput = input;
    },
    onRowEvent(event: TableItemEvent<DbProduct>) {
      // Pass-through
      this.$emit("onRowEvent", event);
    },
  },
});
</script>
