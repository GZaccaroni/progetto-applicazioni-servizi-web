const isoDateFormat =
  /^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2}):(\d{2}(?:\.\d*)?)((-(\d{2}):(\d{2})|Z)?)$/;

function isIsoDateString(value: unknown): value is string {
  if (value == undefined) return false;
  if (typeof value != "string") return false;
  return isoDateFormat.test(value);
}

export function deserializeDates(body: Record<string, unknown>) {
  if (body === null || body === undefined || typeof body !== "object") return;
  for (const key of Object.keys(body)) {
    const value = body[key];
    if (value == undefined) continue;
    if (isIsoDateString(value)) {
      body[key] = new Date(value);
    } else if (typeof value === "object") deserializeDates(<any>value);
  }
}
