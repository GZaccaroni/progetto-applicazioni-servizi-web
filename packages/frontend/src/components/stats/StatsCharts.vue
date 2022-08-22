<template>
  <div style="width: 100%">
    <stats-filter @change="updateChartData" />
    <p v-if="totalValue !== undefined">{{ totalValue }}</p>
    <stats-line-chart
      v-if="chartData !== undefined"
      :data="chartData"
      :global="true"
    />
    <stats-line-chart
      v-if="chartData !== undefined"
      :data="chartData"
      :global="false"
    />
    <stats-bar-chart v-if="chartData !== undefined" :data="chartData" />
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from "vue";
import StatsFilter from "@/components/stats/StatsFilter.vue";
import StatsBarChart from "@/components/stats/StatsBarChart.vue";
import StatsLineChart from "@/components/stats/StatsLineChart.vue";
import { NetworkChartData } from "@common/model/network/NetworkChartData";
import { sumBy } from "lodash";
import {
  AnalyticsDataInput,
  getAnalyticsData,
} from "@/repositories/AnalyticsRepository";
import { repositoryErrorHandler } from "@/helpers/errorHandler";
import { ChartDataType } from "@common/model/common/ChartDataType";

const chartData = ref<NetworkChartData | undefined>(undefined);
const totalValue = computed(() => {
  if (chartData.value == undefined) return undefined;
  return sumBy(chartData.value.data, "value");
});
function updateChartData(input: AnalyticsDataInput) {
  getAnalyticsData(input).catch(repositoryErrorHandler);
}
onMounted(() => {
  updateChartData({ dataType: ChartDataType.quantity });
});
</script>
