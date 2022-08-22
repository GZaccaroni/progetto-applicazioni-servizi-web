import Client from "@/repositories/common/AxiosClient";
import { NetworkChartData } from "@common/model/network/NetworkChartData";
import { NetworkProductKindIdentifier } from "@common/model/network/NetworkProduct";
import { ChartDataType } from "@common/model/common/ChartDataType";

const resource = "/analytics";

export interface AnalyticsDataInput {
  storeId?: string;
  dataType: ChartDataType;
  fromDate?: Date;
  toDate?: Date;
  items?: NetworkProductKindIdentifier[];
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
