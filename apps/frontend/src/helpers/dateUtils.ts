export function toISODateString(date?: Date): string | undefined {
  return date?.toISOString()?.substring(0, 10);
}
