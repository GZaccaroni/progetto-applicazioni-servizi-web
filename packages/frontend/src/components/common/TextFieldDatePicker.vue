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
    type: Date as PropType<Date>,
  },
  label: {
    type: String,
    required: true,
  },
  min: {
    type: Date as PropType<Date>,
  },
  max: {
    type: Date as PropType<Date>,
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
});
const emit = defineEmits(["input"]);

const menuVisible = ref(false);
function toDateString(date?: Date): string | undefined {
  return date?.toISOString()?.substring(0, 10);
}
const selectedDate = computed({
  get: () => {
    return toDateString(props["value"]);
  },
  set: (value) =>
    emit("input", value != undefined ? new Date(value) : undefined),
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
  return props.min != undefined ? toDateString(props.min) : undefined;
});
const maxStrDate = computed(() => {
  return props.max != undefined ? toDateString(props.max) : undefined;
});
function save(date: string) {
  menuVisible.value = false;
  selectedDate.value = date;
}
</script>
