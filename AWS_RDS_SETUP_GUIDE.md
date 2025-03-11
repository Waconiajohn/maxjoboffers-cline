# AWS RDS Setup Guide for MaxJobOffers

This guide provides step-by-step instructions for setting up an AWS RDS PostgreSQL database for the MaxJobOffers application.

## Table of Contents

1. [Prerequisites](#prerequisites)
2. [Creating an AWS RDS PostgreSQL Instance](#creating-an-aws-rds-postgresql-instance)
3. [Configuring Security Groups](#configuring-security-groups)
4. [Creating a Database User and Schema](#creating-a-database-user-and-schema)
5. [Connecting to Your RDS Instance](#connecting-to-your-rds-instance)
6. [Setting Up Environment Variables](#setting-up-environment-variables)
7. [Running Database Migrations](#running-database-migrations)
8. [Monitoring and Maintenance](#monitoring-and-maintenance)

## Prerequisites

Before you begin, make sure you have:

1. An AWS account with appropriate permissions to create RDS instances
2. AWS CLI installed and configured (optional, but helpful)
3. A PostgreSQL client (e.g., psql, pgAdmin, or DBeaver) for testing connections

## Creating an AWS RDS PostgreSQL Instance

1. **Sign in to the AWS Management Console**:
   - Go to [https://console.aws.amazon.com/](https://console.aws.amazon.com/)
   - Sign in with your AWS account

2. **Navigate to RDS**:
   - In the AWS Management Console, search for "RDS" or find it under "Database" services
   - Click on "RDS" to open the RDS Dashboard

3. **Create a Database**:
   - Click the "Create database" button
   - Choose "Standard create" for more control over the configuration

4. **Choose Engine Options**:
   - Select "PostgreSQL" as the engine type
   - Choose PostgreSQL version 14 (recommended for MaxJobOffers)

5. **Choose Templates**:
   - For development/testing: Select "Free tier" or "Dev/Test"
   - For production: Select "Production"

6. **Configure DB Instance**:
   - **DB instance identifier**: Enter a name (e.g., `maxjoboffers-db`)
   - **Master username**: Create a username (e.g., `maxjoboffers_admin`)
   - **Master password**: Create a strong password and save it securely
   - **DB instance class**: 
     - For development: `db.t3.micro` (free tier eligible)
     - For production: At least `db.t3.small` or higher based on expected load

7. **Storage Configuration**:
   - **Storage type**: General Purpose SSD (gp2)
   - **Allocated storage**: 20 GB (minimum, increase as needed)
   - Enable storage autoscaling and set a maximum threshold (e.g., 100 GB)

8. **Availability & Durability**:
   - For development: Single DB instance (no standby)
   - For production: Multi-AZ deployment for high availability

9. **Connectivity**:
   - **Compute resource**: You have two options here:
     - **Don't connect to an EC2 compute resource**: Choose this if you want to set up the EC2 instance separately or if you're connecting from your local machine
     - **Connect to an EC2 compute resource**: Choose this to automatically configure connectivity between your RDS instance and an existing EC2 instance
       - If you select this option, you'll need to choose an existing EC2 instance from the dropdown
       - This will automatically configure the security groups for both the EC2 instance and RDS instance
   
   - If you chose "Don't connect to an EC2 compute resource", you'll need to configure:
     - **Network type**: Choose "IPv4" (standard)
     - **Virtual Private Cloud (VPC)**: Choose your default VPC or a specific VPC
     - **DB subnet group**: Choose the default subnet group or create a new one
     - **Public access**: 
       - For development: You might choose "Yes" for easier access
       - For production: Choose "No" and use a VPN or bastion host for access
     - **VPC security group**: Create a new security group or use an existing one
     - **Availability Zone**: No preference or choose a specific zone
   
   - **Database port**: Keep the default (5432) or specify a custom port

10. **Database Authentication**:
    - Choose "Password authentication"

11. **Additional Configuration**:
    - **Initial database name**: Enter `maxjoboffers` (this will be used in your connection string)
    - **DB parameter group**: Default
    - **Option group**: Default
    - **Enable automated backups**: Yes (recommended)
    - **Backup retention period**: 7 days (adjust as needed)
    - **Backup window**: No preference or choose a specific time
    - **Enable encryption**: Yes (recommended)
    - **Enable Performance Insights**: Optional, but recommended for production
    - **Enable Enhanced Monitoring**: Optional, but recommended for production
    - **Enable auto minor version upgrade**: Yes (recommended)
    - **Maintenance window**: No preference or choose a specific time

12. **Create Database**:
    - Review your settings
    - Click "Create database"

13. **Wait for the Database to be Created**:
    - This process may take 5-15 minutes
    - You can monitor the status in the RDS Dashboard

## Configuring Security Groups

To allow your application to connect to the RDS instance, you need to configure the security group:

1. **Navigate to the Security Group**:
   - In the RDS Dashboard, click on your database instance
   - Under "Connectivity & security", find the VPC security group
   - Click on the security group to open it in the EC2 Dashboard

2. **Add Inbound Rules**:
   - Select the "Inbound rules" tab
   - Click "Edit inbound rules"
   - Clicsk "Add rule"
   - Set the following:
     - **Type**: PostgreSQL
     - **Protocol**: TCP
     - **Port range**: 5432
     - **Source**: 
       - For development: Your IP address or `0.0.0.0/0` (not recommended for production)
       - For production: The IP range of your application servers or VPC CIDR
   - Click "Save rules"

## Creating a Database User and Schema

After your RDS instance is running, connect to it and create a dedicated user and schema for your application:

1. **Connect to the Database**:
   ```bash
   psql -h your-rds-endpoint.region.rds.amazonaws.com -U maxjoboffers_admin -d maxjoboffers
   ```

2. **Create an Application User**:
   ```sql
   CREATE USER maxjoboffers_app WITH PASSWORD 'your-secure-password';
   ```

3. **Grant Permissions**:
   ```ql
   GRANT ALL PRIVILEGES ON DATABASE maxjoboffers TO maxjoboffers_app;
   ```

4. **Create Schema and Grant Permissions**:
   ```sql
   \c maxjoboffers
   CREATE SCHEMA app;
   GRANT ALL ON SCHEMA app TO maxjoboffers_app;
   GRANT ALL ON ALL TABLES IN SCHEMA app TO maxjoboffers_app;
   ALTER DEFAULT PRIVILEGES IN SCHEMA app GRANT ALL ON TABLES TO maxjoboffers_app;
   ALTER DEFAULT PRIVILEGES IN SCHEMA app GRANT ALL ON SEQUENCES TO maxjoboffers_app;
   ```

## Connecting to Your RDS Instance

To connect to your RDS instance from your application, you'll need the connection string in the following format:

```
postgresql://username:password@endpoint:port/database
```

For example:
```
postgresql://maxjoboffers_app:your-secure-password@maxjoboffers-db.abc123xyz.us-east-1.rds.amazonaws.com:5432/maxjoboffers
```

## Setting Up Environment Variables

Update your `.env` file with the RDS connection string:

```
DATABASE_URL=postgresql://maxjoboffers_app:your-secure-password@maxjoboffers-db.abc123xyz.us-east-1.rds.amazonaws.com:5432/maxjoboffers
```

Make sure to replace the placeholders with your actual values.

## Running Database Migrations

After setting up your RDS instance and updating your environment variables, run the database migrations to create the necessary tables:

```bash
npm run db:migrate:dev
```

This will create all the required tables in your RDS database.

## Monitoring and Maintenance

AWS RDS provides several tools for monitoring and maintaining your database:

1. **CloudWatch Metrics**:
   - Monitor CPU, memory, storage, and I/O
   - Set up alarms for critical thresholds

2. **Performance Insights**:
   - Analyze database performance
   - Identify bottlenecks and slow queries

3. **Enhanced Monitoring**:
   - Get detailed OS-level metrics
   - Monitor in real-time

4. **Automated Backups**:
   - Configure backup retention period
   - Perform point-in-time recovery if needed

5. **Maintenance**:
   - Schedule maintenance windows for updates
   - Enable auto minor version upgrades

## Cost Optimization

To optimize costs while using AWS RDS:

1. **Right-size your instance**:
   - Start with a smaller instance and scale up as needed
   - Monitor performance to determine if you need to change instance types

2. **Use Reserved Instances**:
   - For production environments, consider purchasing Reserved Instances for 1-3 years
   - This can save 30-60% compared to On-Demand pricing

3. **Enable Storage Autoscaling**:
   - Only pay for the storage you use
   - Set a maximum threshold to avoid unexpected costs

4. **Monitor and clean up**:
   - Regularly review your database usage
   - Remove unnecessary data or archive it to S3

## Security Best Practices

1. **Enable Encryption**:
   - Always enable encryption at rest
   - Use SSL/TLS for connections

2. **Restrict Access**:
   - Use security groups to limit access
   - Never expose your database to the public internet in production

3. **Use IAM Authentication**:
   - Consider using IAM database authentication for additional security

4. **Regular Updates**:
   - Keep your database engine updated
   - Apply security patches promptly

5. **Audit Logging**:
   - Enable audit logging to track database activity
   - Export logs to CloudWatch Logs for analysis

## Setting Up EC2 Compute Resources

To run your MaxJobOffers application in AWS, you'll need to set up EC2 instances to host your application. This section covers how to create and configure EC2 instances and connect them to your RDS database.

### Creating an EC2 Instance

1. **Navigate to EC2 in the AWS Console**:
   - Go to the AWS Management Console
   - Search for "EC2" or find it under "Compute" services
   - Click on "EC2" to open the EC2 Dashboard

2. **Launch an EC2 Instance**:
   - Click the "Launch instance" button
   - Choose a name for your instance (e.g., `maxjoboffers-app`)

3. **Choose an Amazon Machine Image (AMI)**:
   - Select "Amazon Linux 2023" (recommended for Node.js applications)
   - This provides a stable, secure, and high-performance execution environment

4. **Select an Instance Type**:
   - For development/testing: `t2.micro` (free tier eligible)
   - For production: At least `t2.small` or `t2.medium` based on expected load
   - Click "Next"

5. **Configure Instance Details**:
   - **Network**: Select the same VPC as your RDS instance
   - **Subnet**: Choose a public subnet for easier access
   - **Auto-assign Public IP**: Enable
   - **IAM role**: Create or select a role with appropriate permissions (S3, CloudWatch, etc.)

6. **Add Storage**:
   - Default storage (8 GB) is usually sufficient for the application
   - Increase if you expect to store a lot of data locally
   - Choose SSD (gp2) for better performance

7. **Configure Security Group**:
   - Create a new security group
   - Add rules to allow:
     - SSH (port 22) from your IP address
     - HTTP (port 80) from anywhere
     - HTTPS (port 443) from anywhere
     - Application port (e.g., 3000) from anywhere or specific IPs

8. **Review and Launch**:
   - Review your configuration
   - Click "Launch"
   - You'll be prompted to create or select a key pair for SSH access:
     
     **Key pair name**: Choose a descriptive name that identifies the purpose and environment, such as:
     - `maxjoboffers-prod-key` (for production)
     - `maxjoboffers-dev-key` (for development)
     - `maxjoboffers-[your-name]-key` (for personal use)
     
     **Key pair type**: Choose RSA
     
     **Private key file format**: Choose .pem for macOS/Linux or .ppk for Windows (if using PuTTY)
   
   - Click "Create key pair" and save the downloaded key file securely
     - On macOS/Linux: `chmod 400 your-key-pair-name.pem` to set proper permissions
     - Never share your private key or store it in public repositories
   
   - Click "Launch Instances"

### Connecting EC2 to RDS

To allow your EC2 instance to communicate with your RDS database, you need to configure the security groups:

1. **Update RDS Security Group**:
   - Go to the RDS Dashboard
   - Select your database instance
   - Go to the "Connectivity & security" tab
   - Click on the VPC security group
   - Add an inbound rule:
     - Type: PostgreSQL
     - Protocol: TCP
     - Port: 5432
     - Source: Your EC2 security group ID
   - Save the rules

2. **Test Connectivity from EC2 to RDS**:
   - SSH into your EC2 instance:
     ```bash
     ssh -i your-key.pem ec2-user@your-ec2-public-ip
     ```
   - Install PostgreSQL client:
     ```bash
     sudo yum install postgresql15
     ```
   - Test the connection:
     ```bash
     psql -h your-rds-endpoint.region.rds.amazonaws.com -U maxjoboffers_app -d maxjoboffers
     ```
   - If you can connect successfully, your EC2 instance can communicate with your RDS database

### Deploying the Application to EC2

1. **Install Node.js and npm**:
   ```bash
   # Connect to your EC2 instance
   ssh -i your-key.pem ec2-user@your-ec2-public-ip

   # Update the system
   sudo yum update -y

   # Install Node.js and npm
   curl -fsSL https://rpm.nodesource.com/setup_18.x | sudo bash -
   sudo yum install -y nodejs

   # Verify installation
   node -v
   npm -v
   ```

2. **Install Git and Clone Your Repository**:
   ```bash
   # Install Git
   sudo yum install -y git

   # Clone your repository
   git clone https://github.com/yourusername/maxjoboffers.git
   cd maxjoboffers
   ```

3. **Set Up Environment Variables**:
   ```bash
   # Create .env file
   nano .env

   # Add your environment variables, including the RDS connection string
   DATABASE_URL=postgresql://maxjoboffers_app:your-secure-password@your-rds-endpoint.region.rds.amazonaws.com:5432/maxjoboffers
   # Add other environment variables as needed
   ```

4. **Install Dependencies and Build the Application**:
   ```bash
   # Install dependencies
   npm install

   # Build the application
   npm run build
   ```

5. **Set Up Process Manager (PM2)**:
   ```bash
   # Install PM2 globally
   sudo npm install -g pm2

   # Start the application with PM2
   pm2 start npm --name "maxjoboffers" -- start

   # Set PM2 to start on system boot
   pm2 startup
   sudo env PATH=$PATH:/usr/bin pm2 startup systemd -u ec2-user --hp /home/ec2-user
   pm2 save
   ```

6. **Set Up Nginx as a Reverse Proxy**:
   ```bash
   # Install Nginx
   sudo yum install -y nginx

   # Configure Nginx
   sudo nano /etc/nginx/conf.d/maxjoboffers.conf
   ```

   Add the following configuration:
   ```nginx
   server {
       listen 80;
       server_name your-domain.com www.your-domain.com;

       location / {
           proxy_pass http://localhost:3000;
           proxy_http_version 1.1;
           proxy_set_header Upgrade $http_upgrade;
           proxy_set_header Connection 'upgrade';
           proxy_set_header Host $host;
           proxy_cache_bypass $http_upgrade;
       }
   }
   ```

   ```bash
   # Test Nginx configuration
   sudo nginx -t

   # Start Nginx and enable it on boot
   sudo systemctl start nginx
   sudo systemctl enable nginx
   ```

7. **Set Up SSL with Let's Encrypt (Optional but Recommended)**:
   ```bash
   # Install Certbot
   sudo yum install -y certbot python3-certbot-nginx

   # Obtain and install SSL certificate
   sudo certbot --nginx -d your-domain.com -d www.your-domain.com
   ```

### Setting Up Auto Scaling (Optional)

For production environments, you might want to set up auto scaling to handle varying loads:

1. **Create an AMI from Your EC2 Instance**:
   - In the EC2 Dashboard, select your instance
   - Click "Actions" > "Image and templates" > "Create image"
   - Provide a name and description
   - Click "Create image"

2. **Create a Launch Template**:
   - In the EC2 Dashboard, go to "Launch Templates"
   - Click "Create launch template"
   - Select the AMI you created
   - Configure instance details, storage, and security groups
   - Add user data script to set up the application on launch

3. **Create an Auto Scaling Group**:
   - In the EC2 Dashboard, go to "Auto Scaling Groups"
   - Click "Create Auto Scaling group"
   - Select your launch template
   - Configure group size and scaling policies
   - Set up load balancing if needed

### Setting Up a Load Balancer (Optional)

For high-availability setups:

1. **Create a Target Group**:
   - In the EC2 Dashboard, go to "Target Groups"
   - Click "Create target group"
   - Choose "Instances" as the target type
   - Configure health checks
   - Register your EC2 instances

2. **Create an Application Load Balancer**:
   - In the EC2 Dashboard, go to "Load Balancers"
   - Click "Create Load Balancer"
   - Choose "Application Load Balancer"
   - Configure listeners and routing
   - Assign security groups
   - Select your target group

## Networking Between EC2 and RDS

Understanding the networking between your EC2 instances and RDS database is crucial for security and performance:

### VPC Configuration

1. **Use the Same VPC**:
   - Place both EC2 and RDS in the same VPC for optimal performance
   - This allows direct communication without going through the public internet

2. **Subnet Configuration**:
   - Place EC2 instances in public subnets if they need to be accessible from the internet
   - Place RDS in private subnets for better security
   - Configure route tables appropriately

3. **Security Group Rules**:
   - EC2 security group: Allow inbound traffic on your application ports (80, 443, 3000, etc.)
   - RDS security group: Allow inbound PostgreSQL traffic (port 5432) only from EC2 security groups
   - Restrict SSH access to EC2 instances to specific IP addresses

### Network ACLs

1. **Configure Network ACLs**:
   - Set up network ACLs as an additional layer of security
   - Allow necessary traffic between EC2 and RDS subnets
   - Block unnecessary traffic

### VPC Endpoints (Optional)

1. **Set Up VPC Endpoints for AWS Services**:
   - Create VPC endpoints for S3, DynamoDB, etc.
   - This allows your EC2 instances to access AWS services without going through the public internet
   - Improves security and reduces data transfer costs

## Conclusion

You now have a fully configured AWS environment for your MaxJobOffers application, including:

1. An AWS RDS PostgreSQL instance for your database
2. EC2 instances to run your application
3. Proper networking between EC2 and RDS
4. Optional auto scaling and load balancing for production environments

This setup provides a scalable, managed solution that can grow with your application's needs.

For additional help or advanced configurations, refer to:
- [AWS RDS Documentation](https://docs.aws.amazon.com/rds/)
- [AWS EC2 Documentation](https://docs.aws.amazon.com/ec2/)
- [AWS VPC Documentation](https://docs.aws.amazon.com/vpc/)
