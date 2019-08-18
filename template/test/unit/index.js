import Vue from "vue";
Vue.config.productionTip = false;
// 加载test/unit/specs目录中所有以.spec.js结尾的文件。
const testsContext = require.context("./specs", true, /\.spec$/);
testsContext.keys().forEach(testsContext);

// 加载除app.js外所有的源文件，这些文件将用作覆盖率测试
const srcContext = require.context("../../src", true, /^\.\/(?!app(\.js)?$)/);
srcContext.keys().forEach(srcContext);