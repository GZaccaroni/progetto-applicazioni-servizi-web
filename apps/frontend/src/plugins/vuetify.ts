import Vue from "vue";
import Vuetify from "vuetify/lib/framework";
import colors from "vuetify/lib/util/colors";
import { UserVuetifyPreset } from "vuetify";
import it from "vuetify/src/locale/it";

Vue.use(Vuetify);
const opts: Partial<UserVuetifyPreset> = {
  lang: {
    locales: { it },
    current: "it",
  },
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
