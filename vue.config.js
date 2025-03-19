const { defineConfig } = require('@vue/cli-service')
const MonacoWebpackPlugin = require('monaco-editor-webpack-plugin')

module.exports = defineConfig({
  devServer: {
    historyApiFallback: true,
  },
  transpileDependencies: true,
  chainWebpack(config) {
    config.plugin('monaco').use(new MonacoWebpackPlugin())
    
    config.resolve.fallback = {
      "stream": "stream-browserify",
      "http": "stream-http", 
      "https": "https-browserify",
      "zlib": "browserify-zlib",
      "crypto": "crypto-browserify",
      "buffer": "buffer",
      "assert": "assert",
      "url": "url",
      "os": "os-browserify/browser",
      "path": "path-browserify",
      "fs": false
    }
  }
})
