/**
 * Feature Migration Script
 * 
 * This script helps automate the migration from a technical-type-based structure
 * to a feature-based architecture.
 * 
 * Usage:
 * node scripts/migrate-to-features.js --feature=job
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// Configuration - Define the mapping of files to features
const featureMapping = {
  job: {
    types: [
      { from: 'src/types/jobSearch.ts', to: 'src/features/job/types/jobSearch.ts' },
      { from: 'src/types/jobTracking.ts', to: 'src/features/job/types/jobTracking.ts' }
    ],
    services: [
      { from: 'src/services/jobSearch.ts', to: 'src/features/job/services/jobSearchService.ts' },
      { from: 'src/services/jobTracking.ts', to: 'src/features/job/services/jobTrackingService.ts' }
    ],
    components: [
      { from: 'src/components/jobSearch/JobSearchBoard.tsx', to: 'src/features/job/components/JobSearchBoard.tsx' },
      { from: 'src/components/jobSearch/JobCard.tsx', to: 'src/features/job/components/JobCard.tsx' },
      { from: 'src/components/jobSearch/JobSearchFilters.tsx', to: 'src/features/job/components/JobSearchFilters.tsx' },
      { from: 'src/components/jobTracking/JobTrackingDashboard.tsx', to: 'src/features/job/components/JobTrackingDashboard.tsx' },
      { from: 'src/components/jobTracking/JobTrackingCard.tsx', to: 'src/features/job/components/JobTrackingCard.tsx' }
    ]
  },
  resume: {
    types: [
      { from: 'src/types/resume.ts', to: 'src/features/resume/types/index.ts' }
    ],
    services: [
      { from: 'src/services/resumeGenerator.ts', to: 'src/features/resume/services/resumeService.ts' }
    ],
    components: [
      { from: 'src/components/ui/resume/ResumeManager.tsx', to: 'src/features/resume/components/ResumeManager.tsx' }
    ],
    ai: [
      { from: 'src/ai/resumePrompts.ts', to: 'src/features/resume/ai/resumePrompts.ts' },
      { from: 'src/ai/resumeReviewSystem.ts', to: 'src/features/resume/ai/resumeReviewSystem.ts' },
      { from: 'src/ai/resumeVersionControl.ts', to: 'src/features/resume/ai/resumeVersionControl.ts' },
      { from: 'src/ai/atsSystemsAndNotifications.ts', to: 'src/features/resume/ai/atsSystemsAndNotifications.ts' },
      { from: 'src/ai/resumeManager.ts', to: 'src/features/resume/ai/resumeManager.ts' }
    ],
    tests: [
      { from: 'src/tests/services/resumeGenerator.test.ts', to: 'src/features/resume/tests/services/resumeGenerator.test.ts' }
    ]
  },
  interview: {
    types: [
      { from: 'src/types/interviewPrep.ts', to: 'src/features/interview/types/interviewPrep.ts' }
    ],
    services: [
      { from: 'src/services/interviewPrep.ts', to: 'src/features/interview/services/interviewPrep.ts' },
      { from: 'src/services/resumeParser.ts', to: 'src/features/interview/services/resumeParser.ts' }
    ],
    components: [
      { from: 'src/components/interview/InterviewPrepDashboard.tsx', to: 'src/features/interview/components/InterviewPrepDashboard.tsx' },
      { from: 'src/components/interview/InterviewPrepViewer.tsx', to: 'src/features/interview/components/InterviewPrepViewer.tsx' },
      { from: 'src/components/interview/InterviewPrepGenerator.tsx', to: 'src/features/interview/components/InterviewPrepGenerator.tsx' }
    ],
    ai: [
      { from: 'src/ai/interviewPrompts.ts', to: 'src/features/interview/ai/interviewPrompts.ts' }
    ],
    tests: [
      { from: 'src/tests/services/interviewPrep.test.ts', to: 'src/features/interview/tests/services/interviewPrep.test.ts' },
      { from: 'src/tests/services/resumeParser.test.ts', to: 'src/features/interview/tests/services/resumeParser.test.ts' },
      { from: 'src/tests/components/interview/InterviewPrepGenerator.test.tsx', to: 'src/features/interview/tests/components/InterviewPrepGenerator.test.tsx' }
    ]
  },
  linkedin: {
    components: [
      { from: 'src/components/linkedin/LinkedInProfileEditor.tsx', to: 'src/features/linkedin/components/LinkedInProfileEditor.tsx' },
      { from: 'src/components/linkedin/SectionSelector.tsx', to: 'src/features/linkedin/components/SectionSelector.tsx' },
      { from: 'src/components/linkedin/ContentEditor.tsx', to: 'src/features/linkedin/components/ContentEditor.tsx' },
      { from: 'src/components/linkedin/PromptWindow.tsx', to: 'src/features/linkedin/components/PromptWindow.tsx' },
      { from: 'src/components/linkedin/JobTitleInput.tsx', to: 'src/features/linkedin/components/JobTitleInput.tsx' },
      { from: 'src/components/linkedin/IndustryInput.tsx', to: 'src/features/linkedin/components/IndustryInput.tsx' },
      { from: 'src/components/linkedin/UploadArea.tsx', to: 'src/features/linkedin/components/UploadArea.tsx' }
    ],
    ai: [
      { from: 'src/ai/networkingPrompts.ts', to: 'src/features/linkedin/ai/networkingPrompts.ts' }
    ]
  },
  resources: {
    types: [
      { from: 'src/mocks/resourcesAndEvents.ts', to: 'src/features/resources/types/index.ts' }
    ],
    services: [
      { from: 'src/services/resourcesAndEvents.ts', to: 'src/features/resources/services/resourcesService.ts' }
    ],
    components: [
      { from: 'src/components/resources/ResourceLibrary.tsx', to: 'src/features/resources/components/ResourceLibrary.tsx' },
      { from: 'src/components/resources/FilterChips.tsx', to: 'src/features/resources/components/FilterChips.tsx' },
      { from: 'src/components/events/UpcomingEvents.tsx', to: 'src/features/resources/components/UpcomingEvents.tsx' }
    ]
  },
  retirement: {
    types: [
      { from: 'src/types/retirement.ts', to: 'src/features/retirement/types/index.ts' }
    ],
    services: [
      { from: 'src/services/retirement.ts', to: 'src/features/retirement/services/retirementService.ts' }
    ],
    components: [
      { from: 'src/components/retirement/RetirementDashboard.tsx', to: 'src/features/retirement/components/RetirementDashboard.tsx' },
      { from: 'src/components/retirement/IncentiveCalculator.tsx', to: 'src/features/retirement/components/IncentiveCalculator.tsx' },
      { from: 'src/components/retirement/OnboardingForm.tsx', to: 'src/features/retirement/components/OnboardingForm.tsx' }
    ],
    api: [
      { from: 'src/api/retirement.ts', to: 'src/features/retirement/api/retirement.ts' }
    ],
    tests: [
      { from: 'src/tests/services/retirement.test.ts', to: 'src/features/retirement/tests/services/retirement.test.ts' },
      { from: 'src/tests/components/retirement/IncentiveCalculator.test.tsx', to: 'src/features/retirement/tests/components/IncentiveCalculator.test.tsx' },
      { from: 'src/tests/api/retirement.test.ts', to: 'src/features/retirement/tests/api/retirement.test.ts' },
      { from: 'src/tests/integration/retirementFlow.test.tsx', to: 'src/features/retirement/tests/integration/retirementFlow.test.tsx' }
    ]
  }
};

// Parse command line arguments
const args = process.argv.slice(2);
let featureArg = '';

args.forEach(arg => {
  if (arg.startsWith('--feature=')) {
    featureArg = arg.split('=')[1];
  }
});

if (!featureArg || !featureMapping[featureArg]) {
  console.log('Please specify a valid feature to migrate:');
  console.log('Usage: node scripts/migrate-to-features.js --feature=<feature-name>');
  console.log('Available features:');
  Object.keys(featureMapping).forEach(feature => {
    console.log(`  - ${feature}`);
  });
  process.exit(1);
}

const feature = featureArg;
const mapping = featureMapping[feature];

console.log(`\n🚀 Starting migration for feature: ${feature}\n`);

// Create feature directory structure
const createDirectories = () => {
  console.log('Creating directory structure...');
  
  const directories = [
    `src/features/${feature}`,
    `src/features/${feature}/components`,
    `src/features/${feature}/services`,
    `src/features/${feature}/types`
  ];
  
  // Add optional directories if needed
  if (mapping.api) directories.push(`src/features/${feature}/api`);
  if (mapping.utils) directories.push(`src/features/${feature}/utils`);
  if (mapping.hooks) directories.push(`src/features/${feature}/hooks`);
  if (mapping.context) directories.push(`src/features/${feature}/context`);
  if (mapping.ai) directories.push(`src/features/${feature}/ai`);
  if (mapping.tests) directories.push(`src/features/${feature}/tests`);
  if (mapping.tests) directories.push(`src/features/${feature}/tests/services`);
  if (mapping.tests) directories.push(`src/features/${feature}/tests/components`);
  if (mapping.tests && mapping.api) directories.push(`src/features/${feature}/tests/api`);
  if (mapping.tests) directories.push(`src/features/${feature}/tests/integration`);
  
  directories.forEach(dir => {
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
      console.log(`  ✅ Created: ${dir}`);
    } else {
      console.log(`  ℹ️ Already exists: ${dir}`);
    }
  });
};

// Copy files to new structure
const copyFiles = () => {
  console.log('\nCopying files...');
  
  const allFiles = [];
  
  // Collect all files to copy
  Object.keys(mapping).forEach(category => {
    mapping[category].forEach(file => {
      allFiles.push(file);
    });
  });
  
  // Copy each file
  allFiles.forEach(file => {
    try {
      if (fs.existsSync(file.from)) {
        // Create directory if it doesn't exist
        const dir = path.dirname(file.to);
        if (!fs.existsSync(dir)) {
          fs.mkdirSync(dir, { recursive: true });
        }
        
        // Copy the file
        fs.copyFileSync(file.from, file.to);
        console.log(`  ✅ Copied: ${file.from} -> ${file.to}`);
      } else {
        console.log(`  ⚠️ Source file not found: ${file.from}`);
      }
    } catch (error) {
      console.error(`  ❌ Error copying ${file.from}: ${error.message}`);
    }
  });
};

// Create index.ts file
const createIndexFile = () => {
  console.log('\nCreating index.ts file...');
  
  let indexContent = `/**
 * ${feature.charAt(0).toUpperCase() + feature.slice(1)} Feature Module
 * 
 * This module exports all ${feature}-related components, services, and types.
 */

