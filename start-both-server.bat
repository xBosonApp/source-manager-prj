@echo off

echo.
echo.
echo.
echo !!!!!!!!!! 此脚本必须用 ctrl+c 来终止, 否则 npm install 无法工作 !!!!!!!!!!!
echo.
echo encoding GBK
echo.

set hostname=192.168.7.144


:如果没有初始化过则安装
:call npm set registry https://registry.npmjs.org/ 
:call npm install

:echo 设置本地数据源
:call npm set registry http://%hostname%:6070/

echo 启动本地数据源
node index.js both

echo.
:echo 还原默认数据源
:call npm set registry https://registry.npmjs.org/ 
