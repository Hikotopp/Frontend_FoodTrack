describe('Login FoodTrack', () => {

  // Login antes de cada prueba
  beforeEach(() => {
    cy.visit('http://localhost:4200/login');
    cy.get('input[name="email"]').type(Cypress.env('ADMIN_EMAIL') ?? 'admin@foodtrack.local');
    cy.get('input[name="password"]').type(Cypress.env('ADMIN_PASSWORD') ?? 'Admin123!');
    cy.contains('button', 'Ingresar').click();
    cy.url().should('include', '/mesas');
  });

  // Prueba 1 - Login exitoso
  it('permite iniciar sesion como administrador', () => {
    cy.contains('Administrador').should('be.visible');
  });

  // Prueba 2 - Ver panel de mesas
  it('muestra el panel de mesas correctamente', () => {
    cy.contains('Panel de mesas').should('be.visible');
    cy.contains('Mesa 1').should('be.visible');
  });

  // Prueba 3 - Crear una mesa
  it('permite agregar una nueva mesa', () => {
    cy.contains('button', 'Agregar mesa').click();
    cy.contains('Mesa').should('be.visible');
  });

  // Prueba 4 - Ver historial
  it('permite navegar al historial', () => {
    cy.contains('button', 'Historial').click();
    cy.url().should('include', '/historial');
  });

  // Prueba 5 - Generar reporte desde historial
  it('permite generar reporte desde historial', () => {
    cy.contains('button', 'Historial').click();
    cy.url().should('include', '/historial');
    cy.contains('button', 'Generar reporte').click();
  });

  // Prueba 6 - Ver cuentas
  it('permite navegar a cuentas', () => {
    cy.contains('button', 'Cuentas').click();
    cy.url().should('not.include', '/mesas');
  });

  // Prueba 7 - Cerrar sesion
  it('permite cerrar sesion correctamente', () => {
    cy.contains('button', 'Cerrar sesión').click();
    cy.url().should('include', '/home');
  });

});
