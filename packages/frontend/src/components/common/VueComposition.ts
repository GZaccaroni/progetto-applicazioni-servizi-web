import { Ref, ref, UnwrapRef, watch } from "@vue/composition-api";

export function observableRef<T>(
  initialValue: T,
  onSet: (value: T) => void
): Ref<UnwrapRef<T>> {
  const valueRef = ref(initialValue);
  watch(valueRef, (newValue) => {
    onSet(newValue as T);
  });
  return valueRef;
}
