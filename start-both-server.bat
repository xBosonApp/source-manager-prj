@echo off

echo.
echo.
echo.
echo !!!!!!!!!! �˽ű������� ctrl+c ����ֹ, ���� npm install �޷����� !!!!!!!!!!!
echo.
echo encoding GBK
echo.

set hostname=192.168.7.144


:���û�г�ʼ������װ
:call npm set registry https://registry.npmjs.org/ 
:call npm install

:echo ���ñ�������Դ
:call npm set registry http://%hostname%:6070/

echo ������������Դ
node index.js both

echo.
:echo ��ԭĬ������Դ
:call npm set registry https://registry.npmjs.org/ 
