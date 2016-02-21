@echo off

echo.
echo.
echo.
echo !!!!!!!!!!     此脚本必须用 ctrl+c 来终止, 否则 npm install 无法工作         !!!!!!!!!!!
echo.
echo encoding GBK
echo.

set hostname=192.168.7.144


rem 如果没有初始化过则安装
rem call npm set registry https://registry.npmjs.org/ 
rem call npm install

rem echo 设置本地数据源
rem call npm set registry http://%hostname%:6070/

echo 启动本地数据源
start /B node index.js local
node index.js sinopia

echo.
rem echo 还原默认数据源
rem call npm set registry https://registry.npmjs.org/ 