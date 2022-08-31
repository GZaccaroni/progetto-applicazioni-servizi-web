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
      v-if="!isCurrentUser && isCurrentUserAdmin"
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
      :label="$t('components.form.user.newPassword')"
      :rules="[passwordRules.min, passwordRules.strength]"
      :append-icon="showPassword ? 'mdi-eye' : 'mdi-eye-off'"
      @click:append="showPassword = !showPassword"
      :autocomplete="isCurrentUser ? 'new-password' : 'off'"
    ></v-text-field>
  </form-dialog>
</template>

<script setup lang="ts">
import { computed, PropType, ref, watch } from "vue";
import { repositoryErrorHandler } from "@/helpers/errorHandler";
import { clone, omit } from "lodash";
import FormDialog, {
  GenericFormDialogModel,
} from "@/components/common/FormDialog.vue";
import { showMessage } from "@/helpers/snackbar";
import { addUser, findUser, updateUser } from "@/repositories/UserRepository";
import { removeBlanks } from "@/helpers/utils";
import { RecursivePartial } from "@/helpers/types";
import { NetworkUser } from "@common/model/network/NetworkUser";
import i18n from "@/i18n";
import { zxcvbn } from "@zxcvbn-ts/core";
import { useUserStore } from "@/store/user";
import { validateRequest } from "@common/validation";
import { CreateUserInputSchema } from "@common/validation/json_schema/CreateUserInput";
import { UpdateUserInputSchema } from "@common/validation/json_schema/UpdateUserInput";
import { CreateUserInput } from "@common/model/network/CreateUserInput";
import { UpdateUserInput } from "@common/model/network/UpdateUserInput";

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
const itemToUpdateId = ref<string>();
const dialogLoading = ref(false);
const isVisible = ref(false);
const isCurrentUser = ref(false);
const isCurrentUserAdmin = ref(false);
const changePassword = ref(false);
const showPassword = ref(false);
const create = computed(() => itemToUpdateId.value == undefined);

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
      itemToUpdateId.value = el.userToUpdate;
      onBecameVisible(el.userToUpdate);
    }
    isVisible.value = el.isVisible;
  }
);
watch(changePassword, (changePassword) => {
  if (changePassword) {
    formData.value = Object.assign(clone(formData.value), { password: "" });
  } else {
    formData.value = Object.assign(clone(formData.value), {
      password: undefined,
    });
  }
});
async function onBecameVisible(userToUpdate?: string) {
  const userStore = useUserStore();
  dialogLoading.value = true;
  if (userToUpdate != undefined) {
    const item = await findUser(userToUpdate).catch(repositoryErrorHandler);
    if (item != undefined) {
      formData.value = mapToFormValue(item);
    }
    isCurrentUser.value = userStore.userProfile?.id == userToUpdate;
    isCurrentUserAdmin.value = userStore.userProfile?.isAdmin ?? false;
  } else {
    formData.value = getDefaultFormValue();
    isCurrentUser.value = false;
  }
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
    if (itemToUpdateId.value != undefined) {
      let updateData = omit(data, "username");
      if (!isCurrentUserAdmin.value) {
        updateData = omit(updateData, "isAdmin");
      }
      await updateUser(itemToUpdateId.value, updateData);
    } else {
      await addUser(data as CreateUserInput);
    }
    const message = create.value
      ? i18n.t("model.user.added")
      : i18n.t("model.user.edited");
    showMessage({
      type: "success",
      text: message.toString(),
    });
    closeForm();
  } catch (e) {
    await repositoryErrorHandler(e);
  }
  formActionsDisabled.value = false;
  submitButtonLoading.value = false;
}
function closeForm() {
  emit("input", { isVisible: false });
}

function validateForm(
  form: RecursivePartial<UpdateUserInput>
): form is UpdateUserInput | CreateUserInput {
  if (create.value) {
    return validateCreateForm(form);
  } else {
    return validateUpdateForm(form);
  }
}
function validateCreateForm(
  form: RecursivePartial<UpdateUserInput>
): form is CreateUserInput {
  return (
    validateRequest(CreateUserInputSchema, form) &&
    zxcvbn(form.password).score >= 3
  );
}
function validateUpdateForm(
  form: RecursivePartial<UpdateUserInput>
): form is UpdateUserInput {
  return (
    validateRequest(UpdateUserInputSchema, omit(form, "username")) &&
    (form.password == undefined || zxcvbn(form.password).score >= 3)
  );
}
// Helpers

function mapToFormValue(item: NetworkUser): RecursivePartial<UpdateUserInput> {
  return omit(item, "id");
}
function getDefaultFormValue(): RecursivePartial<UpdateUserInput> {
  return {
    isAdmin: false,
  };
}
</script>