`;

  // Export types
  if (mapping.types && mapping.types.length > 0) {
    indexContent += '// Export types\n';
    
    // Check if there's a single types file that should be the main export
    const mainTypesFile = mapping.types.find(file => path.basename(file.to) === 'index.ts');
    
    if (mainTypesFile) {
      indexContent += 'export * from \'./types\';\n';
    } else {
      mapping.types.forEach(file => {
        const basename = path.basename(file.to, '.ts');
        indexContent += `export * from './types/${basename}';\n`;
      });
    }
    
    indexContent += '\n';
  }

  // Export services
  if (mapping.services && mapping.services.length > 0) {
    indexContent += '// Export services\n';
    
    mapping.services.forEach(file => {
      const basename = path.basename(file.to, '.ts');
      // Convert camelCase to PascalCase for service class name
      const serviceName = basename.replace(/Service$/, '');
      const serviceVarName = serviceName.charAt(0).toLowerCase() + serviceName.slice(1) + 'Service';
      
      indexContent += `export { ${serviceVarName} } from './services/${basename}';\n`;
    });
    
    indexContent += '\n';
  }

  // Export components
  if (mapping.components && mapping.components.length > 0) {
    indexContent += '// Export components\n';
    
    mapping.components.forEach(file => {
      const basename = path.basename(file.to, '.tsx');
      indexContent += `export { default as ${basename} } from './components/${basename}';\n`;
    });
    
    indexContent += '\n';
  }

  // Export API
  if (mapping.api && mapping.api.length > 0) {
    indexContent += '// Export API\n';
    
    mapping.api.forEach(file => {
      const basename = path.basename(file.to, '.ts');
      indexContent += `export * from './api/${basename}';\n`;
    });
    
    indexContent += '\n';
  }

  // Export AI
  if (mapping.ai && mapping.ai.length > 0) {
    indexContent += '// Export AI\n';
    
    mapping.ai.forEach(file => {
      const basename = path.basename(file.to, '.ts');
      indexContent += `export * from './ai/${basename}';\n`;
    });
    
    indexContent += '\n';
  }

  // Write the index.ts file
  const indexPath = `src/features/${feature}/index.ts`;
  fs.writeFileSync(indexPath, indexContent);
  console.log(`  ✅ Created: ${indexPath}`);
};

// Create README.md file
const createReadmeFile = () => {
  console.log('\nCreating README.md file...');
  
  const featureTitle = feature.charAt(0).toUpperCase() + feature.slice(1);
  
  let readmeContent = `# ${featureTitle} Feature

