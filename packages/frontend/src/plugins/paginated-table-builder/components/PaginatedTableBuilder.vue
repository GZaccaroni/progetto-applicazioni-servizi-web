<template>
  <table-builder
    v-on="$listeners"
    :showCustomFooterPagination="true"
    :single-select="singleSelect"
    :show-select="showSelect"
    :columns="columns"
    :items="items"
    :numberOfItemsPerPage="numberOfItemsPerPage"
    :loading="loading || intLoading"
    :show-expand="showExpand"
  >
    <template
      v-for="(_, name) in $_tableItemSlots()"
      :slot="name"
      slot-scope="slotData"
    >
      <slot :name="name" v-bind="slotData" />
    </template>
    <template v-slot:header>
      <slot name="header"></slot>
    </template>
    <template v-slot:footer>
      <nav :aria-label="$t('components.PaginatedTableBuilder.pagination')">
        <v-btn
          :disabled="!hasPreviousPage"
          @click="loadItems('previous')"
          text
          normal
          :aria-label="$t('components.PaginatedTableBuilder.previousPage')"
        >
          <v-icon>mdi-chevron-left</v-icon>
        </v-btn>
        <v-btn
          :disabled="!hasNextPage"
          @click="loadItems('next')"
          text
          normal
          :aria-label="$t('components.PaginatedTableBuilder.nextPage')"
        >
          <v-icon>mdi-chevron-right</v-icon>
        </v-btn>
      </nav>
    </template>
    <template v-slot:expanded-item="slotData">
      <slot name="expanded-item" v-bind="slotData" />
    </template>
  </table-builder>
</template>

<script setup lang="ts">
import { computed, onBeforeMount, PropType, ref, useSlots, watch } from "vue";
import { debounce, isEqual, pickBy } from "lodash";
import { repositoryErrorHandler } from "@/helpers/errorHandler";
import { useCancellablesListener } from "@/components/common/UnsubscribeMixin";
import { ObservePaginatedResultFunction } from "@/repositories/common/ObserveUtils";
import { ItemAction } from "@/plugins/table-builder/components/ActionsTable.vue";
import { DataTableHeader } from "vuetify";
import { PaginateParams } from "@common/model/network/PaginateParams";

const props = defineProps({
  observeItemsFn: {
    type: Function as PropType<
        ObservePaginatedResultFunction<any, any> // eslint-disable-line
    >,
    required: true,
  },
  observeFnInput: {
    type: Object as PropType<PaginateParams>,
    required: true,
  },
  columns: {
    type: Array as PropType<DataTableHeader[]>,
    default: () => [],
  },
  showSelect: {
    type: Boolean,
    default: false,
  },
  singleSelect: {
    type: Boolean,
    default: false,
  },
  actions: {
    type: Array as PropType<ItemAction[]>,
    default: () => [],
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
const slots = useSlots();

const intLoading = ref(false);
const items = ref(new Array<Partial<Record<string, unknown>>>());
const previousPageCursor = ref<string | undefined>(undefined);
const nextPageCursor = ref<string | undefined>(undefined);
const cancellables = useCancellablesListener();

onBeforeMount(() => {
  loadItems();
});

const hasPreviousPage = computed(() => previousPageCursor.value != undefined);
const hasNextPage = computed(() => nextPageCursor.value != undefined);

watch(
  () => props.observeFnInput,
  (newValue, oldValue) => {
    if (isEqual(oldValue, newValue)) {
      return;
    }
    debouncedLoadItems();
  }
);
function $_tableItemSlots() {
  const excludedItems = ["item.actions"];
  return pickBy(
    slots,
    (_, key) => key.startsWith("item.") && !excludedItems.includes(key)
  );
}
function loadItems(direction?: "previous" | "next") {
  intLoading.value = true;
  // Unsubscribe previous
  cancellables.cancelAll();
  const limit = props.numberOfItemsPerPage;
  let previousCursor: string | undefined;
  let nextCursor: string | undefined;

  switch (direction) {
    case "previous":
      previousCursor = previousPageCursor.value;
      break;
    case "next":
      nextCursor = nextPageCursor.value;
      break;
    default:
      previousCursor = undefined;
      nextCursor = undefined;
      break;
  }
  const unsubscribe = props.observeItemsFn(
    {
      ...props.observeFnInput,
      pagingNext: nextCursor,
      pagingPrevious: previousCursor,
      limit: limit,
    },
    (result) => {
      previousPageCursor.value = result.cursors.previous;
      nextPageCursor.value = result.cursors.next;
      // Add actions if needed
      const itemActions: Partial<Record<ItemAction, boolean>> = {};
      for (const action of props.actions) {
        itemActions[action] = true;
      }
      items.value = result.results.map((item) => {
        return {
          ...item,
          actions: itemActions,
        };
      });
      intLoading.value = false;
    },
    (error) => {
      repositoryErrorHandler(error);
      intLoading.value = false;
    }
  );
  cancellables.addToCancellables(unsubscribe);
}
const debouncedLoadItems = debounce(loadItems, 500);
</script>

<style lang="scss">
.customFooterPagination {
  border-top-left-radius: 0;
  border-top-right-radius: 0;
}
</style>
