<template>
  <div>
    <v-icon
      v-for="(action, index) in actionsToShow"
      :key="index"
      @click="clickAction(action.event)"
      small
      class="mr-2"
    >
      {{ action.ico }}
    </v-icon>
  </div>
</template>

<script lang="ts">
import Vue, { PropType } from "vue";

type Action = {
  name: string;
  ico: string;
  event: string;
};
const ACTIONS: Action[] = [
  {
    name: "list_parents",
    ico: "mdi-format-list-bulleted",
    event: "onActionListParents",
  },
  {
    name: "edit",
    ico: "mdi-pencil",
    event: "onActionEdit",
  },
  {
    name: "remove",
    ico: "mdi-close",
    event: "onActionRemove",
  },
  {
    name: "delete",
    ico: "mdi-delete",
    event: "onActionDelete",
  },
];
type ItemAction = "list_parents" | "remove" | "edit" | "delete";
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
      return ACTIONS.filter(
        (act) => this.item.actions && this.item.actions[act.name]
      );
    },
  },
});
</script>

<style lang="scss" scoped></style>
