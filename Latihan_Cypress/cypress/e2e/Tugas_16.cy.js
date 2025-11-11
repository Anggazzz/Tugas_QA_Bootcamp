/// <reference types="cypress" />

describe('Testing Fitur Login OrangeHRM dengan Intercept', () => {
 
  const validUser = 'Admin';
  const validPass = 'admin123';

  const loginAPI = '**/auth/validate';
  const loginPage = '**/auth/login';

  beforeEach(() => {
   
    cy.visit('https://opensource-demo.orangehrmlive.com/web/index.php/auth/login');
    cy.url().should('include', '/auth/login');


  });


  it('TC_001. [Intercept] User berhasil login - Validasi Response Status 200', () => {
    
    cy.intercept('POST', '**/auth/validate').as('loginRequest');

   
    cy.get('input[name="username"]', { timeout: 8000 }).type(validUser);
    cy.get('input[name="password"]', { timeout: 8000 }).type(validPass);
    cy.get('button[type="submit"]').click();

   
    cy.wait('@loginRequest').its('response.statusCode').should('eq', 302);

   
    cy.url().should('include', '/dashboard');
    cy.contains('Dashboard').should('be.visible');
  });

  
  it('TC_014. [Intercept] Gagal Login - Mensimulasikan (Mock) Server Error 401', () => {
   
    cy.intercept('POST', '**/auth/validate', {
      statusCode: 401,
      body: { message: 'Forced Server Error (Mocked)' },
    }).as('mockedError');

    
    cy.get('input[name="username"]', { timeout: 8000 }).type(validUser);
    cy.get('input[name="password"]', { timeout: 8000 }).type(validPass);
    cy.get('button[type="submit"]').click();

    
    cy.wait('@mockedError');

    
  });



it('TC_014. Gagal Login: Username case-sensitive (Cek Response Status)', () => {
   
    cy.intercept('POST', loginAPI).as('loginAttempt');

    cy.visit('https://opensource-demo.orangehrmlive.com/web/index.php/auth/login'); // Ganti dengan URL login Anda

    cy.get('input[name="username"]', { timeout: 8000 }).type('admin'); // 'admin' (lowercase)
    cy.get('input[name="password"]', { timeout: 8000 }).type(validPass);
    cy.get('button[type="submit"]').click();

  
});
it('TC_015. Gagal Login: Password case-sensitive (Cek Request Body non-JSON)', () => {
   
    const validUser = 'Admin';
    const loginAPI = '**/auth/validate'; 

    cy.intercept('POST', loginAPI).as('loginAttempt');

    // Menggunakan baseUrl dari cypress.config.js
    cy.visit('https://opensource-demo.orangehrmlive.com/web/index.php/auth/login');

    cy.get('input[name="username"]', { timeout: 8000 }).type(validUser);
    cy.get('input[name="password"]', { timeout: 8000 }).type('Admin123'); // 'Admin123' (case salah)
    cy.get('button[type="submit"]').click();

   
    cy.wait('@loginAttempt').then((interception) => {
       
        
        
        console.log('Request Body:', interception.request.body);

        expect(interception.request.body).to.include('username=Admin');
        expect(interception.request.body).to.include('password=Admin123');
    });

  
    cy.get('.oxd-alert')
      .should('be.visible')
      .and('contain', 'Invalid credentials');
});

it('TC_016. Fungsional: Klik link "Forgot password?" (Cek Page Load)', () => {
  cy.visit('https://opensource-demo.orangehrmlive.com/web/index.php/auth/login');


  cy.intercept('GET', '**/auth/requestPasswordResetCode').as('resetPageLoad');

  cy.contains('Forgot your password?').click();

 
  cy.wait('@resetPageLoad').its('response.statusCode').should('eq', 200);

  
  cy.url().should('include', '/auth/requestPasswordResetCode');


  cy.get('h6.orangehrm-forgot-password-title')
    .should('be.visible')
    .and('contain', 'Reset Password');
});

it('TC_017. [UI] Validasi placeholder (Cek Response Header Halaman)', () => {
    
    cy.intercept('GET', loginPage).as('pageLoad');

    cy.visit('https://opensource-demo.orangehrmlive.com/web/index.php/auth/login');

  
    cy.wait('@pageLoad').its('response.headers.content-type').should('include', 'text/html');

    cy.get('input[name="username"]').should('have.attr', 'placeholder', 'Username');
    cy.get('input[name="password"]').should('have.attr', 'placeholder', 'Password');
});

it('TC_019. Gagal Login: Username dengan spasi (Cek Response Header)', () => {

  cy.intercept('POST', loginAPI).as('loginAttempt');
  
  cy.visit('https://opensource-demo.orangehrmlive.com/web/index.php/auth/login');

  cy.get('input[name="username"]', { timeout: 8000 }).type(' ' + validUser); // Spasi di depan
  cy.get('input[name="password"]', { timeout: 8000 }).type(validPass);
  cy.get('button[type="submit"]').click();
  

  cy.get('.oxd-alert')
    .should('be.visible')
    .and('contain', 'Invalid credentials');
    
  
  cy.wait('@loginAttempt')
    .its('response.headers.content-type')
    .should('include', 'text/html');
});
it('3. [Spy] Memvalidasi Request Header (Content-Type)', () => {
 
  cy.intercept('POST', loginAPI).as('loginAttempt');

  cy.get('input[name="username"]').type(validUser);
  cy.get('input[name="password"]').type(validPass);
  cy.get('button[type="submit"]').click();


  cy.wait('@loginAttempt').then((interception) => {
      
      expect(interception.request.headers['content-type'])
        .to.include('application/x-www-form-urlencoded');
      });

  cy.url().should('include', '/dashboard');
  });
});
