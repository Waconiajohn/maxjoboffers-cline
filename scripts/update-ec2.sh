#!/bin/bash

# Update EC2 Instance
# This script updates the EC2 instance with the latest code and configuration

# Exit on error
set -e

# Set variables
EC2_HOST="${EC2_HOST:-ec2-user@ec2-xx-xx-xx-xx.us-west-2.compute.amazonaws.com}"
SSH_KEY="${SSH_KEY:-~/.ssh/maxjoboffers-ec2.pem}"
REPO_URL="https://github.com/yourusername/maxjoboffers-github.git"
APP_DIR="/home/ec2-user/maxjoboffers"
TIMESTAMP=$(date +%Y%m%d-%H%M%S)
BACKUP_DIR="${APP_DIR}-backup-${TIMESTAMP}"

# Check if required environment variables are set
if [ -z "$EC2_HOST" ]; then
  echo "Error: EC2_HOST environment variable is not set."
  echo "Usage: EC2_HOST=ec2-user@ec2-xx-xx-xx-xx.us-west-2.compute.amazonaws.com ./update-ec2.sh"
  exit 1
fi

if [ ! -f "$SSH_KEY" ]; then
  echo "Error: SSH key file not found at $SSH_KEY"
  echo "Please provide the path to your SSH key using the SSH_KEY environment variable."
  exit 1
fi

echo "Updating EC2 instance at $EC2_HOST..."

# Create a backup of the current application
echo "Creating backup of current application..."
ssh -i "$SSH_KEY" "$EC2_HOST" "cp -r $APP_DIR $BACKUP_DIR"

# Update the code from GitHub
echo "Updating code from GitHub..."
ssh -i "$SSH_KEY" "$EC2_HOST" "cd $APP_DIR && git pull origin main"

# Install dependencies
echo "Installing dependencies..."
ssh -i "$SSH_KEY" "$EC2_HOST" "cd $APP_DIR && npm install"

# Install AWS SDK for S3 operations
echo "Installing AWS SDK for S3 operations..."
ssh -i "$SSH_KEY" "$EC2_HOST" "cd $APP_DIR && npm install @aws-sdk/client-s3 @aws-sdk/lib-storage"

# Update environment variables
echo "Updating environment variables..."
scp -i "$SSH_KEY" .env "$EC2_HOST:$APP_DIR/.env"

# Run database migrations
echo "Running database migrations..."
ssh -i "$SSH_KEY" "$EC2_HOST" "cd $APP_DIR && npm run migrate"

# Restart the application using PM2
echo "Restarting the application..."
ssh -i "$SSH_KEY" "$EC2_HOST" "cd $APP_DIR && pm2 restart maxjoboffers || pm2 start npm --name maxjoboffers -- start"

# Configure PM2 to start on boot
echo "Configuring PM2 to start on boot..."
ssh -i "$SSH_KEY" "$EC2_HOST" "pm2 save && sudo env PATH=$PATH:/usr/bin pm2 startup systemd -u ec2-user --hp /home/ec2-user"

# Check application status
echo "Checking application status..."
ssh -i "$SSH_KEY" "$EC2_HOST" "pm2 status"

# Test the application
echo "Testing the application..."
ssh -i "$SSH_KEY" "$EC2_HOST" "curl -s http://localhost:3001/health || echo 'Health check failed'"

echo "EC2 instance updated successfully!"
echo "Backup created at: $BACKUP_DIR"
echo "Application is running at: http://$EC2_HOST:3001"
