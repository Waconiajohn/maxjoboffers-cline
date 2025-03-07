/**
 * Database migration script for MaxJobOffers schema update
 * 
 * This script updates the database schema to match the latest entity definitions
 * in the main.wasp file. It adds new fields, creates new tables, and sets up
 * relationships between entities.
 * 
 * To run this migration:
 * 1. Make sure the database is backed up
 * 2. Run: node migrations/20250307_schema_update.js
 */

const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  console.log('Starting database migration...');

  try {
    // Step 1: Add new fields to existing tables
    console.log('Adding new fields to existing tables...');
    
    // User table updates
    await prisma.$executeRaw`
      ALTER TABLE "User" 
      ADD COLUMN IF NOT EXISTS "lastLoginAt" TIMESTAMP,
      ADD COLUMN IF NOT EXISTS "profilePictureUrl" TEXT;
    `;
    
    // Resume table updates
    await prisma.$executeRaw`
      ALTER TABLE "Resume" 
      ADD COLUMN IF NOT EXISTS "matchScore" INTEGER,
      ADD COLUMN IF NOT EXISTS "keywords" TEXT[] DEFAULT '{}',
      ADD COLUMN IF NOT EXISTS "parentResumeId" TEXT;
    `;
    
    // Job table updates
    await prisma.$executeRaw`
      ALTER TABLE "Job" 
      ADD COLUMN IF NOT EXISTS "jobType" TEXT,
      ADD COLUMN IF NOT EXISTS "experienceLevel" TEXT,
      ADD COLUMN IF NOT EXISTS "industry" TEXT,
      ADD COLUMN IF NOT EXISTS "skills" TEXT[] DEFAULT '{}',
      ADD COLUMN IF NOT EXISTS "benefits" TEXT[] DEFAULT '{}';
    `;
    
    // JobApplication table updates
    await prisma.$executeRaw`
      ALTER TABLE "JobApplication" 
      ADD COLUMN IF NOT EXISTS "appliedDate" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      ADD COLUMN IF NOT EXISTS "followUpDate" TIMESTAMP,
      ADD COLUMN IF NOT EXISTS "notes" TEXT,
      ADD COLUMN IF NOT EXISTS "rejectionReason" TEXT;
    `;
    
    // CoverLetter table updates
    await prisma.$executeRaw`
      ALTER TABLE "CoverLetter" 
      ADD COLUMN IF NOT EXISTS "jobId" TEXT,
      ADD COLUMN IF NOT EXISTS "resumeId" TEXT,
      ADD COLUMN IF NOT EXISTS "format" TEXT,
      ADD COLUMN IF NOT EXISTS "version" INTEGER DEFAULT 1;
    `;
    
    // Interview table updates
    await prisma.$executeRaw`
      ALTER TABLE "Interview" 
      ADD COLUMN IF NOT EXISTS "round" INTEGER DEFAULT 1,
      ADD COLUMN IF NOT EXISTS "interviewers" TEXT[] DEFAULT '{}',
      ADD COLUMN IF NOT EXISTS "duration" INTEGER,
      ADD COLUMN IF NOT EXISTS "location" TEXT,
      ADD COLUMN IF NOT EXISTS "feedback" TEXT,
      ADD COLUMN IF NOT EXISTS "status" TEXT DEFAULT 'scheduled';
    `;
    
    // LinkedInProfile table updates
    await prisma.$executeRaw`
      ALTER TABLE "LinkedInProfile" 
      ADD COLUMN IF NOT EXISTS "profileUrl" TEXT,
      ADD COLUMN IF NOT EXISTS "connections" INTEGER,
      ADD COLUMN IF NOT EXISTS "recommendations" JSONB;
    `;
    
    // Step 2: Create new tables
    console.log('Creating new tables...');
    
    // LinkedInPost table
    await prisma.$executeRaw`
      CREATE TABLE IF NOT EXISTS "LinkedInPost" (
        "id" TEXT NOT NULL,
        "userId" TEXT NOT NULL,
        "title" TEXT NOT NULL,
        "content" TEXT NOT NULL,
        "hashtags" TEXT[] DEFAULT '{}',
        "suggestedImage" TEXT,
        "engagementTips" TEXT[] DEFAULT '{}',
        "publishDate" TIMESTAMP,
        "status" TEXT DEFAULT 'draft',
        "createdAt" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
        "updatedAt" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
        
        CONSTRAINT "LinkedInPost_pkey" PRIMARY KEY ("id"),
        CONSTRAINT "LinkedInPost_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE
      );
    `;
    
    // NetworkingStrategy table
    await prisma.$executeRaw`
      CREATE TABLE IF NOT EXISTS "NetworkingStrategy" (
        "id" TEXT NOT NULL,
        "userId" TEXT NOT NULL,
        "title" TEXT NOT NULL,
        "summary" TEXT NOT NULL,
        "connectionStrategies" JSONB NOT NULL,
        "contentStrategy" JSONB NOT NULL,
        "outreachTemplates" JSONB NOT NULL,
        "kpis" JSONB NOT NULL,
        "createdAt" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
        "updatedAt" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
        
        CONSTRAINT "NetworkingStrategy_pkey" PRIMARY KEY ("id"),
        CONSTRAINT "NetworkingStrategy_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE
      );
    `;
    
    // SavedJob table
    await prisma.$executeRaw`
      CREATE TABLE IF NOT EXISTS "SavedJob" (
        "id" TEXT NOT NULL,
        "userId" TEXT NOT NULL,
        "jobId" TEXT NOT NULL,
        "notes" TEXT,
        "savedAt" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
        
        CONSTRAINT "SavedJob_pkey" PRIMARY KEY ("id"),
        CONSTRAINT "SavedJob_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE,
        CONSTRAINT "SavedJob_jobId_fkey" FOREIGN KEY ("jobId") REFERENCES "Job"("id") ON DELETE CASCADE ON UPDATE CASCADE,
        CONSTRAINT "SavedJob_userId_jobId_key" UNIQUE ("userId", "jobId")
      );
    `;
    
    // ApplicationStatusHistory table
    await prisma.$executeRaw`
      CREATE TABLE IF NOT EXISTS "ApplicationStatusHistory" (
        "id" TEXT NOT NULL,
        "applicationId" TEXT NOT NULL,
        "status" TEXT NOT NULL,
        "date" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
        "notes" TEXT,
        
        CONSTRAINT "ApplicationStatusHistory_pkey" PRIMARY KEY ("id"),
        CONSTRAINT "ApplicationStatusHistory_applicationId_fkey" FOREIGN KEY ("applicationId") REFERENCES "JobApplication"("id") ON DELETE CASCADE ON UPDATE CASCADE
      );
    `;
    
    // PaymentHistory table
    await prisma.$executeRaw`
      CREATE TABLE IF NOT EXISTS "PaymentHistory" (
        "id" TEXT NOT NULL,
        "userId" TEXT NOT NULL,
        "amount" DECIMAL(10,2) NOT NULL,
        "currency" TEXT NOT NULL DEFAULT 'USD',
        "description" TEXT NOT NULL,
        "paymentMethod" TEXT NOT NULL,
        "status" TEXT NOT NULL,
        "stripePaymentId" TEXT,
        "createdAt" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
        
        CONSTRAINT "PaymentHistory_pkey" PRIMARY KEY ("id"),
        CONSTRAINT "PaymentHistory_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE
      );
    `;
    
    // Step 3: Set up foreign key relationships
    console.log('Setting up foreign key relationships...');
    
    // Resume self-reference for versioning
    await prisma.$executeRaw`
      ALTER TABLE "Resume" 
      ADD CONSTRAINT IF NOT EXISTS "Resume_parentResumeId_fkey" 
      FOREIGN KEY ("parentResumeId") 
      REFERENCES "Resume"("id") 
      ON DELETE SET NULL 
      ON UPDATE CASCADE;
    `;
    
    // CoverLetter references to Job and Resume
    await prisma.$executeRaw`
      ALTER TABLE "CoverLetter" 
      ADD CONSTRAINT IF NOT EXISTS "CoverLetter_jobId_fkey" 
      FOREIGN KEY ("jobId") 
      REFERENCES "Job"("id") 
      ON DELETE SET NULL 
      ON UPDATE CASCADE;
      
      ALTER TABLE "CoverLetter" 
      ADD CONSTRAINT IF NOT EXISTS "CoverLetter_resumeId_fkey" 
      FOREIGN KEY ("resumeId") 
      REFERENCES "Resume"("id") 
      ON DELETE SET NULL 
      ON UPDATE CASCADE;
    `;
    
    // Step 4: Create indexes for performance
    console.log('Creating indexes for performance optimization...');
    
    // Indexes for foreign keys
    await prisma.$executeRaw`CREATE INDEX IF NOT EXISTS "Resume_userId_idx" ON "Resume"("userId");`;
    await prisma.$executeRaw`CREATE INDEX IF NOT EXISTS "Resume_parentResumeId_idx" ON "Resume"("parentResumeId");`;
    await prisma.$executeRaw`CREATE INDEX IF NOT EXISTS "JobApplication_userId_idx" ON "JobApplication"("userId");`;
    await prisma.$executeRaw`CREATE INDEX IF NOT EXISTS "JobApplication_jobId_idx" ON "JobApplication"("jobId");`;
    await prisma.$executeRaw`CREATE INDEX IF NOT EXISTS "JobApplication_resumeId_idx" ON "JobApplication"("resumeId");`;
    await prisma.$executeRaw`CREATE INDEX IF NOT EXISTS "JobApplication_coverLetterId_idx" ON "JobApplication"("coverLetterId");`;
    await prisma.$executeRaw`CREATE INDEX IF NOT EXISTS "CoverLetter_userId_idx" ON "CoverLetter"("userId");`;
    await prisma.$executeRaw`CREATE INDEX IF NOT EXISTS "CoverLetter_jobId_idx" ON "CoverLetter"("jobId");`;
    await prisma.$executeRaw`CREATE INDEX IF NOT EXISTS "CoverLetter_resumeId_idx" ON "CoverLetter"("resumeId");`;
    await prisma.$executeRaw`CREATE INDEX IF NOT EXISTS "Interview_userId_idx" ON "Interview"("userId");`;
    await prisma.$executeRaw`CREATE INDEX IF NOT EXISTS "Interview_jobApplicationId_idx" ON "Interview"("jobApplicationId");`;
    await prisma.$executeRaw`CREATE INDEX IF NOT EXISTS "LinkedInPost_userId_idx" ON "LinkedInPost"("userId");`;
    await prisma.$executeRaw`CREATE INDEX IF NOT EXISTS "NetworkingStrategy_userId_idx" ON "NetworkingStrategy"("userId");`;
    await prisma.$executeRaw`CREATE INDEX IF NOT EXISTS "SavedJob_userId_idx" ON "SavedJob"("userId");`;
    await prisma.$executeRaw`CREATE INDEX IF NOT EXISTS "SavedJob_jobId_idx" ON "SavedJob"("jobId");`;
    await prisma.$executeRaw`CREATE INDEX IF NOT EXISTS "ApplicationStatusHistory_applicationId_idx" ON "ApplicationStatusHistory"("applicationId");`;
    await prisma.$executeRaw`CREATE INDEX IF NOT EXISTS "PaymentHistory_userId_idx" ON "PaymentHistory"("userId");`;
    
    // Indexes for search performance
    await prisma.$executeRaw`CREATE INDEX IF NOT EXISTS "Job_title_idx" ON "Job"("title");`;
    await prisma.$executeRaw`CREATE INDEX IF NOT EXISTS "Job_company_idx" ON "Job"("company");`;
    await prisma.$executeRaw`CREATE INDEX IF NOT EXISTS "Job_location_idx" ON "Job"("location");`;
    await prisma.$executeRaw`CREATE INDEX IF NOT EXISTS "Job_jobType_idx" ON "Job"("jobType");`;
    await prisma.$executeRaw`CREATE INDEX IF NOT EXISTS "Job_experienceLevel_idx" ON "Job"("experienceLevel");`;
    await prisma.$executeRaw`CREATE INDEX IF NOT EXISTS "Job_industry_idx" ON "Job"("industry");`;
    
    // Step 5: Data migration for existing records
    console.log('Migrating existing data...');
    
    // Set default values for new required fields
    await prisma.$executeRaw`
      UPDATE "Interview" 
      SET "status" = 'completed' 
      WHERE "date" < CURRENT_TIMESTAMP AND "status" IS NULL;
    `;
    
    await prisma.$executeRaw`
      UPDATE "JobApplication" 
      SET "appliedDate" = "createdAt" 
      WHERE "appliedDate" IS NULL;
    `;
    
    // Create initial ApplicationStatusHistory records for existing applications
    await prisma.$executeRaw`
      INSERT INTO "ApplicationStatusHistory" ("id", "applicationId", "status", "date")
      SELECT 
        gen_random_uuid()::text, 
        "id", 
        "status", 
        "createdAt"
      FROM "JobApplication"
      WHERE NOT EXISTS (
        SELECT 1 FROM "ApplicationStatusHistory" 
        WHERE "ApplicationStatusHistory"."applicationId" = "JobApplication"."id"
      );
    `;
    
    console.log('Migration completed successfully!');
  } catch (error) {
    console.error('Migration failed:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

main()
  .catch(e => {
    console.error(e);
    process.exit(1);
  });