This feature module provides ${feature}-related functionality for the MaxJobOffers application.

## Overview

The ${feature} feature helps users with:

`;

  // Add feature-specific descriptions
  switch (feature) {
    case 'job':
      readmeContent += `1. Searching and filtering job listings
2. Tracking job applications
3. Receiving job recommendations`;
      break;
    case 'interview':
      readmeContent += `1. Preparing for interviews with practice questions
2. Simulating mock interviews
3. Getting feedback and tips for improvement`;
      break;
    case 'linkedin':
      readmeContent += `1. Optimizing LinkedIn profiles
2. Getting content suggestions
3. Improving profile visibility`;
      break;
    case 'resources':
      readmeContent += `1. Browsing and filtering career resources
2. Discovering upcoming events
3. Saving and tracking progress through resources`;
      break;
    case 'retirement':
      readmeContent += `1. Planning for retirement
2. Calculating financial projections
3. Getting retirement recommendations`;
      break;
    default:
      readmeContent += `1. [Feature-specific functionality]
2. [Feature-specific functionality]
3. [Feature-specific functionality]`;
  }

  readmeContent += `

## Directory Structure

\`\`\`
${feature}/
`;

  // Add directories based on mapping
  if (mapping.components) readmeContent += '├── components/           # UI components\n';
  if (mapping.services) readmeContent += '├── services/             # Business logic\n';
  if (mapping.types) readmeContent += '├── types/                # TypeScript interfaces and types\n';
  if (mapping.api) readmeContent += '├── api/                  # API integration\n';
  if (mapping.utils) readmeContent += '├── utils/                # Feature-specific utilities\n';
  if (mapping.hooks) readmeContent += '├── hooks/                # Custom React hooks\n';
  if (mapping.context) readmeContent += '├── context/              # React context providers\n';
  if (mapping.ai) readmeContent += '├── ai/                   # AI prompts and utilities\n';
  if (mapping.tests) readmeContent += '├── tests/                # Tests\n';
  
  readmeContent += `├── index.ts              # Feature exports
└── README.md             # Documentation
\`\`\`

## Usage

\`\`\`tsx
// Import from the feature module
import { /* components, services, types */ } from 'src/features/${feature}';

// Example usage
// ...
\`\`\`

## Components

`;

  // Add components
  if (mapping.components && mapping.components.length > 0) {
    mapping.components.forEach(file => {
      const basename = path.basename(file.to, '.tsx');
      readmeContent += `- \`${basename}\`: [Component description]\n`;
    });
  } else {
    readmeContent += 'No components defined yet.\n';
  }

  readmeContent += `
## Services

`;

  // Add services
  if (mapping.services && mapping.services.length > 0) {
    mapping.services.forEach(file => {
      const basename = path.basename(file.to, '.ts');
      const serviceName = basename.replace(/Service$/, '');
      const serviceVarName = serviceName.charAt(0).toLowerCase() + serviceName.slice(1) + 'Service';
      
      readmeContent += `### ${serviceVarName}\n\n`;
      readmeContent += `Provides methods for [service description]:\n\n`;
      readmeContent += `- \`method1(...)\`: [Method description]\n`;
      readmeContent += `- \`method2(...)\`: [Method description]\n`;
      readmeContent += `- \`method3(...)\`: [Method description]\n\n`;
    });
  } else {
    readmeContent += 'No services defined yet.\n';
  }

  readmeContent += `
## Types

`;

  // Add types
  if (mapping.types && mapping.types.length > 0) {
    readmeContent += `The feature exports various TypeScript types:\n\n`;
    readmeContent += `- \`Type1\`: [Type description]\n`;
    readmeContent += `- \`Type2\`: [Type description]\n`;
    readmeContent += `- \`Type3\`: [Type description]\n`;
  } else {
    readmeContent += 'No types defined yet.\n';
  }

  // Write the README.md file
  const readmePath = `src/features/${feature}/README.md`;
  fs.writeFileSync(readmePath, readmeContent);
  console.log(`  ✅ Created: ${readmePath}`);
};

// Run the migration
try {
  createDirectories();
  copyFiles();
  createIndexFile();
  createReadmeFile();
  
  console.log(`\n✅ Migration completed for feature: ${feature}`);
  console.log('\nNext steps:');
  console.log('1. Review the migrated files and update imports');
  console.log('2. Update the README.md with accurate descriptions');
  console.log('3. Test the feature to ensure everything works correctly');
  console.log('4. Update the App component to import from the new feature module');
} catch (error) {
  console.error(`\n❌ Migration failed: ${error.message}`);
  process.exit(1);
}
