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
        maximum: 250,
        type: "string",
        transform: ["trim"],
      },
      authorizations: {
        type: "array",
        items: StoreAuthorizationSchema,
      },
    },
  };
