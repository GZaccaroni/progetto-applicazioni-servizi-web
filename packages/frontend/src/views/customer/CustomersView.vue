<template>
  <v-container class="my-1" fluid>
    <header-view :title="$t('views.customers.title').toString()">
      <template v-slot:endItems>
        <v-btn elevation="0" class="me-4" @click="openNewItemDialog()">
          <v-icon left>mdi-plus</v-icon>
          {{ $t("word.create") }}
        </v-btn>
      </template>
    </header-view>
    <list-customers @onRowEvent="onRowEvent" />
    <customer-form-dialog v-model="dialogModel" />
    <confirm-dialog ref="confirmDialog" />
  </v-container>
</template>

<script lang="ts">
import { defineComponent, ref } from "vue";
import {
  TableItemEvent,
  TableItemEventType,
} from "@/plugins/table-builder/TableItemEventType";
import HeaderView from "@/components/common/HeaderView.vue";
import { repositoryErrorHandler } from "@/helpers/errorHandler";
import { ConfirmDialog } from "@/plugins/confirm-dialog/main";
import { DbCustomer } from "@/model/db/DbCustomer";
import { deleteCustomer } from "@/repositories/CustomerRepository";
import ListCustomers from "@/components/customers/ListCustomers.vue";
import CustomerFormDialog, {
  CustomerFormDialogModel,
} from "@/components/form/customer/CustomerFormDialog.vue";

export default defineComponent({
  components: {
    CustomerFormDialog,
    HeaderView,
    ListCustomers,
    ConfirmDialog,
  },
  setup() {
    const dialogModel = ref<CustomerFormDialogModel>({ isVisible: false });
    const confirmDialog = ref<InstanceType<typeof ConfirmDialog>>();
    return {
      confirmDialog,
      dialogModel,
    };
  },
  methods: {
    openNewItemDialog() {
      this.dialogModel = {
        isVisible: true,
      };
    },
    deleteItem(item: DbCustomer) {
      this.confirmDialog
        ?.open(
          this.$t("confirm.delete.customer.title").toString(),
          this.$t("confirm.delete.customer.message", {
            name: item.name,
          }).toString()
        )
        .then((confirmed) => {
          if (confirmed) {
            deleteCustomer(item.id).catch(repositoryErrorHandler);
          }
        });
    },
    onRowEvent(event: TableItemEvent<DbCustomer>) {
      switch (event.type) {
        case TableItemEventType.rowEditAction:
          this.dialogModel = {
            isVisible: true,
            customerToUpdate: event.item.id,
          };
          break;
        case TableItemEventType.rowDeleteAction:
          this.deleteItem(event.item);
          break;
      }
    },
  },
});
</script>
