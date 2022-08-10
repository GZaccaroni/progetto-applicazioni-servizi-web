import Client from "@/repositories/common/AxiosClient";
import { DbChartData, DbChartDataType} from "@/model/db/DbChartData";
import { DbProductKindIdentifier } from "@/model/db/DbProduct";

const resource = "/analytics";

export interface AnalyticsDataInput {
  dataType: DbChartDataType;
  fromDate?: Date;
  toDate?: Date;
  items?: DbProductKindIdentifier[];
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
