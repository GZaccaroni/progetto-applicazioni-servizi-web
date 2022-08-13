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
    <v-row class="pt-6 pb-4">
      <div class="text-h5">Utenti</div>
      <v-spacer />
      <v-btn @click="addAuthorizedUser" icon>
        <v-icon>mdi-plus-circle</v-icon>
      </v-btn>
    </v-row>
    <v-row
      v-for="(_, index) in formData.authorizations"
      :key="index"
      align="center"
    >
      <v-col cols="6">
        <async-select
          v-model="formData.authorizations[index].userId"
          :label="$t('word.user').toString()"
          :find-items-fn="getSelectUsers"
        />
      </v-col>
      <v-col cols="4">
        <async-select
          v-model="formData.authorizations[index].accessLevel"
          :label="$t('model.store.accessLevel.name').toString()"
          :find-items-fn="getSelectStoreAccessLevel"
          :lazy="false"
        />
      </v-col>
      <v-spacer />
      <v-btn @click="removeAuthorizedUser(index)" icon>
        <v-icon>mdi-delete</v-icon>
      </v-btn>
    </v-row>
  </form-dialog>
</template>

<script setup lang="ts">
import { defineProps, PropType, ref, watch } from "vue";
import { repositoryErrorHandler } from "@/helpers/errorHandler";
import { clone } from "lodash";
import FormDialog, {
  GenericFormDialogModel,
} from "@/components/common/FormDialog.vue";
import AsyncSelect from "@/components/common/AsyncSelect.vue";
import { showMessage } from "@/helpers/snackbar";
import { removeBlanks } from "@/helpers/utils";
import { RecursivePartial } from "@/helpers/types";
import i18n from "@/i18n";
import { DbStore } from "@/model/db/DbStore";
import {
  addStore,
  findStore,
  updateStore,
} from "@/repositories/StoreRepository";
import { UpdateStoreInput } from "@/model/UpdateStoreInput";
import {
  getSelectStoreAccessLevel,
  getSelectUsers,
} from "@/helpers/asyncSelectUtils";

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
const formData = ref<RecursivePartial<UpdateStoreInput>>({});
const create = ref(false);
const dialogLoading = ref(false);
const isVisible = ref(false);
const changePassword = ref(false);

watch(
  () => props.value,
  (el) => {
    if (el.isVisible) {
      onBecameVisible(el.storeToUpdate);
    }
    isVisible.value = el.isVisible;
  }
);

async function onBecameVisible(itemToUpdate?: string) {
  dialogLoading.value = true;
  if (itemToUpdate != undefined) {
    create.value = false;
    const item = await findStore(itemToUpdate).catch(repositoryErrorHandler);
    console.log("Caricamento?? ", item);
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
      await addStore(data);
    } else {
      await updateStore(data);
    }
    closeForm();
    const message = create.value
      ? i18n.t("model.store.added")
      : i18n.t("model.store.edited");
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
  form: RecursivePartial<UpdateStoreInput>
): form is UpdateStoreInput {
  const data = clone(removeBlanks(form));
  return data.name != undefined;
}

function addAuthorizedUser() {
  formData.value.authorizations?.push({});
}
function removeAuthorizedUser(index: number) {
  formData.value.authorizations?.splice(index, 1);
}
// Helpers

function mapToFormValue(item: DbStore): RecursivePartial<UpdateStoreInput> {
  return item;
}
const defaultValues: RecursivePartial<UpdateStoreInput> = {
  authorizations: [],
};
</script>
