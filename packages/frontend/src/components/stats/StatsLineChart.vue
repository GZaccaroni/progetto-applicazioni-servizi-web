<template>
  <Line
    :chart-options="chartOptions"
    :chart-data="chartData"
    dataset-id-key="label"
    :height="height"
  />
</template>
<script setup lang="ts">
import { Line } from "vue-chartjs/legacy";
import {
  Chart as ChartJS,
  Title,
  Tooltip,
  Legend,
  BarElement,
  CategoryScale,
  LinearScale,
  ChartDataset,
} from "chart.js";
import { computed, PropType } from "vue";
import { NetworkChartData } from "@common/model/network/NetworkChartData";
import { stringToColor } from "@/helpers/utils";
import { groupBy, sumBy } from "lodash";

ChartJS.register(
  Title,
  Tooltip,
  Legend,
  BarElement,
  CategoryScale,
  LinearScale
);
const props = defineProps({
  height: {
    type: Number,
    default: 400,
  },
  data: {
    type: Object as PropType<NetworkChartData>,
    required: true,
  },
  global: {
    type: Boolean,
  },
});
const chartOptions = {
  responsive: true,
};
const chartData = computed(() => {
  let datasets: ChartDataset[];
  if (props.global) {
    datasets = [getGlobalDataset()];
  } else {
    datasets = getAtomicDataset();
  }
  return {
    labels: getLabels(),
    datasets: datasets,
  };
});
function getLabels(): string[] {
  return props.data.data.flatMap((el) =>
    el.productData.map((el) => dateToString(el.date))
  );
}
function getAtomicDataset(): ChartDataset[] {
  return props.data.data.map((el) => {
    return {
      label: el.productName,
      backgroundColor: stringToColor(el.productName),
      data: el.productData.map((el) => el.value),
    };
  });
}
function getGlobalDataset(): ChartDataset {
  const datas = props.data.data.flatMap((entry) => entry.productData);
  const groupedData = groupBy(datas, "date");
  const values = Object.values(groupedData).map((data) => {
    return sumBy(data, "value");
  });
  return {
    label: "",
    backgroundColor: "#000000",
    data: values,
  };
}

function dateToString(date: string): string {
  return new Date(date).toLocaleDateString();
}
</script>
