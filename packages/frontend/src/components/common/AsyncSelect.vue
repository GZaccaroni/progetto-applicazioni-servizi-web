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
    return-object
  >
  </v-autocomplete>
</template>
<script lang="ts">
import {
  defineComponent,
  PropType,
  ref,
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
      type: [Object, Array] as PropType<unknown>,
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
    mapper: {
      type: Object as PropType<
        // any is AsyncSelectItem | AsyncSelectItem[]
        Mapper<unknown, any> // eslint-disable-line
      >,
    },
  },
  setup(props, context) {
    const isLoading = ref(false);
    const items = ref<AsyncSelectItem[]>();
    let valueState: WritableComputedRef<unknown>;
    if (props.mapper != undefined) {
      valueState = mappedVModel(props, context, "value", props.mapper);
    } else {
      valueState = passthroughVModel(props, context, "value");
    }
    const searchQuery = ref<string>();
    if (props.value != undefined) {
      if (Array.isArray(props.value)) {
        items.value = (props.mapper?.from(props.value) ?? props.value) as any; // eslint-disable-line
      } else {
        items.value = [ (props.mapper?.from(props.value) ?? props.value) as any ] ; // eslint-disable-line
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
