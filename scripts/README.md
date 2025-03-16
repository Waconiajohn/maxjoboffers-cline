# Database Migration Scripts

This directory contains scripts for managing database migrations in the MaxJobOffers project.

## Overview

The MaxJobOffers project uses Wasp, which manages Prisma under the hood. However, for custom migrations and database operations, we need to directly interact with Prisma. These scripts help with that process.

## Scripts

### generate-prisma.js

This script generates the Prisma client from the Wasp-generated schema.prisma file. It:

1. Locates the Wasp-generated schema.prisma file
2. Runs `prisma generate` to create the Prisma client

Usage:
```
node scripts/generate-prisma.js
```

If the schema.prisma file doesn't exist, you can create a custom one:
```
node scripts/generate-prisma.js --create-custom
```

### init-database.js

This script initializes the database schema using Prisma. It:

1. Uses the schema.prisma file to create the initial database schema
2. Creates all the tables needed for the application
3. Uses the --create-only flag to skip shadow database creation (which requires CREATE DATABASE permission)

Usage:
```
node scripts/init-database.js
```

This script should be run before run-migration.js to ensure that all the required tables exist in the database.

### init-database-sql.js

This script initializes the database schema using direct SQL. It:

1. Uses the create-tables.sql file to create all tables directly
2. Bypasses Prisma's shadow database requirement
3. Provides two methods: using the pg client or the psql command

Usage:
```
node scripts/init-database-sql.js
```

This is an alternative to init-database.js when the database user doesn't have CREATE DATABASE permissions.

### create-tables.sql

This SQL script creates all tables for the MaxJobOffers application. It:

1. Creates all the tables with proper relationships
2. Sets up indexes and constraints
3. Uses IF NOT EXISTS to avoid errors if tables already exist

Usage:
```
psql [DATABASE_URL] -f scripts/create-tables.sql
```

This can be used directly with psql or through the init-database-sql.js script.

### verify-database.js

This script verifies the database schema. It:

1. Connects to the database
2. Lists all tables
3. Verifies that the expected tables exist
4. Shows row counts for each table

Usage:
```
node scripts/verify-database.js
```

This script is useful for confirming that the database schema has been set up correctly.

### run-migration.js

This script runs database migrations safely. It:

1. Generates the Prisma client using generate-prisma.js
2. Creates a backup of the database
3. Runs the migration script
4. Verifies the schema has been updated correctly

Usage:
```
node scripts/run-migration.js
```

## Troubleshooting

### Error: @prisma/client did not initialize yet

If you see this error:
```
Error: @prisma/client did not initialize yet. Please run "prisma generate" and try to import it again.
```

Run the generate-prisma.js script first:
```
node scripts/generate-prisma.js
```

Then try your operation again.

### Schema Not Found

If the generate-prisma.js script can't find the schema.prisma file, you have two options:

1. Run `wasp start` at least once to generate the Wasp output files, which include the schema.prisma file.

2. Create a custom schema.prisma file by running:
```
node scripts/generate-prisma.js --create-custom
```

This will create a basic schema.prisma file in the prisma directory that can be used to generate the Prisma client. This is useful for development and testing when you don't have access to the Wasp-generated schema.

## Best Practices

1. Always run migrations through the run-migration.js script, which handles backups and verification
2. Don't modify the Wasp-generated schema.prisma file directly; update the entity definitions in main.wasp instead
3. After updating main.wasp, run `wasp start` to regenerate the schema.prisma file before running migrations
