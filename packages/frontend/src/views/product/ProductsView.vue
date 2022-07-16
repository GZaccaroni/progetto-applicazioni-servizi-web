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

<script lang="ts">
import { defineComponent, ref } from "vue";
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

export default defineComponent({
  components: {
    ProductFormDialog,
    HeaderView,
    ListProducts,
    ConfirmDialog,
  },
  setup() {
    const dialogModel = ref<ProductFormDialogModel>({ isVisible: false });
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
        initialData: {},
      };
    },
    deleteItem(item: DbProduct) {
      this.confirmDialog
        ?.open(
          this.$t("confirm.delete.customer.title").toString(),
          this.$t("confirm.delete.customer.message", {
            name: item.name,
          }).toString()
        )
        .then((confirmed) => {
          if (confirmed) {
            deleteProduct(item.id).catch(repositoryErrorHandler);
          }
        });
    },
    onRowEvent(event: TableItemEvent<DbProduct>) {
      switch (event.type) {
        case TableItemEventType.rowEditAction:
          this.dialogModel = {
            isVisible: true,
            initialData: event.item,
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
