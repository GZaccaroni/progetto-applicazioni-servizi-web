import { JSONSchemaType } from "ajv";
import {CreateOrderInputEntry} from "../../model/network/CreateUpdateOrderInput";
import {ProductGrade} from "../../model/common/ProductGrade";

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
        enum: [ProductGrade.First, ProductGrade.Second, ProductGrade.Mixed],
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
