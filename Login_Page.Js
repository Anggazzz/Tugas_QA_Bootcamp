// cypress/support/pageObjects/LoginPage.js

class LoginPage {

    // --- 1. Selectors (Getters) ---
    // Menggunakan timeout di sini agar terpusat
    getUsernameInput() {
      return cy.get('input[name="username"]', { timeout: 8000 });
    }
  
    getPasswordInput() {
      return cy.get('input[name="password"]', { timeout: 8000 });
    }
  
    getLoginButton() {
      return cy.get('button[type="submit"]');
    }
  
    // Elemen untuk verifikasi/assertion
    getRequiredErrorMessage() {
      return cy.get('.oxd-input-field-error-message');
    }
  
    getInvalidCredentialsAlert() {
      return cy.get('.oxd-alert-content-text');
    }
  
    getLoginContainer() {
      return cy.get('.orangehrm-login-container');
    }
    
    // --- 2. Action Methods (Fungsi Aksi) ---
  
    /**
     * Mengunjungi halaman login dan memverifikasi URL.
     */
    visit() {
      cy.visit('https://opensource-demo.orangehrmlive.com/web/index.php/auth/login');
      cy.url().should('include', '/auth/login');
    }
  
    /**
     * Mengetik username.
     * @param {string} username - Username yang akan diinput.
     */
    typeUsername(username) {
      if (username) {
        this.getUsernameInput().type(username);
      }
    }
  
    /**
     * Mengetik password.
     * @param {string} password - Password yang akan diinput.
     */
    typePassword(password) {
      if (password) {
        this.getPasswordInput().type(password);
      }
    }
  
    /**
     * Mengklik tombol login.
     */
    clickLogin() {
      this.getLoginButton().click();
    }
  
    // --- 3. Business Logic Method (Aksi Gabungan) ---
  
    /**
     * Menjalankan proses login lengkap (mengisi form dan submit).
     * Method ini akan otomatis menangani kasus input kosong jika null/undefined diteruskan.
     * @param {string} username 
     * @param {string} password 
     */
    login(username, password) {
      this.typeUsername(username);
      this.typePassword(password);
      this.clickLogin();
    }
  }
  
  // Ekspor instance baru agar bisa langsung dipakai di file tes
  export default new LoginPage();