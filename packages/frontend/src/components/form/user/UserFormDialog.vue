<template>
  <form-dialog
    v-model="isVisible"
    submit-button-text="Salva"
    :submit-button-loading="submitButtonLoading"
    :title="create ? 'Aggiungi utente' : 'Modifica utente'"
    @submit="saveForm"
  >
    <v-form ref="form" class="pa-4">
      <v-text-field
        v-model="formData.username"
        label="Nome utente"
        :disabled="!create"
      ></v-text-field>
      <v-checkbox
        v-model="formData.isAdmin"
        label="Amministratore"
      ></v-checkbox>
      <v-switch
        v-model="changePassword"
        v-if="!create"
        inset
        label="Cambia password"
      ></v-switch>
      <v-text-field
        type="password"
        v-if="changePassword || create"
        v-model="formData.password"
        label="Password"
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
        console.log("Value: ", props.value);
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
      this.$emit("onClose");
    },
    async saveForm() {
      this.submitButtonLoading = true;
      this.formActionsDisabled = true;
      let data = clone(removeBlanks(this.formData));
      try {
        this.closeForm();
        const message = this.create
          ? "Utente aggiunto con successo"
          : "Utente salvato con successo";
        showMessage({
          type: "success",
          text: message,
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
