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
          :label="$t('model.store.name')"
        ></v-text-field>
      </v-row>
      <v-row class="pt-6 pb-4">
        <div class="text-h5">Utenti</div>
        <v-spacer />
        <v-btn @click="addAuthorizedUser" icon>
          <v-icon>mdi-plus-circle</v-icon>
        </v-btn>
      </v-row>
      <v-row
        v-for="(_, index) in formData.authorizations"
        :key="index"
        align="center"
      >
        <v-col cols="6">
          <async-select
            v-model="formData.authorizations[index].userId"
            :label="$t('word.user').toString()"
            :find-items-fn="findUsersSelectFn"
          />
        </v-col>
        <v-col cols="4">
          <async-select
            v-model="formData.authorizations[index].accessLevel"
            :label="$t('model.store.accessLevel.name').toString()"
            :find-items-fn="findStoreAccessLevelSelectFn"
            :lazy="false"
          />
        </v-col>
        <v-spacer />
        <v-btn @click="removeAuthorizedUser(index)" icon>
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
import AsyncSelect from "@/components/common/AsyncSelect.vue";
import {
  getSelectStoreAccessLevel,
  getSelectUsers,
} from "@/helpers/asyncSelectUtils";
import { addStore, updateStore } from "@/repositories/StoreRepository";
import { UpdateStoreInput } from "@/model/UpdateStoreInput";
export type StoreFormDialogModel = GenericFormDialogModel<{
  itemToUpdate?: DbStore;
}>;
function mapInitialValue(store?: DbStore): RecursivePartial<UpdateStoreInput> {
  return {
    id: store?.id,
    name: store?.name,
    authorizations:
      store?.authorizations.map((el) => {
        return {
          userId: el.user.id,
          accessLevel: el.accessLevel,
        };
      }) ?? [],
  };
}
export default defineComponent({
  components: { AsyncSelect, FormDialog },
  props: {
    value: {
      type: Object as PropType<StoreFormDialogModel>,
      required: true,
    },
  },

  setup(props) {
    const submitButtonLoading = ref(false);
    const formData = ref<RecursivePartial<UpdateStoreInput>>({});
    const create = ref(false);
    const isVisible = ref(false);
    const findUsersSelectFn = getSelectUsers;
    const findStoreAccessLevelSelectFn = getSelectStoreAccessLevel;

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
      findStoreAccessLevelSelectFn,
    };
  },
  methods: {
    closeForm() {
      this.$emit("input", { isVisible: false });
    },
    addAuthorizedUser() {
      this.formData.authorizations?.push({});
    },
    removeAuthorizedUser(index: number) {
      this.formData.authorizations?.splice(index, 1);
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
