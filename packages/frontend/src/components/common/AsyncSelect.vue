<template>
  <v-autocomplete
    v-model="valueState"
    :hide-no-data="!searchQuery || isLoading"
    :items="items"
    :search-input.sync="searchQuery"
    cache-items
    :label="label"
    item-value="id"
    item-text="text"
    :loading="isLoading"
    :multiple="multiple"
    :small-chips="multiple"
    :clearable="clearable"
  >
  </v-autocomplete>
</template>
<script lang="ts">
import { defineComponent, PropType, ref } from "@vue/composition-api";
import { DbIdentifiable } from "@/model/db/DbIdentifiable";
import { passthroughVModel } from "@/helpers/passthroughVModel";
import { debounce } from "lodash";
import { repositoryErrorHandler } from "@/helpers/errorHandler";

export interface AsyncSelectItem extends DbIdentifiable {
  id: string;
  text: string;
}
export type FindSelectItemsInput =
  | { ids: string[]; query?: undefined }
  | { ids?: undefined; query: string };
export type FindSelectItemsFn = (
  input?: FindSelectItemsInput
) => Promise<AsyncSelectItem[]>;

export default defineComponent({
  props: {
    findItemsFn: {
      type: Function as PropType<FindSelectItemsFn>,
      required: true,
    },
    value: {
      type: [Object, Array, String] as PropType<string | string[]>,
    },
    multiple: {
      type: Boolean,
      default: false,
    },
    clearable: {
      type: Boolean,
      default: false,
    },
    label: {
      type: String,
      required: true,
    },
    lazy: {
      type: Boolean,
      default: true,
    },
  },
  setup(props, context) {
    const isLoading = ref(false);
    const items = ref<AsyncSelectItem[]>();
    const valueState = passthroughVModel(props, context, "value");
    const searchQuery = ref<string>();
    return {
      isLoading,
      items,
      valueState,
      searchQuery,
    };
  },
  created() {
    if (this.lazy) {
      this.loadSelectedItems();
    }
    this.updateItems();
    this.updateItems = debounce(this.updateItems, 500);
  },
  methods: {
    updateItems() {
      this.isLoading = true;
      let input: FindSelectItemsInput | undefined;
      if (this.searchQuery != undefined) {
        input = { query: this.searchQuery };
      } else {
        input = undefined;
      }
      this.findItemsFn(input)
        .then((el) => {
          this.items = el;
        })
        .catch(repositoryErrorHandler)
        .finally(() => (this.isLoading = false));
    },
    loadSelectedItems() {
      this.isLoading = true;
      let ids: string[] = [];
      if (Array.isArray(this.valueState)) {
        ids = this.valueState;
      } else if (typeof this.valueState == "string") {
        ids = [this.valueState];
      }
      this.findItemsFn({ ids: ids })
        .then((el) => {
          this.items = el;
          this.isLoading = false;
        })
        .catch(repositoryErrorHandler)
        .finally(() => (this.isLoading = false));
    },
  },

  watch: {
    searchQuery(newValue) {
      if (!this.lazy) return;
      if (newValue == undefined) return;
      this.isLoading = true;
      this.updateItems();
    },
  },
});
</script>
