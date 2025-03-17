#!/bin/bash

# Update EC2 Instance with Latest Changes
#
# This script updates the EC2 instance with the latest changes from GitHub

# Path to the PEM key file
PEM_KEY_PATH="/Users/johnschrup/Desktop/PEM/maxjoboffers-dev-key.pem"

# EC2 instance details
EC2_USER="ec2-user"
EC2_HOST="18.233.6.175"
EC2_PROJECT_PATH="/home/ec2-user/maxjoboffers"

# GitHub repository URL
GITHUB_REPO="git@github.com:maxjoboffers/maxjoboffers.git"

# Branch name
BRANCH_NAME="feature/file-upload-s3"

# Connect to the EC2 instance and update the code
echo "Connecting to EC2 instance and updating the code..."
ssh -i $PEM_KEY_PATH $EC2_USER@$EC2_HOST "cd $EC2_PROJECT_PATH && git fetch && git checkout $BRANCH_NAME && git pull origin $BRANCH_NAME"

# Install dependencies
echo "Installing dependencies..."
ssh -i $PEM_KEY_PATH $EC2_USER@$EC2_HOST "cd $EC2_PROJECT_PATH && npm install"

# Restart the application
echo "Restarting the application..."
ssh -i $PEM_KEY_PATH $EC2_USER@$EC2_HOST "cd $EC2_PROJECT_PATH && pm2 restart all || pm2 start npm --name 'maxjoboffers' -- start"

echo "EC2 instance updated successfully!"
