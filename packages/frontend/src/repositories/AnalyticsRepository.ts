import Client from "@/repositories/common/AxiosClient";
import { NetworkChartData } from "@/model/network/NetworkChartData";
import { DbProductKindIdentifier } from "@/model/network/NetworkProduct";
import { ChartDataType } from "@/model/common/ChartDataType";

const resource = "/analytics";

export interface AnalyticsDataInput {
  storeId?: string;
  dataType: ChartDataType;
  fromDate?: Date;
  toDate?: Date;
  items?: DbProductKindIdentifier[];
  customerId?: string;
}
export async function getAnalyticsData(
  input: AnalyticsDataInput
): Promise<NetworkChartData> {
  const result = await Client.get<NetworkChartData>(`${resource}/find`, {
    params: input,
  });
  return result.data;
}
