<template>
  <form-dialog
    v-model="isVisible"
    :submit-button-text="$t('word.save').toString()"
    :submit-button-loading="submitButtonLoading"
    :title="
      $t(create ? 'model.customer.add' : 'model.customer.edit').toString()
    "
    @submit="saveForm"
  >
    <v-form ref="form" class="pa-4">
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
import { DbCustomer } from "@/model/db/DbCustomer";
import { updateCustomer } from "@/repositories/CustomerRepository";
export type CustomerFormDialogModel = GenericFormDialogModel<{
  initialData: Partial<DbCustomer>;
}>;
export default defineComponent({
  components: { FormDialog },
  props: {
    value: {
      type: Object as PropType<CustomerFormDialogModel>,
      required: true,
    },
  },

  setup(props) {
    const submitButtonLoading = ref(false);
    const formActionsDisabled = ref(false);
    const formData = ref<Partial<DbCustomer>>({});
    const create = ref(false);
    const isVisible = ref(false);

    watch(
      () => props.value,
      (el) => {
        if (el.isVisible) {
          create.value = el.initialData.id == undefined;
          formData.value = el.initialData;
        }
        isVisible.value = el.isVisible;
      }
    );
    return {
      submitButtonLoading,
      formActionsDisabled,
      formData,
      create,
      isVisible,
    };
  },
  methods: {
    closeForm() {
      this.$emit("input", { isVisible: false });
    },
    async saveForm() {
      this.submitButtonLoading = true;
      this.formActionsDisabled = true;
      let data = clone(removeBlanks(this.formData));
      try {
        if (data.name == undefined) {
          return;
        }
        const message = this.create
          ? this.$t("model.customer.added")
          : this.$t("model.customer.edited");
        showMessage({
          type: "success",
          text: message.toString(),
        });
      } catch (e) {
        repositoryErrorHandler(e);
      }
      this.formActionsDisabled = false;
      this.submitButtonLoading = false;
    },
  },
});
</script>
