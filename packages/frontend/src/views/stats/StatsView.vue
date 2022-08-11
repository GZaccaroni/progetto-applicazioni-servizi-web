<template>
  <v-container class="my-1" fluid>
    <header-view :title="$t('views.stats.title').toString()" />
    <stats-chart />
  </v-container>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import HeaderView from "@/components/common/HeaderView.vue";
import StatsChart from "@/components/stats/StatsCharts.vue";

export default defineComponent({
  components: {
    StatsChart,
    HeaderView,
  },
  setup() {
    return {};
  },
});
</script>
