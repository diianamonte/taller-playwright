import { test, expect } from '@playwright/test';

test('TC-01 Verification the elements UI in the login page', async ({ page }) => {
  await page.goto('http://localhost:3000/');
  await expect(page.locator('input[name="firstName"]')).toBeVisible();
  await expect(page.locator('input[name="lastName"]')).toBeVisible();
  await expect(page.locator('input[name="password"]')).toBeVisible();
  await expect(page.getByTestId('boton-registrarse')).toBeVisible();
});

test('TC-02 Verification button register is disabled', async ({ page }) => {
 await page.goto('http://localhost:3000/');
 await expect(page.getByTestId('boton-registrarse')).toBeDisabled();

});

test('TC-03 Verification fill inputs and disabled register button', async ({ page }) => {
  await page.goto('http://localhost:3000/');
  await page.locator('input[name="firstName"]').fill('Juan');
  await page.locator('input[name="lastName"]').fill('Montero');
  await page.locator('input[name="email"]').fill('email@gmail.com');
  await page.locator('input[name="password"]').fill('Password123');
  await expect(page.getByTestId('boton-registrarse')).toBeEnabled();
});

test('TC-04 Verification button login', async ({ page }) => {
await page.goto('http://localhost:3000/');
await page.getByTestId('boton-login-header-signup').click();
await expect(page).toHaveURL('http://localhost:3000/login')
await page.waitForTimeout(5000);
});

test('TC-05 Verification register succes', async ({ page }) => {
  const email = 'diana'+Date.now().toString()+'@gamalgama.com'
  
  await page.goto('http://localhost:3000/');
  await page.locator('input[name="firstName"]').fill('Juan');
  await page.locator('input[name="lastName"]').fill('Montero');
  await page.locator('input[name="email"]').fill(email);
  await page.locator('input[name="password"]').fill('Password123');
  await page.getByTestId('boton-registrarse').click();
  await expect(page.getByText('Registro exitoso')).toBeVisible();
}); 

