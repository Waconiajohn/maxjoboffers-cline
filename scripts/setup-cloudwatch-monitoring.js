#!/usr/bin/env node

/**
 * Setup CloudWatch monitoring for S3 operations
 * 
 * This script sets up CloudWatch monitoring for S3 operations.
 * It creates CloudWatch alarms for S3 operations and configures notifications.
 */

const { CloudWatchClient, PutMetricAlarmCommand } = require('@aws-sdk/client-cloudwatch');
const { SNSClient, CreateTopicCommand, SubscribeCommand } = require('@aws-sdk/client-sns');

// Load environment variables
require('dotenv').config();

// CloudWatch configuration
const cloudWatchClient = new CloudWatchClient({
  region: process.env.AWS_REGION || 'us-west-2',
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY
  }
});

// SNS configuration
const snsClient = new SNSClient({
  region: process.env.AWS_REGION || 'us-west-2',
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY
  }
});

// S3 bucket name from environment variable
const S3_BUCKET = process.env.AWS_S3_BUCKET || 'executive-lms-backups-266735837284';

// Admin email for notifications
const ADMIN_EMAIL = process.env.ADMIN_EMAIL || 'admin@maxjoboffers.com';

// Create SNS topic for notifications
const createSnsTopic = async () => {
  try {
    const command = new CreateTopicCommand({
      Name: 'S3OperationsAlarm'
    });
    const response = await snsClient.send(command);
    return response.TopicArn;
  } catch (error) {
    console.error('Error creating SNS topic:', error);
    throw error;
  }
};

// Subscribe email to SNS topic
const subscribeToTopic = async (topicArn, email) => {
  try {
    const command = new SubscribeCommand({
      TopicArn: topicArn,
      Protocol: 'email',
      Endpoint: email
    });
    await snsClient.send(command);
    console.log(`Subscription confirmation sent to ${email}`);
  } catch (error) {
    console.error('Error subscribing to SNS topic:', error);
    throw error;
  }
};

// Create CloudWatch alarm for S3 operations
const createS3Alarm = async (topicArn) => {
  try {
    // Alarm for high error rate
    const errorAlarmCommand = new PutMetricAlarmCommand({
      AlarmName: `${S3_BUCKET}-ErrorRate`,
      AlarmDescription: 'Alarm for high S3 error rate',
      ActionsEnabled: true,
      AlarmActions: [topicArn],
      MetricName: '4xxErrors',
      Namespace: 'AWS/S3',
      Statistic: 'Sum',
      Dimensions: [
        {
          Name: 'BucketName',
          Value: S3_BUCKET
        }
      ],
      Period: 300, // 5 minutes
      EvaluationPeriods: 1,
      Threshold: 10,
      ComparisonOperator: 'GreaterThanThreshold',
      TreatMissingData: 'notBreaching'
    });
    await cloudWatchClient.send(errorAlarmCommand);
    console.log('Created CloudWatch alarm for S3 error rate');

    // Alarm for high latency
    const latencyAlarmCommand = new PutMetricAlarmCommand({
      AlarmName: `${S3_BUCKET}-HighLatency`,
      AlarmDescription: 'Alarm for high S3 latency',
      ActionsEnabled: true,
      AlarmActions: [topicArn],
      MetricName: 'FirstByteLatency',
      Namespace: 'AWS/S3',
      Statistic: 'Average',
      Dimensions: [
        {
          Name: 'BucketName',
          Value: S3_BUCKET
        }
      ],
      Period: 300, // 5 minutes
      EvaluationPeriods: 3,
      Threshold: 1000, // 1 second
      ComparisonOperator: 'GreaterThanThreshold',
      TreatMissingData: 'notBreaching'
    });
    await cloudWatchClient.send(latencyAlarmCommand);
    console.log('Created CloudWatch alarm for S3 latency');
  } catch (error) {
    console.error('Error creating CloudWatch alarm:', error);
    throw error;
  }
};

// Main function
const main = async () => {
  try {
    console.log('Setting up CloudWatch monitoring for S3 operations...');
    
    // Create SNS topic
    const topicArn = await createSnsTopic();
    console.log(`Created SNS topic: ${topicArn}`);
    
    // Subscribe admin email to SNS topic
    await subscribeToTopic(topicArn, ADMIN_EMAIL);
    
    // Create CloudWatch alarms
    await createS3Alarm(topicArn);
    
    console.log('CloudWatch monitoring setup completed successfully!');
  } catch (error) {
    console.error('Error setting up CloudWatch monitoring:', error);
    process.exit(1);
  }
};

// Run the main function
main().catch(console.error);
