#!/usr/bin/env node

/**
 * Fix Wasp Project Structure
 * 
 * This script fixes the Wasp project structure by:
 * 1. Creating the .wasp directory if it doesn't exist
 * 2. Initializing the Wasp project structure
 * 3. Ensuring the main.wasp file is properly recognized
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');
const readline = require('readline');

// Create readline interface for user input
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

// Get project root directory
const projectRoot = process.cwd();
console.log(`Project root: ${projectRoot}`);

// Check if .wasp directory exists
const waspDirPath = path.join(projectRoot, '.wasp');
const waspDirExists = fs.existsSync(waspDirPath);

if (waspDirExists) {
  console.log('.wasp directory already exists');
} else {
  console.log('Creating .wasp directory...');
  fs.mkdirSync(waspDirPath);
  console.log('.wasp directory created');
}

// Create necessary files in .wasp directory
const waspVersionPath = path.join(waspDirPath, 'wasp-version');
if (!fs.existsSync(waspVersionPath)) {
  console.log('Creating wasp-version file...');
  // Get the current Wasp version
  try {
    const waspVersion = execSync('wasp version').toString().trim().split('\n')[0];
    fs.writeFileSync(waspVersionPath, waspVersion);
    console.log(`wasp-version file created with version: ${waspVersion}`);
  } catch (error) {
    console.error('Error getting Wasp version:', error);
    fs.writeFileSync(waspVersionPath, '0.16.2');
    console.log('wasp-version file created with default version: 0.16.2');
  }
}

// Create out directory in .wasp if it doesn't exist
const waspOutPath = path.join(waspDirPath, 'out');
if (!fs.existsSync(waspOutPath)) {
  console.log('Creating .wasp/out directory...');
  fs.mkdirSync(waspOutPath);
  console.log('.wasp/out directory created');
}

// Create .waspinfo file if it doesn't exist
const waspInfoPath = path.join(waspDirPath, '.waspinfo');
if (!fs.existsSync(waspInfoPath)) {
  console.log('Creating .waspinfo file...');
  const waspInfo = {
    "projectName": "MaxJobOffers",
    "waspVersion": "0.16.2",
    "lastCompilation": new Date().toISOString()
  };
  fs.writeFileSync(waspInfoPath, JSON.stringify(waspInfo, null, 2));
  console.log('.waspinfo file created');
}

// Check if main.wasp file exists
const mainWaspPath = path.join(projectRoot, 'main.wasp');
if (fs.existsSync(mainWaspPath)) {
  console.log('main.wasp file exists');
} else {
  console.error('main.wasp file not found!');
  process.exit(1);
}

// Try to run wasp commands
console.log('\nAttempting to run wasp commands...');

try {
  console.log('\nRunning: wasp version');
  const waspVersionOutput = execSync('wasp version').toString();
  console.log(waspVersionOutput);
  
  console.log('\nRunning: wasp build');
  const waspBuildOutput = execSync('wasp build', { stdio: 'inherit' });
} catch (error) {
  console.error('Error running wasp commands:', error.message);
}

console.log('\nWasp project structure fix completed.');
console.log('You can now try running: wasp start');

rl.close();
