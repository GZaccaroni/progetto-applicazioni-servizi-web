<template>
  <v-container class="my-1" fluid>
    <!--
    <HeaderView :title="$t('word.exercises')">
      <template v-slot:endItems>
        <v-btn elevation="0" class="me-4" @click="openNewItemDialog()">
          <v-icon left>mdi-plus</v-icon>
          Add
        </v-btn>
      </template>
    </HeaderView>
    -->
    <list-users></list-users>
  </v-container>
</template>

<script lang="ts">
import { defineComponent } from "@vue/composition-api";
import ListUsers from "@/components/users/ListUsers.vue";

export default defineComponent({
  components: {
    ListUsers,
  },
  methods: {
    /*openNewItemDialog() {
      let data = {};
      let params = {
        steps: [
          {
            title: this.$t("text.newExercise"),
            component: "exercise/ExerciseForm",
          },
        ],
        data,
      };
      this.$eventBus.emit("showFormDialog", {params, show: true});
    },*/
  },
});
</script>
