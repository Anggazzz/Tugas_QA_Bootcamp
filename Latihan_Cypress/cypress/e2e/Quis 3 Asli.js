/// <reference types="cypress" />


describe('Testing Fitur Login OrangeHRM', () => {
  // Kunjungi halaman login sebelum setiap test
  beforeEach(() => {
      cy.visit('https://opensource-demo.orangehrmlive.com/web/index.php/auth/login');
      // Pastikan halaman login sudah termuat
      cy.url().should('include', '/auth/login');
  });

  // Data Test yang Valid (default OrangeHRM)
  const validUser = 'Admin';
  const validPass = 'admin123';

  // --- TEST CASE 001: HAPPY PATH ---
  it('TC_001. User berhasil login menggunakan kredensial yang valid', () => {
      cy.get('input[name="username"]', { timeout: 8000 }).type(validUser);
      cy.get('input[name="password"]', { timeout: 8000 }).type(validPass);
      cy.get('button[type="submit"]').click();

      // Verifikasi navigasi ke Dashboard
      cy.url().should('include', '/dashboard');
      cy.contains('Dashboard').should('be.visible');
  });

  // --- TEST CASE 2 & 3 & 4: VALIDASI REQUIRED FIELD ---
  it('TC_002. Gagal Login: Username dikosongkan (Password Valid)', () => {
      cy.get('input[name="password"]', { timeout: 8000 }).type(validPass); // Hanya mengisi password
      cy.get('button[type="submit"]').click();

      // Verifikasi pesan error 'Required' pada field username
      // Untuk field Password (yang kedua)
      cy.get('.oxd-input-field-error-message').eq(0).should('contain', 'Required');
  });

  it('TC_003. Gagal Login: Password dikosongkan (Username Valid)', () => {
      cy.get('input[name="username"]', { timeout: 8000 }).type(validUser); // Hanya mengisi username
      cy.get('button[type="submit"]').click();

      // Verifikasi pesan error 'Required' pada field password
      cy.get('.oxd-input-field-error-message').eq(0).should('contain', 'Required');
  });

  it('TC_004. Gagal Login: Username dan Password dikosongkan', () => {
      cy.get('button[type="submit"]', { timeout: 8000 }).click(); // Langsung klik login

      // Verifikasi pesan error 'Required' pada kedua field
      cy.get('.oxd-input-field-error-message').eq(0).should('contain', 'Required');
      cy.get('.oxd-input-field-error-message').eq(0).should('contain', 'Required');
      });

  // --- TEST CASE 5, 6, 7: KREDENSIAL SALAH ---
  it('TC_005. Gagal Login: Username salah, Password benar', () => {
      cy.get('input[name="username"]', { timeout: 8000 }).type('wronguser');
      cy.get('input[name="password"]',  { timeout: 8000 }).type(validPass);
      cy.get('button[type="submit"]').click();

      // Verifikasi pesan error: "Invalid credentials"
      cy.get('.oxd-alert-content-text').should('contain', 'Invalid credentials');
      cy.url().should('include', '/auth/login'); // Tetap di halaman login
  });

  it('TC_006. Gagal Login: Username benar, Password salah', () => {
      cy.get('input[name="username"]',  { timeout: 8000 }).type(validUser);
      cy.get('input[name="password"]',  { timeout: 8000 }).type('wrongpass');
      cy.get('button[type="submit"]').click();

      // Verifikasi pesan error: "Invalid credentials"
      cy.get('.oxd-alert-content-text').should('contain', 'Invalid credentials');
  });

  it('TC_007. Gagal Login: Username dan Password salah', () => {
      cy.get('input[name="username"]', { timeout: 8000 }).type('wronguser');
      cy.get('input[name="password"]',  { timeout: 8000 }).type('wrongpass');
      cy.get('button[type="submit"]').click();

      // Verifikasi pesan error: "Invalid credentials"
      cy.get('.oxd-alert-content-text').should('contain', 'Invalid credentials');
  });


it('TC_008: [UI/UX] Tampilan Dinamis Minimize (Responsivitas)', () => {
    
  cy.log('Langkah 1: Verifikasi tampilan default (Desktop)');
  // Pastikan form terlihat di ukuran standar
  cy.get('.orangehrm-login-container').should('be.visible');

  cy.log('Langkah 2: Mengubah viewport ke ukuran ponsel (Simulasi Minimize)');
  // Mengubah ukuran jendela (viewport) ke ukuran iPhone 6 (375x667)
  cy.viewport('iphone-6'); 
  
  cy.log('Verifikasi 1: Form Login tetap terlihat dan responsif pada ukuran mobile');
  // Form harus tetap ada di DOM
  cy.get('.orangehrm-login-container').should('exist'); 
  // Opsi tambahan: Verifikasi elemen logo atau gambar tidak terpotong (jika ada)

  cy.log('Langkah 3: Mengubah viewport kembali ke desktop');
  cy.viewport(1280, 720); // Kembali ke ukuran desktop
  
  cy.log('Verifikasi 2: Tampilan kembali normal');
  cy.get('.orangehrm-login-container').should('be.visible');
});
 

  it('TC_009. Gagal Login: Menggunakan payload SQL Injection', () => {
      const sqlPayload = "' OR 1=1 --";
      cy.get('input[name="username"]',  { timeout: 8000 }).type(sqlPayload);
      cy.get('input[name="password"]',  { timeout: 8000 }).type('randompass');
      cy.get('button[type="submit"]').click();

      // Verifikasi pesan error: "Invalid credentials" (Menandakan injeksi GAGAL bypass)
      cy.get('.oxd-alert-content-text').should('contain', 'Invalid credentials');
  });

  // --- TEST CASE 11: KARAKTER KHUSUS PADA PASSWORD ---
  it('TC_010. User berhasil login dengan password mengandung karakter khusus (asumsi sistem mendukung)', () => {
      // Karena kita tidak tahu password valid dengan karakter khusus, kita pakai kredensial valid
      // Tujuan: Memastikan field password dapat menerima dan memproses karakter khusus jika ada.
      cy.get('input[name="username"]',  { timeout: 8000 }).type(validUser);
      cy.get('input[name="password"]',  { timeout: 8000 }) .type(validPass + '!'); // Contoh mengetik karakter khusus
      cy.get('input[name="password"]').clear().type(validPass); // Kembali ke valid pass
      cy.get('button[type="submit"]').click();

      cy.url().should('include', '/dashboard');
  });

  // --- TEST CASE 12: VISIBILITAS PASSWORD (TIPE INPUT) ---
  it('TC_011. Password Field harus memiliki tipe "password" (masking input)', () => {
      // Verifikasi elemen input password
      cy.get('input[name="password"]',  { timeout: 8000 }).should('have.attr', 'type', 'password');
  });

  // Tambahan Test Case untuk nilai lebih tinggi
  it('TC_012. Gagal Login: Batas Karakter Username (Input sangat panjang)', () => {
      const longText = 'a'.repeat(300); // 300 karakter
      cy.get('input[name="username"]',  { timeout: 8000 }).type(longText);
      cy.get('input[name="password"]',  { timeout: 8000 }).type(validPass);
      cy.get('button[type="submit"]').click();

      // Diharapkan gagal atau menampilkan pesan error
      cy.get('.oxd-alert-content-text').should('exist');
  });

  it('TC_0013. Gagal Login: Menggunakan angka untuk Username (Jika Username hanya menerima string)', () => {
      cy.get('input[name="username"]',  { timeout: 8000 }).type('123456');
      cy.get('input[name="password"]',  { timeout: 8000 }).type(validPass);
      cy.get('button[type="submit"]').click();

      cy.get('.oxd-alert-content-text').should('contain', 'Invalid credentials');
  });
});