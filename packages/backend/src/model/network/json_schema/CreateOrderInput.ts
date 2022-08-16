import { JSONSchemaType } from "ajv";
import { CreateOrderInputEntrySchema } from "./CreateOrderInputEntry";
import { CreateOrderInput } from "../type/CreateOrderInput";

export const CreateOrderInputSchema: JSONSchemaType<CreateOrderInput> = {
  required: ["date", "entries", "storeId"],
  type: "object",
  properties: {
    customerId: {
      type: "string",
      nullable: true,
    },
    storeId: {
      type: "string",
    },
    date: {
      type: "string",
      format: "date-time",
    },
    entries: {
      type: "array",
      minItems: 1,
      items: CreateOrderInputEntrySchema,
    },
    note: {
      type: "string",
      nullable: true,
    },
  },
};
