const merge = require("webpack-merge");
const baseConf = require("./webpack.config.base");
const path = require("path");
const {
  configureBabelLoader,
  configureURLLoader,
  configureCSSLoader
} = require("./util");

// 本地开发服务器的配置
const devServer = {
        port:55556,
        open:true,
        compress:true,
        overlay:true,
        hot: true,
        proxy: {
          "/api": "http://localhost:8081"
        },
        contentBase: path.join(__dirname, "../dist")
};
module.exports = merge(baseConf, {
  mode: "development",
  cache: true,
  devtool: "eval-source-map",
  devServer,
  module: {
    rules: [
      configureCSSLoader(),
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: [
          // 在babel-loader之前添加thread-loader。
          { loader: "thread-loader" },
          {
            loader: "babel-loader",
            options: {
              cacheDirectory: true
            }
          }
          // ...省略其他配置
        ]
      },
      ...configureURLLoader()
    ]
  }
});