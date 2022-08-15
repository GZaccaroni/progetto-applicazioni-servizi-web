import Ajv, {JSONSchemaType} from "ajv";
import addFormats from "ajv-formats";
export const ajv=new Ajv();
addFormats(ajv)

export function validateRequest<T>(schema: JSONSchemaType<T>, data: unknown): data is T {
  if(ajv.validate(schema, data)) {
    return true;
  } else {
    console.warn("Validation failed", ajv.errorsText());
    return false;
  }
}