#!/usr/bin/env node

/**
 * Analyze Codebases
 *
 * This script analyzes the codebases to determine which one has the most updated code
 */

const fs = require('fs');
const path = require('path');

// Define the paths to the different codebases
const CURSOR_TUTOR_PATH = '/Users/johnschrup/.cursor-tutor';
const MAXJOBOFFERS_GITHUB_PATH = '/Users/johnschrup/maxjoboffers-github';

// Files and directories to exclude from analysis
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

// Function to get the last modified time of a file
const getLastModifiedTime = (filePath) => {
  try {
    const stats = fs.statSync(filePath);
    return stats.mtime;
  } catch (error) {
    console.error(`Error getting last modified time for ${filePath}:`, error);
    return new Date(0); // Return epoch time if there's an error
  }
};

// Function to recursively get all files in a directory
const getFiles = (dir, relativePath = '', result = []) => {
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
      getFiles(dir, itemRelativePath, result);
    } else {
      result.push({
        path: itemRelativePath,
        fullPath: fullPath,
        mtime: stats.mtime
      });
    }
  }
  
  return result;
};

// Function to analyze the codebases
const analyzeCodebases = () => {
  console.log('Analyzing codebases...');
  
  // Get all files in each codebase
  const cursorTutorFiles = fs.existsSync(CURSOR_TUTOR_PATH) ? getFiles(CURSOR_TUTOR_PATH) : [];
  const githubFiles = fs.existsSync(MAXJOBOFFERS_GITHUB_PATH) ? getFiles(MAXJOBOFFERS_GITHUB_PATH) : [];
  
  console.log(`\nFile counts:`);
  console.log(`- ${CURSOR_TUTOR_PATH}: ${cursorTutorFiles.length} files`);
  console.log(`- ${MAXJOBOFFERS_GITHUB_PATH}: ${githubFiles.length} files`);
  
  // Get the most recent file in each codebase
  const cursorTutorMostRecent = cursorTutorFiles.length > 0 ? 
    cursorTutorFiles.reduce((prev, current) => (prev.mtime > current.mtime) ? prev : current) : 
    { path: 'N/A', mtime: new Date(0) };
  
  const githubMostRecent = githubFiles.length > 0 ? 
    githubFiles.reduce((prev, current) => (prev.mtime > current.mtime) ? prev : current) : 
    { path: 'N/A', mtime: new Date(0) };
  
  console.log(`\nMost recent files:`);
  console.log(`- ${CURSOR_TUTOR_PATH}: ${cursorTutorMostRecent.path} (${cursorTutorMostRecent.mtime})`);
  console.log(`- ${MAXJOBOFFERS_GITHUB_PATH}: ${githubMostRecent.path} (${githubMostRecent.mtime})`);
  
  // Calculate the average modification time for each codebase
  const cursorTutorAvgTime = cursorTutorFiles.length > 0 ? 
    cursorTutorFiles.reduce((sum, file) => sum + file.mtime.getTime(), 0) / cursorTutorFiles.length : 
    0;
  
  const githubAvgTime = githubFiles.length > 0 ? 
    githubFiles.reduce((sum, file) => sum + file.mtime.getTime(), 0) / githubFiles.length : 
    0;
  
  console.log(`\nAverage modification times:`);
  console.log(`- ${CURSOR_TUTOR_PATH}: ${new Date(cursorTutorAvgTime)}`);
  console.log(`- ${MAXJOBOFFERS_GITHUB_PATH}: ${new Date(githubAvgTime)}`);
  
  // Determine which codebase has the most recent files
  let mostRecentCodebase;
  let mostRecentTime;
  
  if (cursorTutorMostRecent.mtime > githubMostRecent.mtime) {
    mostRecentCodebase = CURSOR_TUTOR_PATH;
    mostRecentTime = cursorTutorMostRecent.mtime;
  } else {
    mostRecentCodebase = MAXJOBOFFERS_GITHUB_PATH;
    mostRecentTime = githubMostRecent.mtime;
  }
  
  console.log(`\nCodebase with the most recent file: ${mostRecentCodebase} (${mostRecentTime})`);
  
  // Determine which codebase has the most recent files on average
  let mostRecentAvgCodebase;
  let mostRecentAvgTime;
  
  if (cursorTutorAvgTime > githubAvgTime) {
    mostRecentAvgCodebase = CURSOR_TUTOR_PATH;
    mostRecentAvgTime = new Date(cursorTutorAvgTime);
  } else {
    mostRecentAvgCodebase = MAXJOBOFFERS_GITHUB_PATH;
    mostRecentAvgTime = new Date(githubAvgTime);
  }
  
  console.log(`\nCodebase with the most recent files on average: ${mostRecentAvgCodebase} (${mostRecentAvgTime})`);
  
  // Count the number of unique files in each codebase
  const allPaths = new Set();
  
  cursorTutorFiles.forEach(file => allPaths.add(file.path));
  githubFiles.forEach(file => allPaths.add(file.path));
  
  const cursorTutorUnique = cursorTutorFiles.filter(file => 
    !githubFiles.some(f => f.path === file.path)
  );
  
  const githubUnique = githubFiles.filter(file => 
    !cursorTutorFiles.some(f => f.path === file.path)
  );
  
  console.log(`\nUnique files:`);
  console.log(`- ${CURSOR_TUTOR_PATH}: ${cursorTutorUnique.length} unique files`);
  console.log(`- ${MAXJOBOFFERS_GITHUB_PATH}: ${githubUnique.length} unique files`);
  
  // Determine which codebase has the most unique files
  let mostUniqueCodebase;
  let mostUniqueCount;
  
  if (cursorTutorUnique.length > githubUnique.length) {
    mostUniqueCodebase = CURSOR_TUTOR_PATH;
    mostUniqueCount = cursorTutorUnique.length;
  } else {
    mostUniqueCodebase = MAXJOBOFFERS_GITHUB_PATH;
    mostUniqueCount = githubUnique.length;
  }
  
  console.log(`\nCodebase with the most unique files: ${mostUniqueCodebase} (${mostUniqueCount} files)`);
  
  // Overall recommendation
  console.log('\n=== RECOMMENDATION ===');
  
  // If one codebase has both the most recent files and the most unique files, it's likely the most updated
  if (mostRecentCodebase === mostUniqueCodebase) {
    console.log(`The ${mostRecentCodebase} codebase appears to be the most updated.`);
    console.log(`It has the most recent files and the most unique files.`);
    
    if (mostRecentCodebase === CURSOR_TUTOR_PATH) {
      console.log(`\nRecommendation: Use --source=cursor-tutor when synchronizing.`);
    } else {
      console.log(`\nRecommendation: Use --source=github when synchronizing.`);
    }
  } else {
    // If the most recent and most unique codebases are different, we need to make a judgment call
    console.log(`The analysis is inconclusive:`);
    console.log(`- ${mostRecentCodebase} has the most recent files`);
    console.log(`- ${mostUniqueCodebase} has the most unique files`);
    
    // Recommend based on the average modification time
    console.log(`\nBased on the average modification time, ${mostRecentAvgCodebase} appears to be the most updated.`);
    
    if (mostRecentAvgCodebase === CURSOR_TUTOR_PATH) {
      console.log(`\nRecommendation: Use --source=cursor-tutor when synchronizing.`);
    } else {
      console.log(`\nRecommendation: Use --source=github when synchronizing.`);
    }
  }
};

// Run the analysis
analyzeCodebases();
