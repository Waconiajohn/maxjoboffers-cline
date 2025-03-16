#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const { promisify } = require('util');

const readFile = promisify(fs.readFile);
const writeFile = promisify(fs.writeFile);
const readdir = promisify(fs.readdir);
const stat = promisify(fs.stat);

async function findTestFiles(dir) {
  const files = await readdir(dir);
  const testFiles = [];

  for (const file of files) {
    const filePath = path.join(dir, file);
    const stats = await stat(filePath);

    if (stats.isDirectory()) {
      const nestedTestFiles = await findTestFiles(filePath);
      testFiles.push(...nestedTestFiles);
    } else if (file.endsWith('.test.ts') || file.endsWith('.test.tsx')) {
      testFiles.push(filePath);
    }
  }

  return testFiles;
}

async function migrateTestFile(filePath) {
  console.log(`Migrating ${filePath}...`);
  let content = await readFile(filePath, 'utf8');

  // Replace Jest imports with Vitest imports
  content = content.replace(
    /import\s+{([^}]+)}\s+from\s+['"]@jest\/globals['"];?/g,
    (match, imports) => {
      const importList = imports
        .split(',')
        .map(i => i.trim())
        .filter(i => i !== 'jest')
        .join(', ');
      return `import { ${importList}, vi } from 'vitest';`;
    }
  );

  // Replace jest with vi
  content = content.replace(/jest\./g, 'vi.');
  content = content.replace(/jest\.fn/g, 'vi.fn');
  content = content.replace(/jest\.mock/g, 'vi.mock');
  content = content.replace(/jest\.spyOn/g, 'vi.spyOn');
  content = content.replace(/jest\.clearAllMocks/g, 'vi.clearAllMocks');
  content = content.replace(/jest\.resetAllMocks/g, 'vi.resetAllMocks');
  content = content.replace(/jest\.restoreAllMocks/g, 'vi.restoreAllMocks');

  // Fix missing commas and parentheses
  content = content.replace(/describe\('([^']+)'\s+\(\)/g, "describe('$1', ()");
  content = content.replace(/it\('([^']+)'\s+async\s+\(\)/g, "it('$1', async ()");
  content = content.replace(/it\('([^']+)'\s+\(\)/g, "it('$1', ()");
  content = content.replace(/beforeEach\(\(\)\s+=>/g, "beforeEach(() =>");
  content = content.replace(/afterEach\(\(\)\s+=>/g, "afterEach(() =>");
  content = content.replace(/afterAll\(\(\)\s+=>/g, "afterAll(() =>");
  content = content.replace(/beforeAll\(\(\)\s+=>/g, "beforeAll(() =>");

  // Fix mock functions
  content = content.replace(/mock\('([^']+)'\s+\(\)/g, "mock('$1', ()");

  await writeFile(filePath, content, 'utf8');
  console.log(`Successfully migrated ${filePath}`);
}

async function main() {
  try {
    const srcDir = path.join(process.cwd(), 'src');
    const testFiles = await findTestFiles(srcDir);
    
    console.log(`Found ${testFiles.length} test files to migrate`);
    
    for (const testFile of testFiles) {
      await migrateTestFile(testFile);
    }
    
    console.log('Migration completed successfully!');
  } catch (error) {
    console.error('Error during migration:', error);
    process.exit(1);
  }
}

main();
