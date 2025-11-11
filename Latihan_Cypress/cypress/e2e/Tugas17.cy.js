/// <reference types="cypress" />

// 1. Import Page Object di paling atas
import loginPage from 'C:/QA/Latihan_Cypress/cypress/support/Login_Page.js';

describe('Testing Fitur Login OrangeHRM (POM)', () => {

  // Variabel tetap bisa disimpan di sini
  const validUser = 'Admin';
  const validPass = 'admin123';

  beforeEach(() => {
    // 2. Ganti cy.visit() dengan method dari POM
    loginPage.visit();
  });

  it('TC_001. User berhasil login menggunakan kredensial yang valid', () => {
    // 3. Gunakan method 'login' yang sudah digabung
    loginPage.login(validUser, validPass);
    
    // Assertion tetap di file tes
    cy.url().should('include', '/dashboard');
    cy.contains('Dashboard').should('be.visible');
  });

  it('TC_002. Gagal Login: Username dikosongkan (Password Valid)', () => {
    // 4. Gunakan method terpisah jika perlu
    loginPage.typePassword(validPass);
    loginPage.clickLogin();

    // 5. Gunakan getter dari POM untuk assertion
    loginPage.getRequiredErrorMessage().eq(0).should('contain', 'Required');
  });

  it('TC_003. Gagal Login: Password dikosongkan (Username Valid)', () => {
    loginPage.typeUsername(validUser);
    loginPage.clickLogin();
    
    loginPage.getRequiredErrorMessage().eq(0).should('contain', 'Required');
  });

  it('TC_004. Gagal Login: Username dan Password dikosongkan', () => {
    loginPage.clickLogin(); 

    loginPage.getRequiredErrorMessage().eq(0).should('contain', 'Required');
    loginPage.getRequiredErrorMessage().eq(1).should('contain', 'Required'); // Koreksi: harusnya eq(1) untuk error kedua
  });

  it('TC_005. Gagal Login: Username salah, Password benar', () => {
    loginPage.login('wronguser', validPass);
    
    loginPage.getInvalidCredentialsAlert().should('contain', 'Invalid credentials');
    cy.url().should('include', '/auth/login');
  });

  it('TC_006. Gagal Login: Username benar, Password salah', () => {
    loginPage.login(validUser, 'wrongpass');
    
    loginPage.getInvalidCredentialsAlert().should('contain', 'Invalid credentials');
  });

  it('TC_007. Gagal Login: Username dan Password salah', () => {
    loginPage.login('wronguser', 'wrongpass');

    loginPage.getInvalidCredentialsAlert().should('contain', 'Invalid credentials');
  });

  it('TC_008: [UI/UX] Tampilan Dinamis Minimize (Responsivitas)', () => {
    cy.log('Langkah 1: Verifikasi tampilan default (Desktop)');
    loginPage.getLoginContainer().should('be.visible');

    cy.log('Langkah 2: Mengubah viewport ke ukuran ponsel');
    cy.viewport('iphone-6'); // cy.viewport() adalah perintah Cypress, jadi tetap di sini
    
    cy.log('Verifikasi 1: Form Login tetap terlihat');
    loginPage.getLoginContainer().should('exist'); 

    cy.log('Langkah 3: Mengubah viewport kembali ke desktop');
    cy.viewport(1280, 720); 
    
    cy.log('Verifikasi 2: Tampilan kembali normal');
    loginPage.getLoginContainer().should('be.visible');
  });

  it('TC_009. Gagal Login: Menggunakan payload SQL Injection', () => {
    const sqlPayload = "' OR 1=1 --";
    loginPage.login(sqlPayload, 'randompass');
    
    loginPage.getInvalidCredentialsAlert().should('contain', 'Invalid credentials');
  });

  it('TC_010. User berhasil login (setelah salah ketik password)', () => {
    // Untuk kasus unik, kita bisa gabungkan method POM
    loginPage.typeUsername(validUser);
    loginPage.getPasswordInput().type(validPass + '!'); // Memanggil getter untuk aksi unik
    loginPage.getPasswordInput().clear().type(validPass); // Memanggil getter lagi
    loginPage.clickLogin();

    cy.url().should('include', '/dashboard');
  });

  it('TC_011. Password Field harus memiliki tipe "password" (masking input)', () => {
    loginPage.getPasswordInput().should('have.attr', 'type', 'password');
  });

  it('TC_012. Gagal Login: Batas Karakter Username (Input sangat panjang)', () => {
    const longText = 'a'.repeat(300);
    loginPage.login(longText, validPass);
    
    loginPage.getInvalidCredentialsAlert().should('exist');
  });

  it('TC_0013. Gagal Login: Menggunakan angka untuk Username', () => {
    loginPage.login('123456', validPass);
    
    loginPage.getInvalidCredentialsAlert().should('contain', 'Invalid credentials');
  });
});