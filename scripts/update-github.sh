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

# Create a pull request
echo "Creating a pull request..."
PR_URL=$(gh pr create --title "Add file upload functionality with S3 integration" --body "This PR adds file upload functionality with S3 integration, including:

- File upload code to use the correct S3 bucket and region
- Installation of @aws-sdk/lib-storage for handling file uploads
- Proper error handling for S3 operations
- File type validation and size limits
- CloudWatch monitoring for S3 operations
- Application logging for file uploads
- Backup procedures for important files" --base main --head $BRANCH_NAME)

echo "Pull request created: $PR_URL"
echo "Done!"
