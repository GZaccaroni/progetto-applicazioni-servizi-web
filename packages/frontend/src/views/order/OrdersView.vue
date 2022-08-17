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
import ListOrders from "@/components/orders/ListOrders.vue";
import { NetworkOrder } from "@/model/network/NetworkOrder";
import { deleteOrder } from "@/repositories/OrderRepository";
import OrderFormDialog, {
  OrderFormDialogModel,
} from "@/components/form/order/OrderFormDialog.vue";
import i18n from "@/i18n";
import { showConfirmDialog } from "@/helpers/confirmDialog";

const dialogModel = ref<OrderFormDialogModel>({ isVisible: false });

function openNewItemDialog() {
  dialogModel.value = {
    isVisible: true,
  };
}
function deleteItem(item: NetworkOrder) {
  showConfirmDialog({
    title: i18n.t("confirm.delete.order.title").toString(),
    message: i18n.t("confirm.delete.order.message").toString(),
  }).then((confirmed) => {
    if (confirmed) {
      deleteOrder(item.id).catch(repositoryErrorHandler);
    }
  });
}
function onRowEvent(event: TableItemEvent<NetworkOrder>) {
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
