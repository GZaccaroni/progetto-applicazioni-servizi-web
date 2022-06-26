<template>
  <div style="min-width: 100%">
    <v-row>
      <v-col cols="12">
        <v-card style="overflow: hidden">
          <slot name="header"></slot>
          <v-data-table
            v-model="selected"
            :fixed-header="true"
            :headers="columns"
            :items="items"
            :single-select="singleSelect"
            :show-select="showSelect"
            :item-key="itemKey"
            :hide-default-footer="
              hideDefaultFooter || showCustomFooterPagination
            "
            :items-per-page="numberOfItemsPerPage"
            no-data-text="No items"
            class="elevation-0"
            style="border-bottom-left-radius: 0; border-bottom-right-radius: 0"
            :loading="loading"
          >
            <template
              v-for="(_, name) in $_tableItemSlots()"
              :slot="name"
              slot-scope="slotData"
            >
              <slot :name="name" v-bind="slotData" />
            </template>

            <template v-slot:[`item.actions`]="{ item }">
              <actions-table @onClickAction="clickAction" :item="item" />
            </template>
          </v-data-table>
          <v-card-actions
            v-if="showCustomFooterPagination"
            class="customFooterPagination"
          >
            <v-spacer></v-spacer>
            <slot name="footer"></slot>
          </v-card-actions>
        </v-card>
      </v-col>
    </v-row>
  </div>
</template>

<script lang="ts">
import ActionsTable from "./ActionsTable.vue";
import { DataTableHeader } from "vuetify";
import { defineComponent, PropType } from "@vue/composition-api";
import { pickBy } from "lodash";

type Item = Partial<Record<string, string>>;

export default defineComponent({
  components: {
    ActionsTable,
  },

  props: {
    itemKey: {
      type: String,
      default: "id",
    },
    items: {
      type: Array as PropType<Partial<Item>[]>,
      default: () => [],
    },
    columns: {
      type: Array as PropType<DataTableHeader[]>,
      default: () => [],
    },
    hideDefaultFooter: {
      type: Boolean,
      default: false,
    },
    showCustomFooterPagination: {
      type: Boolean,
      default: false,
    },
    showSelect: {
      type: Boolean,
      default: false,
    },
    singleSelect: {
      type: Boolean,
      default: false,
    },
    numberOfItemsPerPage: {
      type: Number,
      default: 10,
    },
    loading: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      selected: [],
    };
  },

  watch: {
    selected(newSelected, _) {
      this.clickAction(newSelected, "onRowSelection");
    },
  },

  computed: {},

  methods: {
    $_tableItemSlots() {
      const excludedItems = ["item.actions"];
      return pickBy(
        this.$scopedSlots,
        (_, key) => key.startsWith("item.") && !excludedItems.includes(key)
      );
    },
    clickAction(item: Item, event: string): void {
      this.$emit("onDataEvent", { item, event });
    },
  },
});
</script>

<style lang="scss">
.customFooterPagination {
  border-top: solid 1px lightgray;
}
</style>
