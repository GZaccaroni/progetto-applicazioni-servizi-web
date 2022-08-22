import { JSONSchemaType } from "ajv";
import { CreateUpdateProductInput } from "../../model/network/CreateUpdateProductInput";
import { ProductKindSchema } from "./ProductKind";
import { QuantityUnitOfMeasure } from "../../model/common/QuantityUnitOfMeasure";

export const CreateUpdateProductInputSchema: JSONSchemaType<CreateUpdateProductInput> =
  {
    required: ["kinds", "name", "unitOfMeasure"],
    type: "object",
    properties: {
      name: {
        maximum: 250,
        type: "string",
      },
      pricePerUnit: {
        exclusiveMinimum: 0,
        type: "number",
        nullable: true,
      },
      kinds: {
        type: "array",
        items: ProductKindSchema,
      },
      unitOfMeasure: {
        type: "string",
        enum: [QuantityUnitOfMeasure.Kilogram, QuantityUnitOfMeasure.Piece],
      },
    },
  };
