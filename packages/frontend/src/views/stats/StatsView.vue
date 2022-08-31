<template>
  <v-container class="my-1" fluid>
    <header-view :title="$t('views.stats.title').toString()" />
    <v-card>
      <stats-chart />
    </v-card>
  </v-container>
</template>

<script setup lang="ts">
import HeaderView from "@/components/common/HeaderView.vue";
import StatsChart from "@/components/stats/StatsCharts.vue";
</script>
