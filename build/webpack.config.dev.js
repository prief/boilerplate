const merge = require("webpack-merge");
const baseConf = require("./webpack.config.base");
const path = require("path");
const {
  configureURLLoader
} = require("./util");

// 本地开发服务器的配置
const devServer = {
        port:55556,
        open:true,
        compress:true,
        overlay:true,
        hot: true,
        clientLogLevel: "warning",
        proxy: {
          "/api": "http://localhost:8081"
        },
        contentBase: path.join(__dirname, "../dist")
};
module.exports = merge(baseConf, {
  mode: "development",
  devServer,
  module: {
    rules: [
      {
        test: /\.scss$/,
        exclude: /node_modules/,
        use: ["style-loader", "css-loader", "postcss-loader", "sass-loader"]
      },
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