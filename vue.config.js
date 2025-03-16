const { defineConfig } = require("@vue/cli-service");
const MonacoWebpackPlugin = require("monaco-editor-webpack-plugin");

module.exports = defineConfig({
    devServer: {
        historyApiFallback: true,
    },
    transpileDependencies: true,
    chainWebpack(config) {
        config.plugin("monaco").use(new MonacoWebpackPlugin());
    },
});
