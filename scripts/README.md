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
