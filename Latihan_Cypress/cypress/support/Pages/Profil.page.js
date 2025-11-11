// cypress/pages/profile.page.js

class ProfilePage {
    // Locator untuk judul "Personal Details" di halaman profil
    getPersonalDetailsTitle() {
      return cy.get('.orangehrm-edit-employee-content h6').contains('Personal Details');
    }
  }
  export default new ProfilePage();