const { defineConfig } = require("@vue/cli-service");
const path = require("path");

module.exports = defineConfig({
  transpileDependencies: ["vuetify"],
  configureWebpack: {
    resolve: {
      alias: {
        "@common": path.resolve(__dirname, "../../packages/common/dist"),
      },
    },
    module: {
      rules: [
        {
          test: /\.tsx?$/,
          exclude: /node_modules/,
          use: {
            loader: "ts-loader",
            options: {
              projectReferences: true,
            },
          },
        },
      ],
    },
  },
  pluginOptions: {
    i18n: {
      locale: "it",
      fallbackLocale: "it",
      localeDir: "locales",
      enableInSFC: false,
      enableBridge: false,
    },
  },
  parallel: false,
});
