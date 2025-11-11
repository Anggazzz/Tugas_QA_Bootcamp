class ForgotPasswordPage {
    selectors = {
      usernameInput: '[name="username"]',
      resetButton: '[type="submit"]',
      successMessage: ".oxd-text--h6",
      pageTitle: ".orangehrm-forgot-password-title",
    };
  
    /**
     * Memverifikasi kita berada di halaman "Forgot Password".
     */
    verifyOnPage() {
      cy.get(this.selectors.pageTitle).should("have.text", "Reset Password");
    }
  
    /**
     * Mengisi username untuk reset.
     * @param {string} username
     */
    fillUsername(username) {
      cy.get(this.selectors.usernameInput).type(username);
    }
  
    /**
     * Mengklik tombol "Reset Password".
     */
    clickResetPassword() {
      cy.get(this.selectors.resetButton).click();
    }
  
    /**
     * Memverifikasi pesan sukses telah muncul.
     */
    verifyResetSuccess() {
      cy.get(this.selectors.successMessage).should(
        "have.text",
        "Reset Password link sent successfully"
      );
    }
  }
  
  export default new ForgotPasswordPage();