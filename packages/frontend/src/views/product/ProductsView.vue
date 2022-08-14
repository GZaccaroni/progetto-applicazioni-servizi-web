<template>
  <v-container class="my-1" fluid>
    <header-view :title="$t('views.products.title').toString()">
      <template v-slot:endItems>
        <v-btn elevation="0" class="me-4" @click="openNewItemDialog()">
          <v-icon left>mdi-plus</v-icon>
          {{ $t("word.create") }}
        </v-btn>
      </template>
    </header-view>
    <list-products @onRowEvent="onRowEvent" />
    <product-form-dialog v-model="dialogModel" />
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
import ListProducts from "@/components/products/ListProducts.vue";
import { DbProduct } from "@/model/db/DbProduct";
import { deleteProduct } from "@/repositories/ProductRepository";
import ProductFormDialog, {
  ProductFormDialogModel,
} from "@/components/form/product/ProductFormDialog.vue";
import i18n from "@/i18n";

const dialogModel = ref<ProductFormDialogModel>({ isVisible: false });
const confirmDialog = ref<InstanceType<typeof ConfirmDialog>>();

function openNewItemDialog() {
  dialogModel.value = {
    isVisible: true,
  };
}
function deleteItem(item: DbProduct) {
  confirmDialog.value
    ?.open(
      i18n.t("confirm.delete.customer.title").toString(),
      i18n
        .t("confirm.delete.customer.message", {
          name: item.name,
        })
        .toString()
    )
    .then((confirmed) => {
      if (confirmed) {
        deleteProduct(item.id).catch(repositoryErrorHandler);
      }
    });
}
function onRowEvent(event: TableItemEvent<DbProduct>) {
  switch (event.type) {
    case TableItemEventType.rowEditAction:
      dialogModel.value = {
        isVisible: true,
        productToUpdate: event.item.id,
      };
      break;
    case TableItemEventType.rowDeleteAction:
      deleteItem(event.item);
      break;
  }
}
</script>
