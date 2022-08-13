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

<script lang="ts">
import Vue, { PropType } from "vue";
import { TableItemEventType } from "@/plugins/table-builder/TableItemEventType";

type Action = {
  name: ItemAction;
  ico: string;
  event: string;
};
const ACTIONS: Action[] = [
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
export type ItemAction = "edit" | "delete";
export default Vue.extend({
  name: "ActionTable",
  props: {
    item: {
      type: Object as PropType<{
        actions: Partial<Record<ItemAction, { event: string }>>;
      }>,
    },
  },
  data() {
    return {
      actions: ACTIONS,
    };
  },

  methods: {
    clickAction(event: string): void {
      this.$emit("onClickAction", this.item, event);
    },
  },
  computed: {
    actionsToShow(): Action[] {
      return ACTIONS.filter((act) => {
        return this.item?.actions && this.item.actions[act.name];
      });
    },
  },
});
</script>

<style lang="scss" scoped></style>
