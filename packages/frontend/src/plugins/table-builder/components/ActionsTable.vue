<template>
  <div>
    <v-icon
      v-for="(action, index) in actionsToShow"
      :key="index"
      @click="clickAction(action.event)"
      small
      class="mr-2"
      role="button"
      :aria-label="$t('components.ActionsTable.actions.' + action.name)"
    >
      {{ action.ico }}
    </v-icon>
  </div>
</template>

<script setup lang="ts">
import { computed, PropType } from "vue";
import { TableItemEventType } from "@/plugins/table-builder/TableItemEventType";

export type ItemAction = "edit" | "delete";
type Action = {
  name: ItemAction;
  ico: string;
  event: string;
};
const actions: Action[] = [
  {
    name: "edit",
    ico: "mdi-pencil",
    event: TableItemEventType.rowEditAction,
  },
  {
    name: "delete",
    ico: "mdi-delete",
    event: TableItemEventType.rowDeleteAction,
  },
];

const props = defineProps({
  item: {
    type: Object as PropType<{
      actions: Partial<Record<ItemAction, { event: string }>>;
    }>,
  },
});
const emit = defineEmits(["onClickAction"]);
function clickAction(event: string): void {
  emit("onClickAction", props.item, event);
}
const actionsToShow = computed(() => {
  return actions.filter((act) => {
    return props.item?.actions && props.item.actions[act.name];
  });
});
</script>

<style lang="scss" scoped></style>
