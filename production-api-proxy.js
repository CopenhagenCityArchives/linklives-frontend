const HttpProxy = require("http-proxy");

const proxy = HttpProxy.createProxyServer({
  target: "https://data.link-lives.dk",
  changeOrigin: true,
});

proxy.listen(2492);
