# NPM 服务器

启动完整 npm 服务器, (授权, 用户管理, 上传包, 开源服务器缓存)
`npm start`

启动本地 npm 服务器 (基于本地目录, 无权限, 不能上传)
`npm test`


## 关于更新远程 7.13 的方法  [最新]

1. 启用 vpn 拨号到远程
2. ssh 连接到 19 再连接到 13
3. 在远程设置 npm set registry http://10.8.0.6:6071/
4. local 端口设置为 6071
5. 启动本机的 start-both-server.bat
6. 在 13 上 npm 更新


## 关于更新远程 7.13 的方法 [过时]

1. 启用 vpn 拨号到远程
2. ssh 连接到 19 再连接到 13
3. 在远程设置 npm set registry http://10.8.0.6:6071/
4. sinopia 不设置任何权限
5. local 端口设置为 6071
6. npm-server 项目 index.js:224 行 out.host = '10.8.0.6'; out.port = 6070;
7. 启用两个命令行, 一个运行 npm test, 一个运行 npm start
8. 在 13 上 npm 更新


## 问题

* 客户端连接服务器出现部分包安装失败的情况, 此时删除服务器上 storage-packages/ 下对应的包目录, 然后重启服务器.