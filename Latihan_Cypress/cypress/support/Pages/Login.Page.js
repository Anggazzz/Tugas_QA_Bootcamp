// cypress/pages/login.page.js

class LoginPage {
    // Locators
    getUsernameInput() { return cy.get('input[name="username"]'); }
    getPasswordInput() { return cy.get('input[name="password"]'); }
    getLoginButton() { return cy.get('button[type="submit"]'); }
  
    // Actions
    visit() {
      cy.visit('https://opensource-demo.orangehrmlive.com/');
    }
  
    login(username, password) {
      this.getUsernameInput().type(username);
      this.getPasswordInput().type(password);
      this.getLoginButton().click();
    }
  }
  export default new LoginPage();