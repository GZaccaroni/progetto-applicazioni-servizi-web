import { JSONSchemaType } from "ajv";
import {
  CreateOrderInputEntry,
  GradeEnum,
} from "../type/CreateOrderInputEntry";

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
        enum: [GradeEnum.First, GradeEnum.Second, GradeEnum.Mixed],
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
