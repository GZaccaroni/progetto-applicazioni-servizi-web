export enum TableItemEventType {
  rowSelection = "rowSelection",
  rowClick = "rowClick",
}
export interface TableItemEvent<Item> {
  item: Item;
  type: TableItemEventType;
}
