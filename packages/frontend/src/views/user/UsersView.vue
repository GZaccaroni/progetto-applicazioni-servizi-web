<template>
  <v-container class="my-1" fluid>
    <header-view title="Utenti">
      <template v-slot:endItems>
        <v-btn elevation="0" class="me-4" @click="openNewItemDialog()">
          <v-icon left>mdi-plus</v-icon>
          Aggiungi
        </v-btn>
      </template>
    </header-view>
    <list-users @onRowEvent="onRowEvent" />
  </v-container>
</template>

<script lang="ts">
import { defineComponent } from "@vue/composition-api";
import ListUsers from "@/components/users/ListUsers.vue";
import {
  TableItemEvent,
  TableItemEventType,
} from "@/plugins/table-builder/TableItemEventType";
import { DbUser } from "@/model/db/DbUser";
import HeaderView from "@/components/common/HeaderView.vue";

export default defineComponent({
  components: {
    HeaderView,
    ListUsers,
  },
  methods: {
    openNewItemDialog() {
      console.log("New item!");
    },
    onRowEvent(event: TableItemEvent<DbUser>) {
      switch (event.type) {
        case TableItemEventType.rowEditAction:
          console.log("Edit row!");
          break;
        case TableItemEventType.rowDeleteAction:
          console.log("Delete row!");
          break;
      }
    },
  },
});
</script>
