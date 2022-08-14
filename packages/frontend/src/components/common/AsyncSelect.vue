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
<script setup lang="ts">
import { computed, onMounted, PropType, ref, watch } from "vue";
import { debounce } from "lodash";
import { repositoryErrorHandler } from "@/helpers/errorHandler";
import {
  AsyncSelectItem,
  FindSelectItemsFn,
  FindSelectItemsInput,
} from "./AsyncSelectTypes";

const props = defineProps({
  findItemsFn: {
    type: Function as PropType<FindSelectItemsFn>,
    required: true,
  },
  value: {
    type: [Object, Array, String] as PropType<
      string | string[] | AsyncSelectItem<unknown> | AsyncSelectItem<unknown>[]
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
});
const emit = defineEmits(["input"]);

const isLoading = ref(false);
const items = ref<AsyncSelectItem<unknown>[]>([]);
const valueState = computed({
  get: () => props.value,
  set: (value) => emit("input", value),
});
const searchQuery = ref<string>();

let updateItems = () => {
  isLoading.value = true;
  let input: FindSelectItemsInput | undefined;
  if (searchQuery.value != undefined) {
    input = { query: searchQuery.value };
  } else {
    input = undefined;
  }
  props
    .findItemsFn(input)
    .then((el) => {
      items.value = el;
    })
    .catch(repositoryErrorHandler)
    .finally(() => (isLoading.value = false));
};
function loadSelectedItems() {
  isLoading.value = true;
  const ids = getSelectedValuesIds();
  props
    .findItemsFn({ ids: ids })
    .then((el) => {
      items.value = el;
      isLoading.value = false;
    })
    .catch(repositoryErrorHandler)
    .finally(() => (isLoading.value = false));
}
function getSelectedValuesIds(): string[] {
  const ids = new Array<string>();
  const value = valueState.value;
  if (Array.isArray(value)) {
    for (const element of value) {
      if (typeof element == "object") {
        ids.push(element.id);
      } else {
        ids.push(element);
      }
    }
  } else if (typeof value == "object") {
    ids.push(value.id);
  } else if (value != undefined) {
    ids.push(value);
  }
  return ids;
}

onMounted(() => {
  if (props.lazy) {
    loadSelectedItems();
  }
  updateItems();
  updateItems = debounce(updateItems, 500);
});

watch(searchQuery, (newValue) => {
  if (!props.lazy) return;
  if (newValue == undefined) return;
  isLoading.value = true;
  updateItems();
});
watch(items, (newItems) => {
  const currentValueState = valueState.value;
  if (currentValueState == undefined || typeof currentValueState == "string")
    return;
  if (Array.isArray(currentValueState)) {
    currentValueState.forEach((value, index) => {
      if (typeof value != "object") return;
      const itemIndex = newItems.findIndex((el) => el.id == value.id);
      if (itemIndex != -1) {
        currentValueState[index] = newItems[index];
      }
    });
  } else if (typeof currentValueState == "object") {
    const index = newItems.findIndex((el) => el.id == currentValueState.id);
    if (index != -1) {
      valueState.value = newItems[index];
    }
  }
});
</script>
