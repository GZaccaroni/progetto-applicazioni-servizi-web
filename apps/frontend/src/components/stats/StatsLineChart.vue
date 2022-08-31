<template>
  <line-chart-generator
    :chart-options="chartOptions"
    :chart-data="chartData.data"
    dataset-id-key="label"
    :height="height"
  />
</template>
<script setup lang="ts">
import { Line as LineChartGenerator } from "vue-chartjs/legacy";
import {
  CategoryScale,
  Chart as ChartJS,
  ChartData,
  ChartDataset,
  ChartOptions,
  Legend,
  LinearScale,
  LineElement,
  PointElement,
  TimeScale,
  TimeUnit,
  Title,
  Tooltip,
} from "chart.js";
import "chartjs-adapter-date-fns";
import { it } from "date-fns/locale";
import {
  addDays,
  addMonths,
  addYears,
  compareAsc,
  differenceInDays,
  format,
  isSameDay,
  isSameMonth,
  isSameYear,
} from "date-fns";
import { computed, PropType } from "vue";
import { NetworkChartData } from "@common/model/network/NetworkChartData";
import { getMinMax, stringToColor } from "@/helpers/utils";
import { groupBy, sumBy } from "lodash";
import { ChartTimeDataPoint } from "@/helpers/types";

ChartJS.register(
  Title,
  Tooltip,
  Legend,
  LineElement,
  LinearScale,
  CategoryScale,
  PointElement,
  TimeScale
);
type ChartGenerationData = {
  data: ChartData<"line", ChartTimeDataPoint[]>;
  unit: TimeUnit;
};
const props = defineProps({
  height: {
    type: Number,
    default: 100,
  },
  data: {
    type: Object as PropType<NetworkChartData>,
    required: true,
  },
  global: {
    type: Boolean,
  },
});
const chartData = computed<ChartGenerationData>(() => {
  const timeUnit = inferTimeUnit(props.data);
  let datasets: ChartDataset<"line", ChartTimeDataPoint[]>[];
  if (props.global) {
    datasets = [getGlobalDataset()];
  } else {
    datasets = getAtomicDataset();
  }
  datasets = groupByTimeUnit(datasets, timeUnit);
  datasets = fillGapsWithZero(datasets, timeUnit);
  return {
    data: {
      datasets,
    },
    unit: timeUnit,
  };
});
const chartOptions = computed<ChartOptions<"line">>(() => ({
  maintainAspectRatio: false,
  responsive: true,
  scales: {
    x: {
      type: "time",
      time: {
        unit: chartData.value.unit,
        round: chartData.value.unit,
      },
      adapters: {
        date: {
          locale: it,
        },
      },
    },
  },
  plugins: {
    legend: {
      display: !props.global,
    },
  },
}));
function getAtomicDataset(): ChartDataset<"line", ChartTimeDataPoint[]>[] {
  return props.data.data.map((el) => {
    return {
      label: el.productName,
      backgroundColor: stringToColor(el.productName),
      data: el.productData.map((el) => {
        return {
          x: new Date(el.date),
          y: el.value,
        };
      }),
    };
  });
}
function getGlobalDataset(): ChartDataset<"line", ChartTimeDataPoint[]> {
  const datas = props.data.data.flatMap((entry) => entry.productData);
  const groupedData = groupBy(datas, "date");
  const values = Object.entries(groupedData).map(([date, data]) => {
    return {
      x: new Date(date),
      y: sumBy(data, "value"),
    };
  });
  return {
    label: "Andamento globale",
    backgroundColor: "#000000",
    data: values,
  };
}
function inferTimeUnit(chartData: NetworkChartData): TimeUnit {
  const fallbackValue: TimeUnit = "day";
  const dates = chartData.data
    .flatMap((el) => el.productData)
    .map((el) => new Date(el.date));
  if (dates.length == 0) return fallbackValue;
  const [minDate, maxDate] = getMinMax(dates)!;
  const days = differenceInDays(new Date(minDate), new Date(maxDate));
  if (days > 365 * 1.5) {
    return "year";
  } else if (days > 30 * 1.5) {
    return "month";
  } else {
    return "day";
  }
}
function groupByTimeUnit(
  chartDatasets: ChartDataset<"line", ChartTimeDataPoint[]>[],
  timeUnit: TimeUnit
): ChartDataset<"line", ChartTimeDataPoint[]>[] {
  let groupByFormat: string;
  switch (timeUnit) {
    case "year":
      groupByFormat = "yyyy";
      break;
    case "month":
      groupByFormat = "MM-yyyy";
      break;
    case "day":
      groupByFormat = "dd-MM-yyyy";
      break;
    default:
      throw "Unsupported timeUnit " + timeUnit;
  }
  const groupByClause = (point: ChartTimeDataPoint) =>
    format(new Date(point.x), groupByFormat);
  return chartDatasets.map((dataset) => {
    const groupedPoints = groupBy(dataset.data, groupByClause);
    dataset.data = Object.values(groupedPoints).map((pointsGroup) => {
      const firstItem = pointsGroup[0];
      return {
        x: firstItem.x,
        y: sumBy(pointsGroup, "y"),
      };
    });
    return dataset;
  });
}
function fillGapsWithZero(
  chartDatasets: ChartDataset<"line", ChartTimeDataPoint[]>[],
  timeUnit: TimeUnit
): ChartDataset<"line", ChartTimeDataPoint[]>[] {
  let dateComparison: (first: Date, second: Date) => boolean;
  let addFn: (date: Date, amount: number) => Date;
  switch (timeUnit) {
    case "year":
      dateComparison = isSameYear;
      addFn = addYears;
      break;
    case "month":
      dateComparison = isSameMonth;
      addFn = addMonths;
      break;
    case "day":
      dateComparison = isSameDay;
      addFn = addDays;
      break;
    default:
      throw "Unsupported timeUnit " + timeUnit;
  }
  const dates = chartDatasets
    .flatMap((dataset) => dataset.data)
    .map((item) => item.x);
  if (dates.length == 0) return chartDatasets;
  const [minDate, maxDate] = getMinMax(dates)!;
  return chartDatasets.map((dataset) => {
    let currentIterationDate: Date | undefined = undefined;
    do {
      const date: Date =
        currentIterationDate == undefined
          ? minDate
          : addFn(currentIterationDate, 1);
      const containsDate = dataset.data.some((el) =>
        dateComparison(date, el.x)
      );
      if (!containsDate) {
        dataset.data.push({ x: date, y: 0 });
      }
      currentIterationDate = date;
    } while (!dateComparison(currentIterationDate, maxDate));
    dataset.data.sort((a, b) => compareAsc(a.x, b.x));
    return dataset;
  });
}
</script>
