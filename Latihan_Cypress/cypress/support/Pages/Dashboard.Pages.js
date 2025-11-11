// cypress/pages/dashboard.page.js

class DashboardPage {
    // Locators
    getDashboardTitle() { return cy.get('h6.oxd-topbar-header-breadcrumb-module'); }
    getDirectoryMenu() { return cy.get('a.oxd-main-menu-item[href*="viewDirectory"]'); }
  
    // Actions
    clickDirectory() {
      this.getDirectoryMenu().click();
    }
  
    // Assertions
    assertOnDashboard() {
      this.getDashboardTitle().should('contain.text', 'Dashboard');
    }
  }
  export default new DashboardPage();