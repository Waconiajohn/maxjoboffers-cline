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
  path.join(__dirname, '..', '.wasp', 'db', 'schema.prisma')
];

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
  
  if (!schemaPath) {
    console.error('Could not find schema.prisma file. Make sure Wasp has generated it.');
    console.error('Possible locations checked:');
    possibleSchemaLocations.forEach(loc => console.error(`- ${loc}`));
    process.exit(1);
  }
  
  console.log(`Found schema.prisma at: ${schemaPath}`);
  
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
