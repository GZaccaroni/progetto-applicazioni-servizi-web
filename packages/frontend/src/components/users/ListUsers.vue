<template>
  <div style="width: 100%">
    <paginated-table-builder
      :observe-items-fn="observeUsers"
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

<script setup lang="ts">
import { ref } from "vue";
import { FindUsersInput, observeUsers } from "@/repositories/UserRepository";
import { DataTableHeader } from "vuetify";
import { NetworkUser } from "@/model/network/NetworkUser";
import { TableItemEvent } from "@/plugins/table-builder/TableItemEventType";
import ListUsersFilter from "@/components/users/ListUsersFilter.vue";
import i18n from "@/i18n";

const emit = defineEmits(["onRowEvent"]);

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

function filterList(input: FindUsersInput) {
  observeFnInput.value = input;
}
function onRowEvent(event: TableItemEvent<NetworkUser>) {
  // Pass-through
  emit("onRowEvent", event);
}
</script>
