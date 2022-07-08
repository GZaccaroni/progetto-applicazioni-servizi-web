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
      <v-row v-for="(_, index) in authorizedUsers" :key="index" align="center">
        <v-col cols="6">
          <async-select
            v-model="authorizedUsers[index].user"
            :label="$t('word.user').toString()"
            :find-items-fn="findStoresSelectFn"
          />
        </v-col>
        <v-col cols="4">
          <async-select
            v-model="authorizedUsers[index].accessLevel"
            :label="$t('model.store.accessLevel.name').toString()"
            :find-items-fn="findStoreAccessLevelSelectFn"
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
import { DbStore, DbStoreAccessLevel } from "@/model/db/DbStore";
import { RecursivePartial } from "@/helpers/types";
import AsyncSelect, {
  AsyncSelectItem,
} from "@/components/common/AsyncSelect.vue";
import {
  getSelectStoreAccessLevel,
  getSelectStores,
} from "@/helpers/asyncSelectUtils";
import { observableRef } from "@/components/common/VueComposition";
import i18n from "@/i18n";
import { addStore, updateStore } from "@/repositories/StoreRepository";
export type StoreFormDialogModel = GenericFormDialogModel<{
  initialData: RecursivePartial<DbStore>;
}>;
interface AuthorizationViewData {
  user?: Partial<AsyncSelectItem>;
  accessLevel?: Partial<AsyncSelectItem>;
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
    const formData = ref<RecursivePartial<DbStore>>({});
    const create = ref(false);
    const isVisible = ref(false);
    const findStoresSelectFn = getSelectStores;
    const findStoreAccessLevelSelectFn = getSelectStoreAccessLevel;

    console.log("Initial data ", props.value);
    const authorizedUsers = observableRef<AuthorizationViewData[]>(
      [],
      (newValue) => {
        formData.value.authorizations = newValue.map((value) => {
          return {
            user: {
              id: value.user?.id,
              username: value.user?.text,
            },
            accessLevel: value.accessLevel?.id as DbStoreAccessLevel,
          };
        });
      }
    );
    watch(
      () => props.value,
      (el) => {
        if (el.isVisible) {
          create.value = el.initialData.id == undefined;
          let initialData = clone(el.initialData);
          initialData.authorizations = initialData.authorizations ?? [];
          formData.value = initialData;
          authorizedUsers.value =
            formData.value.authorizations?.map((el) => {
              return {
                accessLevel: {
                  id: el.accessLevel as DbStoreAccessLevel,
                  text: i18n
                    .t("model.store.accessLevel." + el.accessLevel)
                    .toString(),
                },
                user: {
                  id: el.user?.id,
                  text: el.user?.username,
                },
              };
            }) ?? [];
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
      authorizedUsers,
    };
  },
  methods: {
    closeForm() {
      console.log("Is visible: false");
      this.$emit("input", { isVisible: false });
    },
    addAuthorizedUser() {
      console.log("Add item to authorized users!");
      this.authorizedUsers.push({});
    },
    removeAuthorizedUser(index: number) {
      this.authorizedUsers.splice(index);
    },
    async saveForm() {
      this.submitButtonLoading = true;
      let data = clone(removeBlanks(this.formData));
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
      let data = clone(removeBlanks(this.formData));
      return data.name != undefined;
    },
  },
});
</script>
