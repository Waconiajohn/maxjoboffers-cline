/// <reference types="cypress" />

describe('Interview Preparation Flow', () => {
  // Test data
  const testUser = {
    email: Cypress.env('testUserEmail'),
    password: Cypress.env('testUserPassword')
  };
  
  // Store IDs for use between tests
  let applicationId;
  let interviewId;
  
  beforeEach(() => {
    // Login before each test
    cy.login(testUser.email, testUser.password);
  });
  
  it('should navigate to an existing application', () => {
    // Visit the applications page
    cy.visit('/applications');
    
    // Verify applications are displayed
    cy.get('[data-testid="application-card"]').should('have.length.at.least', 1);
    
    // Store the first application ID for later use
    cy.get('[data-testid="application-card"]').first().invoke('attr', 'data-application-id').then(id => {
      applicationId = id;
      cy.log(`Selected application ID: ${applicationId}`);
    });
    
    // Click on the first application
    cy.get('[data-testid="application-card"]').first().click();
    
    // Verify application details page
    cy.contains('Application Details').should('be.visible');
  });
  
  it('should create a mock interview', () => {
    // Visit the application details page
    cy.visit(`/applications/${applicationId}`);
    
    // Click on the "Prepare for Interview" button
    cy.contains('Prepare for Interview').click();
    
    // Select interview type
    cy.contains('Interview Type').should('be.visible');
    cy.get('[data-testid="interview-type-behavioral"]').click();
    
    // Click on the "Create Mock Interview" button
    cy.contains('Create Mock Interview').click();
    
    // Verify interview creation
    cy.contains('Mock Interview Created').should('be.visible');
    
    // Store the interview ID for later use
    cy.url().then(url => {
      interviewId = url.split('/').pop();
      cy.log(`Created interview ID: ${interviewId}`);
    });
  });
  
  it('should research the company', () => {
    // Visit the interview details page
    cy.visit(`/interviews/${interviewId}`);
    
    // Click on the "Research Company" tab
    cy.contains('Research Company').click();
    
    // Verify company research is displayed
    cy.contains('Company Overview').should('be.visible');
    cy.contains('Recent News').should('be.visible');
    cy.contains('Culture & Values').should('be.visible');
    cy.contains('Interview Process').should('be.visible');
    
    // Click on "Generate Insights" button
    cy.contains('Generate Insights').click();
    
    // Wait for insights generation
    cy.contains('Generating insights...', { timeout: 15000 }).should('be.visible');
    cy.contains('Company Insights', { timeout: 30000 }).should('be.visible');
    
    // Verify insights are displayed
    cy.get('[data-testid="company-insights"]').should('be.visible');
    cy.get('[data-testid="talking-points"]').should('be.visible');
  });
  
  it('should practice interview questions', () => {
    // Visit the interview details page
    cy.visit(`/interviews/${interviewId}`);
    
    // Click on the "Practice Questions" tab
    cy.contains('Practice Questions').click();
    
    // Verify questions are displayed
    cy.get('[data-testid="question-card"]').should('have.length.at.least', 5);
    
    // Click on the first question
    cy.get('[data-testid="question-card"]').first().click();
    
    // Verify question details
    cy.contains('Question Details').should('be.visible');
    cy.get('[data-testid="question-text"]').should('be.visible');
    cy.get('[data-testid="question-category"]').should('be.visible');
    cy.get('[data-testid="question-difficulty"]').should('be.visible');
    
    // Type an answer
    cy.get('[data-testid="answer-input"]').type('This is my practice answer to the interview question. I would approach this problem by first understanding the requirements, then breaking it down into smaller steps, and finally implementing a solution that is efficient and maintainable.');
    
    // Submit the answer
    cy.contains('Submit Answer').click();
    
    // Wait for feedback generation
    cy.contains('Analyzing your answer...', { timeout: 15000 }).should('be.visible');
    cy.contains('Answer Feedback', { timeout: 30000 }).should('be.visible');
    
    // Verify feedback is displayed
    cy.get('[data-testid="feedback-content"]').should('be.visible');
    cy.get('[data-testid="feedback-score"]').should('be.visible');
    cy.get('[data-testid="feedback-strengths"]').should('be.visible');
    cy.get('[data-testid="feedback-improvements"]').should('be.visible');
  });
  
  it('should record a mock interview session', () => {
    // Visit the interview details page
    cy.visit(`/interviews/${interviewId}`);
    
    // Click on the "Mock Interview" tab
    cy.contains('Mock Interview').click();
    
    // Start the mock interview
    cy.contains('Start Mock Interview').click();
    
    // Verify interview session started
    cy.contains('Interview Session').should('be.visible');
    cy.contains('Question 1 of').should('be.visible');
    
    // Mock allowing microphone access
    cy.window().then((win) => {
      cy.stub(win.navigator.mediaDevices, 'getUserMedia').resolves({
        getTracks: () => [{
          stop: () => {}
        }]
      });
    });
    
    // Start recording
    cy.contains('Start Recording').click();
    
    // Wait for recording time
    cy.wait(5000);
    
    // Stop recording
    cy.contains('Stop Recording').click();
    
    // Verify recording saved
    cy.contains('Recording saved').should('be.visible');
    
    // Submit recording for analysis
    cy.contains('Submit for Analysis').click();
    
    // Wait for analysis
    cy.contains('Analyzing your response...', { timeout: 15000 }).should('be.visible');
    cy.contains('Response Analysis', { timeout: 30000 }).should('be.visible');
    
    // Verify analysis results
    cy.get('[data-testid="analysis-content"]').should('be.visible');
    cy.get('[data-testid="analysis-score"]').should('be.visible');
    cy.get('[data-testid="analysis-feedback"]').should('be.visible');
    
    // Move to next question
    cy.contains('Next Question').click();
    
    // Verify moved to next question
    cy.contains('Question 2 of').should('be.visible');
  });
  
  it('should view interview summary and score', () => {
    // Visit the interview details page
    cy.visit(`/interviews/${interviewId}`);
    
    // Click on the "Summary" tab
    cy.contains('Summary').click();
    
    // Verify summary is displayed
    cy.contains('Interview Summary').should('be.visible');
    cy.get('[data-testid="overall-score"]').should('be.visible');
    cy.get('[data-testid="question-summary"]').should('have.length.at.least', 1);
    cy.get('[data-testid="strength-areas"]').should('be.visible');
    cy.get('[data-testid="improvement-areas"]').should('be.visible');
    
    // Download interview report
    cy.contains('Download Report').click();
    
    // Verify download started
    cy.contains('Preparing report...').should('be.visible');
    cy.contains('Report downloaded').should('be.visible');
  });
});
