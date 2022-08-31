import Client from "@/repositories/common/AxiosClient";
import { NetworkChartData } from "@common/model/network/NetworkChartData";
import { GetAnalyticsInput } from "@common/model/network/GetAnalyticsInput";

const resource = "/analytics";

export async function getAnalyticsData(
  input: GetAnalyticsInput
): Promise<NetworkChartData> {
  const result = await Client.post<NetworkChartData>(`${resource}`, input);
  return result.data;
}
