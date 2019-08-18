const VueLoaderPlugin = require('vue-loader/lib/plugin')
const path = require("path")
const StyleLintPlugin = require("stylelint-webpack-plugin");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const SpritesmithPlugin = require("webpack-spritesmith");
const { templateFunction } = require("./util");
const DebugPlugin = require("./DebugPlugin");
const HardSourceWebpackPlugin = require("hard-source-webpack-plugin");
module.exports = {
  mode:'none',
    entry: {
        app:  path.resolve(__dirname, "../src/app.js")
      },
      output: {
        filename: 'js/[name].js',
        path: path.resolve(__dirname, '../dist'),
        publicPath:''
      },
      
    resolve: {
      modules: ["../node_modules", "../src/assets/generated"]
    },
  module: {
    rules: [
      {
        test: /\.vue$/,
        exclude:/node_modules/,
        loader: 'vue-loader'
      },
      {
        test: /\.(js|vue)$/,
        exclude: /node_modules/,
        enforce: "pre",
        options: {
          formatter: require("eslint-friendly-formatter")
        },
        loader: "eslint-loader",
      }                                  
    ]
  },
  plugins: [
    new DebugPlugin({ enable: true }),
    new VueLoaderPlugin(),
    new HtmlWebpackPlugin({
        template: "./public/index.html",
        title: "项目模板"
      }),
      new StyleLintPlugin({
        files: ["src/**/*.{vue, css, scss, sass}","!src/assets/generated/"]
      }),
      new SpritesmithPlugin({
        src: {
          cwd: path.resolve(__dirname, "../src/assets/sprites"),
          glob: "*.png"
        },
        customTemplates: {
          function_based_template: templateFunction
        },
        target: {
          image: path.resolve(__dirname, "../src/assets/generated/sprite.png"),
          css: [
            [
              path.resolve(__dirname, "../src/assets/generated/sprite2.scss"),
              {
                format: "function_based_template"
              }
            ],
            path.resolve(__dirname, "../src/assets/generated/sprite.scss")
          ]
        },
        apiOptions: {
          cssImageRef: "~sprite.png"
        }
      }),
      new HardSourceWebpackPlugin()
  ]
}