import Vue from "vue";
import Vuetify from "vuetify/lib/framework";
import colors from "vuetify/lib/util/colors";
import { UserVuetifyPreset } from "vuetify";

Vue.use(Vuetify);
const opts: Partial<UserVuetifyPreset> = {
  icons: {
    iconfont: "mdi",
  },
  theme: {
    themes: {
      light: {
        danger: colors.red,
      },
    },
  },
};
export default new Vuetify(opts);
