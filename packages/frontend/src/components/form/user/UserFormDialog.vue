<template>
  <form-dialog
    v-model="isVisible"
    :submit-button-text="$t('word.save').toString()"
    :submit-button-loading="submitButtonLoading"
    :submit-button-enabled="validateForm(formData)"
    :dialog-loading="dialogLoading"
    :title="$t(create ? 'model.user.add' : 'model.user.edit').toString()"
    @submit="saveForm"
  >
    <v-text-field
      v-model="formData.username"
      :label="$t('model.user.username')"
      minlength="4"
      maxlength="30"
      counter
      :disabled="!create"
      :autocomplete="isCurrentUser ? 'username' : 'off'"
    ></v-text-field>
    <v-checkbox
      v-model="formData.isAdmin"
      :label="$t('model.user.isAdmin')"
    ></v-checkbox>
    <v-switch
      v-model="changePassword"
      v-if="!create"
      inset
      :label="$t('components.form.user.changePassword')"
    ></v-switch>
    <v-text-field
      :type="showPassword ? 'text' : 'password'"
      v-if="changePassword"
      v-model="formData.password"
      :label="$t('model.user.password')"
      :rules="[passwordRules.min, passwordRules.strength]"
      :append-icon="showPassword ? 'mdi-eye' : 'mdi-eye-off'"
      @click:append="showPassword = !showPassword"
      :autocomplete="isCurrentUser ? 'new-password' : 'off'"
    ></v-text-field>
  </form-dialog>
</template>

<script setup lang="ts">
import { PropType, ref, watch } from "vue";
import { repositoryErrorHandler } from "@/helpers/errorHandler";
import { clone } from "lodash";
import FormDialog, {
  GenericFormDialogModel,
} from "@/components/common/FormDialog.vue";
import { showMessage } from "@/helpers/snackbar";
import {
  addUser,
  AddUserInput,
  findUser,
  updateUser,
  UpdateUserInput,
} from "@/repositories/UserRepository";
import { removeBlanks } from "@/helpers/utils";
import { RecursivePartial } from "@/helpers/types";
import { NetworkUser } from "@/model/network/NetworkUser";
import i18n from "@/i18n";
import { zxcvbn } from "@zxcvbn-ts/core";
import { useUserStore } from "@/store/user";
export type UserFormDialogModel = GenericFormDialogModel<{
  userToUpdate?: string;
}>;
const props = defineProps({
  value: {
    type: Object as PropType<UserFormDialogModel>,
    required: true,
  },
});
const emit = defineEmits(["input"]);

const submitButtonLoading = ref(false);
const formActionsDisabled = ref(false);
const formData = ref<RecursivePartial<UpdateUserInput>>({});
const create = ref(false);
const dialogLoading = ref(false);
const isVisible = ref(false);
const isCurrentUser = ref(false);
const changePassword = ref(false);
const showPassword = ref(false);
const passwordRules = {
  min: (v?: string) =>
    (v != undefined && v.length >= 8) ||
    i18n.t("components.form.userLogin.passwordMinLength", { length: 8 }),
  strength: (v?: string) =>
    (v != undefined && zxcvbn(v).score >= 3) ||
    i18n.t("components.form.userLogin.passwordWeak"),
};

watch(
  () => props.value,
  (el) => {
    if (el.isVisible) {
      onBecameVisible(el.userToUpdate);
    }
    isVisible.value = el.isVisible;
  }
);

async function onBecameVisible(userToUpdate?: string) {
  const userStore = useUserStore();
  dialogLoading.value = true;
  if (userToUpdate != undefined) {
    create.value = false;
    const item = await findUser(userToUpdate).catch(repositoryErrorHandler);
    if (item != undefined) {
      formData.value = mapToFormValue(item);
    }
  } else {
    create.value = true;
    formData.value = defaultValues;
  }
  isCurrentUser.value = userStore.userProfile?.username == userToUpdate;
  changePassword.value = create.value;
  dialogLoading.value = false;
}
async function saveForm() {
  submitButtonLoading.value = true;
  formActionsDisabled.value = true;
  const data = clone(removeBlanks(formData.value));
  try {
    if (!validateForm(data)) {
      showMessage({
        text: i18n.t("error.formGeneric").toString(),
        type: "error",
      });
      submitButtonLoading.value = false;
      return;
    }
    if (create.value) {
      await addUser(data as AddUserInput);
    } else {
      await updateUser(data);
    }
    closeForm();
    const message = create.value
      ? i18n.t("model.user.added")
      : i18n.t("model.user.edited");
    showMessage({
      type: "success",
      text: message.toString(),
    });
    closeForm();
  } catch (e) {
    repositoryErrorHandler(e);
  }
  formActionsDisabled.value = false;
  submitButtonLoading.value = false;
}
function closeForm() {
  emit("input", { isVisible: false });
}
function validateForm(
  form: RecursivePartial<UpdateUserInput>
): form is UpdateUserInput {
  const data = clone(removeBlanks(form));
  if (changePassword.value && data.password == undefined) {
    return false;
  }
  return data.username != undefined;
}

// Helpers

function mapToFormValue(item: NetworkUser): RecursivePartial<UpdateUserInput> {
  return item;
}
const defaultValues: RecursivePartial<UpdateUserInput> = {
  isAdmin: false,
};
</script>
