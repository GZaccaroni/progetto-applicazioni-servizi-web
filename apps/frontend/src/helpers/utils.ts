import { compareAsc } from "date-fns";

export function isBlank(str: string | undefined) {
  return !str || /^\s*$/.test(str);
}
export function removeBlanks<T>(obj: T): Partial<T> {
  const acc: Partial<T> = {};
  for (const key in obj) {
    const value = obj[key];
    if (value === undefined) continue;
    switch (typeof value) {
      case "string":
        if (isBlank(value)) continue;
        break;
      case "number":
        if (Number.isNaN(value)) continue;
        break;
    }
    acc[key] = value;
  }
  return acc;
}
export function stringToColor(str: string) {
  let i;
  let hash = 0;
  for (i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash);
  }
  let colour = "#";
  for (i = 0; i < 3; i++) {
    const value = (hash >> (i * 8)) & 0xff;
    colour += ("00" + value.toString(16)).substr(-2);
  }
  return colour;
}
export function getMinMax(array: Date[]): [Date, Date] | undefined {
  if (array.length == 0) {
    return undefined;
  }
  let minV = array[0];
  let maxV = array[0];
  for (const item of array) {
    if (compareAsc(item, minV) == -1) minV = item;
    if (compareAsc(item, maxV) == 1) maxV = item;
  }
  return [minV, maxV];
}
