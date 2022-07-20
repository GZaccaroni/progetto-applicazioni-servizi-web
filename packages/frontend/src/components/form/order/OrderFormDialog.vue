<template>
  <form-dialog
    v-model="isVisible"
    :submit-button-text="$t('word.save').toString()"
    :submit-button-loading="submitButtonLoading"
    :submit-button-enabled="validateForm(formData)"
    :title="$t(create ? 'model.order.add' : 'model.order.edit').toString()"
    @submit="saveForm"
    @close="closeForm"
  >
    <v-form ref="form" class="pa-4">
      <v-row>
        <async-select
          v-model="formData.storeId"
          :label="$t('model.order.store').toString()"
          :find-items-fn="getSelectStores"
        />
      </v-row>
      <v-row>
        <async-select
          v-model="formData.customerId"
          :label="$t('model.order.customer').toString()"
          :find-items-fn="getSelectCustomers"
        />
      </v-row>
      <v-row>
        <text-field-date-picker
          v-model="formData.date"
          :show-icon="false"
          :label="$t('model.order.date').toString()"
        />
      </v-row>
      <v-row class="pt-6 pb-4">
        <div class="text-h5">Utenti</div>
        <v-spacer />
        <v-btn @click="addEntry" icon>
          <v-icon>mdi-plus-circle</v-icon>
        </v-btn>
      </v-row>
      <v-row v-for="(_, index) in formData.entries" :key="index" align="center">
        <v-col cols="6">
          <async-select
            v-model="formData.entries[index].userId"
            :label="$t('word.user').toString()"
            :find-items-fn="getSelectUsers"
          />
        </v-col>
        <v-col cols="4">
          <async-select
            v-model="formData.entries[index].accessLevel"
            :label="$t('model.store.accessLevel.name').toString()"
            :find-items-fn="getSelectStoreAccessLevel"
            :lazy="false"
          />
        </v-col>
        <v-spacer />
        <v-btn @click="removeEntry(index)" icon>
          <v-icon>mdi-delete</v-icon>
        </v-btn>
      </v-row>
    </v-form>
  </form-dialog>
</template>

<script setup lang="ts">
import { defineProps, PropType, ref, watch } from "vue";
import { repositoryErrorHandler } from "@/helpers/errorHandler";
import { clone } from "lodash";
import FormDialog, {
  GenericFormDialogModel,
} from "@/components/common/FormDialog.vue";
import TextFieldDatePicker from "@/components/common/TextFieldDatePicker.vue";
import AsyncSelect from "@/components/common/AsyncSelect.vue";
import { showMessage } from "@/helpers/snackbar";
import {
  getSelectCustomers,
  getSelectStoreAccessLevel,
  getSelectStores,
  getSelectUsers,
} from "@/helpers/asyncSelectUtils";
import { removeBlanks } from "@/helpers/utils";
import { RecursivePartial } from "@/helpers/types";
import i18n from "@/i18n";
import {
  addOrder,
  findOrder,
  updateOrder,
} from "@/repositories/OrderRepository";
import { UpdateOrderInput } from "@/model/UpdateOrderInput";
import { DbOrder } from "@/model/db/DbOrder";

export type OrderFormDialogModel = GenericFormDialogModel<{
  orderToUpdate?: string;
}>;
const props = defineProps({
  value: {
    type: Object as PropType<OrderFormDialogModel>,
    required: true,
  },
});
const emit = defineEmits(["input"]);

const submitButtonLoading = ref(false);
const formActionsDisabled = ref(false);
const formData = ref<RecursivePartial<UpdateOrderInput>>({});
const create = ref(false);
const dialogLoading = ref(false);
const isVisible = ref(false);
const changePassword = ref(false);

watch(
  () => props.value,
  (el) => {
    if (el.isVisible) {
      onBecameVisible(el.orderToUpdate);
    }
    isVisible.value = el.isVisible;
  }
);

async function onBecameVisible(itemToUpdate?: string) {
  dialogLoading.value = true;
  if (itemToUpdate != undefined) {
    create.value = false;
    const item = await findOrder(itemToUpdate).catch(repositoryErrorHandler);
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

function addEntry() {
  formData.value.entries?.push({});
}
function removeEntry(index: number) {
  formData.value.entries?.splice(index, 1);
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
      await addOrder(data);
    } else {
      await updateOrder(data);
    }
    closeForm();
    const message = create.value
      ? i18n.t("model.order.added")
      : i18n.t("model.order.edited");
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
  form: RecursivePartial<UpdateOrderInput>
): form is UpdateOrderInput {
  const data = clone(removeBlanks(form));
  return data.date != undefined;
}

// Helpers

function mapToFormValue(item: DbOrder): RecursivePartial<UpdateOrderInput> {
  return {
    customerId: item.customer?.id,
    storeId: item.store.id,
    date: item.date,
    entries:
      item.entries.map((entry) => {
        return {
          productId: entry.productId,
          variantId: entry.variantId,
          pricePerUnit: entry.pricePerUnit,
          grade: entry.grade,
        };
      }) ?? [],
    note: item.note,
  };
}
const defaultValues: RecursivePartial<UpdateOrderInput> = {
  entries: [],
};
</script>
