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
          this.$t("confirm.delete.user.title").toString(),
          this.$t("confirm.delete.user.message", {
            username: item.username,
          }).toString()
        )
        .then((confirmed) => {
          if (confirmed) {
            deleteUser(item.id).catch(repositoryErrorHandler);
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
