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
import ListProducts from "@/components/products/ListProducts.vue";
import { NetworkProduct } from "@common/model/network/NetworkProduct";
import { deleteProduct } from "@/repositories/ProductRepository";
import ProductFormDialog, {
  ProductFormDialogModel,
} from "@/components/form/product/ProductFormDialog.vue";
import i18n from "@/i18n";
import { showConfirmDialog } from "@/helpers/confirmDialog";

const dialogModel = ref<ProductFormDialogModel>({ isVisible: false });

function openNewItemDialog() {
  dialogModel.value = {
    isVisible: true,
  };
}
function deleteItem(item: NetworkProduct) {
  showConfirmDialog({
    title: i18n.t("confirm.delete.product.title").toString(),
    message: i18n
      .t("confirm.delete.product.message", {
        name: item.name,
      })
      .toString(),
  }).then((confirmed) => {
    if (confirmed) {
      deleteProduct(item.id).catch(repositoryErrorHandler);
    }
  });
}
function onRowEvent(event: TableItemEvent<NetworkProduct>) {
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
