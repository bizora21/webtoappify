@echo off
echo ===================================================
echo LIMPEZA GERAL - Matando todos os processos Node.js
echo ===================================================
taskkill /F /IM node.exe /T 2>nul
echo.
echo Todos os processos foram encerrados.
echo Agora voce pode iniciar o backend e o frontend limpos.
echo.
pause
