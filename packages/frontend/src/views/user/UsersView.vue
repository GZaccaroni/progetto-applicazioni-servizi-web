<template>
  <v-container class="my-1" fluid>
    <header-view :title="$t('views.users.title').toString()">
      <template v-slot:endItems>
        <v-btn elevation="0" class="me-4" @click="openNewItemDialog()">
          <v-icon left>mdi-plus</v-icon>
          {{ $t("word.create") }}
        </v-btn>
      </template>
    </header-view>
    <list-users @onRowEvent="onRowEvent" />
    <user-form-dialog v-model="dialogModel" />
    <confirm-dialog ref="confirmDialog" />
  </v-container>
</template>

<script setup lang="ts">
import { ref } from "vue";
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
import i18n from "@/i18n";

const dialogModel = ref<UserFormDialogModel>({ isVisible: false });
const confirmDialog = ref<InstanceType<typeof ConfirmDialog>>();

function openNewItemDialog() {
  dialogModel.value = {
    isVisible: true,
  };
}
function deleteItem(item: DbUser) {
  confirmDialog.value
    ?.open(
      i18n.t("confirm.delete.user.title").toString(),
      i18n
        .t("confirm.delete.user.message", {
          username: item.username,
        })
        .toString()
    )
    .then((confirmed) => {
      if (confirmed) {
        deleteUser(item.username).catch(repositoryErrorHandler);
      }
    });
}
function onRowEvent(event: TableItemEvent<DbUser>) {
  switch (event.type) {
    case TableItemEventType.rowEditAction:
      dialogModel.value = {
        isVisible: true,
        userToUpdate: event.item.username,
      };
      break;
    case TableItemEventType.rowDeleteAction:
      deleteItem(event.item);
      break;
  }
}
</script>
