<template>
  <Bar
    :chart-options="chartOptions"
    :chart-data="chartData"
    dataset-id-key="label"
    :height="height"
  />
</template>
<script setup lang="ts">
import { Bar } from "vue-chartjs/legacy";
import {
  Chart as ChartJS,
  Title,
  Tooltip,
  Legend,
  BarElement,
  CategoryScale,
  LinearScale,
  ChartData,
} from "chart.js";
import { computed, PropType } from "vue";
import { NetworkChartData } from "@common/model/network/NetworkChartData";
import { stringToColor } from "@/helpers/utils";

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
    default: 100,
  },
  data: {
    type: Object as PropType<NetworkChartData>,
    required: true,
  },
});
const chartOptions = {
  maintainAspectRatio: false,
  responsive: true,
};
const chartData = computed<ChartData<"bar">>(() => {
  return {
    labels: [""],
    datasets: props.data.data.map((el) => {
      return {
        label: el.productName,
        backgroundColor: stringToColor(el.productName),
        data: [el.value],
      };
    }),
  };
});
</script>
