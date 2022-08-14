<template>
  <v-container class="my-1" fluid>
    <header-view :title="$t('views.stores.title').toString()">
      <template v-slot:endItems>
        <v-btn elevation="0" class="me-4" @click="openNewItemDialog()">
          <v-icon left>mdi-plus</v-icon>
          {{ $t("word.create") }}
        </v-btn>
      </template>
    </header-view>
    <list-stores @onRowEvent="onRowEvent" />
    <store-form-dialog v-model="dialogModel" />
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
import ListStores from "@/components/stores/ListStores.vue";
import { DbStore } from "@/model/db/DbStore";
import { deleteStore } from "@/repositories/StoreRepository";
import StoreFormDialog, {
  StoreFormDialogModel,
} from "@/components/form/store/StoreFormDialog.vue";
import i18n from "@/i18n";

const dialogModel = ref<StoreFormDialogModel>({ isVisible: false });
const confirmDialog = ref<InstanceType<typeof ConfirmDialog>>();

function openNewItemDialog() {
  dialogModel.value = {
    isVisible: true,
  };
}
function deleteItem(item: DbStore) {
  confirmDialog.value
    ?.open(
      i18n.t("confirm.delete.store.title").toString(),
      i18n
        .t("confirm.delete.store.message", {
          name: item.name,
        })
        .toString()
    )
    .then((confirmed) => {
      if (confirmed) {
        deleteStore(item.id).catch(repositoryErrorHandler);
      }
    });
}
function onRowEvent(event: TableItemEvent<DbStore>) {
  switch (event.type) {
    case TableItemEventType.rowEditAction:
      dialogModel.value = {
        isVisible: true,
        storeToUpdate: event.item.id,
      };
      break;
    case TableItemEventType.rowDeleteAction:
      deleteItem(event.item);
      break;
  }
}
</script>
