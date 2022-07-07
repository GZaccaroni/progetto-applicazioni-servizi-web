import {
  computed,
  SetupContext,
  WritableComputedRef,
} from "@vue/composition-api";
import { Mapper } from "@/helpers/types";

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
export function mappedVModel<
  PropsType,
  KeyType extends keyof PropsType & string,
  MappedType
>(
  props: PropsType,
  context: SetupContext,
  name: KeyType,
  mapper: Mapper<MappedType, PropsType[KeyType]>
): WritableComputedRef<MappedType> {
  return computed({
    get: () => mapper.to(props[name]),
    set: (value) => context.emit(`input`, mapper.from(value)),
  });
}
