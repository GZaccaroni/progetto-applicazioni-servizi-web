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
      type="tel"
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
import { computed, PropType, ref, watch } from "vue";
import { repositoryErrorHandler } from "@/helpers/errorHandler";
import { clone, omit } from "lodash";
import FormDialog, {
  GenericFormDialogModel,
} from "@/components/common/FormDialog.vue";
import { showMessage } from "@/helpers/snackbar";
import { removeBlanks } from "@/helpers/utils";
import { RecursivePartial } from "@/helpers/types";
import i18n from "@/i18n";
import { NetworkCustomer } from "@common/model/network/NetworkCustomer";
import {
  addCustomer,
  findCustomer,
  updateCustomer,
} from "@/repositories/CustomerRepository";
import { CreateUpdateCustomerInput } from "@common/model/network/CreateUpdateCustomerInput";
import { validateRequest } from "@common/validation";
import { CreateUpdateCustomerInputSchema } from "@common/validation/json_schema/CreateUpdateCustomerInput";

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
const formData = ref<RecursivePartial<CreateUpdateCustomerInput>>({});
const dialogLoading = ref(false);
const isVisible = ref(false);
const itemToUpdateId = ref<string>();
const create = computed(() => itemToUpdateId.value == undefined);

watch(
  () => props.value,
  (el) => {
    if (el.isVisible) {
      itemToUpdateId.value = el.customerToUpdate;
      onBecameVisible(el.customerToUpdate);
    }
    isVisible.value = el.isVisible;
  }
);

async function onBecameVisible(itemToUpdate?: string) {
  dialogLoading.value = true;
  if (itemToUpdate != undefined) {
    const item = await findCustomer(itemToUpdate).catch(repositoryErrorHandler);
    if (item != undefined) {
      formData.value = mapToFormValue(item);
    }
  } else {
    formData.value = getDefaultFormValue();
  }
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
    if (itemToUpdateId.value) {
      await updateCustomer(itemToUpdateId.value, data);
    } else {
      await addCustomer(data);
    }
    const message = create.value
      ? i18n.t("model.customer.added")
      : i18n.t("model.customer.edited");
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
  form: RecursivePartial<CreateUpdateCustomerInput>
): form is CreateUpdateCustomerInput {
  return validateRequest(CreateUpdateCustomerInputSchema, removeBlanks(form));
}

// Helpers

function mapToFormValue(
  item: NetworkCustomer
): RecursivePartial<CreateUpdateCustomerInput> {
  return omit(item, "id");
}
function getDefaultFormValue(): RecursivePartial<CreateUpdateCustomerInput> {
  return {};
}
</script>
