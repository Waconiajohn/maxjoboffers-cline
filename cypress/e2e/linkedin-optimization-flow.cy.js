/// <reference types="cypress" />

describe('LinkedIn Profile Optimization Flow', () => {
  // Test data
  const testUser = {
    email: Cypress.env('testUserEmail'),
    password: Cypress.env('testUserPassword')
  };
  
  const linkedInData = {
    headline: 'Senior Software Engineer with expertise in React, Node.js, and Cloud Architecture',
    summary: 'Experienced software engineer with a passion for building scalable web applications. Over 8 years of experience in full-stack development with a focus on React, Node.js, and AWS. Strong problem-solving skills and a track record of delivering high-quality software on time.'
  };
  
  const postData = {
    title: 'My Thoughts on Modern Web Development',
    content: 'In today\'s rapidly evolving tech landscape, staying current with web development trends is crucial. I\'ve been exploring the benefits of server components and how they can improve performance and developer experience.',
    hashtags: ['webdevelopment', 'react', 'servercomponents', 'frontend']
  };
  
  // Store IDs for use between tests
  let profileId;
  let postId;
  
  beforeEach(() => {
    // Login before each test
    cy.login(testUser.email, testUser.password);
  });
  
  it('should navigate to LinkedIn content page', () => {
    // Visit the LinkedIn content page
    cy.visit('/linkedin-content');
    
    // Verify page loaded
    cy.contains('LinkedIn Content').should('be.visible');
    cy.contains('Profile Optimization').should('be.visible');
    cy.contains('Content Creation').should('be.visible');
    cy.contains('Networking Strategy').should('be.visible');
  });
  
  it('should create or update LinkedIn profile', () => {
    // Visit the LinkedIn content page
    cy.visit('/linkedin-content');
    
    // Click on "Profile Optimization"
    cy.contains('Profile Optimization').click();
    
    // Check if profile exists
    cy.get('body').then(($body) => {
      if ($body.text().includes('Create LinkedIn Profile')) {
        // Create new profile flow
        cy.contains('Create LinkedIn Profile').click();
        
        // Fill in profile details
        cy.get('[data-testid="headline-input"]').type(linkedInData.headline);
        cy.get('[data-testid="summary-input"]').type(linkedInData.summary);
        
        // Add sections
        cy.contains('Add Experience').click();
        cy.get('[data-testid="experience-title-input"]').type('Senior Software Engineer');
        cy.get('[data-testid="experience-company-input"]').type('Tech Innovations Inc.');
        cy.get('[data-testid="experience-description-input"]').type('Led development of cloud-based solutions for enterprise clients.');
        cy.get('[data-testid="experience-save-button"]').click();
        
        cy.contains('Add Education').click();
        cy.get('[data-testid="education-school-input"]').type('University of Technology');
        cy.get('[data-testid="education-degree-input"]').type('Bachelor of Science in Computer Science');
        cy.get('[data-testid="education-save-button"]').click();
        
        cy.contains('Add Skills').click();
        cy.get('[data-testid="skills-input"]').type('React, Node.js, TypeScript, AWS, Docker, Kubernetes');
        cy.get('[data-testid="skills-save-button"]').click();
        
        // Save profile
        cy.contains('Create Profile').click();
      } else {
        // Update existing profile flow
        cy.contains('Edit Profile').click();
        
        // Update profile details
        cy.get('[data-testid="headline-input"]').clear().type(linkedInData.headline);
        cy.get('[data-testid="summary-input"]').clear().type(linkedInData.summary);
        
        // Save profile
        cy.contains('Update Profile').click();
      }
    });
    
    // Verify profile saved
    cy.contains('Profile saved successfully').should('be.visible');
    
    // Store the profile ID for later use
    cy.url().then(url => {
      profileId = url.split('/').pop();
      cy.log(`LinkedIn profile ID: ${profileId}`);
    });
  });
  
  it('should optimize LinkedIn profile', () => {
    // Visit the LinkedIn profile page
    cy.visit(`/linkedin-content/profile/${profileId}`);
    
    // Click on "Optimize Profile" button
    cy.contains('Optimize Profile').click();
    
    // Select optimization target
    cy.contains('Select Optimization Target').should('be.visible');
    cy.get('[data-testid="optimization-target-software-engineer"]').click();
    
    // Click on "Start Optimization" button
    cy.contains('Start Optimization').click();
    
    // Wait for optimization to complete
    cy.contains('Analyzing your profile...', { timeout: 15000 }).should('be.visible');
    cy.contains('Profile Analysis Results', { timeout: 30000 }).should('be.visible');
    
    // Verify analysis results
    cy.get('[data-testid="optimization-score"]').should('be.visible');
    cy.get('[data-testid="profile-strengths"]').should('be.visible');
    cy.get('[data-testid="profile-weaknesses"]').should('be.visible');
    cy.get('[data-testid="improvement-suggestions"]').should('be.visible');
    
    // Apply optimization suggestions
    cy.contains('Apply Suggestions').click();
    
    // Wait for optimization to complete
    cy.contains('Optimizing your profile...', { timeout: 15000 }).should('be.visible');
    cy.contains('Profile Optimized Successfully', { timeout: 30000 }).should('be.visible');
    
    // Verify optimization results
    cy.get('[data-testid="new-optimization-score"]').should('be.visible');
    cy.get('[data-testid="optimized-headline"]').should('be.visible');
    cy.get('[data-testid="optimized-summary"]').should('be.visible');
    cy.get('[data-testid="optimized-skills"]').should('be.visible');
  });
  
  it('should create LinkedIn post', () => {
    // Visit the LinkedIn content page
    cy.visit('/linkedin-content');
    
    // Click on "Content Creation"
    cy.contains('Content Creation').click();
    
    // Click on "Create New Post" button
    cy.contains('Create New Post').click();
    
    // Fill in post details
    cy.get('[data-testid="post-title-input"]').type(postData.title);
    cy.get('[data-testid="post-content-input"]').type(postData.content);
    
    // Add hashtags
    postData.hashtags.forEach(hashtag => {
      cy.get('[data-testid="hashtag-input"]').type(hashtag);
      cy.get('[data-testid="add-hashtag-button"]').click();
    });
    
    // Generate image suggestion
    cy.contains('Generate Image Suggestion').click();
    
    // Wait for image generation
    cy.contains('Generating image suggestion...', { timeout: 15000 }).should('be.visible');
    cy.contains('Image Suggestion Generated', { timeout: 30000 }).should('be.visible');
    
    // Verify image suggestion
    cy.get('[data-testid="suggested-image"]').should('be.visible');
    
    // Save post
    cy.contains('Save Post').click();
    
    // Verify post saved
    cy.contains('Post saved successfully').should('be.visible');
    
    // Store the post ID for later use
    cy.url().then(url => {
      postId = url.split('/').pop();
      cy.log(`LinkedIn post ID: ${postId}`);
    });
  });
  
  it('should optimize LinkedIn post', () => {
    // Visit the LinkedIn post page
    cy.visit(`/linkedin-content/post/${postId}`);
    
    // Click on "Optimize Post" button
    cy.contains('Optimize Post').click();
    
    // Select optimization target
    cy.contains('Select Audience').should('be.visible');
    cy.get('[data-testid="audience-target-tech-professionals"]').click();
    
    // Click on "Start Optimization" button
    cy.contains('Start Optimization').click();
    
    // Wait for optimization to complete
    cy.contains('Analyzing your post...', { timeout: 15000 }).should('be.visible');
    cy.contains('Post Analysis Results', { timeout: 30000 }).should('be.visible');
    
    // Verify analysis results
    cy.get('[data-testid="engagement-score"]').should('be.visible');
    cy.get('[data-testid="post-strengths"]').should('be.visible');
    cy.get('[data-testid="post-weaknesses"]').should('be.visible');
    cy.get('[data-testid="improvement-suggestions"]').should('be.visible');
    
    // Apply optimization suggestions
    cy.contains('Apply Suggestions').click();
    
    // Wait for optimization to complete
    cy.contains('Optimizing your post...', { timeout: 15000 }).should('be.visible');
    cy.contains('Post Optimized Successfully', { timeout: 30000 }).should('be.visible');
    
    // Verify optimization results
    cy.get('[data-testid="new-engagement-score"]').should('be.visible');
    cy.get('[data-testid="optimized-title"]').should('be.visible');
    cy.get('[data-testid="optimized-content"]').should('be.visible');
    cy.get('[data-testid="optimized-hashtags"]').should('be.visible');
  });
  
  it('should create networking strategy', () => {
    // Visit the LinkedIn content page
    cy.visit('/linkedin-content');
    
    // Click on "Networking Strategy"
    cy.contains('Networking Strategy').click();
    
    // Click on "Create Strategy" button
    cy.contains('Create Strategy').click();
    
    // Fill in strategy details
    cy.get('[data-testid="strategy-title-input"]').type('Tech Industry Networking Plan');
    cy.get('[data-testid="strategy-summary-input"]').type('A comprehensive networking strategy to connect with tech industry professionals and thought leaders.');
    
    // Add connection strategies
    cy.contains('Add Connection Strategy').click();
    cy.get('[data-testid="connection-title-input"]').type('Connect with Tech Leaders');
    cy.get('[data-testid="connection-description-input"]').type('Identify and connect with CTOs, Engineering Managers, and other tech leaders in target companies.');
    cy.get('[data-testid="connection-save-button"]').click();
    
    // Add content strategy
    cy.get('[data-testid="content-strategy-input"]').type('Share technical insights and thought leadership content weekly. Engage with industry trends and discussions.');
    
    // Add outreach templates
    cy.contains('Add Outreach Template').click();
    cy.get('[data-testid="outreach-scenario-input"]').type('Initial connection request');
    cy.get('[data-testid="outreach-template-input"]').type('Hi [Name], I noticed your work on [Project/Company] and was impressed by [Specific Achievement]. I\'d love to connect and learn more about your experience in [Industry/Role].');
    cy.get('[data-testid="outreach-save-button"]').click();
    
    // Add KPIs
    cy.contains('Add KPI').click();
    cy.get('[data-testid="kpi-metric-input"]').type('New connections');
    cy.get('[data-testid="kpi-target-input"]').type('10 per week');
    cy.get('[data-testid="kpi-save-button"]').click();
    
    // Save strategy
    cy.contains('Save Strategy').click();
    
    // Verify strategy saved
    cy.contains('Strategy saved successfully').should('be.visible');
  });
});
