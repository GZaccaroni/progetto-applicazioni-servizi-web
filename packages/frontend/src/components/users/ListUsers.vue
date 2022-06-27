<template>
  <div style="width: 100%">
    <paginated-table-builder
      :observe-items-fn="observeItemsFn"
      :observe-fn-input="observeFnInput"
      @onDataEvent="clickAction"
      :columns="headers"
      :loading="tableLoading"
    >
      <!--
      <template v-slot:header v-if="showFilters">
       <form-builder-vuetify
         @onChangeForm="filterItems"
         :configForm="formConfig.form"
         :validation="formConfig.validate"
         :hide-buttons="true"
       >
       </form-builder-vuetify>
      </template>
      -->
      <template v-slot:[`item.isAdmin`]="{ item }">
        <v-simple-checkbox
          :value="item.isPrivate"
          :disabled="true"
        ></v-simple-checkbox>
      </template>
    </paginated-table-builder>
    <confirm-dialog-vuetify ref="confirm" />
  </div>
</template>

<script lang="ts">
import { defineComponent, ref } from "@vue/composition-api";
import { FindUsersInput, observeUsers } from "@/repositories/UserRepository";
import { DataTableHeader } from "vuetify";
import { DbUser } from "@/model/db/DbUser";
import {
  TableItemEvent,
  TableItemEventType,
} from "@/plugins/table-builder/TableItemEventType";

export default defineComponent({
  setup() {
    const observeItemsFn = observeUsers;
    const tableLoading = ref(false);
    const observeFnInput = ref<FindUsersInput>({ limit: 10 });
    const headers = ref<DataTableHeader[]>([
      {
        text: "Nome utente",
        value: `username`,
        sortable: false,
      },
      {
        text: "Amministratore",
        value: "isAdmin",
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
    openUserView(item: DbUser) {
      this.$router.push(`/users/${item.id}`);
    },

    clickAction(event: TableItemEvent<DbUser>) {
      switch (event.type) {
        case TableItemEventType.rowClick:
          this.openUserView(event.item);
          break;
        case TableItemEventType.rowSelection:
          this.$emit("onDataEvent", event);
          break;
      }
    },
  },
});
</script>
