export interface DbChartDataItem {
  productName: string;
  value: number;
  productData: Array<{
    date: string;
    value: number;
  }>;
}

export interface NetworkChartData {
  data: Array<DbChartDataItem>;
}
