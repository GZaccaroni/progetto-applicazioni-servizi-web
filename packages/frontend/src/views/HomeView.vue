<template>
  <hello-world />
</template>

<script lang="ts">
import HelloWorld from "../components/HelloWorld.vue";
import { defineComponent } from "@vue/composition-api";
import { findOrders } from "@/repositories/OrdersRepository";

export default defineComponent({
  name: "HomeView",
  components: {
    HelloWorld,
  },
  beforeMount() {
    findOrders({ limit: 10 })
      .then((el) => {
        console.log("Result");
        console.log(el);
      })
      .catch((error) => console.error(error));
  },
});
</script>
