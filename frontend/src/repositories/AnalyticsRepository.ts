import Client from "@/repositories/common/AxiosClient";
import { DbChartData, DbChartDataType } from "@/model/DbChartData";
import { DbItemKindIdentifier } from "@/model/DbItem";

const resource = "/analytics";

export interface AnalyticsDataInput {
  dataType: DbChartDataType;
  fromDate?: Date;
  toDate?: Date;
  items?: DbItemKindIdentifier[];
  customerId?: string;
}
export async function getAnalyticsData(
  input: AnalyticsDataInput
): Promise<DbChartData> {
  const result = await Client.get<DbChartData>(`${resource}/find`, {
    params: input,
  });
  return result.data;
}
