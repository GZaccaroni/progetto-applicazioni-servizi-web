<template>
  <v-container class="my-1" fluid>
    <header-view :title="$t('views.orders.title').toString()">
      <template v-slot:endItems>
        <v-btn elevation="0" class="me-4" @click="openNewItemDialog()">
          <v-icon left>mdi-plus</v-icon>
          {{ $t("word.create") }}
        </v-btn>
      </template>
    </header-view>
    <list-orders @onRowEvent="onRowEvent" />
    <order-form-dialog v-model="dialogModel" />
    <confirm-dialog ref="confirmDialog" />
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
import { ConfirmDialog } from "@/plugins/confirm-dialog/main";
import ListOrders from "@/components/orders/ListOrders.vue";
import { DbOrder } from "@/model/db/DbOrder";
import { deleteOrder } from "@/repositories/OrderRepository";
import OrderFormDialog, {
  OrderFormDialogModel,
} from "@/components/form/order/OrderFormDialog.vue";
import i18n from "@/i18n";

const dialogModel = ref<OrderFormDialogModel>({ isVisible: false });
const confirmDialog = ref<InstanceType<typeof ConfirmDialog>>();

function openNewItemDialog() {
  dialogModel.value = {
    isVisible: true,
  };
}
function deleteItem(item: DbOrder) {
  confirmDialog.value
    ?.open(
      i18n.t("confirm.delete.order.title").toString(),
      i18n.t("confirm.delete.order.message").toString()
    )
    .then((confirmed) => {
      if (confirmed) {
        deleteOrder(item.id).catch(repositoryErrorHandler);
      }
    });
}
function onRowEvent(event: TableItemEvent<DbOrder>) {
  switch (event.type) {
    case TableItemEventType.rowEditAction:
      dialogModel.value = {
        isVisible: true,
        orderToUpdate: event.item.id,
      };
      break;
    case TableItemEventType.rowDeleteAction:
      deleteItem(event.item);
      break;
  }
}
</script>
