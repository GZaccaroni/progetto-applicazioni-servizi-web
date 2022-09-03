<template>
  <form-dialog
    v-model="isVisible"
    :submit-button-text="$t('word.save').toString()"
    :submit-button-loading="submitButtonLoading"
    :submit-button-enabled="validateForm(formData)"
    :title="$t(create ? 'model.store.add' : 'model.store.edit').toString()"
    @submit="saveForm"
    @close="closeForm"
  >
    <v-row>
      <v-text-field
        v-model="formData.name"
        :label="$t('model.store.name')"
      ></v-text-field>
    </v-row>
    <div role="grid">
      <v-row class="pt-6 pb-4">
        <div class="text-h5">{{ $t("word.storeAuthorizedUsers") }}</div>
        <v-spacer />
        <v-btn
          @click="addAuthorizedUser"
          icon
          :aria-label="$t('components.form.store.addUser')"
        >
          <v-icon>mdi-plus-circle</v-icon>
        </v-btn>
      </v-row>
      <v-row
        v-for="(_, index) in formData.authorizations"
        :key="index"
        align="center"
        role="row"
      >
        <v-col cols="6" role="gridcell">
          <async-select
            v-model="formData.authorizations[index].userId"
            :label="$t('word.user').toString()"
            :find-items-fn="getSelectUsers"
          />
        </v-col>
        <v-col cols="4" role="gridcell">
          <async-select
            v-model="formData.authorizations[index].accessLevel"
            :label="$t('model.store.accessLevel.name').toString()"
            :find-items-fn="getSelectStoreAccessLevel"
            :lazy="false"
          />
        </v-col>
        <v-spacer />
        <v-btn
          @click="removeAuthorizedUser(index)"
          icon
          :aria-label="$t('components.form.store.removeUser')"
        >
          <v-icon>mdi-delete</v-icon>
        </v-btn>
      </v-row>
    </div>
  </form-dialog>
</template>

<script setup lang="ts">
import { computed, PropType, ref, watch } from "vue";
import { repositoryErrorHandler } from "@/helpers/errorHandler";
import { clone, omit } from "lodash";
import FormDialog, {
  GenericFormDialogModel,
} from "@/components/common/FormDialog.vue";
import AsyncSelect from "@/components/common/AsyncSelect.vue";
import { showMessage } from "@/helpers/snackbar";
import { removeBlanks } from "@/helpers/utils";
import { RecursivePartial } from "@/helpers/types";
import i18n from "@/i18n";
import { NetworkStore } from "@common/model/network/NetworkStore";
import {
  addStore,
  findStore,
  updateStore,
} from "@/repositories/StoreRepository";
import {
  getSelectStoreAccessLevel,
  getSelectUsers,
} from "@/helpers/asyncSelectUtils";
import { CreateUpdateStoreInput } from "@common/model/network/CreateUpdateStoreInput";
import { validateRequest } from "@common/validation";
import { CreateUpdateStoreInputSchema } from "@common/validation/json_schema/CreateUpdateStoreInput";

export type StoreFormDialogModel = GenericFormDialogModel<{
  storeToUpdate?: string;
}>;
const props = defineProps({
  value: {
    type: Object as PropType<StoreFormDialogModel>,
    required: true,
  },
});
const emit = defineEmits(["input"]);

const submitButtonLoading = ref(false);
const formActionsDisabled = ref(false);
const formData = ref<RecursivePartial<CreateUpdateStoreInput>>({});
const dialogLoading = ref(false);
const isVisible = ref(false);
const itemToUpdateId = ref<string>();
const create = computed(() => itemToUpdateId.value == undefined);

watch(
  () => props.value,
  (el) => {
    if (el.isVisible) {
      itemToUpdateId.value = el.storeToUpdate;
      onBecameVisible(el.storeToUpdate);
    }
    isVisible.value = el.isVisible;
  }
);

async function onBecameVisible(itemToUpdate?: string) {
  dialogLoading.value = true;
  if (itemToUpdate != undefined) {
    const item = await findStore(itemToUpdate).catch(repositoryErrorHandler);
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
    if (itemToUpdateId.value != undefined) {
      await updateStore(itemToUpdateId.value, data);
    } else {
      await addStore(data);
    }
    const message = create.value
      ? i18n.t("model.store.added")
      : i18n.t("model.store.edited");
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
  form: RecursivePartial<CreateUpdateStoreInput>
): form is CreateUpdateStoreInput {
  return validateRequest(CreateUpdateStoreInputSchema, removeBlanks(form));
}

function addAuthorizedUser() {
  formData.value.authorizations?.push({});
}
function removeAuthorizedUser(index: number) {
  formData.value.authorizations?.splice(index, 1);
}
// Helpers

function mapToFormValue(
  item: NetworkStore
): RecursivePartial<CreateUpdateStoreInput> {
  return omit(item, "id");
}
function getDefaultFormValue(): RecursivePartial<CreateUpdateStoreInput> {
  return {
    authorizations: [],
  };
}
</script>
