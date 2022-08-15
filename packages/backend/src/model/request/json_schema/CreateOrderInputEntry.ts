import { JSONSchemaType } from "ajv";
import { CreateOrderInputEntry } from "../type/CreateOrderInputEntry";

export const CreateOrderInputEntrySchema: JSONSchemaType<CreateOrderInputEntry> =
  {
    required: ["pricePerUnit", "productId", "quantity"],
    type: "object",
    properties: {
      productId: {
        type: "string",
      },
      variantId: {
        type: "string",
        nullable: true,
      },
      grade: {
        type: "string",
        enum: ["first", "second", "mixed"],
        nullable: true,
      },
      quantity: {
        exclusiveMinimum: 0,
        type: "number",
      },
      pricePerUnit: {
        minimum: 0,
        type: "number",
      },
    },
  };
