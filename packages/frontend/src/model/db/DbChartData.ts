export interface DbChartDataItem {
  productName: string;
  value: number;
  productData: Array<{
    date: Date;
    value: number;
  }>;
}
export enum DbChartDataType {
  quantity = "quantity",
  price = "price",
}

export interface DbChartData {
  data: Array<DbChartDataItem>;
}
