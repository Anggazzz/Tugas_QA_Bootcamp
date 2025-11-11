class LoginPage {
    // --- Locators (Selectors) ---
    selectors = {
      usernameInput: '[name="username"]',
      passwordInput: '[name="password"] ',
      loginButton: '[type="submit"]',
      forgotPasswordLink: ".orangehrm-login-forgot > .oxd-text",
      invalidCredentialsError: ".oxd-alert--error .oxd-text",
      requiredError: ".oxd-input-group .oxd-text--span",
    };
  
    // --- Actions ---
  
    /**
     * Mengunjungi halaman login.
     */
    visit() {
      cy.visit("https://opensource-demo.orangehrmlive.com/");
      cy.get(this.selectors.loginButton, { timeout: 10000 }).should("be.visible");
  
    }
  
    /**
     * Mengisi username.
     * @param {string} username
     */
    fillUsername(username) {
      cy.get(this.selectors.usernameInput, { timeout: 10000 }).type(username);
    }
  
    /**
     * Mengisi password.
     * @param {string} password
     */
    fillPassword(password) {
      cy.get(this.selectors.passwordInput, { timeout: 10000 }).type(password);
    }
  
    /**
     * Mengklik tombol Login.
     */
    clickLogin() {
      cy.get(this.selectors.loginButton).click();
    }
  
    /**
     * Mengklik link "Forgot your password?".
     */
    clickForgotPassword() {
      cy.get(this.selectors.forgotPasswordLink).click();
    }
  
    /**
     * Aksi gabungan untuk proses login.
     * @param {string} username
     * @param {string} password
     */
    login(username, password) {
      this.fillUsername(username);
      this.fillPassword(password);
      this.clickLogin();
    }
  
    // --- Assertions ---
  
    /**
     * Memvalidasi pesan error "Invalid credentials".
     */
    shouldShowInvalidCredentials() {
      cy.get(this.selectors.invalidCredentialsError).should(
        "have.text",
        "Invalid credentials"
      );
    }
  
    /**
     * Memvalidasi pesan error "Required".
     * @param {number} index - 0 untuk username, 1 untuk password
     */
    shouldShowRequiredError(index = 0) {
      cy.get(this.selectors.requiredError)
        .eq(index)
        .should("have.text", "Required");
    }

}
  
  export default new LoginPage();