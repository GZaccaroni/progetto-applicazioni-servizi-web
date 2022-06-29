<template>
  <form-dialog
    v-model="isVisible"
    submit-button-text="Salva"
    :submit-button-loading="submitButtonLoading"
    :title="$t(create ? 'model.user.add' : 'model.user.edit').toString()"
    @submit="saveForm"
  >
    <v-form ref="form" class="pa-4">
      <v-text-field
        v-model="formData.username"
        :label="$t('model.user.username')"
        :disabled="!create"
      ></v-text-field>
      <v-checkbox
        v-model="formData.isAdmin"
        :label="$t('model.user.isAdmin')"
      ></v-checkbox>
      <v-switch
        v-model="changePassword"
        v-if="!create"
        inset
        :label="$t('components.form.user.changePassword')"
      ></v-switch>
      <v-text-field
        type="password"
        v-if="changePassword || create"
        v-model="formData.password"
        :label="$t('model.user.password')"
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
import { AddUserInput } from "@/repositories/UserRepository";
import { removeBlanks } from "@/helpers/utils";
export type UserFormDialogModel = GenericFormDialogModel<{
  initialData: Partial<AddUserInput>;
}>;
export default defineComponent({
  components: { FormDialog },
  props: {
    value: {
      type: Object as PropType<UserFormDialogModel>,
      required: true,
    },
  },

  setup(props) {
    const submitButtonLoading = ref(false);
    const formActionsDisabled = ref(false);
    const formData = ref<Partial<AddUserInput>>({});
    const create = ref(false);
    const isVisible = ref(false);
    const changePassword = ref(false);

    watch(
      () => props.value,
      (el) => {
        if (el.isVisible) {
          create.value = el.initialData.username == undefined;
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
      changePassword,
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
        this.closeForm();
        const message = this.create
          ? this.$t("model.user.added")
          : this.$t("model.user.edited");
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
