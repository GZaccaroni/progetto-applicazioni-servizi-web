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
      <v-btn
        :disabled="!hasPreviousPage"
        @click="loadItems('previous')"
        text
        normal
      >
        <v-icon>mdi-chevron-left</v-icon>
      </v-btn>
      <v-btn :disabled="!hasNextPage" @click="loadItems('next')" text normal>
        <v-icon>mdi-chevron-right</v-icon>
      </v-btn>
    </template>
  </table-builder>
</template>

<script lang="ts">
import { defineComponent, PropType, ref } from "@vue/composition-api";
import { debounce, isEqual, pickBy } from "lodash";
import { repositoryErrorHandler } from "@/helpers/errorHandler";
import { useCancellablesListener } from "@/components/common/UnsubscribeMixin";
import { ObservePaginatedResultFunction } from "@/repositories/common/ObserveUtils";
import { ItemAction } from "@/plugins/table-builder/components/ActionsTable.vue";
import { PaginatedFindInput } from "@/repositories/common/PaginatedResult";
import { DataTableHeader } from "vuetify";

export default defineComponent({
  name: "PaginatedTable",
  components: {},
  props: {
    observeItemsFn: {
      type: Function as PropType<
        ObservePaginatedResultFunction<any, any> // eslint-disable-line
      >,
      required: true,
    },
    observeFnInput: {
      type: Object as PropType<PaginatedFindInput>,
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
  },
  setup() {
    const intLoading = ref(false);
    const items = ref(new Array<Partial<Record<string, unknown>>>());
    const previousPageCursor = ref<string | undefined>(undefined);
    const nextPageCursor = ref<string | undefined>(undefined);
    const cancellables = useCancellablesListener();

    return {
      intLoading,
      items,
      previousPageCursor,
      nextPageCursor,
      ...cancellables,
    };
  },
  beforeMount() {
    this.loadItems();
  },
  computed: {
    hasPreviousPage(): boolean {
      return this.previousPageCursor != undefined;
    },
    hasNextPage(): boolean {
      return this.nextPageCursor != undefined;
    },
  },
  watch: {
    observeFnInput(oldValue, newValue) {
      if (isEqual(oldValue, newValue)) {
        return;
      }
      this.debouncedLoadItems();
    },
  },
  created() {
    this.debouncedLoadItems = debounce(this.debouncedLoadItems, 500);
  },
  methods: {
    $_tableItemSlots() {
      const excludedItems = ["item.actions"];
      return pickBy(
        this.$scopedSlots,
        (_, key) => key.startsWith("item.") && !excludedItems.includes(key)
      );
    },
    debouncedLoadItems(direction?: "previous" | "next") {
      this.loadItems(direction);
    },
    loadItems(direction?: "previous" | "next") {
      this.intLoading = true;
      // Unsubscribe previous
      this.cancelAll();
      const limit = this.numberOfItemsPerPage;
      let previousCursor: string | undefined;
      let nextCursor: string | undefined;

      switch (direction) {
        case "previous":
          previousCursor = this.previousPageCursor;
          break;
        case "next":
          nextCursor = this.nextPageCursor;
          break;
        default:
          previousCursor = undefined;
          nextCursor = undefined;
          break;
      }
      const unsubscribe = this.observeItemsFn(
        {
          ...this.observeFnInput,
          pagingNext: nextCursor,
          pagingPrevious: previousCursor,
          limit: limit,
        },
        (result) => {
          this.previousPageCursor = result.previous;
          this.nextPageCursor = result.next;
          // Add actions if needed
          const actions: Partial<Record<ItemAction, boolean>> = {};
          for (const action of this.actions) {
            actions[action] = true;
          }
          this.items = result.results.map((item) => {
            return {
              ...item,
              actions: actions,
            };
          });
          this.intLoading = false;
        },
        (error) => {
          repositoryErrorHandler(error);
          this.intLoading = false;
        }
      );
      this.addToCancellables(unsubscribe);
    },
  },
});
</script>

<style lang="scss">
.customFooterPagination {
  border-top-left-radius: 0;
  border-top-right-radius: 0;
}
</style>
