/// <reference types="cypress" />

describe('Job Application Flow', () => {
  // Test data
  const testUser = {
    email: Cypress.env('testUserEmail'),
    password: Cypress.env('testUserPassword')
  };
  
  const resumeData = {
    title: 'My Professional Resume',
    filePath: 'fixtures/resume.pdf'
  };
  
  const jobSearchData = {
    query: 'Software Engineer',
    location: 'San Francisco, CA'
  };
  
  // Store IDs for use between tests
  let resumeId;
  let jobId;
  let optimizedResumeId;
  let coverLetterId;
  
  beforeEach(() => {
    // Login before each test
    cy.login(testUser.email, testUser.password);
  });
  
  it('should upload a resume', () => {
    // Visit the resume upload page
    cy.visit('/resumes/new');
    
    // Fill in the resume title
    cy.get('input[name="title"]').type(resumeData.title);
    
    // Upload the resume file
    cy.get('input[type="file"]').attachFile(resumeData.filePath);
    
    // Submit the form
    cy.get('button[type="submit"]').click();
    
    // Verify success message
    cy.contains('Resume uploaded successfully').should('be.visible');
    
    // Store the resume ID for later use
    cy.url().then(url => {
      resumeId = url.split('/').pop();
      cy.log(`Uploaded resume ID: ${resumeId}`);
    });
  });
  
  it('should search for jobs', () => {
    // Visit the job search page
    cy.visit('/jobs/search');
    
    // Fill in the search form
    cy.get('input[name="query"]').type(jobSearchData.query);
    cy.get('input[name="location"]').type(jobSearchData.location);
    
    // Submit the search
    cy.get('button[type="submit"]').click();
    
    // Verify search results
    cy.contains('Search results').should('be.visible');
    cy.get('[data-testid="job-card"]').should('have.length.at.least', 1);
    
    // Store the first job ID for later use
    cy.get('[data-testid="job-card"]').first().invoke('attr', 'data-job-id').then(id => {
      jobId = id;
      cy.log(`Selected job ID: ${jobId}`);
    });
  });
  
  it('should analyze and optimize the resume for the job', () => {
    // Visit the job detail page
    cy.visit(`/jobs/${jobId}`);
    
    // Click on the "Optimize Resume" button
    cy.contains('Optimize Resume').click();
    
    // Select the resume to optimize
    cy.get(`[data-resume-id="${resumeId}"]`).click();
    
    // Wait for analysis to complete
    cy.contains('Analyzing your resume...', { timeout: 15000 }).should('be.visible');
    cy.contains('Resume Analysis Results', { timeout: 30000 }).should('be.visible');
    
    // View the analysis results
    cy.get('[data-testid="match-score"]').should('be.visible');
    cy.get('[data-testid="strengths"]').should('be.visible');
    cy.get('[data-testid="weaknesses"]').should('be.visible');
    cy.get('[data-testid="improvement-suggestions"]').should('be.visible');
    
    // Click on the "Optimize Now" button
    cy.contains('Optimize Now').click();
    
    // Wait for optimization to complete
    cy.contains('Optimizing your resume...', { timeout: 15000 }).should('be.visible');
    cy.contains('Resume Optimized Successfully', { timeout: 30000 }).should('be.visible');
    
    // Store the optimized resume ID
    cy.get('[data-testid="optimized-resume-id"]').invoke('text').then(id => {
      optimizedResumeId = id;
      cy.log(`Optimized resume ID: ${optimizedResumeId}`);
    });
  });
  
  it('should generate a cover letter', () => {
    // Visit the job detail page
    cy.visit(`/jobs/${jobId}`);
    
    // Click on the "Generate Cover Letter" button
    cy.contains('Generate Cover Letter').click();
    
    // Select the optimized resume
    cy.get(`[data-resume-id="${optimizedResumeId}"]`).click();
    
    // Wait for generation to complete
    cy.contains('Generating your cover letter...', { timeout: 15000 }).should('be.visible');
    cy.contains('Cover Letter Generated Successfully', { timeout: 30000 }).should('be.visible');
    
    // Store the cover letter ID
    cy.get('[data-testid="cover-letter-id"]').invoke('text').then(id => {
      coverLetterId = id;
      cy.log(`Generated cover letter ID: ${coverLetterId}`);
    });
    
    // Verify the cover letter content
    cy.get('[data-testid="cover-letter-content"]').should('be.visible');
  });
  
  it('should apply to the job', () => {
    // Visit the job detail page
    cy.visit(`/jobs/${jobId}`);
    
    // Click on the "Apply Now" button
    cy.contains('Apply Now').click();
    
    // Select the optimized resume
    cy.get(`[data-resume-id="${optimizedResumeId}"]`).click();
    
    // Select the cover letter
    cy.get(`[data-cover-letter-id="${coverLetterId}"]`).click();
    
    // Submit the application
    cy.contains('Submit Application').click();
    
    // Wait for submission to complete
    cy.contains('Submitting your application...', { timeout: 15000 }).should('be.visible');
    cy.contains('Application Submitted Successfully', { timeout: 30000 }).should('be.visible');
    
    // Verify application status
    cy.visit('/applications');
    cy.contains(jobSearchData.query).should('be.visible');
    cy.contains('Applied').should('be.visible');
  });
  
  it('should track application status', () => {
    // Visit the applications page
    cy.visit('/applications');
    
    // Find the application
    cy.contains(jobSearchData.query).parent().as('applicationRow');
    
    // Verify application details
    cy.get('@applicationRow').contains('Applied').should('be.visible');
    cy.get('@applicationRow').contains(new Date().toLocaleDateString()).should('be.visible');
    
    // Click on the application to view details
    cy.get('@applicationRow').click();
    
    // Verify application details page
    cy.contains('Application Details').should('be.visible');
    cy.contains(jobSearchData.query).should('be.visible');
    cy.contains('Applied').should('be.visible');
    
    // Verify resume and cover letter links
    cy.contains('View Resume').should('have.attr', 'href').and('include', optimizedResumeId);
    cy.contains('View Cover Letter').should('have.attr', 'href').and('include', coverLetterId);
  });
});
