import { test, expect, request } from '@playwright/test';
import { RegisterPage } from '../Pages/Registerpage'; 
import testData from '../data/testData.json';
import { DashboardPage } from '../Pages/dashboardPage';
import { LoginPage } from '../Pages/loginPage';
import { BackendUtils } from '../utils/backendUtils';

let registerPage: RegisterPage;
let loginPage: LoginPage;
let dashboardPage: DashboardPage;
let backendUtils: BackendUtils;

test.beforeEach (async ({page}) => {
  registerPage = new RegisterPage(page);
  loginPage = new LoginPage(page);
  dashboardPage = new DashboardPage(page);
  await registerPage.visitarPaginaRegistro();

})

test('TC-01 Verification the elements UI in the login page', async ({ page }) => {
  await expect(registerPage.firstNameInput).toBeVisible();
  await expect(registerPage.lastNameInput).toBeVisible();
  await expect(registerPage.emailInput).toBeVisible();
  await expect(registerPage.registerButton).toBeVisible();
})

test('TC-02 Verification button register is disabled', async ({ page }) => {
 await expect(registerPage.registerButton).toBeDisabled();

});

test('TC-03 Verification fill inputs and disabled register button', async ({ page }) => {
  await registerPage.completarFormularioRegistro(testData.usuarioValido)
  await expect(registerPage.registerButton).toBeEnabled();
});

test('TC-04 Verification button login', async ({ page }) => {

await registerPage.loginButton.click();
 await expect(page).toHaveURL('http://localhost:3000/login'); 
});

test('TC-5 Verificar Registro exitoso con datos válidos', async ({ page }) => {

  await test.step('Completar el formulario de registro con datos válidos', async () => {
    
    const email = (testData.usuarioValido.email.split('@')[0]) + Date.now().toString() + '@' + testData.usuarioValido.email.split('@')[1];
   
    testData.usuarioValido.email = email;

    await registerPage.completarYHacerClickBotonRegistro(testData.usuarioValido);
  });
  await expect(page.getByText('Registro exitoso')).toBeVisible();
});

test('TC-6 Verificar que un usuario no pueda registrarse con un correo electronico existente ', async ({ page }) => {

  await test.step('Completar el formulario de registro con datos válidos', async () => {
    await registerPage.completarYHacerClickBotonRegistro(testData.usuarioValido);
    await expect(page.getByText('Email already in use')).toBeVisible();
  });
  
});

test('TC-8 Verificar inicio de sesión exitoso con credenciales válidas verificando respuesta de API', async ({ page }) => {
    
    const email = (testData.usuarioValido.email.split('@')[0]) + Date.now().toString() + '@' + testData.usuarioValido.email.split('@')[1];
   
    testData.usuarioValido.email = email;
  
    await registerPage.completarFormularioRegistro(testData.usuarioValido);


  const responsePromise = page.waitForResponse('http://localhost:4000/api/auth/signup')
  await registerPage.hacerClickBotonRegistro();
  const response = await responsePromise;
  const responseBody = await response.json();


  expect(response.status()).toBe(201);
  expect(responseBody).toHaveProperty('token');
  expect(responseBody).toHaveProperty('user');
  expect(typeof responseBody.token).toBe('string');

  await expect(page.getByText('Registro exitoso')).toBeVisible();

});

test('TC-9 Generar signup desde la API', async ({ page, request }) => {
  const email = (testData.usuarioValido.email.split('@')[0]) + Date.now().toString() + '@' + testData.usuarioValido.email.split('@')[1];
  const response = await request.post('http://localhost:3000/api/auth/signup', { //para esperar el endpoint
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
    },
    data: {
      firstName: testData.usuarioValido.nombre,
      lastName: testData.usuarioValido.apellido,
      email: email,
      password: testData.usuarioValido.contraseña,
    }
  });
  const responseBody = await response.json();
  expect(response.status()).toBe(201);
  expect(responseBody).toHaveProperty('token');
  expect(typeof responseBody.token).toBe('string');
  expect(responseBody).toHaveProperty('user');
  expect(responseBody.user).toEqual(expect.objectContaining({
    id: expect.any(String),
    firstName: testData.usuarioValido.nombre,
    lastName: testData.usuarioValido.apellido,
    email: email,
  }));
});

test('TC-10 Verificar comportamiento del front ante un error 500 en el registro', async ({ page }) => {
  await page.route('**/api/auth/signup', route => {
    route.fulfill({
      status: 500,
      contentType: 'application/json',
      body: JSON.stringify({ message: 'Error en el registro' }),
    });
  });
await registerPage.completarYHacerClickBotonRegistro(testData.usuarioValido);
await expect(page.getByText('Error en el registro')).toBeVisible();
});

