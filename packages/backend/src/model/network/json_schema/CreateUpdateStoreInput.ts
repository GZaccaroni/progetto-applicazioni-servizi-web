import { JSONSchemaType } from "ajv";
import { CreateUpdateStoreInput } from "../type/CreateUpdateStoreInput";
import { StoreAuthorizationSchema } from "./StoreAuthorization";

export const CreateUpdateStoreInputSchema: JSONSchemaType<CreateUpdateStoreInput> =
  {
    required: ["authorizations", "name"],
    type: "object",
    properties: {
      name: {
        maximum: 250,
        type: "string",
      },
      authorizations: {
        type: "array",
        items: StoreAuthorizationSchema,
      },
    },
  };
