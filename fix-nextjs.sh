#!/bin/bash

# Clear npm cache
echo "Clearing npm cache..."
npm cache clean --force

# Remove node_modules and package-lock.json
echo "Removing node_modules and package-lock.json..."
rm -rf node_modules
rm -f package-lock.json

# Reinstall dependencies
echo "Reinstalling dependencies..."
npm install

# If still having issues with SWC, try to forcibly install the correct binary
echo "Checking for SWC installation..."
if [ ! -f "./node_modules/@next/swc-darwin-arm64/next-swc.darwin-arm64.node" ]; then
  echo "Installing @next/swc-darwin-arm64 specifically..."
  npm install @next/swc-darwin-arm64
fi

echo "Done! Try running the Next.js development server again."