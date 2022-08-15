import { CreateOrderInputEntry } from "./CreateOrderInputEntry";

export interface CreateOrderInput {
  customerId?: string;
  storeId: string;
  date: string;
  entries: Array<CreateOrderInputEntry>;
  note?: string;
}
