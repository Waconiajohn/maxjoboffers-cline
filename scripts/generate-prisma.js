/**
 * Script to generate Prisma client from the Wasp-generated schema
 * 
 * This script:
 * 1. Locates the Wasp-generated schema.prisma file
 * 2. Runs prisma generate to create the Prisma client
 * 
 * Usage:
 * node scripts/generate-prisma.js
 */

const { spawn } = require('child_process');
const fs = require('fs');
const path = require('path');

// Possible locations for the Wasp-generated schema.prisma file
const possibleSchemaLocations = [
  path.join(__dirname, '..', '.wasp', 'out', 'db', 'schema.prisma'),
  path.join(__dirname, '..', '.wasp', 'build', 'db', 'schema.prisma'),
  path.join(__dirname, '..', '.wasp', 'db', 'schema.prisma'),
  // Add more potential locations if needed
];

// Check if a custom schema.prisma file exists in the project
const customSchemaPath = path.join(__dirname, '..', 'prisma', 'schema.prisma');

async function createCustomSchema() {
  console.log('Creating a custom schema.prisma file...');
  
  // Create the prisma directory if it doesn't exist
  const prismaDir = path.join(__dirname, '..', 'prisma');
  if (!fs.existsSync(prismaDir)) {
    fs.mkdirSync(prismaDir, { recursive: true });
  }
  
  // Create a basic schema.prisma file
  const schemaContent = `
// This is a temporary schema.prisma file created by generate-prisma.js
// It should be replaced by the Wasp-generated schema when you run 'wasp start'

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

generator client {
  provider = "prisma-client-js"
}

// Define your models here
model User {
  id        String   @id @default(uuid())
  email     String   @unique
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
}
`;
  
  fs.writeFileSync(customSchemaPath, schemaContent);
  console.log(`Created custom schema.prisma at: ${customSchemaPath}`);
  return customSchemaPath;
}

async function main() {
  console.log('Looking for Wasp-generated schema.prisma file...');
  
  // Find the schema.prisma file
  let schemaPath = null;
  for (const location of possibleSchemaLocations) {
    if (fs.existsSync(location)) {
      schemaPath = location;
      break;
    }
  }
  
  // Check for custom schema
  if (!schemaPath && fs.existsSync(customSchemaPath)) {
    schemaPath = customSchemaPath;
  }
  
  if (!schemaPath) {
    console.error('Could not find schema.prisma file. Make sure Wasp has generated it.');
    console.error('Possible locations checked:');
    possibleSchemaLocations.forEach(loc => console.error(`- ${loc}`));
    
    console.log('\nYou need to run "wasp start" at least once to generate the schema.prisma file.');
    console.log('Alternatively, you can create a custom schema.prisma file in the prisma directory.');
    
    const createCustom = process.argv.includes('--create-custom');
    if (createCustom) {
      schemaPath = await createCustomSchema();
    } else {
      console.log('\nTo create a custom schema.prisma file, run:');
      console.log('node scripts/generate-prisma.js --create-custom');
      process.exit(1);
    }
  }
  
  console.log(`Using schema.prisma at: ${schemaPath}`);
  
  // Run prisma generate
  console.log('Running prisma generate...');
  
  return new Promise((resolve, reject) => {
    const prismaGenerate = spawn('npx', ['prisma', 'generate', '--schema', schemaPath], { 
      stdio: 'inherit',
      shell: true
    });
    
    prismaGenerate.on('close', (code) => {
      if (code === 0) {
        console.log('Prisma client generated successfully!');
        resolve();
      } else {
        console.error(`prisma generate failed with code ${code}`);
        reject(new Error(`prisma generate failed with code ${code}`));
      }
    });
    
    prismaGenerate.on('error', (err) => {
      console.error('Failed to start prisma generate process:', err);
      reject(err);
    });
  });
}

main()
  .catch(e => {
    console.error(e);
    process.exit(1);
  });
