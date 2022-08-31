<template>
  <form-dialog
    v-model="isVisible"
    :submit-button-text="$t('word.save').toString()"
    :submit-button-loading="submitButtonLoading"
    :submit-button-enabled="validateForm(formData)"
    :title="$t(create ? 'model.product.add' : 'model.product.edit').toString()"
    @submit="saveForm"
    @close="closeForm"
  >
    <v-row>
      <v-text-field
        v-model="formData.name"
        :label="$t('model.product.name')"
      ></v-text-field>
    </v-row>
    <v-row>
      <v-col cols="5" class="pa-0">
        <v-text-field
          type="number"
          v-model.number="formData.pricePerUnit"
          :suffix="priceSuffix"
          :label="$t('model.product.pricePerUnit')"
          :min="0"
        ></v-text-field>
      </v-col>
      <v-spacer />
      <v-col cols="5" class="pa-0">
        <async-select
          v-model="formData.unitOfMeasure"
          :label="$t('model.product.unitOfMeasure').toString()"
          :find-items-fn="getSelectUnitOfMeasure"
          :lazy="false"
        />
      </v-col>
    </v-row>
    <div role="grid">
      <v-row class="pt-6 pb-4">
        <div class="text-h5">{{ $t("word.productKinds") }}</div>
        <v-spacer />
        <v-btn
          @click="addKind"
          icon
          :aria-label="$t('components.form.product.addKind')"
        >
          <v-icon>mdi-plus-circle</v-icon>
        </v-btn>
      </v-row>
      <v-row
        v-for="(_, index) in formData.kinds"
        :key="formData.kinds[index].id"
        align="center"
        role="row"
      >
        <v-col cols="6" role="gridcell">
          <v-text-field
            v-model="formData.kinds[index].name"
            :label="$t('model.product.name')"
          ></v-text-field>
        </v-col>
        <v-col cols="4" role="gridcell">
          <v-text-field
            type="number"
            v-model.number="formData.kinds[index].pricePerUnit"
            :label="$t('model.product.pricePerUnit')"
            :suffix="priceSuffix"
            :min="0"
          ></v-text-field>
        </v-col>
        <v-spacer />
        <v-btn
          @click="removeKind(index)"
          icon
          :aria-label="$t('components.form.product.removeKind')"
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
import { getSelectUnitOfMeasure } from "@/helpers/asyncSelectUtils";
import { NetworkProduct } from "@common/model/network/NetworkProduct";
import {
  addProduct,
  findProduct,
  updateProduct,
} from "@/repositories/ProductRepository";
import { CreateUpdateProductInput } from "@common/model/network/CreateUpdateProductInput";
import { validateRequest } from "@common/validation";
import { CreateUpdateProductInputSchema } from "@common/validation/json_schema/CreateUpdateProductInput";

export type ProductFormDialogModel = GenericFormDialogModel<{
  productToUpdate?: string;
}>;
const props = defineProps({
  value: {
    type: Object as PropType<ProductFormDialogModel>,
    required: true,
  },
});
const emit = defineEmits(["input"]);

const submitButtonLoading = ref(false);
const formActionsDisabled = ref(false);
const formData = ref<RecursivePartial<CreateUpdateProductInput>>({});
const dialogLoading = ref(false);
const isVisible = ref(false);
const itemToUpdateId = ref<string>();
const create = computed(() => itemToUpdateId.value == undefined);

const priceSuffix = computed(() => {
  let suffix = "€";
  if (formData.value.unitOfMeasure == undefined) return suffix;
  suffix += "/";
  suffix += i18n
    .t("model.unitOfMeasure." + formData.value.unitOfMeasure)
    .toString();
  return suffix;
});
watch(
  () => props.value,
  (el) => {
    if (el.isVisible) {
      itemToUpdateId.value = el.productToUpdate;
      onBecameVisible(el.productToUpdate);
    }
    isVisible.value = el.isVisible;
  }
);

async function onBecameVisible(itemToUpdate?: string) {
  dialogLoading.value = true;
  if (itemToUpdate != undefined) {
    const item = await findProduct(itemToUpdate).catch(repositoryErrorHandler);
    if (item != undefined) {
      formData.value = mapToFormValue(item);
    }
  } else {
    formData.value = defaultValues;
  }
  dialogLoading.value = false;
}

function addKind() {
  formData.value.kinds?.push({ id: crypto.randomUUID() });
}
function removeKind(index: number) {
  formData.value.kinds?.splice(index, 1);
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
      await updateProduct(itemToUpdateId.value, data);
    } else {
      await addProduct(data);
    }
    const message = create.value
      ? i18n.t("model.product.added")
      : i18n.t("model.product.edited");
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
  form: RecursivePartial<CreateUpdateProductInput>
): form is CreateUpdateProductInput {
  return validateRequest(CreateUpdateProductInputSchema, form);
}

// Helpers

function mapToFormValue(
  item: NetworkProduct
): RecursivePartial<CreateUpdateProductInput> {
  return omit(item, "id");
}
const defaultValues: RecursivePartial<NetworkProduct> = {
  kinds: [],
};
</script>
