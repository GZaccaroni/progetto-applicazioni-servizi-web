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
            :no-data-text="$t('components.TableBuilder.noData')"
            class="elevation-0"
            style="border-bottom-left-radius: 0; border-bottom-right-radius: 0"
            :loading="loading"
            :show-expand="showExpand"
          >
            <template
              v-for="(_, name) in $_tableItemSlots()"
              :slot="name"
              slot-scope="slotData"
            >
              <slot :name="name" v-bind="slotData" />
            </template>
            <template
              v-slot:[`item.data-table-expand`]="{ isExpanded, expand }"
            >
              <v-icon
                @click="expand(!isExpanded)"
                :aria-label="
                  $t(
                    'components.PaginatedTableBuilder.' +
                      (isExpanded ? 'collapse' : 'expand') +
                      'Row'
                  )
                "
                role="button"
              >
                {{ isExpanded ? "mdi-chevron-up" : "mdi-chevron-down" }}
              </v-icon>
            </template>
            <template v-slot:[`item.actions`]="{ item }">
              <actions-table @onClickAction="clickAction" :item="item" />
            </template>
            <template v-slot:expanded-item="slotData">
              <slot name="expanded-item" v-bind="slotData" />
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

<script setup lang="ts">
import ActionsTable from "./ActionsTable.vue";
import { DataTableHeader } from "vuetify";
import { defineEmits, defineProps, PropType, ref, useSlots, watch } from "vue";
import { pickBy } from "lodash";
import { TableItemEventType } from "@/plugins/table-builder/TableItemEventType";

type Item = Partial<Record<string, string>>;

defineProps({
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
  showExpand: {
    type: Boolean,
    default: false,
  },
});
const emit = defineEmits(["onRowEvent"]);
const slots = useSlots();

const selected = ref();

watch(selected, (newSelected) => {
  clickAction(newSelected, TableItemEventType.rowSelection);
});
function $_tableItemSlots() {
  const excludedItems = ["item.actions"];
  return pickBy(
    slots,
    (_, key) => key.startsWith("item.") && !excludedItems.includes(key)
  );
}
function clickAction(item: Item, eventType: TableItemEventType): void {
  emit("onRowEvent", { item, type: eventType });
}
</script>

<style lang="scss">
.customFooterPagination {
  border-top: solid 1px lightgray;
}
</style>
