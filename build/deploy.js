const { spawn } = require("child_process");
const scp = spawn(
  "scp",
  [
    "-r",
    // 如果远程服务器防火墙为scp命令设置了指定的端口，我们需要使用 -P 参数来设置命令的端口号
    "-P",
    "29049",
    "dist/*",
    // 此处替换成自己的服务器ip和登录用户
    "root@45.78.12.135:/usr/local/webserver/nginx/html"
  ],
  // 如果不指定，子进程的信息无法输出到主进程中，无法弹出密码输入提示。
  { stdio: "inherit" }
);

scp.on("close", code => {
  if (!code) {
    process.stdout.write("恭喜你，部署成功！");
  }
});


// 二、使用FTP账号密码形式部署到OSS
var fs = require("vinyl-fs");
var ftp = require("vinyl-ftp");

var conn = new ftp({
  // 要连接的FTP的host
  host: "",
  // FTP的端口号
  port: "",
  // FTP的用户名
  user: "",
  // FTP的登录密码
  password: "",
  log: logstr
});

// conn.dest返回一个 stream对象，参数是要文件要上传到的目录
fs.src("./dist/**", { buffer: false }).pipe(
  conn.dest("/assets/minisite/demodeploy")
);

// 文件上传日志打印
function logstr(mode, address) {
  if (address) {
    console.log(mode, address);
  }
}