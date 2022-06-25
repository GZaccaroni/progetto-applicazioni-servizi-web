<template>
  <hello-world />
</template>

<script lang="ts">
import Vue from "vue";
import HelloWorld from "../components/HelloWorld.vue";
import { defineComponent } from "@vue/composition-api";

export default defineComponent({
  name: "HomeView",

  components: {
    HelloWorld,
  },
});
</script>
