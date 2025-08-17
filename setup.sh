#!/bin/bash

# ATS Resume Builder - Setup Script for macOS/Linux
# This script will check prerequisites and install dependencies

set -e  # Exit on error

# Color codes for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to print colored output
print_success() {
    echo -e "${GREEN}✓${NC} $1"
}

print_error() {
    echo -e "${RED}✗${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}⚠${NC} $1"
}

print_info() {
    echo -e "${BLUE}ℹ${NC} $1"
}

# Function to check command exists
command_exists() {
    command -v "$1" >/dev/null 2>&1
}

# Function to compare versions
version_compare() {
    local version1=$1
    local version2=$2
    
    if [[ "$(printf '%s\n' "$version2" "$version1" | sort -V | head -n1)" == "$version2" ]]; then
        return 0
    else
        return 1
    fi
}

echo ""
echo "================================================"
echo "   ATS Resume Builder - Setup Script"
echo "================================================"
echo ""

# Check for Node.js
print_info "Checking for Node.js..."
if command_exists node; then
    NODE_VERSION=$(node -v | sed 's/v//')
    print_success "Node.js found: v$NODE_VERSION"
    
    # Check Node.js version
    if version_compare "$NODE_VERSION" "18.0.0"; then
        print_success "Node.js version meets requirements (>=18.0.0)"
    else
        print_error "Node.js version $NODE_VERSION is below required version 18.0.0"
        print_info "Please update Node.js to version 18 or higher"
        print_info "Visit: https://nodejs.org/ or use a version manager like nvm"
        exit 1
    fi
else
    print_error "Node.js is not installed"
    print_info "Please install Node.js version 18 or higher"
    
    # Provide OS-specific installation instructions
    if [[ "$OSTYPE" == "darwin"* ]]; then
        print_info "For macOS, you can install Node.js using:"
        echo "    • Homebrew: brew install node"
        echo "    • Download from: https://nodejs.org/"
        echo "    • Using nvm: curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.0/install.sh | bash"
    else
        print_info "For Linux, you can install Node.js using:"
        echo "    • Package manager (Ubuntu/Debian): sudo apt-get install nodejs"
        echo "    • Package manager (RHEL/CentOS): sudo yum install nodejs"
        echo "    • Download from: https://nodejs.org/"
        echo "    • Using nvm: curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.0/install.sh | bash"
    fi
    exit 1
fi

# Check for npm
print_info "Checking for npm..."
if command_exists npm; then
    NPM_VERSION=$(npm -v)
    print_success "npm found: v$NPM_VERSION"
    
    # Check npm version
    if version_compare "$NPM_VERSION" "8.0.0"; then
        print_success "npm version meets requirements (>=8.0.0)"
    else
        print_warning "npm version $NPM_VERSION is below recommended version 8.0.0"
        print_info "Consider updating npm: npm install -g npm@latest"
    fi
else
    print_error "npm is not installed"
    print_info "npm usually comes with Node.js. Please reinstall Node.js"
    exit 1
fi

# Check if package.json exists
if [ ! -f "package.json" ]; then
    print_error "package.json not found. Are you in the project root directory?"
    exit 1
fi

# Install dependencies
echo ""
print_info "Installing project dependencies..."
echo ""

if npm install; then
    echo ""
    print_success "Dependencies installed successfully!"
else
    echo ""
    print_error "Failed to install dependencies"
    print_info "Please check the error messages above and try again"
    exit 1
fi

# Run initial build to verify setup
echo ""
print_info "Running initial build to verify setup..."
echo ""

if npm run build; then
    echo ""
    print_success "Build completed successfully!"
else
    echo ""
    print_warning "Build failed, but this might be okay for initial setup"
    print_info "You can try running 'npm run dev' to start the development server"
fi

# Create .nvmrc if it doesn't exist
if [ ! -f ".nvmrc" ]; then
    echo "18" > .nvmrc
    print_success "Created .nvmrc file for Node version management"
fi

# Success message
echo ""
echo "================================================"
echo "   Setup Complete! 🎉"
echo "================================================"
echo ""
print_success "ATS Resume Builder is ready to use!"
echo ""
echo "To start the development server, run:"
echo ""
echo "    ${GREEN}npm run dev${NC}"
echo ""
echo "The application will be available at:"
echo "    ${BLUE}http://localhost:3002${NC}"
echo ""
echo "Other available commands:"
echo "    • npm run build   - Build for production"
echo "    • npm run start   - Start production server"
echo "    • npm run lint    - Run linter"
echo "    • npm run type-check - Check TypeScript types"
echo ""
print_info "Happy coding! 🚀"
echo ""