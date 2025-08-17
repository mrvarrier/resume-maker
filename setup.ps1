# ATS Resume Builder - Setup Script for Windows PowerShell
# This script will check prerequisites and install dependencies

# Ensure script stops on errors
$ErrorActionPreference = "Stop"

# Function to print colored output
function Write-ColorOutput {
    param(
        [string]$Message,
        [string]$Type = "Info"
    )
    
    switch ($Type) {
        "Success" { Write-Host "✓ $Message" -ForegroundColor Green }
        "Error" { Write-Host "✗ $Message" -ForegroundColor Red }
        "Warning" { Write-Host "⚠ $Message" -ForegroundColor Yellow }
        "Info" { Write-Host "ℹ $Message" -ForegroundColor Cyan }
        default { Write-Host $Message }
    }
}

# Function to check if a command exists
function Test-CommandExists {
    param([string]$Command)
    
    try {
        if (Get-Command $Command -ErrorAction SilentlyContinue) {
            return $true
        }
        return $false
    }
    catch {
        return $false
    }
}

# Function to compare versions
function Compare-Version {
    param(
        [string]$Version1,
        [string]$Version2
    )
    
    $v1 = [Version]::new($Version1)
    $v2 = [Version]::new($Version2)
    
    return $v1 -ge $v2
}

# Clear screen and show header
Clear-Host
Write-Host ""
Write-Host "================================================" -ForegroundColor Cyan
Write-Host "   ATS Resume Builder - Setup Script" -ForegroundColor Cyan
Write-Host "================================================" -ForegroundColor Cyan
Write-Host ""

