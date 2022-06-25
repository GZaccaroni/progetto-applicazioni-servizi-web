interface ChartDataItem {
  date: string;
  value: number;
  dataPerItem: Array<{
    itemName: string;
    value: number;
  }>;
}

export interface DbChartData {
  data: Array<ChartDataItem>;
}
