-- SQL script to create all tables for MaxJobOffers application
-- This can be used as an alternative to Prisma migrations if the database user doesn't have CREATE DATABASE permissions

-- User table
CREATE TABLE IF NOT EXISTS "User" (
  "id" TEXT NOT NULL,
  "email" TEXT NOT NULL,
  "name" TEXT,
  "password" TEXT,
  "lastLoginAt" TIMESTAMP,
  "profilePictureUrl" TEXT,
  "createdAt" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP NOT NULL,
  PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX IF NOT EXISTS "User_email_key" ON "User"("email");

-- Resume table
CREATE TABLE IF NOT EXISTS "Resume" (
  "id" TEXT NOT NULL,
  "userId" TEXT NOT NULL,
  "title" TEXT NOT NULL,
  "content" TEXT NOT NULL,
  "matchScore" INTEGER,
  "keywords" TEXT[] DEFAULT '{}',
  "parentResumeId" TEXT,
  "createdAt" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP NOT NULL,
  PRIMARY KEY ("id"),
  CONSTRAINT "Resume_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT "Resume_parentResumeId_fkey" FOREIGN KEY ("parentResumeId") REFERENCES "Resume"("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- Job table
CREATE TABLE IF NOT EXISTS "Job" (
  "id" TEXT NOT NULL,
  "title" TEXT NOT NULL,
  "company" TEXT NOT NULL,
  "location" TEXT NOT NULL,
  "description" TEXT NOT NULL,
  "salary" TEXT,
  "url" TEXT,
  "jobType" TEXT,
  "experienceLevel" TEXT,
  "industry" TEXT,
  "skills" TEXT[] DEFAULT '{}',
  "benefits" TEXT[] DEFAULT '{}',
  "createdAt" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP NOT NULL,
  PRIMARY KEY ("id")
);

-- CoverLetter table
CREATE TABLE IF NOT EXISTS "CoverLetter" (
  "id" TEXT NOT NULL,
  "userId" TEXT NOT NULL,
  "title" TEXT NOT NULL,
  "content" TEXT NOT NULL,
  "jobId" TEXT,
  "resumeId" TEXT,
  "format" TEXT,
  "version" INTEGER NOT NULL DEFAULT 1,
  "createdAt" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP NOT NULL,
  PRIMARY KEY ("id"),
  CONSTRAINT "CoverLetter_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT "CoverLetter_jobId_fkey" FOREIGN KEY ("jobId") REFERENCES "Job"("id") ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT "CoverLetter_resumeId_fkey" FOREIGN KEY ("resumeId") REFERENCES "Resume"("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- JobApplication table
CREATE TABLE IF NOT EXISTS "JobApplication" (
  "id" TEXT NOT NULL,
  "userId" TEXT NOT NULL,
  "jobId" TEXT NOT NULL,
  "resumeId" TEXT,
  "coverLetterId" TEXT,
  "status" TEXT NOT NULL,
  "appliedDate" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "followUpDate" TIMESTAMP,
  "notes" TEXT,
  "rejectionReason" TEXT,
  "createdAt" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP NOT NULL,
  PRIMARY KEY ("id"),
  CONSTRAINT "JobApplication_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT "JobApplication_jobId_fkey" FOREIGN KEY ("jobId") REFERENCES "Job"("id") ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT "JobApplication_resumeId_fkey" FOREIGN KEY ("resumeId") REFERENCES "Resume"("id") ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT "JobApplication_coverLetterId_fkey" FOREIGN KEY ("coverLetterId") REFERENCES "CoverLetter"("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- Interview table
CREATE TABLE IF NOT EXISTS "Interview" (
  "id" TEXT NOT NULL,
  "userId" TEXT NOT NULL,
  "jobApplicationId" TEXT NOT NULL,
  "date" TIMESTAMP NOT NULL,
  "round" INTEGER NOT NULL DEFAULT 1,
  "interviewers" TEXT[] DEFAULT '{}',
  "duration" INTEGER,
  "location" TEXT,
  "feedback" TEXT,
  "status" TEXT NOT NULL DEFAULT 'scheduled',
  "createdAt" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP NOT NULL,
  PRIMARY KEY ("id"),
  CONSTRAINT "Interview_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT "Interview_jobApplicationId_fkey" FOREIGN KEY ("jobApplicationId") REFERENCES "JobApplication"("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- LinkedInProfile table
CREATE TABLE IF NOT EXISTS "LinkedInProfile" (
  "id" TEXT NOT NULL,
  "userId" TEXT NOT NULL,
  "headline" TEXT,
  "summary" TEXT,
  "profileUrl" TEXT,
  "connections" INTEGER,
  "recommendations" JSONB,
  "createdAt" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP NOT NULL,
  PRIMARY KEY ("id"),
  CONSTRAINT "LinkedInProfile_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE
);

CREATE UNIQUE INDEX IF NOT EXISTS "LinkedInProfile_userId_key" ON "LinkedInProfile"("userId");

-- LinkedInPost table
CREATE TABLE IF NOT EXISTS "LinkedInPost" (
  "id" TEXT NOT NULL,
  "userId" TEXT NOT NULL,
  "title" TEXT NOT NULL,
  "content" TEXT NOT NULL,
  "hashtags" TEXT[] DEFAULT '{}',
  "suggestedImage" TEXT,
  "engagementTips" TEXT[] DEFAULT '{}',
  "publishDate" TIMESTAMP,
  "status" TEXT NOT NULL DEFAULT 'draft',
  "createdAt" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP NOT NULL,
  PRIMARY KEY ("id"),
  CONSTRAINT "LinkedInPost_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- NetworkingStrategy table
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
  "updatedAt" TIMESTAMP NOT NULL,
  PRIMARY KEY ("id"),
  CONSTRAINT "NetworkingStrategy_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- SavedJob table
CREATE TABLE IF NOT EXISTS "SavedJob" (
  "id" TEXT NOT NULL,
  "userId" TEXT NOT NULL,
  "jobId" TEXT NOT NULL,
  "notes" TEXT,
  "savedAt" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY ("id"),
  CONSTRAINT "SavedJob_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT "SavedJob_jobId_fkey" FOREIGN KEY ("jobId") REFERENCES "Job"("id") ON DELETE CASCADE ON UPDATE CASCADE
);

CREATE UNIQUE INDEX IF NOT EXISTS "SavedJob_userId_jobId_key" ON "SavedJob"("userId", "jobId");

-- ApplicationStatusHistory table
CREATE TABLE IF NOT EXISTS "ApplicationStatusHistory" (
  "id" TEXT NOT NULL,
  "applicationId" TEXT NOT NULL,
  "status" TEXT NOT NULL,
  "date" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "notes" TEXT,
  PRIMARY KEY ("id"),
  CONSTRAINT "ApplicationStatusHistory_applicationId_fkey" FOREIGN KEY ("applicationId") REFERENCES "JobApplication"("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- PaymentHistory table
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
  PRIMARY KEY ("id"),
  CONSTRAINT "PaymentHistory_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE
);
