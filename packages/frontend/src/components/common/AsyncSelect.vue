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
    return-object
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
export type FindSelectItemsFn = (query: string) => Promise<AsyncSelectItem[]>;

export default defineComponent({
  props: {
    findItemsFn: {
      type: Function as PropType<FindSelectItemsFn>,
      required: true,
    },
    value: {
      type: [Object, Array] as PropType<AsyncSelectItem | AsyncSelectItem[]>,
      required: true,
    },
    multiple: {
      type: Boolean,
      required: true,
    },
    label: {
      type: String,
      required: true,
    },
  },
  setup(props, context) {
    const isLoading = ref(false);
    const items = ref<AsyncSelectItem[]>();
    const valueState = passthroughVModel(props, context, "value");
    const searchQuery = ref<string>();
    if (Array.isArray(props.value)) {
      items.value = props.value;
    } else {
      items.value = [props.value];
    }
    return {
      isLoading,
      items,
      valueState,
      searchQuery,
    };
  },
  created() {
    this.updateItems = debounce(this.updateItems, 500);
  },
  methods: {
    updateItems() {
      if (this.searchQuery == undefined) return;
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
