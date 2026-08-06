@echo off
chcp 65001 > nul
title Roque 50 años - Servidor Local y Red Wi-Fi

cd /d "%~dp0"

echo =======================================================
echo    ROQUE 50 AÑOS - Servidor Web para Pruebas en Red
echo =======================================================
echo.

set PUERTO=8080
set /p USER_PUERTO="Ingresa el puerto deseado [Presiona Enter para puerto %PUERTO%]: "
if not "%USER_PUERTO%"=="" set PUERTO=%USER_PUERTO%

echo.

set PID_ENCONTRADO=
for /f "tokens=5" %%a in ('netstat -aon 2^>nul ^| findstr /r /c:":%PUERTO% .*LISTENING"') do (
    set PID_ENCONTRADO=%%a
)

if not "%PID_ENCONTRADO%"=="" (
    echo [!] ATENCION: Ya existe un servidor activo escuchando en el puerto %PUERTO% - PID: %PID_ENCONTRADO%
    echo.
    set CERRAR_PREVIO=
    set /p CERRAR_PREVIO="¿Deseas cerrar el servidor anterior antes de iniciar uno nuevo? [S/n]: "
    if /i "%CERRAR_PREVIO%"=="n" (
        echo.
        echo [X] Operacion cancelada. El servidor anterior sigue activo en http://localhost:%PUERTO%
        echo.
        pause
        exit /b
    )
    
    echo.
    echo [*] Cerrando el servidor anterior - PID: %PID_ENCONTRADO%...
    taskkill /F /PID %PID_ENCONTRADO% >nul 2>&1
    echo [OK] Servidor anterior cerrado correctamente.
    echo.
)

echo   [PC Local]  : http://localhost:%PUERTO%

python -c "import socket; s=socket.socket(socket.AF_INET,socket.SOCK_DGRAM); s.connect(('8.8.8.8',80)); ip=s.getsockname()[0]; s.close(); print('  [Red Wi-Fi] : http://' + ip + ':%PUERTO%')" 2>nul
if errorlevel 1 (
    python -c "import socket; print('  [Red Wi-Fi] : http://' + socket.gethostbyname(socket.gethostname()) + ':%PUERTO%')" 2>nul
)

echo.
echo =======================================================
echo   Abre la dirección [Red Wi-Fi] desde tu celular o tablet
echo   conectado a la misma red Wi-Fi para probar la invitación.
echo =======================================================
echo.

start "" "http://localhost:%PUERTO%"

python -m http.server -b 0.0.0.0 %PUERTO%

pause
