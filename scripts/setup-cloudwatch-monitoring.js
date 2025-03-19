#!/usr/bin/env node

/**
 * Setup CloudWatch Monitoring
 *
 * This script sets up CloudWatch monitoring for S3 operations
 */

const { 
  CloudWatchClient, 
  PutMetricAlarmCommand,
  PutDashboardCommand
} = require('@aws-sdk/client-cloudwatch');

const {
  CloudWatchEventsClient,
  PutRuleCommand,
  PutTargetsCommand
} = require('@aws-sdk/client-cloudwatch-events');

// Define the AWS region and bucket name from environment variables
const REGION = process.env.AWS_REGION || 'us-east-1';
const BUCKET_NAME = process.env.AWS_S3_BUCKET || 'executive-lms-backups-266735837284-us-east-1';

// Create CloudWatch client
const cloudWatchClient = new CloudWatchClient({
  region: REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY
  }
});

// Create CloudWatch Events client
const cloudWatchEventsClient = new CloudWatchEventsClient({
  region: REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY
  }
});

// Function to create a CloudWatch alarm for S3 operations
const createS3OperationsAlarm = async () => {
  try {
    console.log('Creating CloudWatch alarm for S3 operations...');
    
    const params = {
      AlarmName: `${BUCKET_NAME}-4xx-errors`,
      AlarmDescription: `Alarm for 4xx errors on ${BUCKET_NAME} bucket`,
      ActionsEnabled: true,
      MetricName: '4xxErrors',
      Namespace: 'AWS/S3',
      Statistic: 'Sum',
      Dimensions: [
        {
          Name: 'BucketName',
          Value: BUCKET_NAME
        }
      ],
      Period: 300, // 5 minutes
      EvaluationPeriods: 1,
      Threshold: 5,
      ComparisonOperator: 'GreaterThanThreshold',
      TreatMissingData: 'notBreaching'
    };
    
    const command = new PutMetricAlarmCommand(params);
    const response = await cloudWatchClient.send(command);
    
    console.log('CloudWatch alarm created successfully!');
    return response;
  } catch (error) {
    console.error('Error creating CloudWatch alarm:', error);
    throw error;
  }
};

// Function to create a CloudWatch dashboard for S3 operations
const createS3Dashboard = async () => {
  try {
    console.log('Creating CloudWatch dashboard for S3 operations...');
    
    const dashboardBody = {
      widgets: [
        {
          type: 'metric',
          x: 0,
          y: 0,
          width: 12,
          height: 6,
          properties: {
            metrics: [
              ['AWS/S3', 'AllRequests', 'BucketName', BUCKET_NAME],
              ['AWS/S3', 'GetRequests', 'BucketName', BUCKET_NAME],
              ['AWS/S3', 'PutRequests', 'BucketName', BUCKET_NAME]
            ],
            view: 'timeSeries',
            stacked: false,
            region: REGION,
            title: 'S3 Requests',
            period: 300
          }
        },
        {
          type: 'metric',
          x: 0,
          y: 6,
          width: 12,
          height: 6,
          properties: {
            metrics: [
              ['AWS/S3', '4xxErrors', 'BucketName', BUCKET_NAME],
              ['AWS/S3', '5xxErrors', 'BucketName', BUCKET_NAME]
            ],
            view: 'timeSeries',
            stacked: false,
            region: REGION,
            title: 'S3 Errors',
            period: 300
          }
        },
        {
          type: 'metric',
          x: 12,
          y: 0,
          width: 12,
          height: 6,
          properties: {
            metrics: [
              ['AWS/S3', 'BytesDownloaded', 'BucketName', BUCKET_NAME],
              ['AWS/S3', 'BytesUploaded', 'BucketName', BUCKET_NAME]
            ],
            view: 'timeSeries',
            stacked: false,
            region: REGION,
            title: 'S3 Data Transfer',
            period: 300
          }
        },
        {
          type: 'metric',
          x: 12,
          y: 6,
          width: 12,
          height: 6,
          properties: {
            metrics: [
              ['AWS/S3', 'FirstByteLatency', 'BucketName', BUCKET_NAME],
              ['AWS/S3', 'TotalRequestLatency', 'BucketName', BUCKET_NAME]
            ],
            view: 'timeSeries',
            stacked: false,
            region: REGION,
            title: 'S3 Latency',
            period: 300
          }
        }
      ]
    };
    
    const params = {
      DashboardName: `${BUCKET_NAME}-dashboard`,
      DashboardBody: JSON.stringify(dashboardBody)
    };
    
    const command = new PutDashboardCommand(params);
    const response = await cloudWatchClient.send(command);
    
    console.log('CloudWatch dashboard created successfully!');
    return response;
  } catch (error) {
    console.error('Error creating CloudWatch dashboard:', error);
    throw error;
  }
};

// Function to create a CloudWatch Events rule for S3 object creation
const createS3ObjectCreationRule = async () => {
  try {
    console.log('Creating CloudWatch Events rule for S3 object creation...');
    
    // Create the rule
    const ruleParams = {
      Name: `${BUCKET_NAME}-object-created`,
      Description: `Rule for S3 object creation in ${BUCKET_NAME} bucket`,
      EventPattern: JSON.stringify({
        source: ['aws.s3'],
        'detail-type': ['AWS API Call via CloudTrail'],
        detail: {
          eventSource: ['s3.amazonaws.com'],
          eventName: ['PutObject', 'CompleteMultipartUpload'],
          requestParameters: {
            bucketName: [BUCKET_NAME]
          }
        }
      }),
      State: 'ENABLED'
    };
    
    const ruleCommand = new PutRuleCommand(ruleParams);
    const ruleResponse = await cloudWatchEventsClient.send(ruleCommand);
    
    console.log('CloudWatch Events rule created successfully!');
    
    // Note: In a real implementation, you would set up a target for the rule,
    // such as a Lambda function to process the events. For this example, we'll
    // just create the rule without a target.
    
    console.log('Note: No target has been set for the rule. In a production environment, you would set up a Lambda function or other target to process the events.');
    
    return ruleResponse;
  } catch (error) {
    console.error('Error creating CloudWatch Events rule:', error);
    throw error;
  }
};

// Main function
const main = async () => {
  try {
    // Check if AWS credentials are set
    if (!process.env.AWS_ACCESS_KEY_ID || !process.env.AWS_SECRET_ACCESS_KEY) {
      console.error('AWS credentials are not set. Please set AWS_ACCESS_KEY_ID and AWS_SECRET_ACCESS_KEY environment variables.');
      process.exit(1);
    }
    
    console.log(`Setting up CloudWatch monitoring for S3 bucket: ${BUCKET_NAME}`);
    
    // Create CloudWatch alarm
    await createS3OperationsAlarm();
    
    // Create CloudWatch dashboard
    await createS3Dashboard();
    
    // Create CloudWatch Events rule
    await createS3ObjectCreationRule();
    
    console.log('\nCloudWatch monitoring setup completed successfully!');
    console.log(`You can view the dashboard at: https://${REGION}.console.aws.amazon.com/cloudwatch/home?region=${REGION}#dashboards:name=${BUCKET_NAME}-dashboard`);
    console.log(`You can view the alarm at: https://${REGION}.console.aws.amazon.com/cloudwatch/home?region=${REGION}#alarmsV2:alarm/${BUCKET_NAME}-4xx-errors`);
  } catch (error) {
    console.error('Setup failed:', error);
    process.exit(1);
  }
};

// Run the main function
main();
