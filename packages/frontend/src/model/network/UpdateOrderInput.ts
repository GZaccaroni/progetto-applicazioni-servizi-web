import { NetworkIdentifiable } from "@/model/network/NetworkIdentifiable";
import { CreateOrderInput } from "@/model/network/CreateOrderInput";

export type UpdateOrderInput = CreateOrderInput & NetworkIdentifiable;
