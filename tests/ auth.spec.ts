import { test, expect } from '@playwright/test'; 
import { DashboardPage } from '../Pages/dashboardpage';
import { LoginPage } from '../Pages/loginPage';
import testData from '../data/testData.json'

let loginPage: LoginPage;
let dashboardPage: DashboardPage;

test.beforeEach (async ({page}) => {
  loginPage = new LoginPage(page);
  await loginPage.visitarPaginaLogin();
})

test('TC-1.1 test', async ({ page }) => {
  await loginPage.completarYHacerClickBotonLogin(testData.usuarioValido);
  await expect(page.getByText('Inicio de sesión exitoso')).toBeVisible();
  await expect(page).toHaveURL('http://localhost:3000/dashboard');
  await expect(page.getByTestId('titulo-dashboard')).toBeVisible();

})

test('TC-2.1 test', async ({ page }) => {
    
const emailInvalido = (testData.usuarioValido.email.split('@')[0]) + Date.now().toString() + '@' + testData.usuarioValido.email.split('@')[1];
   
testData.usuarioValido.email = emailInvalido;

  await loginPage.completarYHacerClickBotonLogin(testData.usuarioValido);
  await expect(page.getByText('Invalid credentials')).toBeVisible();
  await expect(page).toHaveURL('http://localhost:3000/login');


})