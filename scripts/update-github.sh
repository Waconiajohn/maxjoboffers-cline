#!/bin/bash

# Update GitHub repository with the latest changes
# This script commits and pushes changes to GitHub

set -e

# Log function
log() {
  echo "$(date '+%Y-%m-%d %H:%M:%S') - $1"
}

# Check if git is installed
if ! command -v git &> /dev/null; then
  log "Git is not installed. Please install git and try again."
  exit 1
fi

# Check if the current directory is a git repository
if [ ! -d ".git" ]; then
  log "Current directory is not a git repository. Please run this script from the root of the repository."
  exit 1
fi

# Create a new branch for the changes
BRANCH_NAME="feature/s3-file-uploads-$(date +%Y%m%d)"
log "Creating new branch: $BRANCH_NAME"
git checkout -b $BRANCH_NAME

# Add all changes
log "Adding changes to git"
git add .

# Commit changes
log "Committing changes"
git commit -m "Implement S3 file uploads with proper error handling and validation"

# Push changes to GitHub
log "Pushing changes to GitHub"
git push origin $BRANCH_NAME

# Create pull request
log "Creating pull request"
echo "Please create a pull request on GitHub from the branch $BRANCH_NAME to main."
echo "Visit: https://github.com/yourusername/maxjoboffers/compare/main...$BRANCH_NAME"

log "GitHub update completed successfully!"
