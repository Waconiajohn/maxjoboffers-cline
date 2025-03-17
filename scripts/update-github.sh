#!/bin/bash

# Update GitHub Repository with Latest Changes
#
# This script updates the GitHub repository with the latest changes

# Set the GitHub repository URL
GITHUB_REPO="git@github.com:maxjoboffers/maxjoboffers.git"

# Set the branch name
BRANCH_NAME="feature/file-upload-s3"

# Check if the branch already exists
if git rev-parse --verify $BRANCH_NAME >/dev/null 2>&1; then
  echo "Branch $BRANCH_NAME already exists, checking it out..."
  git checkout $BRANCH_NAME
else
  echo "Creating and checking out branch $BRANCH_NAME..."
  git checkout -b $BRANCH_NAME
fi

# Add all changes
echo "Adding all changes..."
git add .

# Commit the changes
echo "Committing changes..."
git commit -m "Add file upload functionality with S3 integration"

# Push the changes to GitHub
echo "Pushing changes to GitHub..."
git push -u origin $BRANCH_NAME

# Note: Pull request creation requires GitHub CLI (gh) which is not installed
echo "Note: To create a pull request, please go to the GitHub repository website."
echo "Pull request should include the following details:"
echo "- Title: Add file upload functionality with S3 integration"
echo "- Description: This PR adds file upload functionality with S3 integration, including:"
echo "  - File upload code to use the correct S3 bucket and region"
echo "  - Installation of @aws-sdk/lib-storage for handling file uploads"
echo "  - Proper error handling for S3 operations"
echo "  - File type validation and size limits"
echo "  - CloudWatch monitoring for S3 operations"
echo "  - Application logging for file uploads"
echo "  - Backup procedures for important files"
echo "Done!"
