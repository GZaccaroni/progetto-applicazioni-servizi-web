import { JSONSchemaType } from "ajv";
import { CreateUpdateStoreInput } from "../../model/network/CreateUpdateStoreInput";
import { StoreAuthorizationSchema } from "./StoreAuthorization";

export const CreateUpdateStoreInputSchema: JSONSchemaType<CreateUpdateStoreInput> =
  {
    required: ["authorizations", "name"],
    additionalProperties: false,
    type: "object",
    properties: {
      name: {
        type: "string",
        maxLength: 250,
        transform: ["trim"],
      },
      authorizations: {
        type: "array",
        uniqueItemProperties: ["userId"],
        items: StoreAuthorizationSchema,
      },
    },
  };
