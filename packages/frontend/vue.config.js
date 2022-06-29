const { defineConfig } = require("@vue/cli-service");
module.exports = defineConfig({
  transpileDependencies: ["vuetify"],

  pluginOptions: {
    i18n: {
      locale: 'it',
      fallbackLocale: 'it',
      localeDir: 'locales',
      enableInSFC: false,
      enableBridge: false
    }
  }
});
