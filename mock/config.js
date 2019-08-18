// 使用公共的api模块。
const api = require("./api.js");
  const getUserInfo = require("./data/user.js");
  
  const config = [
    {
      method: "get",
      url: api.getUserInfo,
      data: getUserInfo
    }
  ];
  module.exports = config;