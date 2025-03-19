#!/usr/bin/env node

/**
 * Test Resume Upload
 *
 * This script tests uploading a resume to S3 and simulates parsing and matching it to a job description
 */

const fs = require('fs');
const path = require('path');
const { Upload } = require('@aws-sdk/lib-storage');
const { S3Client } = require('@aws-sdk/client-s3');

// Define the AWS region and bucket name from environment variables
const REGION = process.env.AWS_REGION || 'us-east-1';
const BUCKET_NAME = process.env.AWS_S3_BUCKET || 'executive-lms-backups-266735837284-us-east-1';

// Create an S3 client
const s3Client = new S3Client({
  region: REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY
  }
});

// Function to upload a file to S3
const uploadFile = async (filePath, key, contentType) => {
  try {
    // Read the file
    const fileContent = fs.readFileSync(filePath);
    
    // Create the upload parameters
    const uploadParams = {
      Bucket: BUCKET_NAME,
      Key: key,
      Body: fileContent,
      ContentType: contentType || 'application/octet-stream'
    };
    
    console.log(`Uploading file ${filePath} to S3 bucket ${BUCKET_NAME} with key ${key}...`);
    
    // Create a managed upload
    const upload = new Upload({
      client: s3Client,
      params: uploadParams
    });
    
    // Add event listeners for progress
    upload.on('httpUploadProgress', (progress) => {
      console.log(`Upload progress: ${Math.round((progress.loaded || 0) / (progress.total || 1) * 100)}%`);
    });
    
    // Execute the upload
    const result = await upload.done();
    console.log('File uploaded successfully:', result.Location);
    return result;
  } catch (error) {
    console.error('Error uploading file to S3:', error);
    throw error;
  }
};

// Function to generate a random file name
const generateRandomFileName = (extension) => {
  const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
  const random = Math.random().toString(36).substring(2, 8);
  return `resume-${timestamp}-${random}.${extension}`;
};

// Function to determine content type based on file extension
const getContentType = (filePath) => {
  const extension = path.extname(filePath).toLowerCase();
  
  switch (extension) {
    case '.pdf':
      return 'application/pdf';
    case '.doc':
      return 'application/msword';
    case '.docx':
      return 'application/vnd.openxmlformats-officedocument.wordprocessingml.document';
    case '.txt':
      return 'text/plain';
    default:
      return 'application/octet-stream';
  }
};

// Function to simulate parsing a resume
const simulateResumeParsing = (resumePath) => {
  console.log(`\nSimulating resume parsing for ${resumePath}...`);
  
  // In a real implementation, this would use a resume parsing service or library
  // For this test, we'll just simulate the parsing with some mock data
  
  const mockParsedData = {
    name: 'John Doe',
    email: 'john.doe@example.com',
    phone: '(555) 123-4567',
    skills: [
      'JavaScript',
      'TypeScript',
      'React',
      'Node.js',
      'AWS',
      'S3',
      'Docker',
      'CI/CD'
    ],
    experience: [
      {
        title: 'Senior Software Engineer',
        company: 'Tech Company Inc.',
        location: 'San Francisco, CA',
        startDate: '2020-01',
        endDate: 'Present',
        description: 'Led development of cloud-based applications using AWS services.'
      },
      {
        title: 'Software Engineer',
        company: 'Startup LLC',
        location: 'Austin, TX',
        startDate: '2017-06',
        endDate: '2019-12',
        description: 'Developed front-end applications using React and TypeScript.'
      }
    ],
    education: [
      {
        degree: 'Bachelor of Science in Computer Science',
        institution: 'University of Technology',
        location: 'Boston, MA',
        graduationDate: '2017-05'
      }
    ]
  };
  
  console.log('Resume parsed successfully!');
  console.log('Extracted information:');
  console.log(`- Name: ${mockParsedData.name}`);
  console.log(`- Email: ${mockParsedData.email}`);
  console.log(`- Skills: ${mockParsedData.skills.join(', ')}`);
  console.log(`- Experience: ${mockParsedData.experience.length} positions`);
  console.log(`- Education: ${mockParsedData.education.length} degrees`);
  
  return mockParsedData;
};