try {
    # Check for Node.js
    Write-ColorOutput "Checking for Node.js..." "Info"
    
    if (Test-CommandExists "node") {
        $nodeVersionRaw = node -v
        $nodeVersion = $nodeVersionRaw -replace 'v', ''
        Write-ColorOutput "Node.js found: $nodeVersionRaw" "Success"
        
        # Check Node.js version
        if (Compare-Version $nodeVersion "18.0.0") {
            Write-ColorOutput "Node.js version meets requirements (>=18.0.0)" "Success"
        }
        else {
            Write-ColorOutput "Node.js version $nodeVersionRaw is below required version v18.0.0" "Error"
            Write-ColorOutput "Please update Node.js to version 18 or higher" "Info"
            Write-ColorOutput "Download from: https://nodejs.org/" "Info"
            Write-Host ""
            Write-Host "Press any key to exit..." -ForegroundColor Yellow
            $null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")
            exit 1
        }
    }
    else {
        Write-ColorOutput "Node.js is not installed" "Error"
        Write-ColorOutput "Please install Node.js version 18 or higher" "Info"
        Write-Host ""
        Write-Host "Installation options for Windows:" -ForegroundColor Cyan
        Write-Host "  • Download from: https://nodejs.org/" -ForegroundColor White
        Write-Host "  • Using Chocolatey: choco install nodejs" -ForegroundColor White
        Write-Host "  • Using Scoop: scoop install nodejs" -ForegroundColor White
        Write-Host "  • Using winget: winget install OpenJS.NodeJS" -ForegroundColor White
        Write-Host ""
        Write-Host "Press any key to exit..." -ForegroundColor Yellow
        $null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")
        exit 1
    }
    
    # Check for npm
    Write-ColorOutput "Checking for npm..." "Info"
    
    if (Test-CommandExists "npm") {
        $npmVersion = npm -v
        Write-ColorOutput "npm found: v$npmVersion" "Success"
        
        # Check npm version
        $npmMajor = [int]($npmVersion.Split('.')[0])
        if ($npmMajor -ge 8) {
            Write-ColorOutput "npm version meets requirements (>=8.0.0)" "Success"
        }
        else {
            Write-ColorOutput "npm version $npmVersion is below recommended version 8.0.0" "Warning"
            Write-ColorOutput "Consider updating npm: npm install -g npm@latest" "Info"
        }
    }
    else {
        Write-ColorOutput "npm is not installed" "Error"
        Write-ColorOutput "npm usually comes with Node.js. Please reinstall Node.js" "Info"
        Write-Host ""
        Write-Host "Press any key to exit..." -ForegroundColor Yellow
        $null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")
        exit 1
    }
    
    # Check if package.json exists
    if (!(Test-Path "package.json")) {
        Write-ColorOutput "package.json not found. Are you in the project root directory?" "Error"
        Write-Host ""
        Write-Host "Current directory: $(Get-Location)" -ForegroundColor Yellow
        Write-Host ""
        Write-Host "Press any key to exit..." -ForegroundColor Yellow
        $null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")
        exit 1
    }
    
    # Clean npm cache (optional, helps with some issues)
    Write-Host ""
    Write-ColorOutput "Cleaning npm cache..." "Info"
    npm cache clean --force 2>$null
    
    # Install dependencies
    Write-Host ""
    Write-ColorOutput "Installing project dependencies..." "Info"
    Write-Host ""
    
    $installProcess = Start-Process -FilePath "npm" -ArgumentList "install" -NoNewWindow -PassThru -Wait
    
    if ($installProcess.ExitCode -eq 0) {
        Write-Host ""
        Write-ColorOutput "Dependencies installed successfully!" "Success"
    }
    else {
        Write-Host ""
        Write-ColorOutput "Failed to install dependencies" "Error"
        Write-ColorOutput "Please check the error messages above and try again" "Info"
        Write-Host ""
        Write-Host "Press any key to exit..." -ForegroundColor Yellow
        $null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")
        exit 1
    }
    
    # Run initial build to verify setup
    Write-Host ""
    Write-ColorOutput "Running initial build to verify setup..." "Info"
    Write-Host ""
    
    $buildProcess = Start-Process -FilePath "npm" -ArgumentList "run", "build" -NoNewWindow -PassThru -Wait
    
    if ($buildProcess.ExitCode -eq 0) {
        Write-Host ""
        Write-ColorOutput "Build completed successfully!" "Success"
    }
    else {
        Write-Host ""
        Write-ColorOutput "Build failed, but this might be okay for initial setup" "Warning"
        Write-ColorOutput "You can try running 'npm run dev' to start the development server" "Info"
    }
    
    # Create .nvmrc if it doesn't exist
    if (!(Test-Path ".nvmrc")) {
        "18" | Out-File -FilePath ".nvmrc" -Encoding UTF8 -NoNewline
        Write-ColorOutput "Created .nvmrc file for Node version management" "Success"
    }
    
    # Success message
    Write-Host ""
    Write-Host "================================================" -ForegroundColor Green
    Write-Host "   Setup Complete! 🎉" -ForegroundColor Green
    Write-Host "================================================" -ForegroundColor Green
    Write-Host ""
    Write-ColorOutput "ATS Resume Builder is ready to use!" "Success"
    Write-Host ""
    Write-Host "To start the development server, run:" -ForegroundColor Cyan
    Write-Host ""
    Write-Host "    npm run dev" -ForegroundColor Green
    Write-Host ""
    Write-Host "The application will be available at:" -ForegroundColor Cyan
    Write-Host "    http://localhost:3002" -ForegroundColor Blue
    Write-Host ""
    Write-Host "Other available commands:" -ForegroundColor Cyan
    Write-Host "    • npm run build      - Build for production" -ForegroundColor White
    Write-Host "    • npm run start      - Start production server" -ForegroundColor White
    Write-Host "    • npm run lint       - Run linter" -ForegroundColor White
    Write-Host "    • npm run type-check - Check TypeScript types" -ForegroundColor White
    Write-Host ""
    Write-ColorOutput "Happy coding! 🚀" "Info"
    Write-Host ""
    
    # Ask if user wants to start dev server now
    Write-Host "Would you like to start the development server now? (Y/N): " -ForegroundColor Yellow -NoNewline
    $response = Read-Host
    
    if ($response -eq 'Y' -or $response -eq 'y') {
        Write-Host ""
        Write-ColorOutput "Starting development server..." "Info"
        Write-Host "Press Ctrl+C to stop the server" -ForegroundColor Yellow
        Write-Host ""
        npm run dev
    }
}
catch {
    Write-Host ""
    Write-ColorOutput "An error occurred: $_" "Error"
    Write-Host ""
    Write-Host "Press any key to exit..." -ForegroundColor Yellow
    $null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")
    exit 1
}