@echo off

echo.
echo.
echo.
echo !!!!!!!!!!     �˽ű������� ctrl+c ����ֹ, ���� npm install �޷�����         !!!!!!!!!!!
echo.
echo encoding GBK
echo.

set hostname=192.168.7.144


rem ���û�г�ʼ������װ
rem call npm set registry https://registry.npmjs.org/ 
rem call npm install

rem echo ���ñ�������Դ
rem call npm set registry http://%hostname%:6070/

echo ������������Դ
start /B node index.js local
node index.js sinopia

echo.
rem echo ��ԭĬ������Դ
rem call npm set registry https://registry.npmjs.org/ 