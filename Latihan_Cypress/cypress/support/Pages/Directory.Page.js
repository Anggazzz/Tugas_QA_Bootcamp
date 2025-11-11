// cypress/pages/directory.page.js

class DirectoryPage {
  // Locators
  getPageTitle() { return cy.get('h6.oxd-topbar-header-breadcrumb-module'); }
  getEmployeeNameInput() { return cy.get('input[placeholder="Type for hints..."]'); }
  getJobTitleDropdown() { return cy.get('.oxd-select-text').eq(0); }
  getLocationDropdown() { return cy.get('.oxd-select-text').eq(1); }
  getSearchButton() { return cy.get('button[type="submit"]'); }
  getResetButton() { return cy.get('button[type="reset"]'); }
  getRecordsFoundText() { return cy.get('.orangehrm-horizontal-padding > .oxd-text'); }
  getAutocompleteDropdown() { return cy.get('.oxd-autocomplete-dropdown'); }
  getGridViewButton() { return cy.get('button.bi-grid-3x3-gap'); }
  getListViewButton() { return cy.get('button.bi-list'); }
  getGridContainer() { return cy.get('.orangehrm-directory-card-view'); }
  getListContainer() { return cy.get('.orangehrm-container'); }
  getFirstEmployeeCard() { return cy.get('.oxd-directory-card').first(); }
  getCardName() { return this.getFirstEmployeeCard().find('.oxd-directory-card-body__name'); }
  getCardJobTitle() { return this.getFirstEmployeeCard().find('.oxd-directory-card-body__jobTitle'); }
  
  // Actions
  // cypress/support/Pages/Directory.Page.js

// ... (locators)
getSpinner() {
  return cy.get('.oxd-loading-spinner');
}

// **LOCATOR UNTUK TC03/TC11 (DIBUAT SABAR)**
getFirstEmployeeCard() {
  // .should('be.visible') memaksa Cypress menunggu kartu muncul
  return cy.get('.oxd-directory-card').first().should('be.visible');
}
getCardName() { return this.getFirstEmployeeCard().find('.oxd-directory-card-body__name'); }
getCardJobTitle() { return this.getFirstEmployeeCard().find('.oxd-directory-card-body__jobTitle'); }


// **ACTION YANG DIMODIFIKASI (JADI SABAR)**
clickSearch() {
  this.getSearchButton().click();
  // STRATEGI WAIT: Tunggu spinner hilang SETELAH klik search
  this.getSpinner().should('not.exist');
}

clickReset() {
  this.getResetButton().click();
  // STRATEGI WAIT: Tunggu spinner hilang SETELAH klik reset
  this.getSpinner().should('not.exist');
}

// ... (action lama lainnya: selectJobTitle, selectLocation) ...
selectJobTitle(title) {
  this.getJobTitleDropdown().click();
  cy.get('.oxd-select-dropdown').contains(title).click();
}
selectLocation(location) {
  this.getLocationDropdown().click();
  cy.get('.oxd-select-dropdown').contains(location).click();
}
clickGridView() {
  this.getGridViewButton().click();
}
clickListView() {
  this.getListViewButton().click();
}
clickFirstEmployee() {
  this.getFirstEmployeeCard().click(); // Ini akan otomatis menunggu berkat getFirstEmployeeCard()
}
}
export default new DirectoryPage();


  