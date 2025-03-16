# MaxJobOffers Database Migration and Testing Guide

This guide provides instructions for running the database migration and tests for the MaxJobOffers application.

## Table of Contents

1. [Prerequisites](#prerequisites)
2. [Database Migration](#database-migration)
3. [Running Tests](#running-tests)
4. [Troubleshooting](#troubleshooting)

## Prerequisites

Before running the migration or tests, ensure you have the following:

- Node.js (v14 or higher)
- npm (v6 or higher)
- PostgreSQL or SQLite database
- Environment variables set up (see `.env.example`)

## Database Migration

The database migration adds new fields, tables, and relationships to support the enhanced features of the MaxJobOffers application.

### What's Included in the Migration

- New fields for existing tables (User, Resume, Job, JobApplication, CoverLetter, Interview, LinkedInProfile)
- New tables (LinkedInPost, NetworkingStrategy, SavedJob, ApplicationStatusHistory, PaymentHistory)
- Foreign key relationships between entities
- Indexes for performance optimization
- Data migration for existing records

### Running the Migration

1. **Backup your database** (the script will do this automatically, but it's always good to have a manual backup)

2. **Run the migration script**:

   ```bash
   node scripts/run-migration.js
   ```

3. **Follow the prompts** in the terminal:
   - Confirm that you want to proceed with the migration
   - The script will create a backup, run the migration, and verify the schema
   - If the migration fails, you'll have the option to restore from the backup

### Migration Process

The migration script performs the following steps:

1. **Backup**: Creates a backup of your database before making any changes
2. **Migration**: Runs the migration script to update the schema
3. **Verification**: Checks that all expected tables, columns, and indexes exist
4. **Summary**: Provides a summary of the migration results

If any step fails, the script will provide an error message and offer to restore from the backup.

## Running Tests

The MaxJobOffers application includes unit tests, integration tests, and end-to-end tests to ensure everything works correctly.

### Unit Tests

Unit tests verify that individual components work correctly in isolation.

```bash
node scripts/run-tests.js --unit
```

This will run tests for:
- Job actions (`searchJobs`, `applyToJob`)
- Cover letter actions (`generateCoverLetter`)

### Integration Tests

Integration tests verify that components work correctly together.

```bash
node scripts/run-tests.js --integration
```

This will run tests for:
- Job application flow (resume upload, job search, resume optimization, cover letter generation, job application)

### End-to-End Tests

End-to-end tests verify that the entire application works correctly from a user's perspective.

```bash
# Start the application first
npm run start

# In a separate terminal, run the E2E tests
node scripts/run-tests.js --e2e
```

This will run Cypress tests for:
- Job application flow
- Interview preparation flow
- LinkedIn profile optimization flow

### Running All Tests

To run all tests (unit, integration, and end-to-end):

```bash
node scripts/run-tests.js --all
```

## Troubleshooting

### Migration Issues

- **Database connection errors**: Check your DATABASE_URL in the .env file
- **Permission errors**: Ensure your database user has sufficient privileges
- **Schema verification errors**: Check the error message for details on what's missing

### Test Issues

- **Jest not found**: Run `npm install --save-dev jest @types/jest ts-jest`
- **Cypress not found**: The test script will install it automatically, or you can run `npm install --save-dev cypress cypress-file-upload @percy/cypress`
- **Test failures**: Check the error message and the test file for details

### Common Solutions

- **Clear database**: If tests are failing due to database state, try resetting the database
- **Update dependencies**: Run `npm update` to ensure all dependencies are up to date
- **Check environment variables**: Ensure all required environment variables are set

## Next Steps

After successfully running the migration and tests:

1. **Deploy to staging**: Test the changes in a staging environment
2. **Verify functionality**: Manually test key features
3. **Deploy to production**: Once everything is verified, deploy to production

For any issues or questions, please contact the development team.
