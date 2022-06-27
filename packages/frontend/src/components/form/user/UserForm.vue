<template>
  <div>
    <v-form ref="form" class="pa-4" @submit.prevent>
      <v-text-field
        v-model="form.searchName"
        label="Cerca per nome"
      ></v-text-field>
    </v-form>
  </div>
</template>

<script lang="ts">
import { mapGetters } from "vuex";
import { defineComponent } from "@vue/composition-api";
import {repositoryErrorHandler} from "@/helpers/errorHandler";
import {clone} from "lodash";
import {DbUser} from "@/model/db/DbUser";

export default defineComponent({
  props: {
    initialData: {
      type: Object,
      default: null,
    },
  },

  data(): {
    submitButtonLoading: boolean;
    formActionsDisabled: boolean;
  } {
    return {
      submitButtonLoading: false,
      formActionsDisabled: false,
    };
  },

  created() {
  },

  computed: {
    ...mapGetters("user", {
      userProfile: "userProfile",
    }),
  },

  methods: {
    closeForm() {
      this.$emit("onClose");
    },
    async saveForm(form: DbUser) {
      this.submitButtonLoading = true;
      this.formActionsDisabled = true;
      let data = clone(form);
      console.log(data);
      try {
        const user: DbUser = {
          id: data.id,
          title: data.title,
          focusAreas: data.focusAreas,
          trainingGoals: data.trainingGoals,
          tags: data.tags,
          video: {
            [Language.Default]: {
              mp4: videoPath,
              duration: duration,
            },
          },
        };

        await exerciseRepository.saveExercise(exercise, this.action == "add");
        this.closeForm();
        this.$message({
          type: "success",
          text: this.$t(`message.save.item.${this.action}`),
        });
      } catch (e) {
        repositoryErrorHandler(e);
      }
      this.formActionsDisabled = false;
      this.submitButtonLoading = false;
    },

    submitForm(form) {
      this.saveForm(form);
    },
  },
});
</script>