// Function to simulate matching a resume to a job description
const simulateJobMatching = (parsedResume) => {
  console.log('\nSimulating job matching...');
  
  // Mock job description
  const mockJobDescription = {
    title: 'Senior Full Stack Developer',
    company: 'Enterprise Solutions Inc.',
    location: 'Remote',
    skills: [
      'JavaScript',
      'TypeScript',
      'React',
      'Node.js',
      'AWS',
      'MongoDB',
      'GraphQL',
      'Docker'
    ],
    experience: '3+ years of experience in full-stack development',
    education: 'Bachelor\'s degree in Computer Science or related field'
  };
  
  console.log('Job Description:');
  console.log(`- Title: ${mockJobDescription.title}`);
  console.log(`- Company: ${mockJobDescription.company}`);
  console.log(`- Required Skills: ${mockJobDescription.skills.join(', ')}`);
  
  // Calculate match score
  const matchingSkills = parsedResume.skills.filter(skill => 
    mockJobDescription.skills.includes(skill)
  );
  
  const skillMatchPercentage = Math.round(
    (matchingSkills.length / mockJobDescription.skills.length) * 100
  );
  
  console.log('\nMatch Analysis:');
  console.log(`- Matching Skills: ${matchingSkills.join(', ')}`);
  console.log(`- Skill Match: ${skillMatchPercentage}%`);
  console.log(`- Experience: ${parsedResume.experience.length > 1 ? 'Sufficient' : 'Insufficient'}`);
  console.log(`- Education: ${parsedResume.education.length > 0 ? 'Meets requirements' : 'Does not meet requirements'}`);
  
  const overallMatch = skillMatchPercentage >= 70 ? 'Strong' : skillMatchPercentage >= 50 ? 'Moderate' : 'Weak';
  console.log(`- Overall Match: ${overallMatch}`);
  
  return {
    matchingSkills,
    skillMatchPercentage,
    overallMatch
  };
};

// Main function
const main = async () => {
  try {
    // Check if AWS credentials are set
    if (!process.env.AWS_ACCESS_KEY_ID || !process.env.AWS_SECRET_ACCESS_KEY) {
      console.error('AWS credentials are not set. Please set AWS_ACCESS_KEY_ID and AWS_SECRET_ACCESS_KEY environment variables.');
      process.exit(1);
    }
    
    // Check if a resume file path is provided
    const resumePath = process.argv[2];
    if (!resumePath) {
      console.error('Please provide a path to a resume file.');
      console.error('Usage: node scripts/test-resume-upload.js path/to/resume.pdf');
      process.exit(1);
    }
    
    // Check if the file exists
    if (!fs.existsSync(resumePath)) {
      console.error(`File not found: ${resumePath}`);
      process.exit(1);
    }
    
    // Get the content type
    const contentType = getContentType(resumePath);
    
    // Upload the resume
    const extension = path.extname(resumePath).substring(1);
    const key = `resumes/${generateRandomFileName(extension)}`;
    const result = await uploadFile(resumePath, key, contentType);
    
    console.log('\nResume uploaded successfully!');
    console.log(`File uploaded to: ${result.Location}`);
    console.log(`S3 URI: s3://${BUCKET_NAME}/${key}`);
    console.log(`Direct URL: https://${BUCKET_NAME}.s3.${REGION}.amazonaws.com/${key}`);
    
    // Simulate resume parsing
    const parsedResume = simulateResumeParsing(resumePath);
    
    // Simulate job matching
    const matchResult = simulateJobMatching(parsedResume);
    
    console.log('\nTest completed successfully!');
  } catch (error) {
    console.error('Test failed:', error);
    process.exit(1);
  }
};

// Run the main function
main();
