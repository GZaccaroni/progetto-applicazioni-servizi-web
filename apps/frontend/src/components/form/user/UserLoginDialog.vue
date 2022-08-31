<template>
  <form-dialog
    v-model="isVisible"
    :submit-button-text="
      $t('components.form.userLogin.submitButton').toString()
    "
    :submit-button-loading="submitButtonLoading"
    :submit-button-enabled="validateForm(formData)"
    :title="$t('components.form.userLogin.title').toString()"
    @submit="saveForm"
    @close="closeForm"
  >
    <v-text-field
      v-model="formData.username"
      :label="$t('model.user.username')"
      autocomplete="username"
    ></v-text-field>
    <v-text-field
      type="password"
      v-model="formData.password"
      :label="$t('model.user.password')"
      autocomplete="current-password"
    ></v-text-field>
  </form-dialog>
</template>

<script setup lang="ts">
import { ref, watch } from "vue";
import { repositoryErrorHandler } from "@/helpers/errorHandler";
import { clone } from "lodash";
import { showMessage } from "@/helpers/snackbar";
import { removeBlanks } from "@/helpers/utils";
import i18n from "@/i18n";
import FormDialog from "@/components/common/FormDialog.vue";
import { useUserStore } from "@/store/user";
import { UserLoginInput } from "@common/model/network/UserLoginInput";
import { validateRequest } from "@common/validation";
import { UserLoginInputSchema } from "@common/validation/json_schema/UserLoginInput";

const props = defineProps({
  value: {
    type: Boolean,
    required: true,
  },
});
const emit = defineEmits(["input"]);

const submitButtonLoading = ref(false);
const formData = ref<Partial<UserLoginInput>>({});
const isVisible = ref(false);

watch(
  () => props.value,
  (el) => {
    isVisible.value = el;
  }
);
function closeForm() {
  emit("input", false);
}
async function saveForm() {
  submitButtonLoading.value = true;
  const data = clone(removeBlanks(formData.value));
  if (!validateForm(data)) {
    showMessage({
      text: i18n.t("error.formGeneric").toString(),
      type: "error",
    });
    submitButtonLoading.value = false;
    return;
  }
  const store = useUserStore();
  try {
    await store.login(data);
    closeForm();
  } catch (e) {
    await repositoryErrorHandler(e);
  }
  submitButtonLoading.value = false;
}
function validateForm(form: Partial<UserLoginInput>): form is UserLoginInput {
  return validateRequest(UserLoginInputSchema, form);
}
</script>
