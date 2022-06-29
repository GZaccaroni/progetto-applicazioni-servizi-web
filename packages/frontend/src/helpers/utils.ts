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
      default:
        acc[key] = value;
    }
  }
  return acc;
}
