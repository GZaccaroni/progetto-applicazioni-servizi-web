<template>
  <v-container class="my-1" fluid>
    <header-view title="Utenti">
      <template v-slot:endItems>
        <v-btn elevation="0" class="me-4" @click="openNewItemDialog()">
          <v-icon left>mdi-plus</v-icon>
          Aggiungi
        </v-btn>
      </template>
    </header-view>
    <list-users @onRowEvent="onRowEvent" />
    <user-form-dialog v-model="dialogModel" />
    <confirm-dialog ref="confirmDialog" />
  </v-container>
</template>

<script lang="ts">
import { defineComponent, ref } from "@vue/composition-api";
import ListUsers from "@/components/users/ListUsers.vue";
import {
  TableItemEvent,
  TableItemEventType,
} from "@/plugins/table-builder/TableItemEventType";
import { DbUser } from "@/model/db/DbUser";
import HeaderView from "@/components/common/HeaderView.vue";
import UserFormDialog, {
  UserFormDialogModel,
} from "@/components/form/user/UserFormDialog.vue";
import { deleteUser } from "@/repositories/UserRepository";
import { repositoryErrorHandler } from "@/helpers/errorHandler";
import { ConfirmDialog } from "@/plugins/confirm-dialog/main";

export default defineComponent({
  components: {
    UserFormDialog,
    HeaderView,
    ListUsers,
    ConfirmDialog,
  },
  setup() {
    const dialogModel = ref<UserFormDialogModel>({ isVisible: false });
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
    deleteItem(item: DbUser) {
      this.confirmDialog
        ?.open(
          "Elimina utente",
          "Sei sicuro di volere eliminare " + item.username + "?"
        )
        .then((confirmed) => {
          if (confirmed) {
            deleteUser(item.username).catch(repositoryErrorHandler);
          }
        });
    },
    onRowEvent(event: TableItemEvent<DbUser>) {
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
