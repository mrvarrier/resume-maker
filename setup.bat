@echo off
setlocal enabledelayedexpansion

REM ATS Resume Builder - Setup Script for Windows
REM This script will check prerequisites and install dependencies

echo.
echo ================================================
echo    ATS Resume Builder - Setup Script
echo ================================================
echo.

REM Check for Node.js
echo [INFO] Checking for Node.js...
where node >nul 2>nul
if %errorlevel% neq 0 (
    echo [ERROR] Node.js is not installed
    echo [INFO] Please install Node.js version 18 or higher
    echo [INFO] Download from: https://nodejs.org/
    echo.
    echo Press any key to exit...
    pause >nul
    exit /b 1
)

REM Get Node.js version
for /f "tokens=*" %%i in ('node -v') do set NODE_VERSION=%%i
echo [OK] Node.js found: %NODE_VERSION%

REM Extract major version number
for /f "tokens=1,2 delims=v." %%a in ("%NODE_VERSION%") do set MAJOR_VERSION=%%b

REM Check Node.js version (must be 18 or higher)
if %MAJOR_VERSION% lss 18 (
    echo [ERROR] Node.js version %NODE_VERSION% is below required version v18.0.0
    echo [INFO] Please update Node.js to version 18 or higher
    echo [INFO] Download from: https://nodejs.org/
    echo.
    echo Press any key to exit...
    pause >nul
    exit /b 1
) else (
    echo [OK] Node.js version meets requirements ^(^>=18.0.0^)
)

REM Check for npm
echo [INFO] Checking for npm...
where npm >nul 2>nul
if %errorlevel% neq 0 (
    echo [ERROR] npm is not installed
    echo [INFO] npm usually comes with Node.js. Please reinstall Node.js
    echo.
    echo Press any key to exit...
    pause >nul
    exit /b 1
)

REM Get npm version
for /f "tokens=*" %%i in ('npm -v') do set NPM_VERSION=%%i
echo [OK] npm found: v%NPM_VERSION%

REM Extract major version number for npm
for /f "tokens=1 delims=." %%a in ("%NPM_VERSION%") do set NPM_MAJOR=%%a

REM Check npm version (recommend 8 or higher)
if %NPM_MAJOR% lss 8 (
    echo [WARNING] npm version %NPM_VERSION% is below recommended version 8.0.0
    echo [INFO] Consider updating npm: npm install -g npm@latest
) else (
    echo [OK] npm version meets requirements ^(^>=8.0.0^)
)

REM Check if package.json exists
if not exist "package.json" (
    echo [ERROR] package.json not found. Are you in the project root directory?
    echo.
    echo Press any key to exit...
    pause >nul
    exit /b 1
)

REM Install dependencies
echo.
echo [INFO] Installing project dependencies...
echo.

call npm install
if %errorlevel% neq 0 (
    echo.
    echo [ERROR] Failed to install dependencies
    echo [INFO] Please check the error messages above and try again
    echo.
    echo Press any key to exit...
    pause >nul
    exit /b 1
)

echo.
echo [OK] Dependencies installed successfully!

REM Run initial build to verify setup
echo.
echo [INFO] Running initial build to verify setup...
echo.

call npm run build
if %errorlevel% neq 0 (
    echo.
    echo [WARNING] Build failed, but this might be okay for initial setup
    echo [INFO] You can try running 'npm run dev' to start the development server
) else (
    echo.
    echo [OK] Build completed successfully!
)

REM Create .nvmrc if it doesn't exist
if not exist ".nvmrc" (
    echo 18 > .nvmrc
    echo [OK] Created .nvmrc file for Node version management
)

REM Success message
echo.
echo ================================================
echo    Setup Complete!
echo ================================================
echo.
echo [OK] ATS Resume Builder is ready to use!
echo.
echo To start the development server, run:
echo.
echo     npm run dev
echo.
echo The application will be available at:
echo     http://localhost:3002
echo.
echo Other available commands:
echo     - npm run build      : Build for production
echo     - npm run start      : Start production server
echo     - npm run lint       : Run linter
echo     - npm run type-check : Check TypeScript types
echo.
echo [INFO] Happy coding!
echo.
echo Press any key to exit...
pause >nul