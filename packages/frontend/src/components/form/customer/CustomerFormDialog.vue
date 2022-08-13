<template>
  <form-dialog
    v-model="isVisible"
    :submit-button-text="$t('word.save').toString()"
    :submit-button-loading="submitButtonLoading"
    :submit-button-enabled="validateForm(formData)"
    :title="
      $t(create ? 'model.customer.add' : 'model.customer.edit').toString()
    "
    @submit="saveForm"
  >
    <v-text-field
      v-model="formData.name"
      :label="$t('model.customer.name')"
    ></v-text-field>
    <v-text-field
      v-model="formData.address"
      :label="$t('model.customer.address')"
    ></v-text-field>
    <v-text-field
      v-model="formData.phoneNumber"
      :label="$t('model.customer.phoneNumber')"
    ></v-text-field>
    <v-text-field
      v-model="formData.vatNumber"
      :label="$t('model.customer.vatNumber')"
    ></v-text-field>
  </form-dialog>
</template>

<script setup lang="ts">
import { defineProps, PropType, ref, watch } from "vue";
import { repositoryErrorHandler } from "@/helpers/errorHandler";
import { clone } from "lodash";
import FormDialog, {
  GenericFormDialogModel,
} from "@/components/common/FormDialog.vue";
import { showMessage } from "@/helpers/snackbar";
import { removeBlanks } from "@/helpers/utils";
import { RecursivePartial } from "@/helpers/types";
import i18n from "@/i18n";
import { DbCustomer } from "@/model/db/DbCustomer";
import {
  addCustomer,
  findCustomer,
  updateCustomer,
} from "@/repositories/CustomerRepository";
export type CustomerFormDialogModel = GenericFormDialogModel<{
  customerToUpdate?: string;
}>;
const props = defineProps({
  value: {
    type: Object as PropType<CustomerFormDialogModel>,
    required: true,
  },
});
const emit = defineEmits(["input"]);

const submitButtonLoading = ref(false);
const formActionsDisabled = ref(false);
const formData = ref<RecursivePartial<DbCustomer>>({});
const create = ref(false);
const dialogLoading = ref(false);
const isVisible = ref(false);
const changePassword = ref(false);

watch(
  () => props.value,
  (el) => {
    if (el.isVisible) {
      onBecameVisible(el.customerToUpdate);
    }
    isVisible.value = el.isVisible;
  }
);

async function onBecameVisible(itemToUpdate?: string) {
  dialogLoading.value = true;
  if (itemToUpdate != undefined) {
    create.value = false;
    const item = await findCustomer(itemToUpdate).catch(repositoryErrorHandler);
    if (item != undefined) {
      formData.value = mapToFormValue(item);
    }
  } else {
    create.value = true;
    formData.value = defaultValues;
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
    if (create.value) {
      await addCustomer(data);
    } else {
      await updateCustomer(data);
    }
    closeForm();
    const message = create.value
      ? i18n.t("model.customer.added")
      : i18n.t("model.customer.edited");
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
function validateForm(form: RecursivePartial<DbCustomer>): form is DbCustomer {
  const data = clone(removeBlanks(form));
  return data.name != undefined;
}

// Helpers

function mapToFormValue(item: DbCustomer): RecursivePartial<DbCustomer> {
  return item;
}
const defaultValues: RecursivePartial<DbCustomer> = {};
</script>
