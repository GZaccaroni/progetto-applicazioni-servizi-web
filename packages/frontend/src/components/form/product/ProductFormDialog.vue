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
    <v-form ref="form" class="pa-4">
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
            :find-items-fn="findUnitOfMeasureFn"
            :lazy="false"
          />
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
            :suffix="priceSuffix"
            :min="0"
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
import { defineComponent, PropType, ref, watch } from "vue";
import { repositoryErrorHandler } from "@/helpers/errorHandler";
import { clone } from "lodash";
import FormDialog, {
  GenericFormDialogModel,
} from "@/components/common/FormDialog.vue";
import { showMessage } from "@/helpers/snackbar";
import { removeBlanks } from "@/helpers/utils";
import { DbStore } from "@/model/db/DbStore";
import { RecursivePartial } from "@/helpers/types";
import { getSelectUnitOfMeasure } from "@/helpers/asyncSelectUtils";
import { DbProduct } from "@/model/db/DbProduct";
import AsyncSelect from "@/components/common/AsyncSelect.vue";
import { addProduct, updateProduct } from "@/repositories/ProductRepository";

export type ProductFormDialogModel = GenericFormDialogModel<{
  initialData: RecursivePartial<DbProduct>;
}>;
export default defineComponent({
  components: { AsyncSelect, FormDialog },
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
    const findUnitOfMeasureFn = getSelectUnitOfMeasure;
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
      findUnitOfMeasureFn,
      findStoreAccessLevelSelectFn: findUnitOfMeasureFn,
    };
  },
  computed: {
    priceSuffix() {
      let suffix = "€";
      if (this.formData.unitOfMeasure == undefined) return suffix;
      suffix += "/";
      suffix += this.$t(
        "model.unitOfMeasure." + this.formData.unitOfMeasure
      ).toString();
      return suffix;
    },
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
          await addProduct(data);
        } else {
          await updateProduct(data);
        }
        const message = this.create
          ? this.$t("model.product.added")
          : this.$t("model.product.edited");
        showMessage({
          type: "success",
          text: message.toString(),
        });
        this.closeForm();
      } catch (e) {
        repositoryErrorHandler(e);
      }
      this.submitButtonLoading = false;
    },
    validateForm(form: RecursivePartial<DbStore>): form is DbProduct {
      const data = clone(removeBlanks(this.formData));
      return data.name != undefined;
    },
  },
});
</script>
