#!/bin/bash

# Update EC2 instance with the latest changes
# This script pulls the latest changes from GitHub, installs dependencies, and restarts the application

set -e

# Log function
log() {
  echo "$(date '+%Y-%m-%d %H:%M:%S') - $1"
}

# Change to the application directory
APP_DIR="/home/ec2-user/maxjoboffers"
cd $APP_DIR

# Pull the latest changes from GitHub
log "Pulling latest changes from GitHub..."
git pull origin main

# Install dependencies
log "Installing dependencies..."
npm install

# Install specific AWS SDK dependencies
log "Installing AWS SDK dependencies..."
npm install @aws-sdk/client-s3 @aws-sdk/lib-storage

# Build the application
log "Building the application..."
npm run build

# Restart the application using PM2
log "Restarting the application..."
pm2 restart maxjoboffers || pm2 start npm --name "maxjoboffers" -- start

# Configure PM2 to start on system boot
log "Configuring PM2 to start on system boot..."
pm2 save
sudo env PATH=$PATH:/usr/bin pm2 startup systemd -u ec2-user --hp /home/ec2-user

# Set up CloudWatch monitoring for S3 operations
log "Setting up CloudWatch monitoring for S3 operations..."
node scripts/setup-cloudwatch-monitoring.js

# Set up backup procedures
log "Setting up backup procedures..."
node scripts/setup-backup-procedures.js

# Add backup cron job
log "Adding backup cron job..."
(crontab -l 2>/dev/null || echo "") | grep -v "run-backup.sh" | { cat; echo "0 2 * * * $APP_DIR/scripts/run-backup.sh"; } | crontab -

log "EC2 update completed successfully!"
