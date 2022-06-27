import { clone } from "lodash";

export function isBlank(str: string | undefined) {
  return !str || /^\s*$/.test(str);
}
export function removeBlanks<T>(obj: T): Partial<T> {
  const acc: Partial<T> = {};
  for (const key in clone(obj)) {
    const value = obj[key];
    if (value === undefined) continue;
    if (typeof value == "string" && isBlank(value)) continue;
    acc[key] = value;
  }
  return acc;
}
