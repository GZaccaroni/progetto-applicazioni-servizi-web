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
    <v-form ref="form" class="pa-4">
      <v-row>
        <v-text-field
          v-model="formData.name"
          :label="$t('model.product.name')"
        ></v-text-field>
      </v-row>
      <v-row>
        <v-col cols="6" class="pa-0">
          <v-text-field
            type="number"
            v-model.number="formData.pricePerUnit"
            :label="$t('model.product.pricePerUnit')"
          ></v-text-field>
        </v-col>
        <v-col cols="6" class="pa-0">
          <v-text-field
            v-model="formData.unitOfMeasure"
            :label="$t('model.product.unitOfMeasure')"
          ></v-text-field>
        </v-col>
      </v-row>
      <v-row class="pt-6 pb-4">
        <div class="text-h5">Varietà</div>
        <v-spacer />
        <v-btn @click="addKind" icon>
          <v-icon>mdi-plus-circle</v-icon>
        </v-btn>
      </v-row>
      <v-row
        v-for="(_, index) in formData.kinds"
        :key="formData.kinds[index].id"
        align="center"
      >
        <v-col cols="6">
          <v-text-field
            v-model="formData.kinds[index].name"
            :label="$t('model.product.name')"
          ></v-text-field>
        </v-col>
        <v-col cols="4">
          <v-text-field
            type="number"
            v-model.number="formData.kinds[index].pricePerUnit"
            :label="$t('model.product.pricePerUnit')"
          ></v-text-field>
        </v-col>
        <v-spacer />
        <v-btn @click="removeKind(index)" icon>
          <v-icon>mdi-delete</v-icon>
        </v-btn>
      </v-row>
    </v-form>
  </form-dialog>
</template>

<script lang="ts">
import { defineComponent, PropType, ref, watch } from "@vue/composition-api";
import { repositoryErrorHandler } from "@/helpers/errorHandler";
import { clone } from "lodash";
import FormDialog, {
  GenericFormDialogModel,
} from "@/components/common/FormDialog.vue";
import { showMessage } from "@/helpers/snackbar";
import { removeBlanks } from "@/helpers/utils";
import { DbStore } from "@/model/db/DbStore";
import { RecursivePartial } from "@/helpers/types";
import {
  getSelectStoreAccessLevel,
  getSelectStores,
} from "@/helpers/asyncSelectUtils";
import { addStore, updateStore } from "@/repositories/StoreRepository";
import { DbProduct } from "@/model/db/DbProduct";

export type ProductFormDialogModel = GenericFormDialogModel<{
  initialData: RecursivePartial<DbProduct>;
}>;
export default defineComponent({
  components: { FormDialog },
  props: {
    value: {
      type: Object as PropType<ProductFormDialogModel>,
      required: true,
    },
  },

  setup(props) {
    const submitButtonLoading = ref(false);
    const formData = ref<RecursivePartial<DbProduct>>({});
    const create = ref(false);
    const isVisible = ref(false);
    const findStoresSelectFn = getSelectStores;
    const findStoreAccessLevelSelectFn = getSelectStoreAccessLevel;

    console.log("Initial data ", props.value);
    watch(
      () => props.value,
      (el) => {
        if (el.isVisible) {
          create.value = el.initialData.id == undefined;
          const initialData = clone(el.initialData);
          initialData.kinds = initialData.kinds ?? [];
          formData.value = initialData;
        }
        isVisible.value = el.isVisible;
      }
    );
    return {
      submitButtonLoading,
      formData,
      create,
      isVisible,
      findStoresSelectFn,
      findStoreAccessLevelSelectFn,
    };
  },
  methods: {
    closeForm() {
      this.$emit("input", { isVisible: false });
    },
    addKind() {
      this.formData.kinds?.push({ id: crypto.randomUUID() });
    },
    removeKind(index: number) {
      this.formData.kinds?.splice(index, 1);
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
          await addStore(data);
        } else {
          await updateStore(data);
        }
        const message = this.create
          ? this.$t("model.store.added")
          : this.$t("model.store.edited");
        showMessage({
          type: "success",
          text: message.toString(),
        });
      } catch (e) {
        repositoryErrorHandler(e);
      }
      this.submitButtonLoading = false;
    },
    validateForm(form: RecursivePartial<DbStore>): form is DbStore {
      const data = clone(removeBlanks(this.formData));
      return data.name != undefined;
    },
  },
});
</script>
