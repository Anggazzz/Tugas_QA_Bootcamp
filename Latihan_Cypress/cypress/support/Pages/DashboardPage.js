class DashboardPage {
    selectors = {
      headerTitle: ".oxd-topbar-header-breadcrumb > .oxd-text",
    };
  
    /**
     * Memverifikasi kita berada di dashboard dengan mengecek judul "Dashboard".
     */
    verifyOnDashboard() {
      cy.get(this.selectors.headerTitle).should("have.text", "Dashboard");
    }
  }
  
  export default new DashboardPage();