import Vue from "vue";
import { createPinia, PiniaVuePlugin } from "pinia";
import piniaPluginPersistedstate from "pinia-plugin-persistedstate";

Vue.use(PiniaVuePlugin);

const pinia = createPinia();
pinia.use(piniaPluginPersistedstate);

console.log("Called pinia setup");

export default pinia;
