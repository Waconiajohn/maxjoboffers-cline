
#!/bin/bash
# Update AWS configuration in .env file
cd /home/ec2-user/maxjoboffers
sed -i 's/AWS_REGION=.*/AWS_REGION=us-east-1/' .env
sed -i 's/AWS_S3_BUCKET=.*/AWS_S3_BUCKET=executive-lms-backups-266735837284-us-east-1/' .env
cat .env | grep AWS_
    