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

<script lang="ts">
import { defineComponent, ref } from "vue";
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

export default defineComponent({
  components: {
    OrderFormDialog,
    HeaderView,
    ListOrders,
    ConfirmDialog,
  },
  setup() {
    const dialogModel = ref<OrderFormDialogModel>({ isVisible: false });
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
    deleteItem(item: DbOrder) {
      this.confirmDialog
        ?.open(
          this.$t("confirm.delete.order.title").toString(),
          this.$t("confirm.delete.order.message").toString()
        )
        .then((confirmed) => {
          if (confirmed) {
            deleteOrder(item.id).catch(repositoryErrorHandler);
          }
        });
    },
    onRowEvent(event: TableItemEvent<DbOrder>) {
      switch (event.type) {
        case TableItemEventType.rowEditAction:
          this.dialogModel = {
            isVisible: true,
            itemToUpdate: event.item,
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
