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

<script lang="ts">
import { defineComponent, ref } from "@vue/composition-api";
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

export default defineComponent({
  components: {
    StoreFormDialog,
    HeaderView,
    ListStores,
    ConfirmDialog,
  },
  setup() {
    const dialogModel = ref<StoreFormDialogModel>({ isVisible: false });
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
    deleteItem(item: DbStore) {
      this.confirmDialog
        ?.open(
          this.$t("confirm.delete.store.title").toString(),
          this.$t("confirm.delete.store.message", {
            name: item.name,
          }).toString()
        )
        .then((confirmed) => {
          if (confirmed) {
            deleteStore(item.id).catch(repositoryErrorHandler);
          }
        });
    },
    onRowEvent(event: TableItemEvent<DbStore>) {
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
