#!/usr/bin/env node

/**
 * Synchronize Codebases
 *
 * This script synchronizes the codebases between cursor-tutor and maxjoboffers-github
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// Define the paths to the different codebases
const CURSOR_TUTOR_PATH = '/Users/johnschrup/.cursor-tutor';
const MAXJOBOFFERS_GITHUB_PATH = '/Users/johnschrup/maxjoboffers-github';

// Files and directories to exclude from synchronization
const EXCLUDE_PATTERNS = [
  'node_modules',
  '.git',
  '.env',
  'dist',
  'build',
  '.DS_Store',
  '*.log'
];

// Function to check if a path should be excluded
const shouldExclude = (filePath) => {
  return EXCLUDE_PATTERNS.some(pattern => {
    if (pattern.includes('*')) {
      const regex = new RegExp(pattern.replace('*', '.*'));
      return regex.test(path.basename(filePath));
    }
    return filePath.includes(pattern);
  });
};

// Function to copy a file
const copyFile = (source, destination) => {
  try {
    // Create the destination directory if it doesn't exist
    const destDir = path.dirname(destination);
    if (!fs.existsSync(destDir)) {
      fs.mkdirSync(destDir, { recursive: true });
    }
    
    // Copy the file
    fs.copyFileSync(source, destination);
    console.log(`Copied: ${source} -> ${destination}`);
  } catch (error) {
    console.error(`Error copying file ${source} to ${destination}:`, error);
  }
};

// Function to recursively copy files
const copyFiles = (sourceDir, destDir, relativePath = '') => {
  const currentDir = path.join(sourceDir, relativePath);
  const items = fs.readdirSync(currentDir);
  
  for (const item of items) {
    const itemRelativePath = path.join(relativePath, item);
    const sourcePath = path.join(sourceDir, itemRelativePath);
    const destPath = path.join(destDir, itemRelativePath);
    
    if (shouldExclude(sourcePath)) {
      console.log(`Skipping excluded item: ${sourcePath}`);
      continue;
    }
    
    const stats = fs.statSync(sourcePath);
    
    if (stats.isDirectory()) {
      // Create the directory if it doesn't exist
      if (!fs.existsSync(destPath)) {
        fs.mkdirSync(destPath, { recursive: true });
      }
      
      // Recursively copy files in the directory
      copyFiles(sourceDir, destDir, itemRelativePath);
    } else {
      // Check if the file exists in the destination and if it's different
      if (!fs.existsSync(destPath) || 
          fs.readFileSync(sourcePath).toString() !== fs.readFileSync(destPath).toString()) {
        copyFile(sourcePath, destPath);
      } else {
        console.log(`Skipping identical file: ${sourcePath}`);
      }
    }
  }
};

// Function to count files in a directory (excluding excluded patterns)
const countFiles = (dir) => {
  if (!fs.existsSync(dir)) {
    return 0;
  }
  
  let count = 0;
  const items = fs.readdirSync(dir);
  
  for (const item of items) {
    const fullPath = path.join(dir, item);
    
    if (shouldExclude(fullPath)) {
      continue;
    }
    
    const stats = fs.statSync(fullPath);
    
    if (stats.isDirectory()) {
      count += countFiles(fullPath);
    } else {
      count++;
    }
  }
  
  return count;
};

// Function to synchronize the codebases
const syncCodebases = () => {
  console.log('Starting codebase synchronization...');
  
  // Determine which codebase to use as the source
  let sourcePath;
  
  // Check if a source is specified in the command line arguments
  const sourceArg = process.argv.find(arg => arg.startsWith('--source='));
  if (sourceArg) {
    const specifiedSource = sourceArg.split('=')[1];
    if (specifiedSource === 'cursor-tutor') {
      sourcePath = CURSOR_TUTOR_PATH;
    } else if (specifiedSource === 'github') {
      sourcePath = MAXJOBOFFERS_GITHUB_PATH;
    } else {
      console.error(`Invalid source specified: ${specifiedSource}`);
      console.error('Valid sources are: cursor-tutor, github');
      process.exit(1);
    }
    
    if (!fs.existsSync(sourcePath) || fs.readdirSync(sourcePath).length === 0) {
      console.error(`Specified source ${sourcePath} does not exist or is empty`);
      process.exit(1);
    }
    
    console.log(`Using specified source: ${sourcePath}`);
  } else {
    // Count the number of files in each codebase
    const cursorTutorCount = countFiles(CURSOR_TUTOR_PATH);
    const githubCount = countFiles(MAXJOBOFFERS_GITHUB_PATH);
    
    console.log(`File counts:`);
    console.log(`- ${CURSOR_TUTOR_PATH}: ${cursorTutorCount} files`);
    console.log(`- ${MAXJOBOFFERS_GITHUB_PATH}: ${githubCount} files`);
    
    // Use the codebase with the most files as the source
    if (cursorTutorCount >= githubCount && cursorTutorCount > 0) {
      sourcePath = CURSOR_TUTOR_PATH;
    } else if (githubCount >= cursorTutorCount && githubCount > 0) {
      sourcePath = MAXJOBOFFERS_GITHUB_PATH;
    } else {
      console.error('No valid source codebase found');
      process.exit(1);
    }
    
    console.log(`Using ${sourcePath} as the source (has the most files)`);
  }
  
  // Synchronize to cursor-tutor if it's not the source
  if (sourcePath !== CURSOR_TUTOR_PATH && fs.existsSync(CURSOR_TUTOR_PATH)) {
    console.log(`\nSynchronizing to ${CURSOR_TUTOR_PATH}...`);
    copyFiles(sourcePath, CURSOR_TUTOR_PATH);
  }
  
  // Synchronize to maxjoboffers-github if it's not the source
  if (sourcePath !== MAXJOBOFFERS_GITHUB_PATH && fs.existsSync(MAXJOBOFFERS_GITHUB_PATH)) {
    console.log(`\nSynchronizing to ${MAXJOBOFFERS_GITHUB_PATH}...`);
    copyFiles(sourcePath, MAXJOBOFFERS_GITHUB_PATH);
  }
  
  console.log('\nCodebase synchronization complete!');
};

// Function to verify the synchronization
const verifySync = () => {
  console.log('\nVerifying synchronization...');
  
  // Get the list of files in each codebase (excluding the excluded patterns)
  const getFileList = (dir, relativePath = '', result = []) => {
    const currentDir = path.join(dir, relativePath);
    
    if (!fs.existsSync(currentDir)) {
      return result;
    }
    
    const items = fs.readdirSync(currentDir);
    
    for (const item of items) {
      const itemRelativePath = path.join(relativePath, item);
      const fullPath = path.join(dir, itemRelativePath);
      
      if (shouldExclude(fullPath)) {
        continue;
      }
      
      const stats = fs.statSync(fullPath);
      
      if (stats.isDirectory()) {
        getFileList(dir, itemRelativePath, result);
      } else {
        result.push(itemRelativePath);
      }
    }
    
    return result;
  };
  
  // Get file lists
  const cursorTutorFiles = fs.existsSync(CURSOR_TUTOR_PATH) ? getFileList(CURSOR_TUTOR_PATH) : [];
  const githubFiles = fs.existsSync(MAXJOBOFFERS_GITHUB_PATH) ? getFileList(MAXJOBOFFERS_GITHUB_PATH) : [];
  
  // Check if all files in cursor-tutor are in the github codebase
  if (cursorTutorFiles.length > 0) {
    console.log(`\nChecking files in ${CURSOR_TUTOR_PATH}...`);
    
    for (const file of cursorTutorFiles) {
      const cursorTutorPath = path.join(CURSOR_TUTOR_PATH, file);
      const githubPath = path.join(MAXJOBOFFERS_GITHUB_PATH, file);
      
      const cursorTutorContent = fs.existsSync(cursorTutorPath) ? fs.readFileSync(cursorTutorPath).toString() : '';
      const githubContent = fs.existsSync(githubPath) ? fs.readFileSync(githubPath).toString() : '';
      
      if (fs.existsSync(MAXJOBOFFERS_GITHUB_PATH) && (!fs.existsSync(githubPath) || cursorTutorContent !== githubContent)) {
        console.log(`File ${file} is different or missing in ${MAXJOBOFFERS_GITHUB_PATH}`);
      }
    }
  }
  
  // Check if all files in maxjoboffers-github are in the cursor-tutor codebase
  if (githubFiles.length > 0) {
    console.log(`\nChecking files in ${MAXJOBOFFERS_GITHUB_PATH}...`);
    
    for (const file of githubFiles) {
      const cursorTutorPath = path.join(CURSOR_TUTOR_PATH, file);
      const githubPath = path.join(MAXJOBOFFERS_GITHUB_PATH, file);
      
      const cursorTutorContent = fs.existsSync(cursorTutorPath) ? fs.readFileSync(cursorTutorPath).toString() : '';
      const githubContent = fs.existsSync(githubPath) ? fs.readFileSync(githubPath).toString() : '';
      
      if (fs.existsSync(CURSOR_TUTOR_PATH) && (!fs.existsSync(cursorTutorPath) || githubContent !== cursorTutorContent)) {
        console.log(`File ${file} is different or missing in ${CURSOR_TUTOR_PATH}`);
      }
    }
  }
  
  console.log('\nVerification complete!');
};

// Main function
const main = () => {
  // Check if the user wants to verify only
  const verifyOnly = process.argv.includes('--verify');
  
  if (verifyOnly) {
    verifySync();
  } else {
    syncCodebases();
    verifySync();
  }
};

// Run the main function
main();
