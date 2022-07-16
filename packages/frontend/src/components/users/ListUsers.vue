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
        <list-users-filter @change="filterList" />
      </template>
      <template v-slot:[`item.isAdmin`]="{ item }">
        <v-simple-checkbox
          :value="item.isAdmin"
          :disabled="true"
        ></v-simple-checkbox>
      </template>
    </paginated-table-builder>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref } from "vue";
import { FindUsersInput, observeUsers } from "@/repositories/UserRepository";
import { DataTableHeader } from "vuetify";
import { DbUser } from "@/model/db/DbUser";
import { TableItemEvent } from "@/plugins/table-builder/TableItemEventType";
import ListUsersFilter from "@/components/users/ListUsersFilter.vue";
import i18n from "@/i18n";

export default defineComponent({
  components: {
    ListUsersFilter,
  },
  setup() {
    const observeItemsFn = observeUsers;
    const tableLoading = ref(false);
    const observeFnInput = ref<FindUsersInput>({ limit: 10 });
    const headers = ref<DataTableHeader[]>([
      {
        text: i18n.t("model.user.username").toString(),
        value: `username`,
        sortable: false,
      },
      {
        text: i18n.t("model.user.isAdmin").toString(),
        value: "isAdmin",
        sortable: false,
        width: "130px",
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
    filterList(input: FindUsersInput) {
      this.observeFnInput = input;
    },
    onRowEvent(event: TableItemEvent<DbUser>) {
      // Pass-through
      this.$emit("onRowEvent", event);
    },
  },
});
</script>
