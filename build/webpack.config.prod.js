const merge = require("webpack-merge");
const baseConf = require("./webpack.config.base");
const webpack = require("webpack");
const TerserPlugin = require("terser-webpack-plugin");
const ExtractTextPlugin = require("extract-text-webpack-plugin");
const {CleanWebpackPlugin} = require('clean-webpack-plugin')
const OptimizeCSSPlugin = require("optimize-css-assets-webpack-plugin");
const ModernBuildPlugin = require("./modernBuildPlugin");
const {
  configureBabelLoader,
  configureURLLoader,
  configureCSSLoader
} = require("./util");

module.exports = function(
  options = {
    env: "test",
    buildMode: "common",
    browserslist: ""
  }
) {
  let { env, buildMode, browserslist } = options;
  let filename = "js/[name].js";
  env = env === "prod" ? env : "test";
  if (buildMode !== "legacy" && buildMode !== "modern") {
    buildMode = "common";
  }
  if (!Array.isArray(browserslist)) {
    browserslist = null;
  }
  let plugins = [new TerserPlugin({
    exclude: /node_modules/
  }),new OptimizeCSSPlugin({
    assetNameRegExp: /\.optimize\.css$/g
  }),new webpack.HashedModuleIdsPlugin()];

  let modern = buildMode === "common" ? false : true;
  let postfix = buildMode === "common" ? "" : `-${buildMode}`;
  let rules = [
    configureCSSLoader(env),
    configureBabelLoader(modern, browserslist),
    ...configureURLLoader(env)
  ];
  if (env === "prod") {
    filename = `js/[name]${postfix}.[chunkhash:8].js`;
    plugins.push(new ExtractTextPlugin("css/[name].[hash:8].css"));
  } else {
    filename = `js/[name]${postfix}.js`;
    plugins.push(new ExtractTextPlugin("css/[name].css"));
  }

  // 构建模式是modern时
  if (buildMode === "modern") {
    plugins.push(
      new ModernBuildPlugin({ modern: true }),
      new CleanWebpackPlugin({
        cleanOnceBeforeBuildPatterns: ["**/*", "!js", "!js/*"]
      })
    );
  }

  // 构建模式是legacy时
  if (buildMode === "legacy") {
    plugins.push(
      new ModernBuildPlugin({ modern: false }),
      new CleanWebpackPlugin()
    );
  }

  // 构建模式是普通构建
  if (buildMode === "common") {
    plugins.push(new CleanWebpackPlugin());
  }

  // 生产环境特定配置
  const prodConf = {
    mode:"production",
    output: {
      filename
    },
    module: { rules },
    plugins,
    optimization: {
        splitChunks: {
            chunks: 'async', //表示哪些代码需要优化initial | async | all
  minSize: 30000, //被拆出来的包压缩前最小体积
  minChunks: 1, // 被引用多少次就可以拆分
  maxAsyncRequests: 5, //按需加载时最大并发
  maxInitialRequests: 3, //入口文件最大并发
  automaticNameDelimiter: '~', // 新拆分的命名连接符
  name: true, //拆分出来的块名称，默认由名字和hash组成
          cacheGroups: { //缓存组对象，凡符合的都被打包到缓存组key命名的包里
            vendors: {
              test: /[\\/]node_modules[\\/]/,
              name: "vendors",
              chunks: "all", //推荐用all防止异步重复同步的请求
              reuseExistingChunk: true
            }
          }
        },
        runtimeChunk: "single" //webpack运行时代码抽离到独立的runtime.js
      }
  };

  return merge(baseConf, prodConf);
};