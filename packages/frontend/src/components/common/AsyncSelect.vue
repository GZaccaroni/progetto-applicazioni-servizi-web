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
    :clearable="clearable"
    :return-object="returnObject"
  >
  </v-autocomplete>
</template>
<script lang="ts">
import { defineComponent, PropType, ref } from "vue";
import { passthroughVModel } from "@/helpers/passthroughVModel";
import { debounce, values } from "lodash";
import { repositoryErrorHandler } from "@/helpers/errorHandler";
import {
  AsyncSelectItem,
  FindSelectItemsFn,
  FindSelectItemsInput,
} from "./AsyncSelectTypes";

export default defineComponent({
  props: {
    findItemsFn: {
      type: Function as PropType<FindSelectItemsFn>,
      required: true,
    },
    value: {
      type: [Object, Array, String] as PropType<
        | string
        | string[]
        | AsyncSelectItem<unknown>
        | AsyncSelectItem<unknown>[]
      >,
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
    returnObject: {
      type: Boolean,
      default: false,
    },
  },
  setup(props, context) {
    const isLoading = ref(false);
    const items = ref<AsyncSelectItem<unknown>[]>();
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
      const ids = this.getSelectedValuesIds();
      this.findItemsFn({ ids: ids })
        .then((el) => {
          this.items = el;
          this.isLoading = false;
        })
        .catch(repositoryErrorHandler)
        .finally(() => (this.isLoading = false));
    },
    getSelectedValuesIds(): string[] {
      const ids = new Array<string>();
      if (Array.isArray(this.valueState)) {
        for (const element of this.valueState) {
          if (typeof element == "object") {
            ids.push(element.id);
          } else {
            ids.push(element);
          }
        }
      } else if (typeof this.valueState == "object") {
        ids.push(this.valueState.id);
      } else if (typeof this.valueState == "string") {
        ids.push(this.valueState);
      }
      return ids;
    },
  },

  watch: {
    searchQuery(newValue) {
      if (!this.lazy) return;
      if (newValue == undefined) return;
      this.isLoading = true;
      this.updateItems();
    },
    items(newItems: AsyncSelectItem<unknown>[]) {
      const valueState = this.valueState;
      if (valueState == undefined || typeof valueState == "string") return;
      if (Array.isArray(valueState)) {
        valueState.forEach((value, index) => {
          if (typeof value != "object") return;
          const itemIndex = newItems.findIndex((el) => el.id == value.id);
          if (itemIndex != -1) {
            valueState[index] = newItems[index];
          }
        });
      } else if (typeof valueState == "object") {
        const index = newItems.findIndex((el) => el.id == valueState.id);
        if (index != -1) {
          this.valueState = newItems[index];
        }
      }
    },
  },
});
</script>
