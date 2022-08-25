<template>
  <v-menu
    v-model="menuVisible"
    :close-on-content-click="false"
    transition="scale-transition"
    offset-y
    min-width="auto"
  >
    <template v-slot:activator="{ on, attrs }">
      <v-text-field
        v-model="formattedDate"
        :label="label"
        :prepend-icon="showIcon ? 'mdi-calendar' : undefined"
        readonly
        v-bind="attrs"
        v-on="on"
        :clearable="clearable"
        :aria-label="buttonAriaLabel"
      ></v-text-field>
    </template>
    <v-date-picker
      v-model="selectedDate"
      :min="minStrDate"
      :max="maxStrDate"
      @change="save"
    ></v-date-picker>
  </v-menu>
</template>
<script setup lang="ts">
import { computed, PropType, ref } from "vue";

const props = defineProps({
  value: {
    type: [Date, String] as PropType<Date | string>,
  },
  label: {
    type: String,
    required: true,
  },
  min: {
    type: String,
  },
  max: {
    type: String,
  },
  clearable: {
    type: Boolean,
    default: false,
  },
  showIcon: {
    type: Boolean,
    default: true,
  },
  buttonAriaLabel: {
    type: String,
  },
  returnObject: {
    type: Boolean,
    default: false,
  },
});
const emit = defineEmits(["input"]);

const menuVisible = ref(false);
function toDateString(date?: Date): string | undefined {
  return date?.toISOString()?.substring(0, 10);
}
const selectedDate = computed({
  get: () => {
    if (props["value"] instanceof Date) {
      return toDateString(props["value"]);
    } else {
      const splittedDateTime = props["value"]?.split("T");
      const date = splittedDateTime?.[0];
      const time = splittedDateTime?.[1];
      if (time != undefined) {
        emit("input", date);
      }
      return date;
    }
  },
  set: (value) => {
    if (value == undefined) {
      emit("input", undefined);
      return;
    }
    if (props.returnObject) {
      emit("input", new Date(value));
    } else {
      emit("input", value);
    }
  },
});
const formattedDate = computed({
  get: () => {
    return selectedDate.value != undefined
      ? new Date(selectedDate.value).toLocaleDateString()
      : undefined;
  },
  set: (newValue) => {
    selectedDate.value = newValue;
  },
});
const minStrDate = computed(() => {
  return props.min != undefined ? props.min : undefined;
});
const maxStrDate = computed(() => {
  return props.max != undefined ? props.max : undefined;
});
function save(date: string) {
  menuVisible.value = false;
  selectedDate.value = date;
}
</script>
