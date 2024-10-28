const { defineConfig } = require("@vue/cli-service");
const path = require("path");
module.exports = defineConfig({
  transpileDependencies: true,
  lintOnSave: false,
  productionSourceMap: true,
  // ...其他配置
  chainWebpack: (config) => {
    // 设置@别名
    config.resolve.alias.set("@", path.resolve(__dirname, "src"));
    
  },
});
