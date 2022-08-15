import { JSONSchemaType } from "ajv";
import { CreateOrderEntrySchema } from "./CreateOrderEntry";
import { CreateOrder } from "../type/CreateOrder";

export const CreateOrderSchema: JSONSchemaType<CreateOrder> = {
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
      items: CreateOrderEntrySchema,
    },
    note: {
      type: "string",
      nullable: true,
    },
  },
};
