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
    :return-object="returnObject"
  >
  </v-autocomplete>
</template>
<script lang="ts">
import {
  defineComponent,
  PropType,
  ref,
  toRefs,
  WritableComputedRef,
} from "@vue/composition-api";
import { DbIdentifiable } from "@/model/db/DbIdentifiable";
import { mappedVModel, passthroughVModel } from "@/helpers/passthroughVModel";
import { debounce } from "lodash";
import { repositoryErrorHandler } from "@/helpers/errorHandler";
import { Mapper } from "@/helpers/types";

export interface AsyncSelectItem extends DbIdentifiable {
  id: string;
  text: string;
}
export type FindSelectItemsFn = (query?: string) => Promise<AsyncSelectItem[]>;

export default defineComponent({
  props: {
    findItemsFn: {
      type: Function as PropType<FindSelectItemsFn>,
      required: true,
    },
    value: {
      type: [Object, Array, String] as PropType<
        AsyncSelectItem | AsyncSelectItem[]
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
    returnObject: {
      type: Boolean,
      default: true,
    },
  },
  setup(props, context) {
    const isLoading = ref(false);
    const items = ref<AsyncSelectItem[]>();
    const valueState = passthroughVModel(props, context, "value");
    const searchQuery = ref<string>();
    const propsRef = toRefs(props).value?.value;
    if (propsRef != undefined) {
      if (Array.isArray(propsRef)) {
        items.value = propsRef;
      } else if (typeof propsRef == "object") {
        items.value = [propsRef];
      }
    }
    return {
      isLoading,
      items,
      valueState,
      searchQuery,
    };
  },
  created() {
    this.updateItems();
    this.updateItems = debounce(this.updateItems, 500);
  },
  methods: {
    updateItems() {
      this.isLoading = true;
      this.findItemsFn(this.searchQuery)
        .then((el) => {
          this.items = el;
          this.isLoading = false;
        })
        .catch(repositoryErrorHandler);
    },
  },

  watch: {
    searchQuery(newValue) {
      if (newValue == undefined) return;
      this.isLoading = true;
      this.updateItems();
    },
  },
});
</script>
