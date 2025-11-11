// File: cypress/e2e/saucedemo/login.cy.js atau login.spec.js

describe('Feature Login SauceDemo', () => {
  // Aksi yang dilakukan sebelum setiap 'it' block
  beforeEach(() => {
      // Mengunjungi halaman login sebelum setiap test
      cy.visit('https://www.saucedemo.com/');
  });

  // Helper function untuk mempermudah login
  const performLogin = (username, password) => {
      cy.get('#user-name').type(username);
      cy.get('#password').type(password);
      cy.get('#login-button').click();
  };

  // --- 🧪 Skenario Positif (Berhasil Login) ---

  // 1. Login berhasil dengan User Valid (standard_user)
  it('TC-L01 - Login Berhasil dengan user standard_user', () => {
      performLogin('standard_user', 'secret_sauce');
      // Assertion: Memastikan navigasi ke halaman produk
      cy.url().should('include', '/inventory.html');
      cy.get('.title').should('have.text', 'Products');
      // Opsional: Logout setelah berhasil
      cy.get('#react-burger-menu-btn').click();
      cy.get('#logout_sidebar_link').click();
  });

  // 7. Login berhasil dengan User Problem (problem_user)

it('TC-L02 - Login Berhasil dengan user problem_user (mengecek isu gambar) - FIXED', () => {
  performLogin('problem_user', 'secret_sauce');
  cy.url().should('include', '/inventory.html');
  
  // **PERBAIKAN:** Targetkan elemen <img> di dalam container gambar
  cy.get('.inventory_item_img img').first()
    .should('have.attr', 'src') // Sekarang elemennya pasti punya 'src'
    .and('include', '/static/media/sl-404.168b1cce.jpg'); // Memastikan gambar problem user yang tampil
});

  // 9. Login berhasil dengan User Performance (performance_glitch_user)
  it('TC-L03 - Login Berhasil dengan user performance_glitch_user (mengecek waktu loading)', () => {
      // Karena ini performance test, kita hanya memastikan login berhasil
      performLogin('performance_glitch_user', 'secret_sauce');
      // Assertion: Memastikan navigasi ke halaman produk
      cy.url().should('include', '/inventory.html');
  });

  // --- ⛔ Skenario Negatif (Gagal Login) ---

  // 2. Login gagal dengan Username tidak terdaftar
  it('TC-L04 - Login Gagal: Username tidak terdaftar', () => {
      performLogin('invalid_user', 'secret_sauce');
      // Assertion: Memastikan pesan error ditampilkan
      cy.get('[data-test="error"]').should('be.visible')
          .and('have.text', 'Epic sadface: Username and password do not match any user in this service');
  });

  // 3. Login gagal dengan Password salah
  it('TC-L05 - Login Gagal: Password salah', () => {
      performLogin('standard_user', 'wrong_password');
      // Assertion: Memastikan pesan error ditampilkan
      cy.get('[data-test="error"]').should('be.visible')
          .and('have.text', 'Epic sadface: Username and password do not match any user in this service');
  });

  // 4. Login gagal dengan Username kosong
  it('TC-L06 - Login Gagal: Username kosong', () => {
      performLogin(' ', 'secret_sauce');
      // Assertion: Memastikan pesan error ditampilkan untuk required field Username
      cy.get('[data-test="error"]').should('be.visible')
          .and('have.text', ' Username is required');
  });

  // 5. Login gagal dengan Password kosong
  it('TC-L07 - Login Gagal: Password kosong', () => {
      performLogin('standard_user', ' ');
      // Assertion: Memastikan pesan error ditampilkan untuk required field Password
      cy.get('[data-test="error"]').should('be.visible')
          .and('have.text', ' Password is required');
  });

  // 6. Login gagal dengan Username & Password kosong
  it('TC-L08 - Login Gagal: Username dan Password kosong', () => {
      performLogin('', '');
      // Assertion: Memastikan pesan error ditampilkan (prioritas: Username is required)
      cy.get('[data-test="error"]').should('be.visible')
          .and('have.text', '&nbsp;Username And Password is required');
  });

  // 8. Login gagal dengan User Locked Out (locked_out_user)
  it('TC-L09 - Login Gagal: User locked_out_user', () => {
      performLogin('locked_out_user', 'secret_sauce');
      // Assertion: Memastikan pesan error 'locked out' ditampilkan
      cy.get('[data-test="error"]').should('be.visible')
          .and('have.text', ' &nbsp;Sorry, this user has been locked out.');
  });

  // 10. Login gagal dengan Username diisi angka
  it('TC-L10 - Login Gagal: Username diisi angka (tidak terdaftar)', () => {
      performLogin('12345', 'secret_sauce');
      // Assertion: Memastikan pesan error ditampilkan
      cy.get('[data-test="error"]').should('be.visible')
          .and('have.text', '&nbsp; Username and password do not match any user in this service');
  });

  // 11. Login gagal dengan Kombinasi User Valid & Password Tidak Valid
  it('TC-L11 - Login Gagal: Kombinasi User Valid dan Password Tidak Valid', () => {
      performLogin('standard_user', '12345');
      // Assertion: Memastikan pesan error ditampilkan
      cy.get('[data-test="error"]').should('be.visible')
          .and('have.text', ' &nbsp;Username and password do not match any user in this service');
  });
});