#!/usr/bin/env node

/**
 * Compare .env Files
 *
 * This script compares the .env files across the different codebases
 */

const fs = require('fs');
const path = require('path');

// Define the paths to the different codebases
const CURSOR_TUTOR_PATH = '/Users/johnschrup/.cursor-tutor';
const MAXJOBOFFERS_GITHUB_PATH = '/Users/johnschrup/maxjoboffers-github';

// Function to read an .env file and parse it into an object
const readEnvFile = (filePath) => {
  try {
    if (!fs.existsSync(filePath)) {
      return null;
    }
    
    const content = fs.readFileSync(filePath, 'utf8');
    const lines = content.split('\n');
    const env = {};
    
    for (const line of lines) {
      // Skip empty lines and comments
      if (!line.trim() || line.trim().startsWith('#')) {
        continue;
      }
      
      // Parse key-value pairs
      const match = line.match(/^([^=]+)=(.*)$/);
      if (match) {
        const key = match[1].trim();
        const value = match[2].trim();
        env[key] = value;
      }
    }
    
    return {
      content,
      env,
      lines: lines.length,
      lastModified: fs.statSync(filePath).mtime
    };
  } catch (error) {
    console.error(`Error reading .env file ${filePath}:`, error);
    return null;
  }
};

// Function to compare .env files
const compareEnvFiles = () => {
  console.log('Comparing .env files...');
  
  // Read .env files
  const cursorTutorEnv = readEnvFile(path.join(CURSOR_TUTOR_PATH, '.env'));
  const githubEnv = readEnvFile(path.join(MAXJOBOFFERS_GITHUB_PATH, '.env'));
  
  console.log('\n.env file status:');
  console.log(`- ${CURSOR_TUTOR_PATH}/.env: ${cursorTutorEnv ? 'Found' : 'Not found'}`);
  console.log(`- ${MAXJOBOFFERS_GITHUB_PATH}/.env: ${githubEnv ? 'Found' : 'Not found'}`);
  
  if (!cursorTutorEnv && !githubEnv) {
    console.log('\nNo .env files found in any codebase.');
    return;
  }
  
  // Compare file sizes
  console.log('\nFile sizes (number of lines):');
  if (cursorTutorEnv) console.log(`- ${CURSOR_TUTOR_PATH}/.env: ${cursorTutorEnv.lines} lines`);
  if (githubEnv) console.log(`- ${MAXJOBOFFERS_GITHUB_PATH}/.env: ${githubEnv.lines} lines`);
  
  // Compare last modified times
  console.log('\nLast modified times:');
  if (cursorTutorEnv) console.log(`- ${CURSOR_TUTOR_PATH}/.env: ${cursorTutorEnv.lastModified}`);
  if (githubEnv) console.log(`- ${MAXJOBOFFERS_GITHUB_PATH}/.env: ${githubEnv.lastModified}`);
  
  // Determine which .env file is the most recent
  let mostRecentEnv = null;
  let mostRecentPath = null;
  
  if (cursorTutorEnv && (!mostRecentEnv || cursorTutorEnv.lastModified > mostRecentEnv.lastModified)) {
    mostRecentEnv = cursorTutorEnv;
    mostRecentPath = `${CURSOR_TUTOR_PATH}/.env`;
  }
  
  if (githubEnv && (!mostRecentEnv || githubEnv.lastModified > mostRecentEnv.lastModified)) {
    mostRecentEnv = githubEnv;
    mostRecentPath = `${MAXJOBOFFERS_GITHUB_PATH}/.env`;
  }
  
  console.log(`\nMost recent .env file: ${mostRecentPath} (${mostRecentEnv.lastModified})`);
  
  // Compare environment variables
  console.log('\nComparing environment variables:');
  
  // Get all unique keys
  const allKeys = new Set();
  if (cursorTutorEnv) Object.keys(cursorTutorEnv.env).forEach(key => allKeys.add(key));
  if (githubEnv) Object.keys(githubEnv.env).forEach(key => allKeys.add(key));
  
  // Compare keys
  console.log('\nEnvironment variables comparison:');
  console.log('Key'.padEnd(30) + ' | ' + 'cursor-tutor'.padEnd(20) + ' | ' + 'github'.padEnd(20));
  console.log('-'.repeat(80));
  
  for (const key of Array.from(allKeys).sort()) {
    const cursorTutorValue = cursorTutorEnv && cursorTutorEnv.env[key] ? 'Present' : 'Missing';
    const githubValue = githubEnv && githubEnv.env[key] ? 'Present' : 'Missing';
    
    // Check if the values are different
    let isDifferent = false;
    
    if (cursorTutorEnv && githubEnv && cursorTutorEnv.env[key] !== githubEnv.env[key]) {
      isDifferent = true;
    }
    
    // Only show differences
    if (isDifferent || cursorTutorValue !== githubValue) {
      console.log(key.padEnd(30) + ' | ' + cursorTutorValue.padEnd(20) + ' | ' + githubValue.padEnd(20));
    }
  }
  
  // Recommendation
  console.log('\n=== RECOMMENDATION ===');
  
  if (mostRecentPath === `${CURSOR_TUTOR_PATH}/.env`) {
    console.log(`The ${CURSOR_TUTOR_PATH}/.env file is the most recent.`);
    console.log(`It was last modified on ${mostRecentEnv.lastModified}.`);
    console.log(`\nRecommendation: Use the cursor-tutor .env file as the source.`);
  } else {
    console.log(`The ${MAXJOBOFFERS_GITHUB_PATH}/.env file is the most recent.`);
    console.log(`It was last modified on ${mostRecentEnv.lastModified}.`);
    console.log(`\nRecommendation: Use the maxjoboffers-github .env file as the source.`);
  }
  
  // Suggest copying the most recent .env file to the other codebase
  console.log('\nTo synchronize .env files, run:');
  
  if (mostRecentPath === `${CURSOR_TUTOR_PATH}/.env`) {
    if (githubEnv) {
      console.log(`cp ${CURSOR_TUTOR_PATH}/.env ${MAXJOBOFFERS_GITHUB_PATH}/.env`);
    }
  } else {
    if (cursorTutorEnv) {
      console.log(`cp ${MAXJOBOFFERS_GITHUB_PATH}/.env ${CURSOR_TUTOR_PATH}/.env`);
    }
  }
};

// Run the comparison
compareEnvFiles();
