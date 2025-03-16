#!/bin/bash

# Script to commit and push all changes to GitHub
# This script will:
# 1. Add all new and modified files
# 2. Commit the changes with a descriptive message
# 3. Push the changes to GitHub

# Change to the project root directory
cd "$(dirname "$0")/.."

# Check if there are any changes to commit
if [ -z "$(git status --porcelain)" ]; then
    echo "No changes to commit."
    exit 0
fi

# Show the current status
echo "Current git status:"
git status

# Add all new and modified files
echo "Adding all files to git..."
git add .

# Commit the changes
echo "Committing changes..."
git commit -m "Update project with various improvements

- Fix Prisma initialization issue in migration scripts
- Created generate-prisma.js to generate Prisma client from Wasp schema
- Updated run-migration.js to use generate-prisma.js before using Prisma
- Updated migration script to also generate Prisma client
- Added documentation in scripts/README.md
- Various other improvements and updates"

# Push the changes to GitHub
echo "Pushing changes to GitHub..."
git push

echo "All changes have been pushed to GitHub successfully!"
