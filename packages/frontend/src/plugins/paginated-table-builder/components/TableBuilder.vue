<template>
  <table-builder-vuetify
    v-on="$listeners"
    :showCustomFooterPagination="true"
    :single-select="singleSelect"
    :show-select="showSelect"
    :columns="columns"
    :items="items"
    :numberOfItemsPerPage="numberOfItemsPerPage"
    :sortable="sortable"
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
  </table-builder-vuetify>
</template>

<script lang="ts">
import Vue, { PropType, VueConstructor } from "vue";
import { DataTableHeader } from "vuetify";
import { observeErrorHandler } from "@/components/utils/UIErrorHandler";

export default (
  Vue as VueConstructor<Vue & InstanceType<typeof unsubscribeMixin>>
).extend({
  name: "PaginatedTable",
  components: {},
  mixins: [unsubscribeMixin],

  props: {
    collectionName: {
      type: String,
    },
    columns: {
      type: Array as PropType<DataTableHeader[]>,
      default: () => [],
    },
    filters: {
      type: Array as PropType<FindOptionsWhereFilter[]>,
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
      type: Array as PropType<
        ("list_parents" | "remove" | "edit" | "delete")[]
      >,
      default: () => [],
    },
    numberOfItemsPerPage: {
      type: Number,
      default: 10,
    },
    sortable: {
      type: Boolean,
      default: false,
    },
    loading: {
      type: Boolean,
      default: false,
    },
  },
  data(): {
    intLoading: boolean;
    items: Partial<Record<string, string>>[];
    previousPagesCursors: (string | undefined)[];
    hasNextPage: boolean;
    nonReactive: {
      unsubscribeObserveAll?: Unsubscribe;
    };
  } {
    return {
      intLoading: false,
      items: [],
      previousPagesCursors: [],
      hasNextPage: false,
      nonReactive: {},
    };
  },

  beforeMount() {
    this.loadItems();
  },
  computed: {
    hasPreviousPage(): boolean {
      return this.previousPagesCursors.length > 0;
    },
  },
  watch: {
    filters(oldValue, newValue) {
      if (_.isEqual(oldValue, newValue)) {
        return;
      }
      this.loadItems();
    },
  },
  methods: {
    $_tableItemSlots() {
      const excludedItems = ["item.actions"];
      return _.pickBy(
        this.$scopedSlots,
        (_, key) => key.startsWith("item.") && !excludedItems.includes(key)
      );
    },
    loadItems(direction?: "previous" | "next") {
      // Unsubscribe previous
      this.intLoading = true;
      this.unsubscribeAll();
      const limit = this.numberOfItemsPerPage;
      let startAfter: string | undefined;
      let startAt: string | undefined;

      const orderByField = this.orderByFieldPath ?? "id";
      switch (direction) {
        case "previous":
          startAt = this.previousPagesCursors.pop();
          // If it is the first page don't use startAt
          if (this.previousPagesCursors.length == 0) {
            startAt = undefined;
          }
          startAfter = undefined;
          break;
        case "next":
          startAt = undefined;
          startAfter = _.last(this.items)?.[orderByField];
          if (startAfter == undefined) return;
          break;
        default:
          startAfter = undefined;
          startAt = undefined;
          break;
      }
      const previousPagesCursorsLength = this.previousPagesCursors.length;
      const unsubscribe = firestoreRepository.observeAll(
        this.collectionName,
        {
          whereFilters: this.filters,
          startAfter: startAfter,
          startAt: startAt,
          limit: limit + 1,
          orderBy: {
            fieldPath: this.orderByFieldPath ?? undefined,
            direction: this.orderByDirection ?? undefined,
          },
        },
        (next) => {
          if (next.length == limit + 1) {
            next.pop();
            this.hasNextPage = true;
          } else {
            this.hasNextPage = false;
          }
          if (direction == "next") {
            const firstItemId = _.first(this.items)?.[orderByField];
            Vue.set(
              this.previousPagesCursors,
              previousPagesCursorsLength,
              firstItemId
            );
          }

          // Add actions if needed
          if (this.actions.length > 0) {
            next.forEach((el) => {
              el.actions = {};
              for (const action of this.actions) {
                el.actions[action] = true;
              }
            });
          }
          this.items = next;
          this.intLoading = false;
        },
        (error) => {
          observeErrorHandler(error);
          this.intLoading = false;
        }
      );
      this.unsubscribes.push(unsubscribe);
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