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
          :find-items-fn="findStoreSelectFn"
        />
      </v-row>
      <v-row>
        <async-select
          v-model="formData.customerId"
          :label="$t('model.order.customer').toString()"
          :find-items-fn="findCustomerSelectFn"
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
            :find-items-fn="findUsersSelectFn"
          />
        </v-col>
        <v-col cols="4">
          <async-select
            v-model="formData.entries[index].accessLevel"
            :label="$t('model.store.accessLevel.name').toString()"
            :find-items-fn="findStoreAccessLevelSelectFn"
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

<script lang="ts">
import { defineComponent, PropType, ref, watch } from "vue";
import { repositoryErrorHandler } from "@/helpers/errorHandler";
import { clone } from "lodash";
import FormDialog, {
  GenericFormDialogModel,
} from "@/components/common/FormDialog.vue";
import { showMessage } from "@/helpers/snackbar";
import { removeBlanks } from "@/helpers/utils";
import { RecursivePartial } from "@/helpers/types";
import AsyncSelect from "@/components/common/AsyncSelect.vue";
import {
  getSelectCustomers,
  getSelectStoreAccessLevel,
  getSelectStores,
  getSelectUsers,
} from "@/helpers/asyncSelectUtils";
import { DbOrder } from "@/model/db/DbOrder";
import { UpdateOrderInput } from "@/model/UpdateOrderInput";
import { addOrder, updateOrder } from "@/repositories/OrderRepository";
import TextFieldDatePicker from "@/components/common/TextFieldDatePicker.vue";
export type OrderFormDialogModel = GenericFormDialogModel<{
  itemToUpdate?: DbOrder;
}>;
function mapInitialValue(order?: DbOrder): RecursivePartial<UpdateOrderInput> {
  return {
    customerId: order?.customer?.id,
    storeId: order?.store.id,
    date: order?.date,
    entries:
      order?.entries.map((entry) => {
        return {
          productId: entry.productId,
          variantId: entry.variantId,
          pricePerUnit: entry.pricePerUnit,
          grade: entry.grade,
        };
      }) ?? [],
    note: order?.note,
  };
}
export default defineComponent({
  components: { TextFieldDatePicker, AsyncSelect, FormDialog },
  props: {
    value: {
      type: Object as PropType<OrderFormDialogModel>,
      required: true,
    },
  },

  setup(props) {
    const submitButtonLoading = ref(false);
    const formData = ref<RecursivePartial<UpdateOrderInput>>({});
    const create = ref(false);
    const isVisible = ref(false);
    const findUsersSelectFn = getSelectUsers;
    const findStoreAccessLevelSelectFn = getSelectStoreAccessLevel;
    const findStoreSelectFn = getSelectStores;
    const findCustomerSelectFn = getSelectCustomers;

    watch(
      () => props.value,
      (el) => {
        if (el.isVisible) {
          create.value = el.itemToUpdate == undefined;
          formData.value = mapInitialValue(el.itemToUpdate);
        }
        isVisible.value = el.isVisible;
      }
    );
    return {
      submitButtonLoading,
      formData,
      create,
      isVisible,
      findUsersSelectFn,
      findStoreSelectFn,
      findCustomerSelectFn,
      findStoreAccessLevelSelectFn,
    };
  },
  methods: {
    closeForm() {
      this.$emit("input", { isVisible: false });
    },
    addEntry() {
      this.formData.entries?.push({});
    },
    removeEntry(index: number) {
      this.formData.entries?.splice(index, 1);
    },
    async saveForm() {
      this.submitButtonLoading = true;
      const data = clone(removeBlanks(this.formData));
      try {
        if (!this.validateForm(data)) {
          showMessage({
            text: this.$t("error.formGeneric").toString(),
            type: "error",
          });
          this.submitButtonLoading = false;
          return;
        }
        console.log("Final data", data);
        if (this.create) {
          await addOrder(data);
        } else {
          await updateOrder(data);
        }
        const message = this.create
          ? this.$t("model.order.added")
          : this.$t("model.order.edited");
        showMessage({
          type: "success",
          text: message.toString(),
        });
      } catch (e) {
        repositoryErrorHandler(e);
      }
      this.submitButtonLoading = false;
    },
    validateForm(
      form: RecursivePartial<UpdateOrderInput>
    ): form is UpdateOrderInput {
      const data = clone(removeBlanks(form));
      return data.date != undefined;
    },
  },
});
</script>
