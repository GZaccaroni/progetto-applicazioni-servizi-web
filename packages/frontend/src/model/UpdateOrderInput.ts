import { DbIdentifiable } from "@/model/db/DbIdentifiable";
import { CreateOrderInput } from "@/model/CreateOrderInput";

export type UpdateOrderInput = CreateOrderInput & DbIdentifiable;
