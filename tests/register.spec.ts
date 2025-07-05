import { test, expect } from '@playwright/test';
import { RegisterPage } from '../Pages/Registerpage'; 
import testData from '../data/testData.json';
import { DashboardPage } from '../Pages/dashboardPage';
import { LoginPage } from '../Pages/loginPage';

let registerPage: RegisterPage;
let loginPage: LoginPage;
let dashboardPage: DashboardPage;


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
    
    const email = (testData.usuarioValido.email.split('@')[0]) + Date.now().toString() + '@' + testData.usuarioValido.email.split('@')[1];
   
    testData.usuarioValido.email = email;

    await registerPage.completarYHacerClickBotonRegistro(testData.usuarioValido);
  });
  await expect(page.getByText('Registro exitoso')).toBeVisible();
});

test('TC-7 Verificar inicio de sesión exitoso con credenciales válidas', async ({ page }) => {
  await loginPage.completarYHacerClickBotonLogin(testData.usuarioValido);
  await expect(page.getByText('Inicio de sesión exitoso')).toBeVisible();
  await expect(dashboardPage.dashboardTitle).toBeVisible();
});