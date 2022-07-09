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
<script lang="ts">
import { computed, defineComponent, PropType, ref } from "@vue/composition-api";

export default defineComponent({
  props: {
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
  },
  setup(props, { emit }) {
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
    return {
      menuVisible,
      minStrDate,
      maxStrDate,
      formattedDate,
      selectedDate,
    };
  },
  methods: {
    save(date: string) {
      this.menuVisible = false;
      this.selectedDate = date;
    },
  },
});
</script>
