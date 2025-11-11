// cypress/e2e/directory.spec.cy.js

import LoginPage from 'C:/QA/Latihan_Cypress/cypress/support/Pages/Login.Page';
import DashboardPage from 'C:/QA/Latihan_Cypress/cypress/support/Pages/Dashboard.Pages';
import DirectoryPage from 'C:/QA/Latihan_Cypress/cypress/support/Pages/Directory.Page';

describe('OrangeHRM - Directory Feature', () => {
  
  beforeEach(() => {
    // 1. Daftarkan SEMUA alias Anda di TOP LEVEL
    cy.intercept('POST', '/web/index.php/auth/validate').as('authValidate');
    cy.intercept('GET', '**/api/v2/directory/employees**').as('getEmployees');
    // (Kita biarkan ini, siapa tahu TC lain butuh)
    cy.intercept('GET', '**/api/v2/directory/employees/search**').as('autocompleteSearch');

    // 2. Muat data, LALU jalankan SEMUA aksi setup di dalam .then()
    cy.fixture('user.json').then((user) => {
      LoginPage.visit();
      LoginPage.login(user.username, user.password);
      cy.wait('@authValidate').its('response.statusCode').should('eq', 302);
      
      DashboardPage.assertOnDashboard();
      DashboardPage.clickDirectory();
      
      // Tunggu halaman direktori selesai loading
      cy.wait('@getEmployees');
    });
  });

  // TC01: (Stabil) Navigasi dan Verifikasi API
  it('TC01: Successfully navigate to Directory and verify API call', () => {
    DirectoryPage.getPageTitle().should('contain.text', 'Directory');
    DirectoryPage.getRecordsFoundText().should('be.visible');
  });

  // TC02: (Stabil) Verifikasi Elemen UI Default
  it('TC02: Verify default UI elements are visible', () => {
    DirectoryPage.getEmployeeNameInput().should('be.visible');
    DirectoryPage.getJobTitleDropdown().should('be.visible');
    DirectoryPage.getLocationDropdown().should('be.visible');
    DirectoryPage.getSearchButton().should('be.visible');
    DirectoryPage.getResetButton().should('be.visible');
  });

  // TC03: (BARU - Pengganti) Klik profil karyawan
  

  // cypress/e2e/directory.spec.cy.js

  it('TC03: Click on an employee card navigates to profile page', () => {
    // 1. Pindah ke Grid View dulu
    DirectoryPage.clickGridView();
    
    // 2. Klik (POM akan menunggu kartu terlihat)
    DirectoryPage.clickFirstEmployee();
    
    // 3. **PENGGANTI WAIT**: Tunggu judul di halaman baru
    ProfilePage.getPersonalDetailsTitle().should('be.visible');
    cy.url().should('include', '/pim/viewPersonalDetails');
  });

  // TC04: (BARU - Pengganti) Filter (0) Records Found (tanpa autocomplete)
  it('TC04: Search for a combination that yields (0) Records Found', () => {
    DirectoryPage.selectJobTitle('Chief Executive Officer'); 
    DirectoryPage.selectLocation('Texas R&D');
    
    DirectoryPage.clickSearch(); // Action ini hanya meng-klik
    
    // 4. **PENGGANTI WAIT**: Tunggu spinner hilang
    DirectoryPage.getSpinner().should('not.exist');
    
    DirectoryPage.getRecordsFoundText().should('contain.text', '(0) Records Found');
  });

  // TC05: (BARU - Pengganti) Verifikasi placeholder text
  it('TC05: Verify default placeholder text and dropdown values', () => {
    DirectoryPage.getEmployeeNameInput()
      .should('have.attr', 'placeholder', 'Type for hints...');
    DirectoryPage.getJobTitleDropdown().should('contain.text', 'Select');
    DirectoryPage.getLocationDropdown().should('contain.text', 'Select');
  });

  // TC06: (Stabil) Filter berdasarkan Job Title
  it('TC06: Filter by Job Title (using intercept)', () => {
    DirectoryPage.selectJobTitle('QA Engineer');
    DirectoryPage.clickSearch();
    cy.wait('@getEmployees'); // <-- TETAP PAKAI INI
    DirectoryPage.getRecordsFoundText().should('not.contain.text', '(0) Records Found');
  });

  // TC07: (Stabil) Filter berdasarkan Location
  it('TC07: Filter by Location', () => {
    DirectoryPage.selectLocation('New York Sales Office');
    DirectoryPage.clickSearch();
    cy.wait('@getEmployees');
    DirectoryPage.getRecordsFoundText().should('not.contain.text', '(0) Records Found');
  });

  // TC08: (BARU - Pengganti) Grid view button menjadi aktif
  it('TC08: Grid view button becomes active after click', () => {
    DirectoryPage.clickGridView();
    
    // 5. **PENGGANTI WAIT**: Tunggu UI (class 'active')
    DirectoryPage.getGridViewButton().should('have.class', 'active');
    DirectoryPage.getListViewButton().should('not.have.class', 'active');
  });

  // TC09: (DIUBAH - Tanpa Wait Statis)
  it('TC09: List view button becomes active after click', () => {
    DirectoryPage.clickGridView();
    DirectoryPage.getGridViewButton().should('have.class', 'active'); // Tunggu UI
    
    DirectoryPage.clickListView();
    DirectoryPage.getListViewButton().should('have.class', 'active'); // Tunggu UI
    DirectoryPage.getGridViewButton().should('not.have.class', 'active');
  });

  // TC10: (Stabil) Tombol Reset membersihkan filter
  it('TC10: Reset button clears all filters', () => {
    DirectoryPage.selectJobTitle('QA Engineer');
    DirectoryPage.clickSearch();
    cy.wait('@getEmployees');
    DirectoryPage.clickReset();
    cy.wait('@getEmployees');
    
    DirectoryPage.getJobTitleDropdown().should('contain.text', 'Select');
    DirectoryPage.getLocationDropdown().should('contain.text', 'Select');
  });

  it('TC11: Employee card displays name and job title', () => {
    // 6. **PERBAIKAN**: Pindah ke Grid View dulu agar kartu ada
    DirectoryPage.clickGridView();
    
    DirectoryPage.getFirstEmployeeCard().should('be.visible'); // POM akan menunggu
    DirectoryPage.getCardName().should('not.be.empty');
    DirectoryPage.getCardJobTitle().should('not.be.empty');
  });

  // TC12: (Stabil) Filter Job Title dan Location bersamaan
  it('TC12: Filter by both Job Title and Location', () => {
    DirectoryPage.selectJobTitle('Software Engineer');
    DirectoryPage.selectLocation('Texas R&D');
    DirectoryPage.clickSearch();
    cy.wait('@getEmployees');
    DirectoryPage.getRecordsFoundText().should('not.contain.text', '(0) Records Found');
  });

 // TC13: (DIUBAH - Tanpa Wait Statis)
 it('TC13: Switch to Grid View', () => {
  DirectoryPage.clickGridView();
  // 7. **PENGGANTI WAIT**: Tunggu UI (container-nya terlihat)
  DirectoryPage.getGridContainer().should('be.visible');
});

// TC14: (DIUBAH - Tanpa Wait Statis)
it('TC14: Switch back to List View', () => {
  DirectoryPage.clickGridView();
  DirectoryPage.getGridContainer().should('be.visible'); // Tunggu
  
  DirectoryPage.clickListView();
  DirectoryPage.getListContainer().should('be.visible'); // Tunggu
});

});