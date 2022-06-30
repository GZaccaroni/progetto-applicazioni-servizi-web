import { computed, WritableComputedRef } from "@vue/composition-api";

export function observableRef<T>(
  initialValue: T,
  onSet: (value: T) => void
): WritableComputedRef<T> {
  let currentValue: T = initialValue;
  return computed({
    get: () => {
      return currentValue;
    },
    set: (newValue) => {
      currentValue = newValue;
      setTimeout(() => {
        onSet(newValue);
      });
    },
  });
}
