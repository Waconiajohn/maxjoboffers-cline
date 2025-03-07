// ***********************************************
// This example commands.js shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************

// -- This is a parent command --
Cypress.Commands.add('login', (email, password) => {
  cy.visit('/login');
  cy.get('input[name="email"]').type(email);
  cy.get('input[name="password"]').type(password);
  cy.get('button[type="submit"]').click();
  cy.url().should('include', '/dashboard');
});

// Command to upload a resume file
Cypress.Commands.add('uploadResume', (filePath, title) => {
  cy.visit('/resumes/new');
  cy.get('input[name="title"]').type(title);
  cy.get('input[type="file"]').attachFile(filePath);
  cy.get('button[type="submit"]').click();
  cy.contains('Resume uploaded successfully').should('be.visible');
});

// Command to search for jobs
Cypress.Commands.add('searchJobs', (query, location) => {
  cy.visit('/jobs/search');
  cy.get('input[name="query"]').type(query);
  cy.get('input[name="location"]').type(location);
  cy.get('button[type="submit"]').click();
  cy.contains('Search results').should('be.visible');
});

// Command to optimize a resume for a job
Cypress.Commands.add('optimizeResume', (resumeId, jobId) => {
  cy.visit(`/resumes/${resumeId}`);
  cy.get(`[data-job-id="${jobId}"]`).click();
  cy.contains('Optimize for this job').click();
  cy.contains('Resume optimized successfully').should('be.visible');
});

// Command to generate a cover letter
Cypress.Commands.add('generateCoverLetter', (resumeId, jobId) => {
  cy.visit(`/jobs/${jobId}`);
  cy.get(`[data-resume-id="${resumeId}"]`).click();
  cy.contains('Generate Cover Letter').click();
  cy.contains('Cover letter generated successfully').should('be.visible');
});

// Command to apply for a job
Cypress.Commands.add('applyToJob', (resumeId, coverLetterId, jobId) => {
  cy.visit(`/jobs/${jobId}`);
  cy.get(`[data-resume-id="${resumeId}"]`).click();
  cy.get(`[data-cover-letter-id="${coverLetterId}"]`).click();
  cy.contains('Apply Now').click();
  cy.contains('Application submitted successfully').should('be.visible');
});

// -- This is a child command --
// Cypress.Commands.add('drag', { prevSubject: 'element'}, (subject, options) => { ... })

// -- This is a dual command --
// Cypress.Commands.add('dismiss', { prevSubject: 'optional'}, (subject, options) => { ... })

// -- This will overwrite an existing command --
// Cypress.Commands.overwrite('visit', (originalFn, url, options) => { ... })
