import { JSONSchemaType } from "ajv";
import { CreateUpdateProductInput } from "../../model/network/CreateUpdateProductInput";
import { ProductKindSchema } from "./ProductKind";
import { QuantityUnitOfMeasure } from "../../model/common/QuantityUnitOfMeasure";

export const CreateUpdateProductInputSchema: JSONSchemaType<CreateUpdateProductInput> =
  {
    required: ["kinds", "name", "unitOfMeasure"],
    type: "object",
    additionalProperties: false,
    properties: {
      name: {
        minLength: 1,
        maxLength: 250,
        type: "string",
        transform: ["trim"],
      },
      pricePerUnit: {
        exclusiveMinimum: 0,
        type: "number",
        nullable: true,
      },
      kinds: {
        type: "array",
        uniqueItemProperties: ["name"],
        items: ProductKindSchema,
      },
      unitOfMeasure: {
        type: "string",
        enum: [QuantityUnitOfMeasure.Kilogram, QuantityUnitOfMeasure.Piece],
      },
    },
  };
