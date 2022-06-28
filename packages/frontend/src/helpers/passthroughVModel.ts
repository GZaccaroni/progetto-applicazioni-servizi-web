import { computed, SetupContext } from "@vue/composition-api";

export function passthroughVModel<T>(
  props: T,
  context: SetupContext,
  name: keyof T & string
) {
  return computed({
    get: () => props[name],
    set: (value) => context.emit(`input`, value),
  });
}
