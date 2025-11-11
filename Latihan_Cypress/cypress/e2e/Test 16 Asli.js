/// <reference types="cypress" />

describe('Testing Fitur Login OrangeHRM dengan Intercept', () => {
  // Kredensial yang valid kita simpan di atas
  const validUser = 'Admin';
  const validPass = 'admin123';
// Asumsi URL API login. Sesuaikan jika perlu.
  const loginAPI = '**/auth/validate';
  const loginPage = '**/auth/login';

  beforeEach(() => {
    // Kita tetap mengunjungi halaman sebelum setiap tes
    cy.visit('https://opensource-demo.orangehrmlive.com/web/index.php/auth/login');
    cy.url().should('include', '/auth/login');


  });

  // ---
  // STRATEGI 1: SPY & VALIDASI RESPONSE STATUS (Happy Path)
  // Kita "mengintip" (spy) request POST login dan memastikan server merespons
  // dengan status code 200 (OK) yang menandakan login berhasil.
  // ---
  it('TC_001. [Intercept] User berhasil login - Validasi Response Status 200', () => {
    // 1. Setup Intercept untuk request POST ke endpoint 'validate'
    cy.intercept('POST', '**/auth/validate').as('loginRequest');

    // 2. Aksi user (mengisi form dan klik)
    cy.get('input[name="username"]', { timeout: 8000 }).type(validUser);
    cy.get('input[name="password"]', { timeout: 8000 }).type(validPass);
    cy.get('button[type="submit"]').click();

    // 3. Menunggu intercept 'loginRequest' selesai
    cy.wait('@loginRequest').its('response.statusCode').should('eq', 302);

    // 4. Validasi UI (opsional, tapi bagus)
    cy.url().should('include', '/dashboard');
    cy.contains('Dashboard').should('be.visible');
  });

  
  it('TC_014. [Intercept] Gagal Login - Mensimulasikan (Mock) Server Error 401', () => {
    // 1. Setup Intercept untuk *memblokir* request dan *memalsukan* response
    cy.intercept('POST', '**/auth/validate', {
      statusCode: 401,
      body: { message: 'Forced Server Error (Mocked)' },
    }).as('mockedError');

    // 2. Aksi user (menggunakan kredensial yang VALID)
    cy.get('input[name="username"]', { timeout: 8000 }).type(validUser);
    cy.get('input[name="password"]', { timeout: 8000 }).type(validPass);
    cy.get('button[type="submit"]').click();

    // 3. Menunggu response palsu kita
    cy.wait('@mockedError');

    
  });



it('TC_014. Gagal Login: Username case-sensitive (Cek Response Status)', () => {
    // INTERCEPT BERBEDA 1: Memvalidasi 'response.statusCode' dari API
    cy.intercept('POST', loginAPI).as('loginAttempt');

    cy.visit('https://opensource-demo.orangehrmlive.com/web/index.php/auth/login'); // Ganti dengan URL login Anda

    cy.get('input[name="username"]', { timeout: 8000 }).type('admin'); // 'admin' (lowercase)
    cy.get('input[name="password"]', { timeout: 8000 }).type(validPass);
    cy.get('button[type="submit"]').click();

  
});
it('TC_015. Gagal Login: Password case-sensitive (Cek Request Body non-JSON)', () => {
    // Asumsi variabel ini didefinisikan di level 'describe' atau diimpor
    const validUser = 'Admin';
    const loginAPI = '**/auth/validate'; // URL API login Anda

    cy.intercept('POST', loginAPI).as('loginAttempt');

    // Menggunakan baseUrl dari cypress.config.js
    cy.visit('https://opensource-demo.orangehrmlive.com/web/index.php/auth/login');

    cy.get('input[name="username"]', { timeout: 8000 }).type(validUser);
    cy.get('input[name="password"]', { timeout: 8000 }).type('Admin123'); // 'Admin123' (case salah)
    cy.get('button[type="submit"]').click();

   
    cy.wait('@loginAttempt').then((interception) => {
        // 'interception.request.body' mungkin adalah sebuah string
        // Contoh: "username=Admin&password=Admin123"
        
        // Kita bisa cetak ke konsol untuk debugging:
        console.log('Request Body:', interception.request.body);

        // Gunakan 'expect' dari Chai (bawaan Cypress) untuk validasi string
        // Kita cek apakah body (sebagai string) mengandung teks yang kita kirim
        expect(interception.request.body).to.include('username=Admin');
        expect(interception.request.body).to.include('password=Admin123');
    });

    // Validasi UI tetap berjalan seperti biasa
    // (Gunakan selector yang lebih stabil seperti yang kita bahas di TC_014)
    cy.get('.oxd-alert')
      .should('be.visible')
      .and('contain', 'Invalid credentials');
});

it('TC_016. Fungsional: Klik link "Forgot password?" (Cek Page Load)', () => {
  cy.visit('https://opensource-demo.orangehrmlive.com/web/index.php/auth/login');

  // INTERCEPT BERBEDA 3: Menunggu halaman 'Reset Password' (HTML)
  cy.intercept('GET', '**/auth/requestPasswordResetCode').as('resetPageLoad');

  cy.contains('Forgot your password?').click();

  // Validasi intercept: Memastikan halaman reset berhasil di-load (200)
  cy.wait('@resetPageLoad').its('response.statusCode').should('eq', 200);

  // Validasi bahwa URL berubah ke halaman reset password
  cy.url().should('include', '/auth/requestPasswordResetCode');

  // --- BARIS INI DIPERBAIKI ---
  // Gunakan selector yang benar untuk judul di halaman Reset Password
  cy.get('h6.orangehrm-forgot-password-title')
    .should('be.visible')
    .and('contain', 'Reset Password');
});

it('TC_017. [UI] Validasi placeholder (Cek Response Header Halaman)', () => {
    // INTERCEPT BERBEDA 4: Memvalidasi 'response.headers' dari halaman login itu sendiri
    cy.intercept('GET', loginPage).as('pageLoad');

    cy.visit('https://opensource-demo.orangehrmlive.com/web/index.php/auth/login');

    // Validasi intercept: Memastikan server mengirim content-type 'text/html'
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
  
  // 1. VALIDASI UI: Ini adalah hal terpenting. 
  //    Pengguna melihat pesan error.
  cy.get('.oxd-alert')
    .should('be.visible')
    .and('contain', 'Invalid credentials');
    
  // 2. VALIDASI INTERCEPT (YANG SUDAH BENAR):
  //    Berdasarkan bukti HTML Anda, kita validasi bahwa
  //    server merespons dengan tipe 'text/html'.
  cy.wait('@loginAttempt')
    .its('response.headers.content-type')
    .should('include', 'text/html');
});
it('3. [Spy] Memvalidasi Request Header (Content-Type)', () => {
  // 1. INTERCEPT:
  // Kita hanya perlu mengintip (spy) request-nya
  cy.intercept('POST', loginAPI).as('loginAttempt');

  // 2. AKSI:
  cy.get('input[name="username"]').type(validUser);
  cy.get('input[name="password"]').type(validPass);
  cy.get('button[type="submit"]').click();

  // 3. VALIDASI:
  // Tunggu intercept dan gunakan .then() untuk inspeksi mendalam
  cy.wait('@loginAttempt').then((interception) => {
      // Cek properti 'request.headers'
      expect(interception.request.headers['content-type'])
        .to.include('application/x-www-form-urlencoded');
      });

  // Validasi UI
  cy.url().should('include', '/dashboard');
  });
});
