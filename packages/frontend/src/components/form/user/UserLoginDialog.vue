<template>
  <form-dialog
    v-model="isVisible"
    :submit-button-text="$t('word.login').toString()"
    :submit-button-loading="submitButtonLoading"
    :title="$t('components.form.userLogin.title').toString()"
    @submit="saveForm"
    @close="closeForm"
  >
    <v-form :disabled="submitButtonLoading" class="pa-4">
      <v-text-field
        v-model="formData.username"
        :label="$t('model.user.username')"
      ></v-text-field>
      <v-text-field
        type="password"
        v-model="formData.password"
        :label="$t('model.user.password')"
      ></v-text-field>
    </v-form>
  </form-dialog>
</template>

<script lang="ts">
import { defineComponent, ref, watch } from "@vue/composition-api";
import { repositoryErrorHandler } from "@/helpers/errorHandler";
import { clone } from "lodash";
import FormDialog from "@/components/common/FormDialog.vue";
import { showMessage } from "@/helpers/snackbar";
import { removeBlanks } from "@/helpers/utils";
import { UserCredential } from "@/model/UserCredential";

export default defineComponent({
  components: { FormDialog },
  props: {
    value: {
      type: Boolean,
      required: true,
    },
  },

  setup(props, { emit }) {
    const submitButtonLoading = ref(false);
    const formData = ref<Partial<UserCredential>>({});
    const create = ref(false);
    const isVisible = ref(false);
    const changePassword = ref(false);

    watch(
      () => props.value,
      (el) => {
        isVisible.value = el;
      }
    );
    return {
      submitButtonLoading,
      formData,
      create,
      changePassword,
      isVisible,
    };
  },
  methods: {
    closeForm() {
      this.$emit("input", false);
    },
    async saveForm() {
      this.submitButtonLoading = true;
      const data = clone(removeBlanks(this.formData));
      if (!data.username || !data.password) {
        showMessage({
          text: this.$t("error.formGeneric").toString(),
          type: "error",
        });
        this.submitButtonLoading = false;
        return;
      }
      try {
        await this.$store.dispatch("user/login", this.formData);
        this.closeForm();
      } catch (e) {
        repositoryErrorHandler(e);
      }
      this.submitButtonLoading = false;
    },
  },
});
</script>
