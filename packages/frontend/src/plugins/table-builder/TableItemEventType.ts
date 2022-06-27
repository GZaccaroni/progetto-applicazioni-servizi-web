export enum TableItemEventType {
  rowSelection = "rowSelection",
  rowClick = "rowClick",
  rowEditAction = "rowEditAction",
  rowDeleteAction = "rowDeleteAction",
}
export interface TableItemEvent<Item> {
  item: Item;
  type: TableItemEventType;
}
