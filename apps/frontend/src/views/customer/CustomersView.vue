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
  </v-container>
</template>

<script setup lang="ts">
import { ref } from "vue";
import {
  TableItemEvent,
  TableItemEventType,
} from "@/plugins/table-builder/TableItemEventType";
import HeaderView from "@/components/common/HeaderView.vue";
import { repositoryErrorHandler } from "@/helpers/errorHandler";
import { NetworkCustomer } from "@common/model/network/NetworkCustomer";
import { deleteCustomer } from "@/repositories/CustomerRepository";
import ListCustomers from "@/components/customers/ListCustomers.vue";
import CustomerFormDialog, {
  CustomerFormDialogModel,
} from "@/components/form/customer/CustomerFormDialog.vue";
import i18n from "@/i18n";
import { showConfirmDialog } from "@/helpers/confirmDialog";

const dialogModel = ref<CustomerFormDialogModel>({ isVisible: false });

function openNewItemDialog() {
  dialogModel.value = {
    isVisible: true,
  };
}
function deleteItem(item: NetworkCustomer) {
  showConfirmDialog({
    title: i18n.t("confirm.delete.customer.title").toString(),
    message: i18n
      .t("confirm.delete.customer.message", {
        name: item.name,
      })
      .toString(),
  }).then((confirmed) => {
    if (confirmed) {
      deleteCustomer(item.id).catch(repositoryErrorHandler);
    }
  });
}
function onRowEvent(event: TableItemEvent<NetworkCustomer>) {
  switch (event.type) {
    case TableItemEventType.rowEditAction:
      dialogModel.value = {
        isVisible: true,
        customerToUpdate: event.item.id,
      };
      break;
    case TableItemEventType.rowDeleteAction:
      deleteItem(event.item);
      break;
  }
}
</script>
