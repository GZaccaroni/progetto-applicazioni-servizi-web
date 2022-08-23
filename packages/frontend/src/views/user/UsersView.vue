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
  </v-container>
</template>

<script setup lang="ts">
import { ref } from "vue";
import ListUsers from "@/components/users/ListUsers.vue";
import {
  TableItemEvent,
  TableItemEventType,
} from "@/plugins/table-builder/TableItemEventType";
import { NetworkUser } from "@common/model/network/NetworkUser";
import HeaderView from "@/components/common/HeaderView.vue";
import UserFormDialog, {
  UserFormDialogModel,
} from "@/components/form/user/UserFormDialog.vue";
import { deleteUser } from "@/repositories/UserRepository";
import { repositoryErrorHandler } from "@/helpers/errorHandler";
import i18n from "@/i18n";
import { showConfirmDialog } from "@/helpers/confirmDialog";

const dialogModel = ref<UserFormDialogModel>({ isVisible: false });

function openNewItemDialog() {
  dialogModel.value = {
    isVisible: true,
  };
}
function deleteItem(item: NetworkUser) {
  showConfirmDialog({
    title: i18n.t("confirm.delete.user.title").toString(),
    message: i18n
      .t("confirm.delete.user.message", {
        username: item.username,
      })
      .toString(),
  }).then((confirmed) => {
    if (confirmed) {
      deleteUser(item.username).catch(repositoryErrorHandler);
    }
  });
}
function onRowEvent(event: TableItemEvent<NetworkUser>) {
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
