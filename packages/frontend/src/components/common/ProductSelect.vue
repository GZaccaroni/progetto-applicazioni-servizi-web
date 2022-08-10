<template>
  <async-select
    v-model="valueState"
    :label="$t('word.user').toString()"
    :find-items-fn="findProductKindsSelectFn"
    :multiple="multiple"
  />
</template>
<script lang="ts">
import { computed, defineComponent, PropType } from "vue";
import { getSelectProductKinds } from "@/helpers/asyncSelectUtils";
import AsyncSelect from "@/components/common/AsyncSelect.vue";

export interface ProductKind {
  productId: string;
  variantId?: string;
}

export default defineComponent({
  components: { AsyncSelect },
  props: {
    value: {
      type: [Array, String] as PropType<ProductKind | ProductKind[]>,
    },
    multiple: {
      type: Boolean,
      default: false,
    },
  },
  setup(props, context) {
    const valueState = computed<string | string[] | undefined>({
      get: () => {
        if (Array.isArray(props.value)) {
          return props.value.map(
            (el) => `${el.productId}_${el.variantId ?? ""}`
          );
        } else if (typeof props.value == "object") {
          return `${props.value.productId}_${props.value.variantId ?? ""}`;
        } else {
          return undefined;
        }
      },
      set: (value) => {
        if (Array.isArray(value)) {
          context.emit(
            `input`,
            value.map((el) => {
              const split = el.split("_");
              return {
                productId: split[0],
                variantId: split[1],
              };
            })
          );
        } else if (value != undefined) {
          const split = value.split("_");
          context.emit(`input`, {
            ...props.value,
            productId: split[0],
            variantId: split[1],
          });
        }
      },
    });
    const findProductKindsSelectFn = getSelectProductKinds;

    return {
      valueState,
      findProductKindsSelectFn,
    };
  },
});
</script>
