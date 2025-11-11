// Import semua Page Objects yang dibutuhkan
import LoginPage from "C:/QA/Latihan_Cypress/cypress/support/Pages/LoginPage";
import DashboardPage from "C:/QA/Latihan_Cypress/cypress/support/Pages/DashboardPage";
import ForgotPasswordPage from "C:/QA/Latihan_Cypress/cypress/support/Pages/ForgotPasswordPage";

describe("OrangeHRM Authentication Scenarios", () => {
 
  const LOGIN_API = "**/auth/validate";
  // Gunakan path yang baru Anda temukan:
  const RESET_PASS_API = "**/auth/sendPasswordReset";

  beforeEach(() => {
    // Siapkan interceptor (sebagai 'spy') sebelum setiap tes
    cy.intercept("POST", LOGIN_API).as("loginRequest");
    cy.intercept("POST", RESET_PASS_API).as("resetRequest");

    // Kunjungi halaman login
    LoginPage.visit();
  });

  // --- GRUP TEST CASE LOGIN ---
  context("Login Feature", () => {
    // TC 1: Login sukses (Happy Path) - Menggunakan network request asli (Spying)
    it("TC-001: Should login successfully with valid credentials (Spying)", () => {
      LoginPage.login("Admin", "admin123");

      // Tunggu 'spy' @loginRequest selesai dan pastikan status code-nya 302
      cy.wait("@loginRequest").its("response.statusCode").should("eq", 302);

      DashboardPage.verifyOnDashboard();
    });

  
    it("TC-002: Should show error on invalid password", () => {
      LoginPage.login("Admin", "wrongpassword");

      // Verifikasi respons API (status 302) dan pesan di UI
      cy.wait("@loginRequest").its("response.statusCode").should("eq", 302);
      LoginPage.shouldShowInvalidCredentials();
    });

    // TC 3: Login gagal - Username salah
    it("TC-003: Should show error on invalid username", () => {
      LoginPage.login("WrongUser", "admin123");

      cy.wait("@loginRequest").its("response.statusCode").should("eq", 302);
      LoginPage.shouldShowInvalidCredentials();
    });

    // TC 4: Login gagal - Username kosong
    it("TC-004: Should show 'Required' error on empty username", () => {
      LoginPage.fillPassword("admin123");
      LoginPage.clickLogin();
      LoginPage.shouldShowRequiredError(0); // Index 0 untuk username
    });

    // TC 5: Login gagal - Password kosong
    it("TC-005: Should show 'Required' error on empty password", () => {
      LoginPage.fillUsername("Admin");
      LoginPage.clickLogin();
      LoginPage.shouldShowRequiredError(0); // Index 1 untuk password
    });

    // TC 6: Login gagal - Keduanya kosong
    it("TC-006: Should show 'Required' errors on empty fields", () => {
      LoginPage.clickLogin();
      LoginPage.shouldShowRequiredError(0); // Cek username
      LoginPage.shouldShowRequiredError(1); // Cek password
    });
  });

 

  // TC 7: Reset password gagal - Username kosong (Tetap sama)
  it("TC-007: Should show 'Required' error on empty username for reset", () => {
    LoginPage.clickForgotPassword();
    ForgotPasswordPage.clickResetPassword();
    LoginPage.shouldShowRequiredError(0); 
  });
});
