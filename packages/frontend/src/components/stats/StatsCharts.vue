<template>
  <div style="width: 100%">
    <stats-filter @change="updateChartData" />
    <v-container fluid class="pa-8">
      <p v-if="totalValue !== undefined">
        {{
          $i18n.t(`views.stats.totalSales.${filterInput.dataType}`, {
            total: totalValue,
          })
        }}
      </p>
      <h2 class="mt-12 mb-4">
        {{ $i18n.t("views.stats.trendChartTitle") }}
      </h2>
      <stats-line-chart
        v-if="chartData !== undefined"
        :data="chartData"
        :global="true"
        height="400"
      />
      <h2 class="mt-12 mb-4">
        {{ $i18n.t(`views.stats.chartByProductTitle.${filterInput.dataType}`) }}
      </h2>
      <stats-line-chart
        v-if="chartData !== undefined"
        :data="chartData"
        :global="false"
        height="400"
      />
      <h2 class="mt-12 mb-4">
        {{ $i18n.t(`views.stats.chartByPeriodTitle.${filterInput.dataType}`) }}
      </h2>
      <stats-bar-chart
        v-if="chartData !== undefined"
        :data="chartData"
        height="400"
      />
    </v-container>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from "vue";
import StatsFilter from "@/components/stats/StatsFilter.vue";
import StatsBarChart from "@/components/stats/StatsBarChart.vue";
import StatsLineChart from "@/components/stats/StatsLineChart.vue";
import { NetworkChartData } from "@common/model/network/NetworkChartData";
import { sumBy } from "lodash";
import { getAnalyticsData } from "@/repositories/AnalyticsRepository";
import { repositoryErrorHandler } from "@/helpers/errorHandler";
import { ChartDataType } from "@common/model/common/ChartDataType";
import { GetAnalyticsInput } from "@common/model/network/GetAnalyticsInput";

const chartData = ref<NetworkChartData | undefined>(undefined);
const filterInput = ref<GetAnalyticsInput>({
  dataType: ChartDataType.Quantity,
});
const totalValue = computed(() => {
  if (chartData.value == undefined) return undefined;
  return sumBy(chartData.value.data, "value");
});
async function updateChartData(input: GetAnalyticsInput) {
  try {
    filterInput.value = input;
    chartData.value = await getAnalyticsData(input);
  } catch (e) {
    await repositoryErrorHandler(e);
  }
}
onMounted(() => {
  updateChartData(filterInput.value);
});
</script>
