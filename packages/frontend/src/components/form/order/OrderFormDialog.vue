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
    <div role="grid">
      <v-row class="pt-6 pb-4">
        <div class="text-h5">{{ $t("word.orderEntries") }}</div>
        <v-spacer />
        <v-btn
          @click="addEntry"
          icon
          :aria-label="$t('components.form.order.addEntry')"
        >
          <v-icon>mdi-plus-circle</v-icon>
        </v-btn>
      </v-row>
      <v-row
        v-for="(_, index) in formData.entries"
        :key="index"
        align="center"
        role="row"
      >
        <v-col cols="6" md="4" class="py-0" role="gridcell">
          <async-select
            v-model="selectedProducts[index]"
            :label="$t('model.order.product').toString()"
            :find-items-fn="getSelectProductKinds"
            :return-object="true"
          />
        </v-col>
        <v-col cols="6" md="2" class="py-0" role="gridcell">
          <async-select
            v-model="formData.entries[index].grade"
            :label="$t('model.order.productGrade').toString()"
            :find-items-fn="getSelectProductGrade"
            :lazy="false"
          />
        </v-col>
        <v-col cols="6" md="3" class="py-0" role="gridcell">
          <v-text-field
            type="number"
            v-model.number="formData.entries[index].pricePerUnit"
            :label="$t('model.order.pricePerUnit')"
            :placeholder="priceHint(index)"
            :suffix="priceSuffix(index)"
            :min="0"
          ></v-text-field>
        </v-col>
        <v-col cols="5" md="2" class="py-0" role="gridcell">
          <v-text-field
            type="number"
            v-model.number="formData.entries[index].quantity"
            :label="$t('model.order.quantity')"
            :suffix="unitOfMeasure(index)"
            :min="0"
          ></v-text-field>
        </v-col>
        <v-spacer />
        <v-btn
          @click="removeEntry(index)"
          icon
          :aria-label="$t('components.form.order.removeEntry')"
        >
          <v-icon>mdi-delete</v-icon>
        </v-btn>
        <v-col v-if="$vuetify.breakpoint.smAndDown" cols="12" class="px-2">
          <v-divider cols="12" />
        </v-col>
      </v-row>
    </div>
    <v-row>
      <v-col>
        <v-textarea
          :label="$t('model.order.note')"
          v-model="formData.note"
          rows="1"
          auto-grow
        ></v-textarea>
      </v-col>
    </v-row>
  </form-dialog>
</template>

<script setup lang="ts">
import { computed, PropType, ref, watch } from "vue";
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
  getSelectProductGrade,
  getSelectProductKinds,
  getSelectStores,
  PRODUCT_KIND_IDENTIFIER_SEPARATOR,
  SelectProductKind,
} from "@/helpers/asyncSelectUtils";
import { removeBlanks } from "@/helpers/utils";
import { RecursivePartial } from "@/helpers/types";
import i18n from "@/i18n";
import {
  addOrder,
  findOrder,
  updateOrder,
} from "@/repositories/OrderRepository";
import { NetworkOrder } from "@common/model/network/NetworkOrder";
import { AsyncSelectItem } from "@/components/common/AsyncSelectTypes";
import { CreateUpdateOrderInput } from "@common/model/network/CreateUpdateOrderInput";
import { validateRequest } from "@common/validation";
import { CreateUpdateOrderInputSchema } from "@common/validation/json_schema/CreateUpdateOrderInput";

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
const formData = ref<RecursivePartial<CreateUpdateOrderInput>>({});
const dialogLoading = ref(false);
const isVisible = ref(false);
const selectedProducts = ref<
  (AsyncSelectItem<SelectProductKind> | undefined)[]
>([]);
const itemToUpdateId = ref<string>();
const create = computed(() => itemToUpdateId.value == undefined);

watch(
  selectedProducts,
  (newValue) => {
    newValue.forEach((el, index) => {
      formData.value.entries = formData.value.entries ?? [];
      formData.value.entries[index].productId = el?.item?.productId;
      formData.value.entries[index].variantId = el?.item?.variantId;
    });
  },
  { deep: true }
);
watch(
  () => props.value,
  (el) => {
    if (el.isVisible) {
      itemToUpdateId.value = el.userToUpdate;
      onBecameVisible(el.orderToUpdate);
    }
    isVisible.value = el.isVisible;
  }
);

async function onBecameVisible(itemToUpdate?: string) {
  dialogLoading.value = true;
  if (itemToUpdate != undefined) {
    const item = await findOrder(itemToUpdate).catch(repositoryErrorHandler);
    if (item != undefined) {
      formData.value = mapToFormValue(item);
    }
  } else {
    formData.value = defaultValues;
  }
  setProductKindsIdentifiers();
  dialogLoading.value = false;
}
function setProductKindsIdentifiers() {
  selectedProducts.value = (formData.value.entries ?? []).map((el) => {
    const id =
      el.variantId == undefined
        ? el.productId
        : `${el.productId}${PRODUCT_KIND_IDENTIFIER_SEPARATOR}${el.variantId}`;
    if (id != undefined) {
      return {
        id: id,
        text: "",
      };
    } else {
      return undefined;
    }
  });
}
function priceSuffix(index: number): string | undefined {
  const item = selectedProducts.value[index]?.item;
  if (item != undefined) {
    let suffix = "€";
    const unit = unitOfMeasure(index);
    if (unit == undefined) return suffix;
    suffix += "/" + unit;
    return suffix;
  } else {
    return undefined;
  }
}
function priceHint(index: number): string | undefined {
  return selectedProducts.value[index]?.item?.pricePerUnit?.toString();
}
function unitOfMeasure(index: number): string | undefined {
  const item = selectedProducts.value[index]?.item;
  if (item != undefined) {
    return i18n.t("model.unitOfMeasure." + item.unitOfMeasure).toString();
  } else {
    return undefined;
  }
}
function addEntry() {
  formData.value.entries?.push({});
  selectedProducts.value.push();
}
function removeEntry(index: number) {
  selectedProducts.value.splice(index, 1);
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
    if (itemToUpdateId.value != undefined) {
      await updateOrder(itemToUpdateId.value, data);
    } else {
      await addOrder(data);
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
    await repositoryErrorHandler(e);
  }
  formActionsDisabled.value = false;
  submitButtonLoading.value = false;
}
function closeForm() {
  emit("input", { isVisible: false });
}
function validateForm(
  form: RecursivePartial<CreateUpdateOrderInput>
): form is CreateUpdateOrderInput {
  return validateRequest(CreateUpdateOrderInputSchema, form);
}

// Helpers

function mapToFormValue(
  item: NetworkOrder
): RecursivePartial<CreateUpdateOrderInput> {
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
          quantity: entry.quantity,
          grade: entry.grade,
        };
      }) ?? [],
    note: item.note,
  };
}
const defaultValues: RecursivePartial<CreateUpdateOrderInput> = {
  entries: [],
};
</script>
