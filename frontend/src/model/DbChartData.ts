export interface DbChartDataItem {
  date: string;
  value: number;
  dataPerItem: Array<{
    itemName: string;
    value: number;
  }>;
}
export enum DbChartDataType {
  Quantity = "quantity",
  Revenue = "price",
}

export interface DbChartData {
  data: Array<DbChartDataItem>;
}
