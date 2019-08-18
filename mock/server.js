const express = require("express");
const bodyParser = require("body-parser");
const multipart = require("connect-multiparty");
const config = require("./config");
const multipartMiddleware = multipart();
const app = express();

const Mock = require("mockjs");
const mock = (data, params) => {
  if (Object.prototype.toString.call(data) === "[object Object]") {
    return Mock.mock(data);
  } else if (typeof data === "function") {
    return Mock.mock(data(params));
  } else {
    return "error: data shold be an object or a function.";
  }
};

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.all("*", (req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "X-Requested-With,Content-Type");
  res.header("Access-Control-Allow-Methods", "PUT,POST,GET,DELETE,OPTIONS");
  res.header("X-Powered-By", "mock");
  res.header("Content-Type", "application/json;charset=utf-8");
  next();
});

// 绑定路由信息
config.forEach(({ method, url, data }) => {
    if (method === "get") {
      app.get(url, (req, res) => {
        res.json(mock(data, req.query));
      });
    } else if (method === "post") {
      app.post(url, multipartMiddleware, (req, res) => {
        res.json(mock(data, req.body));
      });
    } else if (method === "jsonp") {
      app.get(url, (req, res) => {
        const query = req.query;
  
        const mockData = JSON.stringify(mock(data, req.query));
  
        const callback =
          "typeof " +
          query.callback +
          ' === "function" && ' +
          query.callback +
          "(" +
          mockData +
          ")";
  
        res.send(callback);
      });
    }
  });


// 支持自定义端口
let port = 8081;
process.argv.forEach((arg, index, arr) => {
  if (arg === "--port") {
    port = arr[index + 1] || 8081;
    return false;
  }
});

module.exports = app.listen(port, () => {
  console.log("Mock Server listening on http://localhost:" + port);
});