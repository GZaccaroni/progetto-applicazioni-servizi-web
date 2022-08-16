export interface DbChartDataItem {
  productName: string;
  value: number;
  productData: Array<{
    date: Date;
    value: number;
  }>;
}

export interface NetworkChartData {
  data: Array<DbChartDataItem>;
}
